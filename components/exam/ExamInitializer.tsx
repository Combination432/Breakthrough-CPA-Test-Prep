'use client'

import { useEffect, useState } from 'react'
import { useExamStore } from '@/lib/store/exam-store'
import { ExamController } from './ExamController'
import { Loader2 } from 'lucide-react'
import type { Exam } from '@/lib/supabase/queries'

interface ExamInitializerProps {
  exam: Exam
  examId: string
}

export function ExamInitializer({ exam, examId }: ExamInitializerProps) {
  const { setExamId, startExam } = useExamStore()
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    setExamId(examId, exam.sectionCode)
    startExam(exam.timeLimit)
    setIsInitialized(true)
  }, [examId, exam.sectionCode, exam.timeLimit, setExamId, startExam])

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  return <ExamController exam={exam} examId={examId} />
}
