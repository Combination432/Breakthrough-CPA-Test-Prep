'use client'

import { ReactNode, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ExamTimer } from '@/components/exam/ExamTimer'
import { NavigationGrid } from '@/components/exam/NavigationGrid'
import { Calculator, Power, ChevronLeft, ChevronRight, Flag } from 'lucide-react'
import { useExamStore } from '@/lib/store/exam-store'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

interface ExamLayoutProps {
  children: ReactNode
}

export default function ExamLayout({ children }: ExamLayoutProps) {
  const router = useRouter()
  const {
    examSectionCode,
    status,
    completeExam,
    currentTestletIndex,
    currentQuestionIndex,
    previousQuestion,
    nextQuestion,
    toggleFlag,
    flags
  } = useExamStore()

  const handleQuitExam = () => {
    completeExam()
    router.push('/study')
  }

  const handlePrevious = () => {
    previousQuestion()
  }

  const handleNext = () => {
    nextQuestion()
  }

  const handleToggleFlag = () => {
    // We'll get the current question ID from the page context
    // For now, this is a placeholder - will be properly implemented in TestletController
    const currentQuestionId = `q-${currentTestletIndex}-${currentQuestionIndex}`
    toggleFlag(currentQuestionId)
  }

  // Check if current question is flagged
  const currentQuestionId = `q-${currentTestletIndex}-${currentQuestionIndex}`
  const isCurrentFlagged = flags.has(currentQuestionId)

  // Warn before leaving the page
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (status === 'active') {
        e.preventDefault()
        e.returnValue = ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [status])

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Left: Section Info */}
          <div className="flex items-center gap-4">
            <div className="text-lg font-bold text-gray-900">
              {examSectionCode || 'CPA'} Exam
            </div>
            <div className="h-6 w-px bg-gray-300"></div>
            <div className="text-sm text-gray-600">
              {status === 'active' && 'In Progress'}
              {status === 'review' && 'Review Mode'}
              {status === 'completed' && 'Completed'}
            </div>
          </div>

          {/* Center: Timer */}
          <div className="flex-1 flex justify-center">
            <ExamTimer />
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" title="Calculator (Coming Soon)">
              <Calculator className="h-4 w-4 mr-2" />
              Calculator
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Power className="h-4 w-4 mr-2" />
                  Quit Exam
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Quit Exam?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to quit the exam? Your progress will be saved, but you will need to restart the exam session.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleQuitExam}>
                    Quit Exam
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>

      {/* Footer Navigation */}
      <footer className="bg-white border-t shadow-sm px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Left: Previous Button */}
          <div className="w-32">
            <Button
              variant="outline"
              size="lg"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0 && currentTestletIndex === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
          </div>

          {/* Center: Flag and Navigation Grid */}
          <div className="flex items-center gap-4">
            <Button
              variant={isCurrentFlagged ? 'default' : 'outline'}
              size="lg"
              onClick={handleToggleFlag}
              className={isCurrentFlagged ? 'bg-yellow-500 hover:bg-yellow-600' : ''}
            >
              <Flag className={`h-4 w-4 mr-2 ${isCurrentFlagged ? 'fill-current' : ''}`} />
              {isCurrentFlagged ? 'Flagged' : 'Flag for Review'}
            </Button>

            <NavigationGrid />
          </div>

          {/* Right: Next Button */}
          <div className="w-32 flex justify-end">
            <Button
              variant="default"
              size="lg"
              onClick={handleNext}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </footer>
    </div>
  )
}
