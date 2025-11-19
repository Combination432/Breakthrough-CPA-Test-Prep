'use client'

import { useState, useEffect } from 'react'
import { QuestionCard } from './QuestionCard'
import { QuizSummary } from './QuizSummary'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ChevronRight } from 'lucide-react'
import { useQuizStore } from '@/store/quiz-store'

interface Question {
  id: string
  stem: string
  options: { key: string; text: string }[]
  correct_answer: string
  explanation: string
}

interface QuizSessionProps {
  questions: Question[]
}

export function QuizSession({ questions }: QuizSessionProps) {
  const {
    currentQuestionIndex,
    correctCount,
    incorrectCount,
    answers,
    nextQuestion,
    submitAnswer,
    resetQuiz,
  } = useQuizStore()

  const [isClient, setIsClient] = useState(false)

  // Handle hydration
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Reset quiz when component mounts
  useEffect(() => {
    if (isClient) {
      resetQuiz()
    }
  }, [isClient, resetQuiz])

  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-lg text-gray-600">Loading quiz...</div>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const isQuizComplete = currentQuestionIndex >= questions.length
  const currentAnswer = answers[currentQuestionIndex]
  const canProceed = currentAnswer?.isSubmitted

  const progress = (currentQuestionIndex / questions.length) * 100

  const handleAnswerSubmit = (isCorrect: boolean, selectedAnswer: string) => {
    submitAnswer(currentQuestionIndex, selectedAnswer, isCorrect)
  }

  const handleNextQuestion = () => {
    nextQuestion()
  }

  const handleRetry = () => {
    resetQuiz()
  }

  // Show summary if quiz is complete
  if (isQuizComplete) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <QuizSummary
          correctCount={correctCount}
          incorrectCount={incorrectCount}
          totalQuestions={questions.length}
          onRetry={handleRetry}
        />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          <span>
            {correctCount} correct • {incorrectCount} incorrect
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Card */}
      <QuestionCard
        question={currentQuestion}
        questionNumber={currentQuestionIndex + 1}
        onAnswerSubmit={handleAnswerSubmit}
      />

      {/* Next Question Button */}
      {canProceed && currentQuestionIndex < questions.length - 1 && (
        <div className="flex justify-end">
          <Button onClick={handleNextQuestion} size="lg">
            Next Question
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Finish Quiz Button */}
      {canProceed && currentQuestionIndex === questions.length - 1 && (
        <div className="flex justify-end">
          <Button onClick={handleNextQuestion} size="lg">
            Finish Quiz
          </Button>
        </div>
      )}
    </div>
  )
}
