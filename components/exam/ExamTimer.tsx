'use client'

import { useEffect } from 'react'
import { Clock } from 'lucide-react'
import { useExamStore } from '@/lib/store/exam-store'

export function ExamTimer() {
  const { timeLeft, isTimerRunning, tick } = useExamStore()

  // Timer tick effect
  useEffect(() => {
    if (!isTimerRunning) return

    const interval = setInterval(() => {
      tick()
    }, 1000)

    return () => clearInterval(interval)
  }, [isTimerRunning, tick])

  // Format time as HH:MM:SS
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Warning colors
  const getTimerColor = () => {
    if (timeLeft < 300) return 'text-red-600' // Less than 5 minutes
    if (timeLeft < 1800) return 'text-yellow-600' // Less than 30 minutes
    return 'text-gray-700'
  }

  return (
    <div className={`flex items-center gap-2 font-mono text-lg font-semibold ${getTimerColor()}`}>
      <Clock className="h-5 w-5" />
      <span>{formatTime(timeLeft)}</span>
    </div>
  )
}
