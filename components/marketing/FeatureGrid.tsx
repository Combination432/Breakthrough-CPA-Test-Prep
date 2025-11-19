'use client'

import { Sparkles, TrendingUp, Smartphone } from 'lucide-react'

export function FeatureGrid() {
  return (
    <section id="features" className="py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Why Breakthrough CPA is Different
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We built the platform we wish existed when we were studying for the CPA exam.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {/* Feature 1: Real Excel-like Simulations */}
          <div className="group relative">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-100 hover:border-primary transition-all duration-300 hover:shadow-xl h-full">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Sparkles className="w-7 h-7 text-primary" />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Real Excel-like Simulations
              </h3>

              <p className="text-gray-700 mb-4 leading-relaxed">
                Practice with <strong>real Task-Based Simulations (TBS)</strong> powered by react-data-grid.
                Not static screenshots — actual interactive spreadsheets, exhibits, and research tools
                that mirror the AICPA exam environment.
              </p>

              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  <span>Editable cells and formulas</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  <span>Multi-tab exhibits</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  <span>Document review tools</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Feature 2: Adaptive Analytics */}
          <div className="group relative">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border-2 border-purple-100 hover:border-primary transition-all duration-300 hover:shadow-xl h-full">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-7 h-7 text-primary" />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Adaptive Analytics
              </h3>

              <p className="text-gray-700 mb-4 leading-relaxed">
                Our <strong>intelligent weak-point detection</strong> analyzes your performance across
                all topics and question types. Stop wasting time on what you already know — focus
                on the areas that need work.
              </p>

              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  <span>Topic-level mastery tracking</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  <span>Personalized study recommendations</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  <span>Progress predictions</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Feature 3: Mobile Optimized */}
          <div className="group relative">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border-2 border-green-100 hover:border-primary transition-all duration-300 hover:shadow-xl h-full">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Smartphone className="w-7 h-7 text-primary" />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Mobile Optimized
              </h3>

              <p className="text-gray-700 mb-4 leading-relaxed">
                <strong>Study on the go</strong> with our fully responsive platform. Whether you're
                on your phone during lunch or on a tablet at the library, your progress syncs
                seamlessly across all devices.
              </p>

              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  <span>Works on any screen size</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  <span>Offline-ready flashcards</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  <span>Cloud-synced progress</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
