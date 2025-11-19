'use client'

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, XCircle, Lightbulb } from 'lucide-react'
import { cn } from '@/lib/utils'

interface QuestionOption {
  key: string
  text: string
}

interface QuestionCardProps {
  question: {
    id: string
    stem: string
    options: QuestionOption[]
    correct_answer: string
    explanation: string
  }
  questionNumber: number
  onAnswerSubmit?: (isCorrect: boolean, selectedAnswer: string) => void
  readOnly?: boolean
  showFeedback?: boolean
}

export function QuestionCard({
  question,
  questionNumber,
  onAnswerSubmit,
  readOnly = false,
  showFeedback = true
}: QuestionCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string>('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = () => {
    if (!selectedAnswer) return

    const isCorrect = selectedAnswer === question.correct_answer

    // In exam mode (showFeedback=false), don't set isSubmitted
    // This prevents showing correct/incorrect feedback
    if (showFeedback) {
      setIsSubmitted(true)
    }

    onAnswerSubmit?.(isCorrect, selectedAnswer)
  }

  const getOptionClassName = (optionKey: string) => {
    // In exam mode (showFeedback=false), don't show correctness colors
    if (!showFeedback || !isSubmitted) {
      return 'border-gray-200 hover:border-gray-300'
    }

    // Show correct answer in green (only when showFeedback is true)
    if (optionKey === question.correct_answer) {
      return 'border-green-500 bg-green-50'
    }

    // Show wrong selected answer in red (only when showFeedback is true)
    if (optionKey === selectedAnswer && selectedAnswer !== question.correct_answer) {
      return 'border-red-500 bg-red-50'
    }

    return 'border-gray-200 opacity-60'
  }

  const isCorrect = selectedAnswer === question.correct_answer

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Question {questionNumber}</span>
          {showFeedback && isSubmitted && (
            <div className="flex items-center gap-2">
              {isCorrect ? (
                <span className="flex items-center gap-1 text-green-600 text-sm font-normal">
                  <CheckCircle2 className="h-5 w-5" />
                  Correct!
                </span>
              ) : (
                <span className="flex items-center gap-1 text-red-600 text-sm font-normal">
                  <XCircle className="h-5 w-5" />
                  Incorrect
                </span>
              )}
            </div>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Question Text */}
        <div className="prose prose-sm max-w-none">
          <ReactMarkdown>{question.stem}</ReactMarkdown>
        </div>

        {/* Answer Options */}
        <RadioGroup
          value={selectedAnswer}
          onValueChange={setSelectedAnswer}
          disabled={isSubmitted}
          className="space-y-3"
        >
          {question.options.map((option) => (
            <div
              key={option.key}
              className={cn(
                'flex items-start space-x-3 rounded-lg border-2 p-4 transition-all',
                getOptionClassName(option.key),
                !isSubmitted && selectedAnswer === option.key && 'border-primary bg-primary/5'
              )}
            >
              <RadioGroupItem
                value={option.key}
                id={`option-${option.key}`}
                className="mt-1"
              />
              <Label
                htmlFor={`option-${option.key}`}
                className="flex-1 cursor-pointer text-sm leading-relaxed"
              >
                <span className="font-semibold mr-2">{option.key}.</span>
                {option.text}
              </Label>
              {showFeedback && isSubmitted && option.key === question.correct_answer && (
                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
              )}
              {showFeedback && isSubmitted && option.key === selectedAnswer && selectedAnswer !== question.correct_answer && (
                <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
              )}
            </div>
          ))}
        </RadioGroup>

        {/* Submit Button */}
        {!isSubmitted && (
          <Button
            onClick={handleSubmit}
            disabled={!selectedAnswer}
            className="w-full"
            size="lg"
          >
            Submit Answer
          </Button>
        )}

        {/* Explanation (shown after submission in study mode) */}
        {showFeedback && isSubmitted && (
          <Alert variant={isCorrect ? 'success' : 'default'}>
            <Lightbulb className="h-4 w-4" />
            <AlertTitle>Explanation</AlertTitle>
            <AlertDescription>
              <div className="prose prose-sm max-w-none mt-2">
                <ReactMarkdown>
                  {question.explanation}
                </ReactMarkdown>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
