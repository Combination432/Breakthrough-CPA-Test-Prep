'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { QuestionCard } from '@/components/quiz/QuestionCard'
import { TBSLayout } from '@/components/tbs/TBSLayout'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Home } from 'lucide-react'
import { ScoreReportModal } from '@/components/exam/ScoreReportModal'
import type { Exam, MCQQuestion, TBSQuestion } from '@/lib/supabase/queries'

interface ExamReviewClientProps {
  examData: any
  examStructure: Exam
  userResponses: Record<string, any>
}

export function ExamReviewClient({
  examData,
  examStructure,
  userResponses,
}: ExamReviewClientProps) {
  const router = useRouter()
  const [currentTestletIndex, setCurrentTestletIndex] = useState(0)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [showScoreModal, setShowScoreModal] = useState(true)

  const currentTestlet = examStructure.testlets[currentTestletIndex]
  const currentQuestion = currentTestlet?.questions[currentQuestionIndex]

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    } else if (currentTestletIndex > 0) {
      setCurrentTestletIndex(currentTestletIndex - 1)
      setCurrentQuestionIndex(
        examStructure.testlets[currentTestletIndex - 1].questions.length - 1
      )
    }
  }

  const handleNext = () => {
    if (currentQuestionIndex < currentTestlet.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else if (currentTestletIndex < examStructure.testlets.length - 1) {
      setCurrentTestletIndex(currentTestletIndex + 1)
      setCurrentQuestionIndex(0)
    }
  }

  const isFirstQuestion = currentTestletIndex === 0 && currentQuestionIndex === 0
  const isLastQuestion =
    currentTestletIndex === examStructure.testlets.length - 1 &&
    currentQuestionIndex === currentTestlet.questions.length - 1

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Score Report Modal */}
      {showScoreModal && examData && (
        <ScoreReportModal examData={examData} onClose={() => setShowScoreModal(false)} />
      )}

      {/* Header */}
      <header className="bg-white border-b shadow-sm px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {examData.exam_sections?.name || 'Exam'} - Review Mode
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Testlet {currentTestlet.testletNumber} - Question {currentQuestionIndex + 1} of{' '}
              {currentTestlet.questions.length}
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowScoreModal(true)}>
              View Score Report
            </Button>
            <Button onClick={() => router.push('/dashboard')}>
              <Home className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="h-full">
          {currentQuestion && currentQuestion.type === 'MCQ' ? (
            <div className="max-w-4xl mx-auto py-8 px-4">
              <QuestionCard
                question={{
                  id: currentQuestion.id,
                  stem: (currentQuestion as MCQQuestion).stem,
                  options: (currentQuestion as MCQQuestion).options,
                  correct_answer: (currentQuestion as MCQQuestion).correct_answer,
                  explanation: (currentQuestion as MCQQuestion).explanation,
                }}
                questionNumber={currentQuestionIndex + 1}
                readOnly={true}
                showFeedback={true}
              />
            </div>
          ) : currentQuestion && currentQuestion.type === 'TBS' ? (
            <div className="h-full">
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
                readOnly={true}
                showFeedback={true}
                showStem={true}
              />
            </div>
          ) : null}
        </div>
      </main>

      {/* Footer Navigation */}
      <footer className="bg-white border-t shadow-sm px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button variant="outline" size="lg" onClick={handlePrevious} disabled={isFirstQuestion}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="text-sm text-gray-600">
            Question {currentTestletIndex * 15 + currentQuestionIndex + 1} of{' '}
            {examData.total_questions}
          </div>

          <Button variant="default" size="lg" onClick={handleNext} disabled={isLastQuestion}>
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </footer>
    </div>
  )
}
