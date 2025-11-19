'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { MOCK_FAR_EXAM, MockQuestion, MockMCQQuestion, MockTBSQuestion } from '@/lib/mock-exam-structure'
import { QuestionCard } from '@/components/quiz/QuestionCard'
import { TBSLayout } from '@/components/tbs/TBSLayout'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, ChevronLeft, ChevronRight, Home } from 'lucide-react'
import { ScoreReportModal } from '@/components/exam/ScoreReportModal'
import { createClient } from '@/lib/supabase/client'

export default function ExamReviewPage() {
  const params = useParams()
  const router = useRouter()
  const examId = params.examId as string

  const [currentTestletIndex, setCurrentTestletIndex] = useState(0)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [showScoreModal, setShowScoreModal] = useState(true)
  const [examData, setExamData] = useState<any>(null)
  const [userResponses, setUserResponses] = useState<Record<string, any>>({})

  // Fetch exam data on mount
  useEffect(() => {
    async function fetchExamData() {
      const supabase = createClient()

      // Fetch exam record
      const { data: exam, error: examError } = await supabase
        .from('exams')
        .select(`
          id,
          score,
          passed,
          total_questions,
          questions_answered,
          time_spent_seconds,
          created_at,
          exam_sections (
            code,
            name
          )
        `)
        .eq('id', examId)
        .single()

      if (examError || !exam) {
        console.error('Error fetching exam:', examError)
        setIsLoading(false)
        return
      }

      // Fetch user responses
      const { data: responses, error: responsesError } = await supabase
        .from('user_responses')
        .select('question_id, response_data, is_correct, points_earned, points_possible')
        .eq('exam_id', examId)

      const responsesMap: Record<string, any> = {}
      if (responses) {
        responses.forEach((r) => {
          responsesMap[r.question_id] = r
        })
      }

      setExamData(exam)
      setUserResponses(responsesMap)
      setIsLoading(false)
    }

    fetchExamData()
  }, [examId])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  if (!examData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card>
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold">Exam Not Found</h2>
            <p className="text-gray-600 mt-2">
              The exam you are trying to review could not be found.
            </p>
            <Button className="mt-4" onClick={() => router.push('/dashboard')}>
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Get current testlet and question from mock data
  const currentTestlet = MOCK_FAR_EXAM.testlets[currentTestletIndex]
  const currentQuestion = currentTestlet?.questions[currentQuestionIndex]

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    } else if (currentTestletIndex > 0) {
      setCurrentTestletIndex(currentTestletIndex - 1)
      setCurrentQuestionIndex(MOCK_FAR_EXAM.testlets[currentTestletIndex - 1].questions.length - 1)
    }
  }

  const handleNext = () => {
    if (currentQuestionIndex < currentTestlet.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else if (currentTestletIndex < MOCK_FAR_EXAM.testlets.length - 1) {
      setCurrentTestletIndex(currentTestletIndex + 1)
      setCurrentQuestionIndex(0)
    }
  }

  const isFirstQuestion = currentTestletIndex === 0 && currentQuestionIndex === 0
  const isLastQuestion =
    currentTestletIndex === MOCK_FAR_EXAM.testlets.length - 1 &&
    currentQuestionIndex === currentTestlet.questions.length - 1

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Score Report Modal */}
      {showScoreModal && examData && (
        <ScoreReportModal
          examData={examData}
          onClose={() => setShowScoreModal(false)}
        />
      )}

      {/* Header */}
      <header className="bg-white border-b shadow-sm px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {examData.exam_sections?.name || 'Exam'} - Review Mode
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Testlet {currentTestlet.testletNumber} - Question {currentQuestionIndex + 1} of {currentTestlet.questions.length}
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
                  stem: (currentQuestion as MockMCQQuestion).stem,
                  options: (currentQuestion as MockMCQQuestion).options,
                  correct_answer: (currentQuestion as MockMCQQuestion).correct_answer,
                  explanation: (currentQuestion as MockMCQQuestion).explanation,
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
                  stem: (currentQuestion as MockTBSQuestion).stem,
                  exhibits: (currentQuestion as MockTBSQuestion).exhibits,
                  columns: (currentQuestion as MockTBSQuestion).columns,
                  rows: (currentQuestion as MockTBSQuestion).rows,
                  correctAnswers: (currentQuestion as MockTBSQuestion).correctAnswers,
                  explanation: (currentQuestion as MockTBSQuestion).explanation,
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
          <Button
            variant="outline"
            size="lg"
            onClick={handlePrevious}
            disabled={isFirstQuestion}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="text-sm text-gray-600">
            Question {currentTestletIndex * 15 + currentQuestionIndex + 1} of {examData.total_questions}
          </div>

          <Button
            variant="default"
            size="lg"
            onClick={handleNext}
            disabled={isLastQuestion}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </footer>
    </div>
  )
}
