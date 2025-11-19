'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { MOCK_FAR_EXAM, MockMCQQuestion, MockTBSQuestion } from '@/lib/mock-exam-structure'

export interface ExamAnswer {
  questionId: string
  answer: any
  timeSpent: number
  isFlagged: boolean
}

export interface GradingResult {
  examId: string
  score: number
  totalQuestions: number
  correctAnswers: number
  mcqScore: number
  tbsScore: number
  mcqCorrect: number
  mcqTotal: number
  tbsCorrect: number
  tbsTotal: number
  passed: boolean
  breakdown: {
    questionId: string
    isCorrect: boolean
    pointsEarned: number
    pointsPossible: number
  }[]
}

export async function submitExam(
  examId: string,
  sectionCode: string,
  answers: Record<string, ExamAnswer>,
  timeSpent: number
): Promise<{ success: boolean; result?: GradingResult; error?: string }> {
  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return { success: false, error: 'User not authenticated' }
    }

    // For now, we'll use the mock exam structure
    // In production, you would fetch from the database
    const exam = MOCK_FAR_EXAM

    if (exam.sectionCode !== sectionCode) {
      return { success: false, error: 'Exam section mismatch' }
    }

    // Initialize grading variables
    let mcqCorrect = 0
    let mcqTotal = 0
    let tbsPointsEarned = 0
    let tbsPointsPossible = 0
    let tbsTotal = 0
    const breakdown: GradingResult['breakdown'] = []

    // Grade each testlet
    exam.testlets.forEach((testlet) => {
      testlet.questions.forEach((question) => {
        const userAnswer = answers[question.id]

        if (question.type === 'MCQ') {
          mcqTotal++
          const mcqQuestion = question as MockMCQQuestion
          const selectedAnswer = userAnswer?.answer as string
          const isCorrect = selectedAnswer === mcqQuestion.correct_answer

          if (isCorrect) {
            mcqCorrect++
          }

          breakdown.push({
            questionId: question.id,
            isCorrect,
            pointsEarned: isCorrect ? 1 : 0,
            pointsPossible: 1,
          })
        } else if (question.type === 'TBS') {
          tbsTotal++
          const tbsQuestion = question as MockTBSQuestion
          const userTBSAnswer = userAnswer?.answer as Record<string, any>

          // Calculate partial credit for TBS
          let cellsCorrect = 0
          let cellsTotal = 0

          // Grade each row in the TBS answer
          Object.keys(tbsQuestion.correctAnswers).forEach((rowId) => {
            const correctRow = tbsQuestion.correctAnswers[rowId]
            const userRow = userTBSAnswer?.[rowId]

            Object.keys(correctRow).forEach((columnKey) => {
              cellsTotal++

              if (userRow) {
                const userValue = parseFloat(String(userRow[columnKey] || '').replace(/,/g, '')) || 0
                const correctValue = parseFloat(String(correctRow[columnKey]).replace(/,/g, '')) || 0

                // Allow for small floating point differences
                if (Math.abs(userValue - correctValue) < 0.01) {
                  cellsCorrect++
                }
              }
            })
          })

          // Calculate points for this TBS (partial credit)
          const pointsPossible = 1 // Each TBS is worth 1 point
          const pointsEarned = cellsTotal > 0 ? (cellsCorrect / cellsTotal) * pointsPossible : 0

          tbsPointsEarned += pointsEarned
          tbsPointsPossible += pointsPossible

          breakdown.push({
            questionId: question.id,
            isCorrect: cellsCorrect === cellsTotal && cellsTotal > 0,
            pointsEarned: parseFloat(pointsEarned.toFixed(2)),
            pointsPossible: pointsPossible,
          })
        }
      })
    })

    // Apply 50/50 weighting (MCQs = 50%, TBS = 50%)
    const mcqScore = mcqTotal > 0 ? (mcqCorrect / mcqTotal) * 50 : 0
    const tbsScore = tbsPointsPossible > 0 ? (tbsPointsEarned / tbsPointsPossible) * 50 : 0
    const totalScore = mcqScore + tbsScore
    const passed = totalScore >= 75

    // Get or create exam section
    const { data: examSection } = await supabase
      .from('exam_sections')
      .select('id')
      .eq('code', sectionCode)
      .single()

    if (!examSection) {
      return { success: false, error: 'Exam section not found' }
    }

    // Insert exam record
    const { data: examRecord, error: examError } = await supabase
      .from('exams')
      .insert({
        id: examId,
        user_id: user.id,
        exam_section_id: examSection.id,
        status: 'completed',
        started_at: new Date(Date.now() - timeSpent * 1000).toISOString(),
        completed_at: new Date().toISOString(),
        submitted_at: new Date().toISOString(),
        time_limit_minutes: exam.timeLimit / 60,
        time_spent_seconds: timeSpent,
        time_remaining_seconds: exam.timeLimit - timeSpent,
        total_questions: mcqTotal + tbsTotal,
        questions_answered: Object.keys(answers).length,
        questions_flagged: Object.values(answers).filter((a) => a.isFlagged).length,
        score: parseFloat(totalScore.toFixed(2)),
        passed,
        is_practice_mode: false,
        show_answers_immediately: false,
      })
      .select()
      .single()

    if (examError) {
      console.error('Error inserting exam:', examError)
      return { success: false, error: `Failed to save exam: ${examError.message}` }
    }

    // Insert user responses
    const responsesToInsert = breakdown.map((item) => {
      const userAnswer = answers[item.questionId]
      return {
        exam_id: examId,
        question_id: item.questionId,
        user_id: user.id,
        response_data: { answer: userAnswer?.answer || null },
        is_correct: item.isCorrect,
        points_earned: item.pointsEarned,
        points_possible: item.pointsPossible,
        is_flagged: userAnswer?.isFlagged || false,
        is_answered: !!userAnswer,
        time_spent_seconds: userAnswer?.timeSpent || 0,
        submitted_at: new Date().toISOString(),
      }
    })

    const { error: responsesError } = await supabase
      .from('user_responses')
      .insert(responsesToInsert)

    if (responsesError) {
      console.error('Error inserting responses:', responsesError)
      // Don't fail the whole operation if responses fail
    }

    // Revalidate paths
    revalidatePath('/dashboard')
    revalidatePath(`/exam/${examId}`)

    const result: GradingResult = {
      examId,
      score: parseFloat(totalScore.toFixed(2)),
      totalQuestions: mcqTotal + tbsTotal,
      correctAnswers: mcqCorrect + breakdown.filter((b) => b.isCorrect && b.questionId.includes('tbs')).length,
      mcqScore: parseFloat(mcqScore.toFixed(2)),
      tbsScore: parseFloat(tbsScore.toFixed(2)),
      mcqCorrect,
      mcqTotal,
      tbsCorrect: parseFloat((tbsPointsEarned).toFixed(2)),
      tbsTotal,
      passed,
      breakdown,
    }

    return { success: true, result }
  } catch (error) {
    console.error('Error submitting exam:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
