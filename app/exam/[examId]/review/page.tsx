import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getExamWithQuestions } from '@/lib/supabase/queries'
import { ExamReviewClient } from '@/components/exam/ExamReviewClient'

export default async function ExamReviewPage({ params }: { params: { examId: string } }) {
  const supabase = await createClient()
  const examId = params.examId

  // Fetch exam record
  const { data: examRecord, error: examError } = await supabase
    .from('exams')
    .select(
      `
      id,
      score,
      passed,
      total_questions,
      questions_answered,
      time_spent_seconds,
      created_at,
      exam_sections (
        code,
        name
      )
    `
    )
    .eq('id', examId)
    .single()

  if (examError || !examRecord) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Exam Not Found</h2>
          <p className="text-gray-600 mt-2">
            The exam you are trying to review could not be found.
          </p>
        </div>
      </div>
    )
  }

  // Fetch user responses
  const { data: responses } = await supabase
    .from('user_responses')
    .select('question_id, response_data, is_correct, points_earned, points_possible')
    .eq('exam_id', examId)

  const responsesMap: Record<string, any> = {}
  if (responses) {
    responses.forEach((r) => {
      responsesMap[r.question_id] = r
    })
  }

  // Get exam structure from database
  const sectionCode = examRecord.exam_sections?.code || 'FAR'
  const examStructure = await getExamWithQuestions(sectionCode)

  if (!examStructure) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Exam Structure Not Found</h2>
          <p className="text-gray-600 mt-2">
            Could not load exam structure for section: {sectionCode}
          </p>
        </div>
      </div>
    )
  }

  return (
    <ExamReviewClient
      examData={examRecord}
      examStructure={examStructure}
      userResponses={responsesMap}
    />
  )
}
