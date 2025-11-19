'use client'

import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useExamStore } from '@/lib/store/exam-store'
import { Grid3x3, Flag } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavigationGridProps {
  questions: { id: string }[]
  currentQuestionIndex: number
  onNavigate: (index: number) => void
}

export function NavigationGrid({
  questions,
  currentQuestionIndex,
  onNavigate,
}: NavigationGridProps) {
  const { answers, flags } = useExamStore()

  const getQuestionStatus = (questionId: string, index: number) => {
    const isCurrent = index === currentQuestionIndex
    const isAnswered = !!answers[questionId]
    const isFlagged = flags.has(questionId)

    return {
      isCurrent,
      isAnswered,
      isFlagged,
    }
  }

  const getQuestionClass = (questionId: string, index: number) => {
    const { isCurrent, isAnswered, isFlagged } = getQuestionStatus(questionId, index)

    if (isCurrent) {
      return 'bg-primary text-primary-foreground border-primary'
    }

    if (isFlagged) {
      return 'bg-yellow-100 text-yellow-900 border-yellow-400'
    }

    if (isAnswered) {
      return 'bg-green-100 text-green-900 border-green-400'
    }

    return 'bg-gray-100 text-gray-700 border-gray-300'
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <Grid3x3 className="h-4 w-4 mr-2" />
          Question Grid
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Navigate to Question</h4>
            <p className="text-xs text-gray-600 mb-4">
              Click a question number to jump to that question
            </p>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {questions.map((question, index) => {
              const { isFlagged } = getQuestionStatus(question.id, index)

              return (
                <button
                  key={question.id}
                  onClick={() => onNavigate(index)}
                  className={cn(
                    'relative h-10 w-10 rounded border-2 text-sm font-semibold transition-all hover:scale-105',
                    getQuestionClass(question.id, index)
                  )}
                >
                  {index + 1}
                  {isFlagged && (
                    <Flag className="absolute -top-1 -right-1 h-3 w-3 text-yellow-600 fill-yellow-600" />
                  )}
                </button>
              )
            })}
          </div>

          <div className="space-y-2 text-xs border-t pt-3">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded border-2 bg-primary border-primary"></div>
              <span>Current Question</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded border-2 bg-green-100 border-green-400"></div>
              <span>Answered</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded border-2 bg-yellow-100 border-yellow-400"></div>
              <span>Flagged for Review</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded border-2 bg-gray-100 border-gray-300"></div>
              <span>Not Answered</span>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
