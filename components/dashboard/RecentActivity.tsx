'use client'

import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { CheckCircle2, XCircle, Clock, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Exam {
  id: string
  score: number | null
  passed: boolean | null
  total_questions: number
  questions_answered: number
  time_spent_seconds: number
  created_at: string
  exam_sections: {
    code: string
    name: string
  } | null
}

interface RecentActivityProps {
  exams: Exam[]
}

export function RecentActivity({ exams }: RecentActivityProps) {
  if (exams.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No exam attempts yet</p>
        <p className="text-sm text-gray-400 mt-2">
          Start your first practice exam to see your progress here
        </p>
      </div>
    )
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  return (
    <div className="space-y-3">
      {exams.map((exam) => (
        <div
          key={exam.id}
          className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-start gap-4 flex-1">
            {/* Status Icon */}
            <div className="mt-1">
              {exam.passed ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
            </div>

            {/* Exam Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h3 className="font-semibold text-gray-900">
                  {exam.exam_sections?.name || 'Unknown Section'}
                </h3>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    exam.passed
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {exam.score !== null && exam.score !== undefined
                    ? `${exam.score.toFixed(1)}%`
                    : 'N/A'}
                </span>
              </div>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {formatTime(exam.time_spent_seconds)}
                </span>
                <span>
                  {exam.questions_answered}/{exam.total_questions} questions
                </span>
                <span className="text-gray-400">
                  {formatDistanceToNow(new Date(exam.created_at), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Review Button */}
          <Link href={`/exam/${exam.id}/review`}>
            <Button variant="ghost" size="sm">
              Review
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
      ))}
    </div>
  )
}
