'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, Circle, Flag, ChevronRight } from 'lucide-react'
import { useExamStore } from '@/lib/store/exam-store'

interface TestletReviewProps {
  testletNumber: number
  testletTitle: string
  questions: { id: string; type: string; stem: string }[]
  onNavigateToQuestion: (questionIndex: number) => void
  onSubmitTestlet: () => void
}

export function TestletReview({
  testletNumber,
  testletTitle,
  questions,
  onNavigateToQuestion,
  onSubmitTestlet,
}: TestletReviewProps) {
  const { answers, flags } = useExamStore()

  const getQuestionStatus = (questionId: string) => {
    const isAnswered = !!answers[questionId]
    const isFlagged = flags.has(questionId)

    return { isAnswered, isFlagged }
  }

  const answeredCount = questions.filter((q) => !!answers[q.id]).length
  const flaggedCount = questions.filter((q) => flags.has(q.id)).length
  const unansweredCount = questions.length - answeredCount

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            Testlet {testletNumber} Review: {testletTitle}
          </CardTitle>
          <CardDescription>
            Review your answers before submitting this testlet. Once submitted, you cannot return to these questions.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Summary */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{answeredCount}</div>
              <div className="text-sm text-gray-600">Answered</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-600">{unansweredCount}</div>
              <div className="text-sm text-gray-600">Unanswered</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">{flaggedCount}</div>
              <div className="text-sm text-gray-600">Flagged</div>
            </div>
          </div>

          {/* Question List */}
          <div>
            <h3 className="font-semibold mb-3">Question Status</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {questions.map((question, index) => {
                const { isAnswered, isFlagged } = getQuestionStatus(question.id)

                return (
                  <button
                    key={question.id}
                    onClick={() => onNavigateToQuestion(index)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-semibold">
                      {index + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-900 truncate">
                        {question.stem.substring(0, 80)}...
                      </div>
                      <div className="text-xs text-gray-500">{question.type}</div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isFlagged && (
                        <div className="flex items-center gap-1 text-yellow-600">
                          <Flag className="h-4 w-4 fill-current" />
                          <span className="text-xs">Flagged</span>
                        </div>
                      )}

                      {isAnswered ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      ) : (
                        <Circle className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Warning for unanswered */}
          {unansweredCount > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Warning:</strong> You have {unansweredCount} unanswered question{unansweredCount !== 1 ? 's' : ''}. You can review them now or submit the testlet.
              </p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              onClick={onSubmitTestlet}
              size="lg"
              className="min-w-[200px]"
            >
              Submit Testlet {testletNumber}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
