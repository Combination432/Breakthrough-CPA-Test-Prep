'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, Zap, Loader2 } from 'lucide-react'
import { createCheckoutSession } from '@/app/pricing/actions'
import { PLANS } from '@/lib/stripe'

interface PricingCardsProps {
  isAuthenticated: boolean
  currentStatus: string
}

export function PricingCards({ isAuthenticated, currentStatus }: PricingCardsProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleUpgrade = async () => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/pricing')
      return
    }

    setIsLoading(true)
    try {
      const result = await createCheckoutSession()
      if (result?.error) {
        alert(result.error)
        setIsLoading(false)
      }
      // If successful, user will be redirected to Stripe Checkout
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to start checkout')
      setIsLoading(false)
    }
  }

  const isActive = currentStatus === 'active' || currentStatus === 'trialing'

  return (
    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
      {/* Free Tier */}
      <Card className="relative border-2">
        <CardHeader>
          <CardTitle className="text-2xl">Free</CardTitle>
          <CardDescription>Perfect for getting started</CardDescription>
          <div className="mt-4">
            <span className="text-4xl font-bold">$0</span>
            <span className="text-gray-600">/month</span>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 mb-6">
            {PLANS.FREE.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>
          <Button
            variant="outline"
            className="w-full"
            disabled
          >
            Current Plan
          </Button>
        </CardContent>
      </Card>

      {/* Pro Tier */}
      <Card className="relative border-2 border-primary shadow-lg">
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
            <Zap className="w-4 h-4" />
            Most Popular
          </div>
        </div>
        <CardHeader>
          <CardTitle className="text-2xl">Pro</CardTitle>
          <CardDescription>Everything you need to pass</CardDescription>
          <div className="mt-4">
            <span className="text-4xl font-bold">${PLANS.PRO.price}</span>
            <span className="text-gray-600">/month</span>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 mb-6">
            {PLANS.PRO.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>

          {isActive ? (
            <Button variant="outline" className="w-full" disabled>
              Current Plan
            </Button>
          ) : (
            <Button
              onClick={handleUpgrade}
              disabled={isLoading}
              className="w-full"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                'Upgrade to Pro'
              )}
            </Button>
          )}

          <p className="text-xs text-center text-gray-500 mt-4">
            7-day money-back guarantee
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
