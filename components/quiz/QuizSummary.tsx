'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, XCircle, RotateCcw, Home } from 'lucide-react'
import Link from 'next/link'

interface QuizSummaryProps {
  correctCount: number
  incorrectCount: number
  totalQuestions: number
  onRetry?: () => void
}

export function QuizSummary({ correctCount, incorrectCount, totalQuestions, onRetry }: QuizSummaryProps) {
  const percentage = Math.round((correctCount / totalQuestions) * 100)
  const passed = percentage >= 75

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl">Quiz Complete!</CardTitle>
        <CardDescription>Here&apos;s how you performed</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Score Circle */}
        <div className="flex justify-center">
          <div className="relative w-40 h-40">
            <svg className="w-40 h-40 transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-gray-200"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={`${2 * Math.PI * 70}`}
                strokeDashoffset={`${2 * Math.PI * 70 * (1 - percentage / 100)}`}
                className={passed ? 'text-green-500' : 'text-yellow-500'}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-bold">{percentage}%</div>
                <div className="text-sm text-gray-600">Score</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
            <div>
              <div className="text-2xl font-bold text-green-700">{correctCount}</div>
              <div className="text-sm text-green-600">Correct</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
            <XCircle className="h-8 w-8 text-red-600" />
            <div>
              <div className="text-2xl font-bold text-red-700">{incorrectCount}</div>
              <div className="text-sm text-red-600">Incorrect</div>
            </div>
          </div>
        </div>

        {/* Performance Message */}
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          {passed ? (
            <p className="text-lg font-medium text-green-700">
              Great job! You passed with a score of {percentage}%
            </p>
          ) : (
            <p className="text-lg font-medium text-yellow-700">
              You scored {percentage}%. Keep practicing to improve!
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          {onRetry && (
            <Button
              onClick={onRetry}
              variant="outline"
              className="flex-1"
              size="lg"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Retry Quiz
            </Button>
          )}
          <Link href="/" className="flex-1">
            <Button variant="default" className="w-full" size="lg">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
