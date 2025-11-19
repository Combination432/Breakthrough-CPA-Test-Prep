import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
})

// Price IDs - these should be set in your Stripe dashboard
export const STRIPE_PRICE_IDS = {
  MONTHLY_PRO: process.env.STRIPE_MONTHLY_PRICE_ID || 'price_xxx', // Replace with actual price ID
}

// Product metadata
export const PLANS = {
  FREE: {
    name: 'Free',
    price: 0,
    features: [
      '1 Sample Exam',
      'Basic Dashboard',
      'MCQ Practice Questions',
    ],
  },
  PRO: {
    name: 'Pro',
    price: 49,
    priceId: STRIPE_PRICE_IDS.MONTHLY_PRO,
    features: [
      'Unlimited Full-Length Exams',
      'Task-Based Simulations (TBS)',
      'Detailed Performance Analytics',
      'All 4 CPA Exam Sections (AUD, FAR, REG, BEC)',
      'Progress Tracking & Study Streak',
      'Exam Review Mode',
    ],
  },
}
