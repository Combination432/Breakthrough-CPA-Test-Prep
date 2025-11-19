'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useExamStore } from '@/lib/store/exam-store'
import { MOCK_FAR_EXAM, MockQuestion, MockMCQQuestion, MockTBSQuestion } from '@/lib/mock-exam-structure'
import { QuestionCard } from '@/components/quiz/QuestionCard'
import { TBSLayout } from '@/components/tbs/TBSLayout'
import { TestletReview } from '@/components/exam/TestletReview'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import { submitExam } from '../actions'

export default function ExamPage() {
  const params = useParams()
  const router = useRouter()
  const examId = params.examId as string

  const {
    currentTestletIndex,
    currentQuestionIndex,
    setExamId,
    startExam,
    submitAnswer,
    goToQuestion,
    nextTestlet,
    answers,
    examSectionCode,
    timeLeft,
  } = useExamStore()

  const [isReviewMode, setIsReviewMode] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize exam on mount
  useEffect(() => {
    if (examId) {
      setExamId(examId, MOCK_FAR_EXAM.sectionCode)
      startExam(MOCK_FAR_EXAM.timeLimit)
      setIsLoading(false)
    }
  }, [examId, setExamId, startExam])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  // Get current testlet
  const currentTestlet = MOCK_FAR_EXAM.testlets[currentTestletIndex]

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
    const isLastTestlet = currentTestletIndex === MOCK_FAR_EXAM.testlets.length - 1

    if (isLastTestlet) {
      // Submit the entire exam
      setIsSubmitting(true)

      try {
        // Calculate time spent (initial time - time left)
        const timeSpent = MOCK_FAR_EXAM.timeLimit - timeLeft

        // Submit the exam
        const result = await submitExam(examId, examSectionCode, answers, timeSpent)

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
    const isLastTestlet = currentTestletIndex === MOCK_FAR_EXAM.testlets.length - 1

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

  // Show testlet instructions on first question
  if (currentQuestionIndex === 0) {
    // TODO: Show testlet instructions screen
    // For now, we'll just render the first question
  }

  // Render the appropriate question component
  if (!currentQuestion) {
    // Reached end of testlet - show review
    setIsReviewMode(true)
    return null
  }

  // Handle MCQ answer submission
  const handleMCQAnswerSubmit = (isCorrect: boolean, selectedAnswer: string) => {
    submitAnswer(currentQuestion.id, selectedAnswer, 0) // TODO: Track time spent
  }

  // Handle TBS answer submission
  const handleTBSSubmit = (answers: Record<string, any>) => {
    submitAnswer(currentQuestion.id, answers, 0) // TODO: Track time spent
  }

  return (
    <div className="h-full">
      {currentQuestion.type === 'MCQ' ? (
        <div className="max-w-4xl mx-auto py-8 px-4">
          <div className="mb-4 text-sm text-gray-600">
            Testlet {currentTestlet.testletNumber} - Question {currentQuestionIndex + 1} of {currentTestlet.questions.length}
          </div>
          <QuestionCard
            question={{
              id: currentQuestion.id,
              stem: (currentQuestion as MockMCQQuestion).stem,
              options: (currentQuestion as MockMCQQuestion).options,
              correct_answer: (currentQuestion as MockMCQQuestion).correct_answer,
              explanation: (currentQuestion as MockMCQQuestion).explanation,
            }}
            questionNumber={currentQuestionIndex + 1}
            onAnswerSubmit={handleMCQAnswerSubmit}
            readOnly={false}
            showFeedback={false} // Don't show feedback in exam mode
          />
        </div>
      ) : (
        <div className="h-full">
          <div className="bg-white border-b px-6 py-3">
            <div className="text-sm text-gray-600">
              Testlet {currentTestlet.testletNumber} - Simulation {currentQuestionIndex + 1} of {currentTestlet.questions.length}
            </div>
            <div className="text-lg font-semibold mt-1">
              {(currentQuestion as MockTBSQuestion).stem}
            </div>
          </div>
          <TBSLayout
            question={{
              id: currentQuestion.id,
              stem: (currentQuestion as MockTBSQuestion).stem,
              exhibits: (currentQuestion as MockTBSQuestion).exhibits,
              columns: (currentQuestion as MockTBSQuestion).columns,
              rows: (currentQuestion as MockTBSQuestion).rows,
              correctAnswers: (currentQuestion as MockTBSQuestion).correctAnswers,
              explanation: (currentQuestion as MockTBSQuestion).explanation,
            }}
            onSubmit={handleTBSSubmit}
            readOnly={false}
            showFeedback={false} // Don't show feedback in exam mode
            showStem={false} // Stem is rendered in the header above
          />
        </div>
      )}
    </div>
  )
}
