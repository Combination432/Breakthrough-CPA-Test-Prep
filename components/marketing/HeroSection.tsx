'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="pt-32 pb-20 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Copy */}
          <div>
            <div className="inline-block px-4 py-2 bg-primary/10 rounded-full text-primary font-semibold text-sm mb-6">
              Join 10,000+ CPA Candidates
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Pass the CPA Exam Faster.{' '}
              <span className="text-primary">Stop Overpaying.</span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Master the CPA exam with realistic Excel-like simulations, adaptive analytics,
              and comprehensive coverage of all 4 sections. For a fraction of the cost.
            </p>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-lg text-gray-700">
                  Real Task-Based Simulations (TBS) with interactive spreadsheets
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-lg text-gray-700">
                  4-hour full-length practice exams matching the actual test
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-lg text-gray-700">
                  Detailed performance analytics to identify weak points
                </span>
              </li>
            </ul>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/login">
                <Button size="lg" className="text-lg px-8 py-6 w-full sm:w-auto">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-6 w-full sm:w-auto"
                >
                  View Pricing
                </Button>
              </Link>
            </div>

            <p className="text-sm text-gray-500 mt-4">
              No credit card required. Access sample exam immediately.
            </p>
          </div>

          {/* Right: Visual/Screenshot */}
          <div className="relative">
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8 border-2 border-primary/20 shadow-2xl">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center gap-2 mb-4 border-b pb-3">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="ml-4 text-sm font-semibold text-gray-700">
                    Task-Based Simulation - Depreciation Schedule
                  </span>
                </div>

                {/* Mock TBS Interface */}
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2 text-xs font-semibold text-gray-700 bg-gray-100 p-2 rounded">
                    <div>Year</div>
                    <div>Asset Cost</div>
                    <div>Depreciation</div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="bg-gray-50 p-2 rounded">Year 1</div>
                    <div className="bg-gray-50 p-2 rounded">$100,000</div>
                    <div className="bg-yellow-50 border-2 border-yellow-300 p-2 rounded font-semibold">
                      $11,700
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="bg-gray-50 p-2 rounded">Year 2</div>
                    <div className="bg-gray-50 p-2 rounded">$100,000</div>
                    <div className="bg-yellow-50 border-2 border-yellow-300 p-2 rounded font-semibold">
                      $18,720
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="bg-gray-50 p-2 rounded">Year 3</div>
                    <div className="bg-gray-50 p-2 rounded">$100,000</div>
                    <div className="bg-yellow-50 border-2 border-yellow-300 p-2 rounded font-semibold">
                      $11,232
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Interactive Excel-like interface</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded font-semibold">
                      EDITABLE
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -top-4 -right-4 bg-white rounded-full px-6 py-3 shadow-xl border-2 border-primary/20">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">$49</div>
                <div className="text-xs text-gray-600">per month</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
