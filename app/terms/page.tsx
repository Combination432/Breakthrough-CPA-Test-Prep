import { MarketingNavbar } from '@/components/marketing/MarketingNavbar'
import { MarketingFooter } from '@/components/marketing/MarketingFooter'

export const metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for Breakthrough CPA test preparation platform',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <MarketingNavbar />

      <main className="flex-1 pt-24 pb-16 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-sm text-gray-500 mb-8">Last updated: November 19, 2025</p>

          <div className="prose prose-gray max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">1. Acceptance of Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                By accessing and using Breakthrough CPA ("the Service"), you accept and agree to be bound
                by the terms and provision of this agreement. If you do not agree to abide by the above,
                please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">2. Use License</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                Permission is granted to temporarily access the materials (information or software) on
                Breakthrough CPA for personal, non-commercial use only. This is the grant of a license,
                not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose or public display</li>
                <li>Attempt to reverse engineer any software contained on the Service</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
                <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">3. Subscriptions</h2>
              <p className="text-gray-700 leading-relaxed">
                Some parts of the Service are billed on a subscription basis ("Subscription(s)"). You will
                be billed in advance on a recurring and periodic basis ("Billing Cycle"). Billing cycles
                are set on a monthly basis.
              </p>
              <p className="text-gray-700 leading-relaxed mt-3">
                At the end of each Billing Cycle, your Subscription will automatically renew under the
                exact same conditions unless you cancel it or Breakthrough CPA cancels it.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">4. Cancellation and Refunds</h2>
              <p className="text-gray-700 leading-relaxed">
                You may cancel your subscription at any time from your account dashboard. Upon cancellation,
                you will retain access to the Service until the end of your current billing period.
              </p>
              <p className="text-gray-700 leading-relaxed mt-3">
                We offer a 7-day money-back guarantee for new subscriptions. Refund requests must be
                submitted within 7 days of the initial purchase.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">5. User Accounts</h2>
              <p className="text-gray-700 leading-relaxed">
                When you create an account with us, you must provide information that is accurate, complete,
                and current at all times. Failure to do so constitutes a breach of the Terms, which may
                result in immediate termination of your account.
              </p>
              <p className="text-gray-700 leading-relaxed mt-3">
                You are responsible for safeguarding the password that you use to access the Service and
                for any activities or actions under your password.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">6. Intellectual Property</h2>
              <p className="text-gray-700 leading-relaxed">
                The Service and its original content (excluding Content provided by users), features,
                and functionality are and will remain the exclusive property of Breakthrough CPA and its
                licensors. The Service is protected by copyright, trademark, and other laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">7. Disclaimer</h2>
              <p className="text-gray-700 leading-relaxed">
                Breakthrough CPA is not affiliated with the AICPA, NASBA, or any state board of accountancy.
                CPA® and Certified Public Accountant® are trademarks owned by the American Institute of CPAs.
              </p>
              <p className="text-gray-700 leading-relaxed mt-3">
                While we strive to provide accurate and helpful exam preparation materials, we make no
                guarantees regarding exam performance or results.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">8. Limitation of Liability</h2>
              <p className="text-gray-700 leading-relaxed">
                In no event shall Breakthrough CPA, nor its directors, employees, partners, agents, suppliers,
                or affiliates, be liable for any indirect, incidental, special, consequential or punitive
                damages, including without limitation, loss of profits, data, use, goodwill, or other
                intangible losses.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">9. Changes to Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time.
                We will provide notice of any material changes by posting the new Terms on this page and
                updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">10. Contact Us</h2>
              <p className="text-gray-700 leading-relaxed">
                If you have any questions about these Terms, please contact us at{' '}
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
