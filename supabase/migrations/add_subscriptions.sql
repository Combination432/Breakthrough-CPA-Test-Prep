-- Add subscription tracking to users
-- This migration adds subscription-related fields to track Stripe customers

-- Create subscriptions table to track user subscription status
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Stripe identifiers
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,

  -- Subscription status
  subscription_status TEXT DEFAULT 'none' CHECK (subscription_status IN ('active', 'trialing', 'past_due', 'canceled', 'incomplete', 'none')),

  -- Subscription details
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT false,

  -- Trial information
  trial_start TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Ensure one subscription per user
  UNIQUE(user_id)
);

-- Add indexes for performance
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_customer ON public.subscriptions(stripe_customer_id);
CREATE INDEX idx_subscriptions_status ON public.subscriptions(subscription_status);

-- Add RLS policies
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can read their own subscription
CREATE POLICY "Users can view own subscription"
  ON public.subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Only service role can insert/update subscriptions (from webhooks)
CREATE POLICY "Service role can manage subscriptions"
  ON public.subscriptions
  FOR ALL
  USING (auth.role() = 'service_role');

-- Add trigger to update updated_at
CREATE OR REPLACE FUNCTION update_subscriptions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_subscriptions_updated_at();

-- Add helpful comments
COMMENT ON TABLE public.subscriptions IS 'Tracks user subscription status and Stripe integration for premium access control';
COMMENT ON COLUMN public.subscriptions.stripe_customer_id IS 'Stripe customer ID for billing';
COMMENT ON COLUMN public.subscriptions.stripe_subscription_id IS 'Stripe subscription ID';
COMMENT ON COLUMN public.subscriptions.subscription_status IS 'Current subscription status from Stripe';
COMMENT ON COLUMN public.subscriptions.current_period_end IS 'When the current billing period ends';
