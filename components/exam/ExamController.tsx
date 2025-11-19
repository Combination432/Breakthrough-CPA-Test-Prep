'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useExamStore } from '@/lib/store/exam-store'
import { QuestionCard } from '@/components/quiz/QuestionCard'
import { TBSLayout } from '@/components/tbs/TBSLayout'
import { TestletReview } from '@/components/exam/TestletReview'
import { Card, CardContent } from '@/components/ui/card'
import { submitExam } from '@/app/exam/actions'
import type { Exam, MCQQuestion, TBSQuestion } from '@/lib/supabase/queries'

interface ExamControllerProps {
  exam: Exam
  examId: string
}

export function ExamController({ exam, examId }: ExamControllerProps) {
  const router = useRouter()

  const {
    currentTestletIndex,
    currentQuestionIndex,
    submitAnswer,
    goToQuestion,
    nextTestlet,
    answers,
    timeLeft,
  } = useExamStore()

  const [isReviewMode, setIsReviewMode] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Get current testlet
  const currentTestlet = exam.testlets[currentTestletIndex]

  if (!currentTestlet) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card>
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold">Exam Complete</h2>
            <p className="text-gray-600 mt-2">
              You have completed all testlets in this exam.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Get current question
  const currentQuestion = currentTestlet.questions[currentQuestionIndex]

  // Handle submitting testlet and moving to next
  const handleSubmitTestlet = async () => {
    const isLastTestlet = currentTestletIndex === exam.testlets.length - 1

    if (isLastTestlet) {
      // Submit the entire exam
      setIsSubmitting(true)

      try {
        // Calculate time spent (initial time - time left)
        const timeSpent = exam.timeLimit - timeLeft

        // Submit the exam
        const result = await submitExam(examId, exam.sectionCode, answers, timeSpent)

        if (result.success && result.result) {
          // Redirect to review page
          router.push(`/exam/${examId}/review`)
        } else {
          console.error('Error submitting exam:', result.error)
          alert(`Error submitting exam: ${result.error}`)
          setIsSubmitting(false)
        }
      } catch (error) {
        console.error('Error submitting exam:', error)
        alert('An error occurred while submitting the exam')
        setIsSubmitting(false)
      }
    } else {
      // Just move to next testlet
      setIsReviewMode(false)
      nextTestlet()
    }
  }

  // Handle navigating from review to a specific question
  const handleNavigateToQuestion = (questionIndex: number) => {
    setIsReviewMode(false)
    goToQuestion(currentTestletIndex, questionIndex)
  }

  // Show review screen if in review mode
  if (isReviewMode) {
    const isLastTestlet = currentTestletIndex === exam.testlets.length - 1

    return (
      <TestletReview
        testletNumber={currentTestlet.testletNumber}
        testletTitle={currentTestlet.title}
        questions={currentTestlet.questions.map((q) => ({
          id: q.id,
          type: q.type,
          stem: q.stem,
        }))}
        onNavigateToQuestion={handleNavigateToQuestion}
        onSubmitTestlet={handleSubmitTestlet}
        isLastTestlet={isLastTestlet}
        isSubmitting={isSubmitting}
      />
    )
  }

  // Render the appropriate question component
  if (!currentQuestion) {
    // Reached end of testlet - show review
    setIsReviewMode(true)
    return null
  }

  // Handle MCQ answer submission
  const handleMCQAnswerSubmit = (isCorrect: boolean, selectedAnswer: string) => {
    submitAnswer(currentQuestion.id, selectedAnswer, 0)
  }

  // Handle TBS answer submission
  const handleTBSSubmit = (answers: Record<string, any>) => {
    submitAnswer(currentQuestion.id, answers, 0)
  }

  return (
    <div className="h-full">
      {currentQuestion.type === 'MCQ' ? (
        <div className="max-w-4xl mx-auto py-8 px-4">
          <div className="mb-4 text-sm text-gray-600">
            Testlet {currentTestlet.testletNumber} - Question {currentQuestionIndex + 1} of{' '}
            {currentTestlet.questions.length}
          </div>
          <QuestionCard
            question={{
              id: currentQuestion.id,
              stem: (currentQuestion as MCQQuestion).stem,
              options: (currentQuestion as MCQQuestion).options,
              correct_answer: (currentQuestion as MCQQuestion).correct_answer,
              explanation: (currentQuestion as MCQQuestion).explanation,
            }}
            questionNumber={currentQuestionIndex + 1}
            onAnswerSubmit={handleMCQAnswerSubmit}
            readOnly={false}
            showFeedback={false}
          />
        </div>
      ) : (
        <div className="h-full">
          <div className="bg-white border-b px-6 py-3">
            <div className="text-sm text-gray-600">
              Testlet {currentTestlet.testletNumber} - Simulation {currentQuestionIndex + 1} of{' '}
              {currentTestlet.questions.length}
            </div>
            <div className="text-lg font-semibold mt-1">
              {(currentQuestion as TBSQuestion).stem}
            </div>
          </div>
          <TBSLayout
            question={{
              id: currentQuestion.id,
              stem: (currentQuestion as TBSQuestion).stem,
              exhibits: (currentQuestion as TBSQuestion).exhibits,
              columns: (currentQuestion as TBSQuestion).columns,
              rows: (currentQuestion as TBSQuestion).rows,
              correctAnswers: (currentQuestion as TBSQuestion).correctAnswers,
              explanation: (currentQuestion as TBSQuestion).explanation,
            }}
            onSubmit={handleTBSSubmit}
            readOnly={false}
            showFeedback={false}
            showStem={false}
          />
        </div>
      )}
    </div>
  )
}
