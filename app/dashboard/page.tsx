import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PerformanceChart } from '@/components/dashboard/PerformanceChart'
import { RecentActivity } from '@/components/dashboard/RecentActivity'
import { Trophy, Target, Flame } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()

  // Check authentication
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    redirect('/login')
  }

  // Fetch user's exam attempts
  const { data: exams, error: examsError } = await supabase
    .from('exams')
    .select(`
      id,
      exam_section_id,
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
    `)
    .eq('user_id', user.id)
    .eq('status', 'completed')
    .order('created_at', { ascending: false })

  const completedExams = exams || []

  // Calculate KPIs
  const totalExams = completedExams.length
  const averageScore = totalExams > 0
    ? completedExams.reduce((sum, exam) => sum + (exam.score || 0), 0) / totalExams
    : 0

  const totalQuestions = completedExams.reduce(
    (sum, exam) => sum + (exam.questions_answered || 0),
    0
  )

  // Calculate study streak (consecutive days with activity)
  const studyStreak = calculateStudyStreak(completedExams)

  // Group exams by section for chart
  const sectionPerformance = completedExams.reduce((acc, exam) => {
    const sectionCode = exam.exam_sections?.code || 'Unknown'
    if (!acc[sectionCode]) {
      acc[sectionCode] = {
        section: exam.exam_sections?.name || sectionCode,
        scores: [],
        attempts: 0,
      }
    }
    if (exam.score !== null && exam.score !== undefined) {
      acc[sectionCode].scores.push(exam.score)
    }
    acc[sectionCode].attempts++
    return acc
  }, {} as Record<string, { section: string; scores: number[]; attempts: number }>)

  const chartData = Object.values(sectionPerformance).map((perf) => ({
    section: perf.section,
    score: perf.scores.length > 0
      ? Math.round(perf.scores.reduce((a, b) => a + b, 0) / perf.scores.length)
      : 0,
    attempts: perf.attempts,
  }))

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Track your progress and performance across all CPA exam sections
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Average Score
              </CardTitle>
              <Trophy className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {averageScore.toFixed(1)}%
              </div>
              <p className="text-xs text-gray-600 mt-1">
                {totalExams} exam{totalExams !== 1 ? 's' : ''} completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Questions Attempted
              </CardTitle>
              <Target className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalQuestions}</div>
              <p className="text-xs text-gray-600 mt-1">
                Total questions answered
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Study Streak
              </CardTitle>
              <Flame className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{studyStreak}</div>
              <p className="text-xs text-gray-600 mt-1">
                Consecutive day{studyStreak !== 1 ? 's' : ''}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Performance Chart */}
        {chartData.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Performance by Section</CardTitle>
              <p className="text-sm text-gray-600">
                Average score across all attempts for each exam section
              </p>
            </CardHeader>
            <CardContent>
              <PerformanceChart data={chartData} />
            </CardContent>
          </Card>
        )}

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <p className="text-sm text-gray-600">
              Your last 5 exam sessions
            </p>
          </CardHeader>
          <CardContent>
            <RecentActivity exams={completedExams.slice(0, 5)} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function calculateStudyStreak(exams: any[]): number {
  if (exams.length === 0) return 0

  // Sort by date descending
  const sortedExams = [...exams].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )

  let streak = 0
  let currentDate = new Date()
  currentDate.setHours(0, 0, 0, 0)

  for (const exam of sortedExams) {
    const examDate = new Date(exam.created_at)
    examDate.setHours(0, 0, 0, 0)

    const daysDiff = Math.floor(
      (currentDate.getTime() - examDate.getTime()) / (1000 * 60 * 60 * 24)
    )

    if (daysDiff === streak) {
      streak++
    } else if (daysDiff > streak) {
      break
    }
  }

  return streak
}
