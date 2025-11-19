import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/navbar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookOpen, Clock, Target } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

const EXAM_SECTIONS = [
  {
    id: 'far',
    code: 'FAR',
    name: 'Financial Accounting and Reporting',
    description: 'Master GAAP, financial statements, and accounting standards',
    topics: 10,
    questions: 100,
    color: 'bg-blue-500',
  },
  {
    id: 'aud',
    code: 'AUD',
    name: 'Auditing and Attestation',
    description: 'Learn audit procedures, professional standards, and ethics',
    topics: 8,
    questions: 80,
    color: 'bg-green-500',
  },
  {
    id: 'reg',
    code: 'REG',
    name: 'Regulation',
    description: 'Study tax law, business law, and professional ethics',
    topics: 12,
    questions: 120,
    color: 'bg-purple-500',
  },
  {
    id: 'bec',
    code: 'BEC',
    name: 'Business Environment and Concepts',
    description: 'Understand corporate governance, economics, and IT',
    topics: 9,
    questions: 90,
    color: 'bg-orange-500',
  },
]

export default async function StudyPage() {
  const supabase = await createClient()

  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Study Mode
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose an exam section to start practicing with Multiple Choice Questions
          </p>
        </div>

        {/* Exam Sections Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {EXAM_SECTIONS.map((section) => (
            <Card key={section.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`${section.color} text-white px-3 py-1 rounded-md font-bold text-sm`}>
                        {section.code}
                      </div>
                      <CardTitle className="text-xl">{section.name}</CardTitle>
                    </div>
                    <CardDescription className="text-base">
                      {section.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    <span>{section.topics} Topics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    <span>{section.questions} Questions</span>
                  </div>
                </div>

                <Link href={`/study/mcq/${section.id}`}>
                  <Button className="w-full" size="lg">
                    Start Practice Quiz (10 Questions)
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Start Info */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              How Study Mode Works
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">1.</span>
                <span>Select an exam section above to start a practice quiz</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">2.</span>
                <span>Each quiz contains 10 random multiple choice questions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">3.</span>
                <span>Get instant feedback with detailed explanations after each answer</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">4.</span>
                <span>Track your score and review your performance at the end</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">5.</span>
                <span>Your progress is saved automatically - you can refresh without losing your place</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
