'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle2, XCircle, Trophy, Clock, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ScoreReportModalProps {
  examData: {
    score: number
    passed: boolean
    total_questions: number
    questions_answered: number
    time_spent_seconds: number
    exam_sections: {
      code: string
      name: string
    } | null
  }
  onClose: () => void
}

export function ScoreReportModal({ examData, onClose }: ScoreReportModalProps) {
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours}h ${minutes}m ${secs}s`
  }

  const scoreColor = examData.score >= 75 ? 'text-green-600' : 'text-red-600'
  const scoreBgColor = examData.score >= 75 ? 'bg-green-50' : 'bg-red-50'
  const scoreBorderColor = examData.score >= 75 ? 'border-green-200' : 'border-red-200'

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Exam Score Report</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Pass/Fail Status */}
          <Card className={`border-2 ${scoreBorderColor} ${scoreBgColor}`}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-center gap-3">
                {examData.passed ? (
                  <CheckCircle2 className="h-12 w-12 text-green-600" />
                ) : (
                  <XCircle className="h-12 w-12 text-red-600" />
                )}
                <div>
                  <div className="text-4xl font-bold text-gray-900">
                    {examData.score.toFixed(1)}%
                  </div>
                  <div className={`text-lg font-semibold ${scoreColor}`}>
                    {examData.passed ? 'PASSED' : 'NOT PASSED'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Exam Section</h3>
            <p className="text-lg text-gray-700">
              {examData.exam_sections?.name || 'Unknown Section'} ({examData.exam_sections?.code || 'N/A'})
            </p>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <Trophy className="h-8 w-8 text-yellow-600 mb-2" />
                  <div className="text-2xl font-bold text-gray-900">
                    {examData.score.toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">Final Score</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <Target className="h-8 w-8 text-blue-600 mb-2" />
                  <div className="text-2xl font-bold text-gray-900">
                    {examData.questions_answered}/{examData.total_questions}
                  </div>
                  <div className="text-sm text-gray-600">Questions</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <Clock className="h-8 w-8 text-purple-600 mb-2" />
                  <div className="text-2xl font-bold text-gray-900">
                    {formatTime(examData.time_spent_seconds)}
                  </div>
                  <div className="text-sm text-gray-600">Time Spent</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Breakdown */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Performance Breakdown</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Multiple Choice Questions (MCQ)</span>
                <span className="font-semibold">50% of total score</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Task-Based Simulations (TBS)</span>
                <span className="font-semibold">50% of total score</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-semibold">Passing Score</span>
                  <span className="font-semibold text-green-600">75%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pass/Fail Message */}
          {examData.passed ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800">
                <strong>Congratulations!</strong> You have successfully passed this exam section.
                Keep up the great work and continue studying for the remaining sections.
              </p>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">
                <strong>Keep practicing!</strong> You scored {examData.score.toFixed(1)}%, which is below
                the passing threshold of 75%. Review the questions you missed and try again.
              </p>
            </div>
          )}

          {/* Close Button */}
          <div className="flex justify-end">
            <Button onClick={onClose} size="lg">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
