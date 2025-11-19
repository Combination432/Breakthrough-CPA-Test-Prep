import { createClient } from '@/lib/supabase/server'
import { QuizSession } from '@/components/quiz/QuizSession'
import { Navbar } from '@/components/navbar'
import { redirect } from 'next/navigation'

interface PageProps {
  params: Promise<{
    topicId: string
  }>
}

// Mock questions for demonstration
const MOCK_QUESTIONS = [
  {
    id: '1',
    stem: 'On December 15, Year 1, a company received **$10,000** from a customer as an advance payment for services to be performed in February, Year 2. The company uses accrual accounting. How should this transaction be recorded on December 15, Year 1?',
    options: [
      { key: 'A', text: 'Debit Cash $10,000; Credit Service Revenue $10,000' },
      { key: 'B', text: 'Debit Cash $10,000; Credit Unearned Revenue $10,000' },
      { key: 'C', text: 'Debit Accounts Receivable $10,000; Credit Service Revenue $10,000' },
      { key: 'D', text: 'Debit Cash $10,000; Credit Accounts Payable $10,000' },
    ],
    correct_answer: 'B',
    explanation: 'Under accrual accounting, revenue is recognized when **earned**, not when cash is received. Since the services will be performed in February Year 2, the revenue has not been earned as of December 15, Year 1. Therefore, the $10,000 should be recorded as Unearned Revenue (a liability) until the services are performed.',
  },
  {
    id: '2',
    stem: 'A company purchased equipment for $100,000 on January 1, Year 1. The equipment has an estimated useful life of 5 years and a salvage value of $10,000. Using the straight-line method, what is the depreciation expense for Year 1?',
    options: [
      { key: 'A', text: '$10,000' },
      { key: 'B', text: '$18,000' },
      { key: 'C', text: '$20,000' },
      { key: 'D', text: '$25,000' },
    ],
    correct_answer: 'B',
    explanation: 'Straight-line depreciation = (Cost - Salvage Value) / Useful Life = ($100,000 - $10,000) / 5 = **$18,000 per year**.',
  },
  {
    id: '3',
    stem: 'During periods of rising prices, which inventory cost flow method will result in the **highest** ending inventory balance on the balance sheet?',
    options: [
      { key: 'A', text: 'FIFO (First-In, First-Out)' },
      { key: 'B', text: 'LIFO (Last-In, First-Out)' },
      { key: 'C', text: 'Weighted Average' },
      { key: 'D', text: 'Specific Identification' },
    ],
    correct_answer: 'A',
    explanation: 'Under FIFO, the oldest (and cheapest, during rising prices) costs are expensed first as COGS, leaving the newest (most expensive) costs in ending inventory. This results in the **highest ending inventory balance**. LIFO does the opposite, resulting in the lowest ending inventory.',
  },
  {
    id: '4',
    stem: 'Which of the following is a characteristic of an **operating lease** under ASC 842?',
    options: [
      { key: 'A', text: 'The lessee records both a lease liability and a right-of-use asset' },
      { key: 'B', text: 'Lease payments are expensed on a straight-line basis' },
      { key: 'C', text: 'The lease transfers ownership of the asset to the lessee' },
      { key: 'D', text: 'Both A and B' },
    ],
    correct_answer: 'D',
    explanation: 'Under ASC 842, **both** operating and finance leases require the lessee to record a lease liability and a right-of-use asset. Operating leases expense lease payments on a **straight-line basis**, while finance leases record interest expense and amortization separately.',
  },
  {
    id: '5',
    stem: 'A company issues $1,000,000 of bonds at a **discount**. Which of the following statements is true regarding the bond discount amortization using the effective interest method?',
    options: [
      { key: 'A', text: 'Interest expense will be less than the cash paid each period' },
      { key: 'B', text: 'Interest expense will be greater than the cash paid each period' },
      { key: 'C', text: 'Interest expense will equal the cash paid each period' },
      { key: 'D', text: 'The carrying value of the bond will decrease over time' },
    ],
    correct_answer: 'B',
    explanation: 'When bonds are issued at a discount, the carrying value is less than the face value. Using the effective interest method, **interest expense** (calculated on the carrying value) will be **greater** than the cash interest paid (calculated on the face value). The discount is amortized over time, increasing the carrying value to face value at maturity.',
  },
  {
    id: '6',
    stem: 'Which of the following is **NOT** a component of comprehensive income?',
    options: [
      { key: 'A', text: 'Unrealized gains and losses on available-for-sale securities' },
      { key: 'B', text: 'Foreign currency translation adjustments' },
      { key: 'C', text: 'Dividends declared to shareholders' },
      { key: 'D', text: 'Pension liability adjustments' },
    ],
    correct_answer: 'C',
    explanation: 'Comprehensive income includes all changes in equity except those resulting from owner investments and distributions. **Dividends declared to shareholders** are distributions to owners and are NOT included in comprehensive income. The other items (A, B, D) are components of other comprehensive income (OCI).',
  },
  {
    id: '7',
    stem: 'Under the equity method of accounting for investments, the investor recognizes its share of the investee\'s net income by:',
    options: [
      { key: 'A', text: 'Debiting Cash and crediting Investment Income' },
      { key: 'B', text: 'Debiting Investment and crediting Investment Income' },
      { key: 'C', text: 'Debiting Investment Income and crediting Investment' },
      { key: 'D', text: 'Debiting Dividend Revenue and crediting Cash' },
    ],
    correct_answer: 'B',
    explanation: 'Under the **equity method**, the investor records its proportionate share of the investee\'s net income by **debiting the Investment account** and **crediting Investment Income**. This increases the investment account. When dividends are received, the investor debits Cash and credits Investment (reducing the investment account).',
  },
  {
    id: '8',
    stem: 'Which of the following would be classified as a **financing activity** in the statement of cash flows?',
    options: [
      { key: 'A', text: 'Purchase of treasury stock' },
      { key: 'B', text: 'Payment of accounts payable' },
      { key: 'C', text: 'Sale of equipment' },
      { key: 'D', text: 'Collection of notes receivable' },
    ],
    correct_answer: 'A',
    explanation: '**Financing activities** involve transactions with owners and creditors. Purchase of **treasury stock** is a financing activity because it represents a distribution to/from owners. Payment of accounts payable (B) is an operating activity. Sale of equipment (C) and collection of notes receivable (D) are investing activities.',
  },
  {
    id: '9',
    stem: 'A company uses the **allowance method** for bad debts. When a specific account is written off, which of the following occurs?',
    options: [
      { key: 'A', text: 'Total assets decrease' },
      { key: 'B', text: 'Net accounts receivable decreases' },
      { key: 'C', text: 'Bad debt expense increases' },
      { key: 'D', text: 'None of the above' },
    ],
    correct_answer: 'D',
    explanation: 'When a specific account is written off under the **allowance method**, the entry is: Debit Allowance for Doubtful Accounts, Credit Accounts Receivable. This reduces both accounts receivable and the allowance by the same amount, so **net accounts receivable remains unchanged**. Total assets do not decrease, and bad debt expense is not affected (it was recorded when the allowance was established).',
  },
  {
    id: '10',
    stem: 'Which of the following is a key difference between a **capital lease** (finance lease) and an **operating lease** under old GAAP (before ASC 842)?',
    options: [
      { key: 'A', text: 'Capital leases were recorded on the balance sheet; operating leases were not' },
      { key: 'B', text: 'Operating leases transferred ownership; capital leases did not' },
      { key: 'C', text: 'Capital leases required higher lease payments' },
      { key: 'D', text: 'There was no difference in accounting treatment' },
    ],
    correct_answer: 'A',
    explanation: 'Under old GAAP (before ASC 842), **capital leases** (now called finance leases) were recorded on the balance sheet as both an asset and a liability. **Operating leases** were treated as off-balance-sheet financing, with only lease payments expensed. Under ASC 842, both types of leases are now recorded on the balance sheet.',
  },
]

export default async function QuizPage({ params }: PageProps) {
  const { topicId } = await params
  const supabase = await createClient()

  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // TODO: Replace with actual database query
  // For now, we'll use mock questions
  // In the future, this would be:
  // const { data: questions, error } = await supabase
  //   .from('questions')
  //   .select('id, stem, options, correct_answer, explanation')
  //   .eq('testlet_id', topicId)
  //   .eq('question_type', 'MCQ')
  //   .eq('is_active', true)
  //   .limit(10)

  const questions = MOCK_QUESTIONS

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navbar />
        <div className="max-w-4xl mx-auto py-16 px-4 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">No Questions Found</h1>
          <p className="text-gray-600">
            There are no questions available for this topic yet.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      <div className="container mx-auto px-4">
        <QuizSession questions={questions} />
      </div>
    </div>
  )
}
