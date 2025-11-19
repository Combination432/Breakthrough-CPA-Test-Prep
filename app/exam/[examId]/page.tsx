import { redirect } from 'next/navigation'
import { getExamWithQuestions } from '@/lib/supabase/queries'
import { ExamInitializer } from '@/components/exam/ExamInitializer'

export default async function ExamPage({ params }: { params: { examId: string } }) {
  // For now, examId will be the section code (e.g., "FAR", "AUD", etc.)
  // In production, you might map the UUID to a section code
  const examId = params.examId

  // Try to fetch exam from database
  // If examId looks like a UUID, map it to a section code
  // Otherwise treat it as a section code
  let sectionCode = examId
  if (examId.length > 10 && examId.includes('-')) {
    // This is a UUID, for now default to FAR
    // In production, you'd look up the exam record
    sectionCode = 'FAR'
  }

  const exam = await getExamWithQuestions(sectionCode)

  if (!exam) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Exam Not Found</h2>
          <p className="text-gray-600 mt-2">
            Could not load exam data for section: {sectionCode}
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Please make sure the exam section has testlets and questions in the database.
          </p>
        </div>
      </div>
    )
  }

  return <ExamInitializer exam={exam} examId={examId} />
}
