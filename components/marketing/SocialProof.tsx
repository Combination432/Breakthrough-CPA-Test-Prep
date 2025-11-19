'use client'

import { GraduationCap, Star, Users } from 'lucide-react'

export function SocialProof() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
            Trusted by CPA Candidates Nationwide
          </h2>
          <p className="text-lg text-gray-600">
            Join thousands of students from top universities who are using Breakthrough CPA
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-primary" />
              </div>
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-2">10,000+</div>
            <div className="text-gray-600">Active Students</div>
          </div>

          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Star className="w-8 h-8 text-primary" />
              </div>
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-2">4.9/5</div>
            <div className="text-gray-600">Average Rating</div>
          </div>

          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <GraduationCap className="w-8 h-8 text-primary" />
              </div>
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-2">85%</div>
            <div className="text-gray-600">Pass Rate</div>
          </div>
        </div>

        {/* Mock Universities */}
        <div className="border-t border-gray-200 pt-12">
          <p className="text-center text-sm text-gray-500 mb-8 uppercase tracking-wide font-semibold">
            Students from leading institutions
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center opacity-60">
            {/* Mock University Names */}
            <div className="text-center">
              <div className="text-xl font-bold text-gray-700">University of Texas</div>
              <div className="text-xs text-gray-500">Austin, TX</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-gray-700">USC Marshall</div>
              <div className="text-xs text-gray-500">Los Angeles, CA</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-gray-700">NYU Stern</div>
              <div className="text-xs text-gray-500">New York, NY</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-gray-700">Ohio State</div>
              <div className="text-xs text-gray-500">Columbus, OH</div>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mt-20 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <TestimonialCard
            quote="The TBS simulations are incredibly realistic. I felt completely prepared walking into the actual exam."
            author="Sarah M."
            title="Passed FAR & AUD"
          />
          <TestimonialCard
            quote="The analytics showed me exactly where I was weak. I focused my study time and passed on my first try."
            author="James K."
            title="Passed all 4 sections"
          />
          <TestimonialCard
            quote="Best value for CPA prep. I was paying $200/month elsewhere and this is way better for a fraction of the cost."
            author="Emily R."
            title="Passed REG & BEC"
          />
        </div>
      </div>
    </section>
  )
}

function TestimonialCard({
  quote,
  author,
  title,
}: {
  quote: string
  author: string
  title: string
}) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        ))}
      </div>
      <p className="text-gray-700 mb-4 italic">&ldquo;{quote}&rdquo;</p>
      <div className="border-t pt-4">
        <div className="font-semibold text-gray-900">{author}</div>
        <div className="text-sm text-gray-600">{title}</div>
      </div>
    </div>
  )
}
