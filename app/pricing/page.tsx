import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PricingCards } from '@/components/pricing/PricingCards'
import { CheckCircle } from 'lucide-react'

export default async function PricingPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get subscription status if user is logged in
  let subscriptionStatus = 'none'
  if (user) {
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('subscription_status')
      .eq('user_id', user.id)
      .single()

    subscriptionStatus = subscription?.subscription_status || 'none'
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get unlimited access to all CPA exam sections, TBS simulations, and analytics
          </p>
        </div>

        {/* Pricing Cards */}
        <PricingCards
          isAuthenticated={!!user}
          currentStatus={subscriptionStatus}
        />

        {/* Features Comparison */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything you need to pass the CPA exam
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Feature
              title="Full-Length Practice Exams"
              description="Realistic 4-hour exam simulations matching the actual CPA exam format"
            />
            <Feature
              title="Task-Based Simulations"
              description="Interactive TBS questions with spreadsheets, exhibits, and complex scenarios"
            />
            <Feature
              title="Performance Analytics"
              description="Track your progress across all topics with detailed score breakdowns"
            />
            <Feature
              title="All 4 Exam Sections"
              description="Complete coverage of AUD, FAR, REG, and BEC sections"
            />
            <Feature
              title="Detailed Explanations"
              description="Learn from mistakes with comprehensive answer explanations"
            />
            <Feature
              title="Study Streak Tracking"
              description="Stay motivated with daily study streak tracking and reminders"
            />
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-24 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <FAQItem
              question="Can I cancel anytime?"
              answer="Yes! You can cancel your subscription at any time from your dashboard. You'll retain access until the end of your current billing period."
            />
            <FAQItem
              question="What's included in the free tier?"
              answer="The free tier includes access to one sample exam and basic dashboard features. Upgrade to Pro for unlimited exams and TBS simulations."
            />
            <FAQItem
              question="How often are questions updated?"
              answer="We continuously update our question bank to reflect the latest CPA exam content and format changes."
            />
            <FAQItem
              question="Is there a money-back guarantee?"
              answer="We offer a 7-day money-back guarantee. If you're not satisfied, contact us for a full refund."
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function Feature({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100">
          <CheckCircle className="w-6 h-6 text-green-600" />
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </div>
  )
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="bg-white rounded-lg border p-6">
      <h3 className="font-semibold text-gray-900 mb-2">{question}</h3>
      <p className="text-gray-600">{answer}</p>
    </div>
  )
}
