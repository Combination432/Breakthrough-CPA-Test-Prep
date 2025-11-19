'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Lock, PlayCircle, Zap } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ExamSection {
  code: string
  name: string
  description: string
}

interface ExamSectionsProps {
  hasAccess: boolean
}

const EXAM_SECTIONS: ExamSection[] = [
  {
    code: 'sample-exam',
    name: 'Sample Exam',
    description: 'Try our platform with a free sample exam',
  },
  {
    code: 'FAR',
    name: 'Financial Accounting and Reporting',
    description: '4-hour exam with MCQs and TBS covering financial accounting standards',
  },
  {
    code: 'AUD',
    name: 'Auditing and Attestation',
    description: '4-hour exam covering auditing procedures and attestation standards',
  },
  {
    code: 'REG',
    name: 'Regulation',
    description: '4-hour exam on federal taxation, ethics, and business law',
  },
  {
    code: 'BEC',
    name: 'Business Environment and Concepts',
    description: '4-hour exam covering business concepts and IT',
  },
]

export function ExamSections({ hasAccess }: ExamSectionsProps) {
  const router = useRouter()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Available Exam Sections</h2>
        {!hasAccess && (
          <Button onClick={() => router.push('/pricing')} size="sm">
            <Zap className="w-4 h-4 mr-2" />
            Upgrade to Pro
          </Button>
        )}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {EXAM_SECTIONS.map((section) => {
          const isFree = section.code === 'sample-exam'
          const isLocked = !isFree && !hasAccess

          return (
            <Card
              key={section.code}
              className={`relative ${isLocked ? 'opacity-75' : ''}`}
            >
              {isLocked && (
                <div className="absolute top-4 right-4 z-10">
                  <div className="bg-gray-900 text-white p-2 rounded-full">
                    <Lock className="w-4 h-4" />
                  </div>
                </div>
              )}

              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {section.name}
                  {isFree && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-normal">
                      FREE
                    </span>
                  )}
                </CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>

              <CardContent>
                {isLocked ? (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => router.push('/pricing')}
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Upgrade to Unlock
                  </Button>
                ) : (
                  <Link href={`/exam/${section.code}`}>
                    <Button className="w-full">
                      <PlayCircle className="w-4 h-4 mr-2" />
                      Start Exam
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
