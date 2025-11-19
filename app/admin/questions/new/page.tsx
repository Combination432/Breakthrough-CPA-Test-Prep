import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { QuestionEditorForm } from '@/components/admin/QuestionEditorForm'

export default async function NewQuestionPage() {
  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch exam sections and testlets for the form
  const { data: sections } = await supabase
    .from('exam_sections')
    .select(
      `
      id,
      code,
      name,
      testlets (
        id,
        testlet_number,
        testlet_type,
        title
      )
    `
    )
    .order('code')

  const sectionsData = sections || []

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Add New Question</h1>
          <p className="text-gray-600 mt-2">
            Create a new MCQ or TBS question for the CPA exam platform
          </p>
        </div>

        {/* Form */}
        <QuestionEditorForm sections={sectionsData} />
      </div>
    </div>
  )
}
