'use client'

import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable'
import { ExhibitViewer } from './ExhibitViewer'
import { SpreadsheetWorkspace } from './SpreadsheetWorkspace'
import type { TBSQuestion, GridRow } from '@/lib/mock-tbs'
import { useState } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { CheckCircle2, XCircle, Lightbulb } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

interface TBSLayoutProps {
  question: TBSQuestion
  onAnswerSubmit?: (rows: GridRow[], isCorrect: boolean) => void
}

export function TBSLayout({ question, onAnswerSubmit }: TBSLayoutProps) {
  const [submittedRows, setSubmittedRows] = useState<GridRow[] | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [results, setResults] = useState<{
    isCorrect: boolean
    correctCount: number
    totalCount: number
  } | null>(null)

  const handleSubmit = (rows: GridRow[]) => {
    // Validate the answers
    let correctCount = 0
    let totalCount = 0

    rows.forEach((row) => {
      const correctRow = question.correctAnswers[row.id]
      if (correctRow) {
        Object.keys(correctRow).forEach((key) => {
          totalCount++
          const userValue = parseFloat(String(row[key]).replace(/,/g, '')) || 0
          const correctValue = parseFloat(String(correctRow[key]).replace(/,/g, '')) || 0

          if (Math.abs(userValue - correctValue) < 0.01) {
            correctCount++
          }
        })
      }
    })

    const isCorrect = correctCount === totalCount && totalCount > 0

    setSubmittedRows(rows)
    setIsSubmitted(true)
    setResults({
      isCorrect,
      correctCount,
      totalCount,
    })

    if (onAnswerSubmit) {
      onAnswerSubmit(rows, isCorrect)
    }
  }

  const handleReset = () => {
    setSubmittedRows(null)
    setIsSubmitted(false)
    setResults(null)
  }

  return (
    <div className="h-full flex flex-col">
      {/* Question Stem */}
      <div className="bg-white border-b px-6 py-4">
        <div className="prose prose-sm max-w-none">
          <ReactMarkdown>{question.stem}</ReactMarkdown>
        </div>
      </div>

      {/* Split Panel Layout */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Left Panel: Exhibits */}
          <ResizablePanel defaultSize={40} minSize={30} maxSize={60}>
            <div className="h-full p-4 bg-gray-50">
              <ExhibitViewer exhibits={question.exhibits} />
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Right Panel: Spreadsheet */}
          <ResizablePanel defaultSize={60} minSize={40}>
            <div className="h-full p-4 bg-white">
              <SpreadsheetWorkspace
                title="Depreciation Schedule Worksheet"
                columns={question.columns}
                initialRows={question.rows}
                onSubmit={handleSubmit}
                onReset={handleReset}
              />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Results and Explanation */}
      {isSubmitted && results && (
        <div className="border-t bg-white p-6">
          <Alert variant={results.isCorrect ? 'success' : 'default'}>
            {results.isCorrect ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}
            <AlertTitle>
              {results.isCorrect ? (
                <span className="text-green-700">Correct!</span>
              ) : (
                <span className="text-red-700">
                  Partially Correct ({results.correctCount} / {results.totalCount} cells)
                </span>
              )}
            </AlertTitle>
            <AlertDescription>
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="h-4 w-4" />
                  <span className="font-semibold">Explanation:</span>
                </div>
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown>{question.explanation}</ReactMarkdown>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  )
}
