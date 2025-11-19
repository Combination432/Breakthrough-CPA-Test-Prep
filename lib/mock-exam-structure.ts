// Mock Exam Structure for CPA Test Simulation
// Represents a complete 4-hour exam with 5 testlets

export type QuestionType = 'MCQ' | 'TBS'
export type TestletType = 'MCQ' | 'TBS'

export interface MockMCQQuestion {
  id: string
  type: 'MCQ'
  stem: string
  options: { key: string; text: string }[]
  correct_answer: string
  explanation: string
}

export interface MockTBSQuestion {
  id: string
  type: 'TBS'
  stem: string
  exhibits: any[]
  columns: any[]
  rows: any[]
  correctAnswers: Record<string, any>
  explanation: string
}

export type MockQuestion = MockMCQQuestion | MockTBSQuestion

export interface MockTestlet {
  id: string
  testletNumber: number
  type: TestletType
  title: string
  instructions: string
  questions: MockQuestion[]
}

export interface MockExam {
  id: string
  sectionCode: string
  sectionName: string
  timeLimit: number // in seconds
  testlets: MockTestlet[]
}

// Import existing mock questions from Phase 3
const MOCK_MCQ_QUESTIONS: MockMCQQuestion[] = [
  {
    id: 'mcq-1',
    type: 'MCQ',
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
    id: 'mcq-2',
    type: 'MCQ',
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
    id: 'mcq-3',
    type: 'MCQ',
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
  // Additional MCQ questions for testlet 2
  {
    id: 'mcq-4',
    type: 'MCQ',
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
    id: 'mcq-5',
    type: 'MCQ',
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
    id: 'mcq-6',
    type: 'MCQ',
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
]

// Create a simplified TBS question for testlets 3-5
const createSimpleTBS = (id: string, title: string): MockTBSQuestion => ({
  id,
  type: 'TBS',
  stem: `Complete the ${title} based on the exhibits provided. Enter the correct values in the spreadsheet.`,
  exhibits: [
    {
      id: 'exhibit-1',
      title: 'Source Document',
      type: 'text',
      content: `This is a sample exhibit for ${title}. Review the information carefully before completing the task.`,
    },
  ],
  columns: [
    { key: 'item', name: 'Item', editable: false, width: 200 },
    { key: 'value', name: 'Value', editable: true, width: 150 },
  ],
  rows: [
    { id: 'row-1', item: 'Item 1', value: '' },
    { id: 'row-2', item: 'Item 2', value: '' },
  ],
  correctAnswers: {
    'row-1': { value: 1000 },
    'row-2': { value: 2000 },
  },
  explanation: `The correct approach for ${title} involves carefully analyzing the source documents and applying the appropriate accounting principles.`,
})

// Mock Exam Structure
export const MOCK_FAR_EXAM: MockExam = {
  id: 'exam-far-001',
  sectionCode: 'FAR',
  sectionName: 'Financial Accounting and Reporting',
  timeLimit: 14400, // 4 hours in seconds

  testlets: [
    // TESTLET 1: MCQ (15 questions)
    {
      id: 'testlet-1',
      testletNumber: 1,
      type: 'MCQ',
      title: 'Multiple Choice - Set 1',
      instructions: 'Answer all questions in this testlet. You may navigate between questions using the Previous and Next buttons. You may also flag questions for review.',
      questions: [
        MOCK_MCQ_QUESTIONS[0],
        MOCK_MCQ_QUESTIONS[1],
        MOCK_MCQ_QUESTIONS[2],
        // Repeat some questions to make 15 total
        { ...MOCK_MCQ_QUESTIONS[0], id: 'mcq-1-dup-1' },
        { ...MOCK_MCQ_QUESTIONS[1], id: 'mcq-2-dup-1' },
        { ...MOCK_MCQ_QUESTIONS[2], id: 'mcq-3-dup-1' },
        { ...MOCK_MCQ_QUESTIONS[0], id: 'mcq-1-dup-2' },
        { ...MOCK_MCQ_QUESTIONS[1], id: 'mcq-2-dup-2' },
        { ...MOCK_MCQ_QUESTIONS[2], id: 'mcq-3-dup-2' },
        { ...MOCK_MCQ_QUESTIONS[0], id: 'mcq-1-dup-3' },
        { ...MOCK_MCQ_QUESTIONS[1], id: 'mcq-2-dup-3' },
        { ...MOCK_MCQ_QUESTIONS[2], id: 'mcq-3-dup-3' },
        { ...MOCK_MCQ_QUESTIONS[0], id: 'mcq-1-dup-4' },
        { ...MOCK_MCQ_QUESTIONS[1], id: 'mcq-2-dup-4' },
        { ...MOCK_MCQ_QUESTIONS[2], id: 'mcq-3-dup-4' },
      ],
    },

    // TESTLET 2: MCQ (15 questions)
    {
      id: 'testlet-2',
      testletNumber: 2,
      type: 'MCQ',
      title: 'Multiple Choice - Set 2',
      instructions: 'Answer all questions in this testlet. The difficulty may adapt based on your performance in Set 1.',
      questions: [
        MOCK_MCQ_QUESTIONS[3],
        MOCK_MCQ_QUESTIONS[4],
        MOCK_MCQ_QUESTIONS[5],
        // Repeat to make 15 total
        { ...MOCK_MCQ_QUESTIONS[3], id: 'mcq-4-dup-1' },
        { ...MOCK_MCQ_QUESTIONS[4], id: 'mcq-5-dup-1' },
        { ...MOCK_MCQ_QUESTIONS[5], id: 'mcq-6-dup-1' },
        { ...MOCK_MCQ_QUESTIONS[3], id: 'mcq-4-dup-2' },
        { ...MOCK_MCQ_QUESTIONS[4], id: 'mcq-5-dup-2' },
        { ...MOCK_MCQ_QUESTIONS[5], id: 'mcq-6-dup-2' },
        { ...MOCK_MCQ_QUESTIONS[3], id: 'mcq-4-dup-3' },
        { ...MOCK_MCQ_QUESTIONS[4], id: 'mcq-5-dup-3' },
        { ...MOCK_MCQ_QUESTIONS[5], id: 'mcq-6-dup-3' },
        { ...MOCK_MCQ_QUESTIONS[3], id: 'mcq-4-dup-4' },
        { ...MOCK_MCQ_QUESTIONS[4], id: 'mcq-5-dup-4' },
        { ...MOCK_MCQ_QUESTIONS[5], id: 'mcq-6-dup-4' },
      ],
    },

    // TESTLET 3: TBS (3 simulations)
    {
      id: 'testlet-3',
      testletNumber: 3,
      type: 'TBS',
      title: 'Task-Based Simulations - Set 1',
      instructions: 'Complete all task-based simulations in this testlet. Review the exhibits carefully and use the provided workspace to complete your answers.',
      questions: [
        createSimpleTBS('tbs-1', 'Financial Statement Preparation'),
        createSimpleTBS('tbs-2', 'Journal Entry Analysis'),
        createSimpleTBS('tbs-3', 'Reconciliation Schedule'),
      ],
    },

    // TESTLET 4: TBS (4 simulations)
    {
      id: 'testlet-4',
      testletNumber: 4,
      type: 'TBS',
      title: 'Task-Based Simulations - Set 2',
      instructions: 'Complete all task-based simulations in this testlet.',
      questions: [
        createSimpleTBS('tbs-4', 'Lease Accounting'),
        createSimpleTBS('tbs-5', 'Revenue Recognition'),
        createSimpleTBS('tbs-6', 'Bond Amortization'),
        createSimpleTBS('tbs-7', 'Consolidation Worksheet'),
      ],
    },

    // TESTLET 5: TBS (4 simulations)
    {
      id: 'testlet-5',
      testletNumber: 5,
      type: 'TBS',
      title: 'Task-Based Simulations - Set 3',
      instructions: 'Complete all task-based simulations in this testlet.',
      questions: [
        createSimpleTBS('tbs-8', 'Impairment Analysis'),
        createSimpleTBS('tbs-9', 'Stock-Based Compensation'),
        createSimpleTBS('tbs-10', 'Pension Accounting'),
        createSimpleTBS('tbs-11', 'Income Tax Provision'),
      ],
    },
  ],
}

// Helper function to get total questions
export const getTotalQuestions = (exam: MockExam): number => {
  return exam.testlets.reduce((total, testlet) => total + testlet.questions.length, 0)
}

// Helper function to get question by navigation
export const getQuestionByIndex = (
  exam: MockExam,
  testletIndex: number,
  questionIndex: number
): MockQuestion | null => {
  const testlet = exam.testlets[testletIndex]
  if (!testlet) return null

  const question = testlet.questions[questionIndex]
  return question || null
}
