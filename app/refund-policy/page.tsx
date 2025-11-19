import { MarketingNavbar } from '@/components/marketing/MarketingNavbar'
import { MarketingFooter } from '@/components/marketing/MarketingFooter'

export const metadata = {
  title: 'Refund Policy',
  description: 'Refund Policy for Breakthrough CPA test preparation platform',
}

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <MarketingNavbar />

      <main className="flex-1 pt-24 pb-16 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Refund Policy</h1>
          <p className="text-sm text-gray-500 mb-8">Last updated: November 19, 2025</p>

          <div className="prose prose-gray max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">7-Day Money-Back Guarantee</h2>
              <p className="text-gray-700 leading-relaxed">
                We stand behind the quality of our CPA exam preparation platform. If you're not satisfied
                with Breakthrough CPA, we offer a full refund within 7 days of your initial purchase.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Eligibility</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                To be eligible for a refund, you must meet the following conditions:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Request must be submitted within 7 days of your initial subscription purchase</li>
                <li>This applies to first-time subscribers only</li>
                <li>Renewal charges are not eligible for refunds</li>
                <li>Promotional or discounted subscriptions may have different refund terms</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">How to Request a Refund</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                To request a refund, please follow these steps:
              </p>
              <ol className="list-decimal pl-6 space-y-2 text-gray-700">
                <li>Send an email to{' '}
                  <a href="mailto:support@breakthroughcpa.com" className="text-primary hover:underline">
                    support@breakthroughcpa.com
                  </a>
                  {' '}with the subject line "Refund Request"
                </li>
                <li>Include your account email address and reason for the refund request</li>
                <li>We will process your request within 3-5 business days</li>
                <li>Refunds will be issued to the original payment method</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Processing Time</h2>
              <p className="text-gray-700 leading-relaxed">
                Once your refund request is approved, please allow:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mt-2">
                <li>3-5 business days for us to process the refund</li>
                <li>5-10 business days for the refund to appear in your account (depending on your bank or card issuer)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Subscription Cancellation</h2>
              <p className="text-gray-700 leading-relaxed">
                You can cancel your subscription at any time from your account dashboard. Upon cancellation:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mt-2">
                <li>You will retain access to the service until the end of your current billing period</li>
                <li>You will not be charged for subsequent billing cycles</li>
                <li>No refund will be provided for the remaining days in your current billing period (unless within the 7-day guarantee window)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Non-Refundable Items</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                The following are not eligible for refunds:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Subscription renewals after the initial 7-day period</li>
                <li>Partial months of service</li>
                <li>Access that has been terminated due to violation of our Terms of Service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Chargebacks</h2>
              <p className="text-gray-700 leading-relaxed">
                If you file a chargeback with your credit card company or bank instead of contacting us
                directly, your account will be immediately suspended and may be subject to collection
                efforts. Please contact our support team first to resolve any billing issues.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Changes to This Policy</h2>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to modify this Refund Policy at any time. Changes will be effective
                immediately upon posting to this page. Your continued use of the service after changes
                are posted constitutes your acceptance of the modified policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Questions?</h2>
              <p className="text-gray-700 leading-relaxed">
                If you have any questions about our Refund Policy, please contact us at:
              </p>
              <p className="text-gray-700 leading-relaxed mt-2">
                Email:{' '}
                <a href="mailto:support@breakthroughcpa.com" className="text-primary hover:underline">
                  support@breakthroughcpa.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>

      <MarketingFooter />
    </div>
  )
}
