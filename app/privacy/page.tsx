import { MarketingNavbar } from '@/components/marketing/MarketingNavbar'
import { MarketingFooter } from '@/components/marketing/MarketingFooter'

export const metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for Breakthrough CPA test preparation platform',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <MarketingNavbar />

      <main className="flex-1 pt-24 pb-16 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-sm text-gray-500 mb-8">Last updated: November 19, 2025</p>

          <div className="prose prose-gray max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">1. Introduction</h2>
              <p className="text-gray-700 leading-relaxed">
                Welcome to Breakthrough CPA ("we," "our," or "us"). We are committed to protecting your
                personal information and your right to privacy. This Privacy Policy explains how we collect,
                use, disclose, and safeguard your information when you use our service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">2. Information We Collect</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                We collect information that you provide directly to us when you:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Register for an account</li>
                <li>Use our practice exams and study materials</li>
                <li>Subscribe to our service</li>
                <li>Contact us for support</li>
                <li>Participate in surveys or promotions</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">Personal Information</h3>
              <p className="text-gray-700 leading-relaxed">
                This may include your name, email address, payment information, and any other information
                you choose to provide.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">Usage Information</h3>
              <p className="text-gray-700 leading-relaxed">
                We automatically collect information about your interactions with our service, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mt-2">
                <li>Exam scores and performance data</li>
                <li>Study patterns and progress</li>
                <li>Device information and IP address</li>
                <li>Browser type and operating system</li>
                <li>Pages visited and time spent on our service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">3. How We Use Your Information</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Provide, maintain, and improve our service</li>
                <li>Process your transactions and manage your subscription</li>
                <li>Personalize your study experience with adaptive analytics</li>
                <li>Send you technical notices, updates, and support messages</li>
                <li>Respond to your comments and questions</li>
                <li>Analyze usage patterns to improve our content and features</li>
                <li>Detect and prevent fraud and abuse</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">4. Information Sharing and Disclosure</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                We do not sell your personal information. We may share your information in the following circumstances:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Service Providers:</strong> We share information with third-party vendors who help us operate our service (e.g., payment processors, hosting providers)</li>
                <li><strong>Legal Requirements:</strong> We may disclose information if required by law or in response to legal requests</li>
                <li><strong>Business Transfers:</strong> In connection with any merger, sale of assets, or acquisition</li>
                <li><strong>With Your Consent:</strong> We may share information for any other purpose with your consent</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">5. Third-Party Services</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                We use the following third-party services:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Stripe:</strong> For payment processing (see Stripe's Privacy Policy)</li>
                <li><strong>Supabase:</strong> For authentication and database services</li>
                <li><strong>Vercel:</strong> For hosting and analytics</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-3">
                These services may collect information as described in their respective privacy policies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">6. Data Security</h2>
              <p className="text-gray-700 leading-relaxed">
                We implement appropriate technical and organizational measures to protect your personal
                information against unauthorized access, alteration, disclosure, or destruction. However,
                no method of transmission over the Internet or electronic storage is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">7. Data Retention</h2>
              <p className="text-gray-700 leading-relaxed">
                We retain your personal information for as long as necessary to provide our service and
                fulfill the purposes outlined in this Privacy Policy, unless a longer retention period
                is required by law.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">8. Your Rights</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                Depending on your location, you may have the following rights:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Access:</strong> Request access to your personal information</li>
                <li><strong>Correction:</strong> Request correction of inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Portability:</strong> Request transfer of your data to another service</li>
                <li><strong>Opt-out:</strong> Opt out of marketing communications</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-3">
                To exercise these rights, please contact us at{' '}
                <a href="mailto:privacy@breakthroughcpa.com" className="text-primary hover:underline">
                  privacy@breakthroughcpa.com
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">9. Cookies and Tracking</h2>
              <p className="text-gray-700 leading-relaxed">
                We use cookies and similar tracking technologies to track activity on our service and
                hold certain information. You can instruct your browser to refuse all cookies or to
                indicate when a cookie is being sent.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">10. Children's Privacy</h2>
              <p className="text-gray-700 leading-relaxed">
                Our service is not intended for children under 13 years of age. We do not knowingly
                collect personal information from children under 13.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">11. Changes to This Privacy Policy</h2>
              <p className="text-gray-700 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes
                by posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">12. Contact Us</h2>
              <p className="text-gray-700 leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <p className="text-gray-700 leading-relaxed mt-2">
                Email:{' '}
                <a href="mailto:privacy@breakthroughcpa.com" className="text-primary hover:underline">
                  privacy@breakthroughcpa.com
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
