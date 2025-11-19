'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { createQuestion } from '@/app/admin/questions/actions'
import { TBSLayout } from '@/components/tbs/TBSLayout'
import { Eye, Save } from 'lucide-react'

type Section = {
  id: string
  code: string
  name: string
  testlets: {
    id: string
    testlet_number: number
    testlet_type: string
    title: string | null
  }[]
}

interface QuestionEditorFormProps {
  sections: Section[]
}

export function QuestionEditorForm({ sections }: QuestionEditorFormProps) {
  const router = useRouter()
  const [questionType, setQuestionType] = useState<'MCQ' | 'TBS'>('MCQ')
  const [selectedSection, setSelectedSection] = useState<string>('')
  const [selectedTestlet, setSelectedTestlet] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  // MCQ fields
  const [stem, setStem] = useState('')
  const [optionA, setOptionA] = useState('')
  const [optionB, setOptionB] = useState('')
  const [optionC, setOptionC] = useState('')
  const [optionD, setOptionD] = useState('')
  const [correctAnswer, setCorrectAnswer] = useState('')
  const [explanation, setExplanation] = useState('')
  const [difficulty, setDifficulty] = useState('')

  // TBS fields
  const [tbsJson, setTbsJson] = useState('')
  const [jsonError, setJsonError] = useState('')
  const [parsedTBS, setParsedTBS] = useState<any>(null)

  const handleTBSJsonChange = (value: string) => {
    setTbsJson(value)
    try {
      const parsed = JSON.parse(value)
      setJsonError('')
      setParsedTBS(parsed)
    } catch (e) {
      setJsonError('Invalid JSON')
      setParsedTBS(null)
    }
  }

  const handleSubmit = async () => {
    if (!selectedTestlet) {
      alert('Please select a section and testlet')
      return
    }

    setIsSubmitting(true)

    try {
      let questionData: any = {
        testlet_id: selectedTestlet,
        question_type: questionType,
        question_number: 1, // TODO: Auto-increment this
        difficulty_level: difficulty || null,
        stem,
        explanation,
      }

      if (questionType === 'MCQ') {
        if (!stem || !optionA || !optionB || !optionC || !optionD || !correctAnswer) {
          alert('Please fill in all MCQ fields')
          setIsSubmitting(false)
          return
        }

        questionData.options = [
          { key: 'A', text: optionA },
          { key: 'B', text: optionB },
          { key: 'C', text: optionC },
          { key: 'D', text: optionD },
        ]
        questionData.correct_answer = correctAnswer
      } else {
        // TBS
        if (!tbsJson || jsonError) {
          alert('Please provide valid TBS JSON configuration')
          setIsSubmitting(false)
          return
        }

        const parsed = JSON.parse(tbsJson)
        questionData.exhibits = parsed.exhibits || []
        questionData.grid_config = {
          columns: parsed.columns || [],
          rows: parsed.rows || [],
        }
        questionData.correct_answer_data = parsed.correctAnswers || {}
      }

      const result = await createQuestion(questionData)

      if (result.success) {
        router.push('/admin/questions')
      } else {
        alert(`Error: ${result.error}`)
        setIsSubmitting(false)
      }
    } catch (error) {
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
      setIsSubmitting(false)
    }
  }

  const selectedSectionData = sections.find((s) => s.id === selectedSection)
  const testlets = selectedSectionData?.testlets || []

  return (
    <div className="space-y-6">
      {/* Section and Testlet Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Question Placement</CardTitle>
          <CardDescription>Select the exam section and testlet for this question</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="section">Exam Section</Label>
            <Select value={selectedSection} onValueChange={setSelectedSection}>
              <SelectTrigger id="section">
                <SelectValue placeholder="Select a section" />
              </SelectTrigger>
              <SelectContent>
                {sections.map((section) => (
                  <SelectItem key={section.id} value={section.id}>
                    {section.code} - {section.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="testlet">Testlet</Label>
            <Select
              value={selectedTestlet}
              onValueChange={setSelectedTestlet}
              disabled={!selectedSection}
            >
              <SelectTrigger id="testlet">
                <SelectValue placeholder="Select a testlet" />
              </SelectTrigger>
              <SelectContent>
                {testlets.map((testlet) => (
                  <SelectItem key={testlet.id} value={testlet.id}>
                    Testlet {testlet.testlet_number} - {testlet.testlet_type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="difficulty">Difficulty</Label>
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger id="difficulty">
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Question Type Tabs */}
      <Tabs value={questionType} onValueChange={(v) => setQuestionType(v as 'MCQ' | 'TBS')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="MCQ">Multiple Choice (MCQ)</TabsTrigger>
          <TabsTrigger value="TBS">Task-Based Simulation (TBS)</TabsTrigger>
        </TabsList>

        {/* MCQ Tab */}
        <TabsContent value="MCQ">
          <Card>
            <CardHeader>
              <CardTitle>MCQ Question Details</CardTitle>
              <CardDescription>Enter the question stem and answer options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="stem">Question Text</Label>
                <Textarea
                  id="stem"
                  rows={4}
                  placeholder="Enter the question stem (supports Markdown)"
                  value={stem}
                  onChange={(e) => setStem(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="optionA">Option A</Label>
                  <Input
                    id="optionA"
                    placeholder="Enter option A"
                    value={optionA}
                    onChange={(e) => setOptionA(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="optionB">Option B</Label>
                  <Input
                    id="optionB"
                    placeholder="Enter option B"
                    value={optionB}
                    onChange={(e) => setOptionB(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="optionC">Option C</Label>
                  <Input
                    id="optionC"
                    placeholder="Enter option C"
                    value={optionC}
                    onChange={(e) => setOptionC(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="optionD">Option D</Label>
                  <Input
                    id="optionD"
                    placeholder="Enter option D"
                    value={optionD}
                    onChange={(e) => setOptionD(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="correctAnswer">Correct Answer</Label>
                <Select value={correctAnswer} onValueChange={setCorrectAnswer}>
                  <SelectTrigger id="correctAnswer">
                    <SelectValue placeholder="Select correct answer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">A</SelectItem>
                    <SelectItem value="B">B</SelectItem>
                    <SelectItem value="C">C</SelectItem>
                    <SelectItem value="D">D</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="explanation">Explanation</Label>
                <Textarea
                  id="explanation"
                  rows={4}
                  placeholder="Explain why this answer is correct (supports Markdown)"
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TBS Tab */}
        <TabsContent value="TBS">
          <Card>
            <CardHeader>
              <CardTitle>TBS Configuration (JSON)</CardTitle>
              <CardDescription>
                Paste your TBS configuration as JSON. Include exhibits, columns, rows, and
                correctAnswers.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="stem-tbs">Question Stem</Label>
                <Textarea
                  id="stem-tbs"
                  rows={3}
                  placeholder="Enter the TBS question stem"
                  value={stem}
                  onChange={(e) => setStem(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="tbsJson">TBS JSON Configuration</Label>
                <Textarea
                  id="tbsJson"
                  rows={20}
                  className="font-mono text-sm"
                  placeholder={`{\n  "exhibits": [...],\n  "columns": [...],\n  "rows": [...],\n  "correctAnswers": {...}\n}`}
                  value={tbsJson}
                  onChange={(e) => handleTBSJsonChange(e.target.value)}
                />
                {jsonError && <p className="text-sm text-red-600 mt-1">{jsonError}</p>}
              </div>

              <div>
                <Label htmlFor="explanation-tbs">Explanation</Label>
                <Textarea
                  id="explanation-tbs"
                  rows={4}
                  placeholder="Explain the solution"
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                />
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={() => setShowPreview(!showPreview)}
                disabled={!parsedTBS}
              >
                <Eye className="h-4 w-4 mr-2" />
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </Button>

              {/* Preview */}
              {showPreview && parsedTBS && (
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h3 className="font-semibold mb-4">TBS Preview</h3>
                  <div className="h-[600px] bg-white rounded border">
                    <TBSLayout
                      question={{
                        id: 'preview',
                        stem: stem || 'Preview Question',
                        exhibits: parsedTBS.exhibits || [],
                        columns: parsedTBS.columns || [],
                        rows: parsedTBS.rows || [],
                        correctAnswers: parsedTBS.correctAnswers || {},
                        explanation: explanation || '',
                      }}
                      readOnly={false}
                      showFeedback={false}
                      showStem={false}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Submit Button */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          <Save className="h-4 w-4 mr-2" />
          {isSubmitting ? 'Saving...' : 'Save Question'}
        </Button>
      </div>
    </div>
  )
}
