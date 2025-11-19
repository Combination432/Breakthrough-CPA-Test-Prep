// Mock Task-Based Simulation Data
// This represents a TBS question about preparing a depreciation schedule

export interface Exhibit {
  id: string
  title: string
  type: 'text' | 'table' | 'pdf'
  content: string | { headers?: string[]; rows?: string[][] }
}

export interface GridColumn {
  key: string
  name: string
  editable: boolean
  width?: number
}

export interface GridRow {
  id: string
  [key: string]: string | number | boolean
}

export interface TBSQuestion {
  id: string
  stem: string
  exhibits: Exhibit[]
  columns: GridColumn[]
  rows: GridRow[]
  correctAnswers: Record<string, any>
  explanation: string
}

export const mockDepreciationTBS: TBSQuestion = {
  id: 'tbs-depreciation-1',
  stem: 'Review the exhibits and prepare a depreciation schedule for the equipment purchased by ABC Corporation. Calculate the annual depreciation expense for each year using the **straight-line method**. Enter your answers in the spreadsheet provided.',

  exhibits: [
    {
      id: 'exhibit-1',
      title: 'Purchase Invoice',
      type: 'text',
      content: `
**EQUIPMENT PURCHASE INVOICE**

Date: January 1, 2024
Vendor: Industrial Equipment Supply Co.

**Item Details:**
- Equipment: Manufacturing Press (Model XL-3000)
- Purchase Price: $120,000
- Installation Costs: $8,000
- Delivery and Setup: $2,000
- Total Cost: $130,000

**Payment Terms:** Net 30 days
**Warranty:** 2 years standard warranty

---

**Notes:**
The equipment was delivered and installed on January 1, 2024, and placed into service immediately. All costs are capitalized as part of the equipment's basis.
      `.trim(),
    },
    {
      id: 'exhibit-2',
      title: 'Tax Law Excerpt',
      type: 'text',
      content: `
**INTERNAL REVENUE CODE - DEPRECIATION**

**§ 167 - Depreciation Deduction**

For property placed in service, the taxpayer may deduct a reasonable allowance for exhaustion, wear and tear, and obsolescence.

**Straight-Line Method:**
The depreciation deduction for each year is calculated as:

    Annual Depreciation = (Cost Basis - Salvage Value) / Useful Life

**Key Requirements:**
1. **Cost Basis:** The total cost to acquire and prepare the asset for use
2. **Salvage Value:** The estimated residual value at the end of useful life
3. **Useful Life:** The estimated period over which the asset will be used

**Example Application:**
For manufacturing equipment, a typical useful life is 10 years with an estimated salvage value of 10% of the original cost.

---

**Management Estimates for ABC Corporation Equipment:**
- Useful Life: 10 years
- Salvage Value: $13,000 (10% of cost basis)
      `.trim(),
    },
    {
      id: 'exhibit-3',
      title: 'Accounting Policy',
      type: 'text',
      content: `
**ABC CORPORATION**
**Fixed Asset Accounting Policy**

**Capitalization:**
All costs necessary to acquire an asset and prepare it for its intended use shall be capitalized. This includes:
- Purchase price
- Installation costs
- Delivery and transportation
- Setup and testing costs

**Depreciation Method:**
The company uses the **straight-line depreciation method** for all fixed assets, consistent with GAAP requirements for financial reporting.

**Depreciation Calculation:**
Depreciation begins in the month the asset is placed in service. For simplicity, we use annual depreciation calculations for assets placed in service on the first day of the fiscal year.

**Partial Year Convention:**
Assets placed in service on January 1 receive a full year of depreciation in Year 1.
      `.trim(),
    },
  ],

  columns: [
    { key: 'year', name: 'Year', editable: false, width: 100 },
    { key: 'assetBasis', name: 'Asset Basis', editable: false, width: 150 },
    { key: 'salvageValue', name: 'Salvage Value', editable: false, width: 150 },
    { key: 'depreciableBase', name: 'Depreciable Base', editable: false, width: 150 },
    { key: 'depreciationExpense', name: 'Depreciation Expense', editable: true, width: 180 },
    { key: 'accumulatedDepreciation', name: 'Accumulated Depreciation', editable: true, width: 200 },
    { key: 'bookValue', name: 'Book Value', editable: true, width: 150 },
  ],

  rows: [
    {
      id: 'row-0',
      year: 'Year 0 (Purchase)',
      assetBasis: 130000,
      salvageValue: 13000,
      depreciableBase: 117000,
      depreciationExpense: 0,
      accumulatedDepreciation: 0,
      bookValue: 130000,
    },
    {
      id: 'row-1',
      year: 'Year 1',
      assetBasis: 130000,
      salvageValue: 13000,
      depreciableBase: 117000,
      depreciationExpense: '',
      accumulatedDepreciation: '',
      bookValue: '',
    },
    {
      id: 'row-2',
      year: 'Year 2',
      assetBasis: 130000,
      salvageValue: 13000,
      depreciableBase: 117000,
      depreciationExpense: '',
      accumulatedDepreciation: '',
      bookValue: '',
    },
    {
      id: 'row-3',
      year: 'Year 3',
      assetBasis: 130000,
      salvageValue: 13000,
      depreciableBase: 117000,
      depreciationExpense: '',
      accumulatedDepreciation: '',
      bookValue: '',
    },
    {
      id: 'row-4',
      year: 'Year 4',
      assetBasis: 130000,
      salvageValue: 13000,
      depreciableBase: 117000,
      depreciationExpense: '',
      accumulatedDepreciation: '',
      bookValue: '',
    },
    {
      id: 'row-5',
      year: 'Year 5',
      assetBasis: 130000,
      salvageValue: 13000,
      depreciableBase: 117000,
      depreciationExpense: '',
      accumulatedDepreciation: '',
      bookValue: '',
    },
  ],

  // Correct answers for validation
  correctAnswers: {
    'row-1': {
      depreciationExpense: 11700,
      accumulatedDepreciation: 11700,
      bookValue: 118300,
    },
    'row-2': {
      depreciationExpense: 11700,
      accumulatedDepreciation: 23400,
      bookValue: 106600,
    },
    'row-3': {
      depreciationExpense: 11700,
      accumulatedDepreciation: 35100,
      bookValue: 94900,
    },
    'row-4': {
      depreciationExpense: 11700,
      accumulatedDepreciation: 46800,
      bookValue: 83200,
    },
    'row-5': {
      depreciationExpense: 11700,
      accumulatedDepreciation: 58500,
      bookValue: 71500,
    },
  },

  explanation: `
**Depreciation Schedule - Correct Calculation:**

**Step 1: Determine Cost Basis**
- Purchase Price: $120,000
- Installation: $8,000
- Delivery/Setup: $2,000
- **Total Cost Basis: $130,000**

**Step 2: Calculate Depreciable Base**
- Cost Basis: $130,000
- Salvage Value: $13,000
- **Depreciable Base: $117,000**

**Step 3: Calculate Annual Depreciation**
Using straight-line method:
- Annual Depreciation = $117,000 / 10 years = **$11,700 per year**

**Step 4: Complete the Schedule**
Each year:
- **Depreciation Expense:** $11,700
- **Accumulated Depreciation:** Prior accumulated + $11,700
- **Book Value:** $130,000 - Accumulated Depreciation

**Key Points:**
- Year 0 shows the initial purchase with no depreciation
- Years 1-5 each have $11,700 annual depreciation expense
- By Year 5, accumulated depreciation is $58,500
- Book value decreases each year by the depreciation amount
- The pattern continues for Years 6-10 until accumulated depreciation reaches $117,000
- Final book value at end of Year 10 will equal salvage value of $13,000
  `.trim(),
}

// Additional mock TBS scenarios can be added here
export const mockTBSQuestions = [mockDepreciationTBS]
