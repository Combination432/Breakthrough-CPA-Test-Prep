import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { QuestionsTable } from '@/components/admin/QuestionsTable'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export default async function AdminQuestionsPage() {
  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch all questions with testlet and section info
  const { data: questions, error } = await supabase
    .from('questions')
    .select(
      `
      id,
      question_type,
      question_number,
      difficulty_level,
      stem,
      options,
      correct_answer,
      testlets (
        id,
        testlet_number,
        testlet_type,
        exam_sections (
          code,
          name
        )
      )
    `
    )
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching questions:', error)
  }

  const questionsData = questions || []

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Question Manager</h1>
            <p className="text-gray-600 mt-2">
              Manage all MCQ and TBS questions across all exam sections
            </p>
          </div>
          <Link href="/admin/questions/new">
            <Button size="lg">
              <Plus className="h-4 w-4 mr-2" />
              Add Question
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg border p-4">
            <div className="text-sm text-gray-600">Total Questions</div>
            <div className="text-2xl font-bold mt-1">{questionsData.length}</div>
          </div>
          <div className="bg-white rounded-lg border p-4">
            <div className="text-sm text-gray-600">MCQ Questions</div>
            <div className="text-2xl font-bold mt-1">
              {questionsData.filter((q) => q.question_type === 'MCQ').length}
            </div>
          </div>
          <div className="bg-white rounded-lg border p-4">
            <div className="text-sm text-gray-600">TBS Questions</div>
            <div className="text-2xl font-bold mt-1">
              {questionsData.filter((q) => q.question_type === 'TBS').length}
            </div>
          </div>
          <div className="bg-white rounded-lg border p-4">
            <div className="text-sm text-gray-600">Sections</div>
            <div className="text-2xl font-bold mt-1">
              {new Set(questionsData.map((q) => q.testlets?.exam_sections?.code)).size}
            </div>
          </div>
        </div>

        {/* Questions Table */}
        <div className="bg-white rounded-lg border">
          <QuestionsTable questions={questionsData} />
        </div>
      </div>
    </div>
  )
}
