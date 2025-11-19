import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/navbar'
import { TBSLayout } from '@/components/tbs/TBSLayout'
import { mockDepreciationTBS } from '@/lib/mock-tbs'
import { redirect } from 'next/navigation'

export default async function TBSDemoPage() {
  const supabase = await createClient()

  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-xl h-[calc(100vh-12rem)] overflow-hidden">
          <TBSLayout question={mockDepreciationTBS} />
        </div>
      </div>
    </div>
  )
}
