# Breakthrough CPA - Complete Setup Guide

This guide will walk you through setting up your local development environment for the Breakthrough CPA Test Prep Platform.

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works fine)
- A Stripe account (optional - only needed for payment testing)

---

## Step 1: Create a Supabase Project

1. **Go to Supabase** and sign up/login:
   - Visit: https://supabase.com
   - Click "Start your project" or "New Project"

2. **Create a new project:**
   - Organization: Select or create one
   - Project name: `breakthrough-cpa` (or your preference)
   - Database password: Create a strong password (save this!)
   - Region: Choose closest to you
   - Pricing plan: Free (sufficient for development)
   - Click "Create new project"

3. **Wait ~2 minutes** for project provisioning to complete

---

## Step 2: Get Your Supabase API Credentials

1. Once your project is ready, go to **Settings → API**
   - Direct link: https://app.supabase.com/project/_/settings/api

2. **Copy these values** (you'll need them in Step 4):
   - **Project URL** (looks like `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")
   - **service_role** key (under "Project API keys") - Keep this secret!

---

## Step 3: Set Up the Database Schema

1. In your Supabase project, go to **SQL Editor**
   - Direct link: https://app.supabase.com/project/_/sql

2. **Run the main schema** (creates all tables):
   - Click "New query"
   - Open `/supabase/migrations/schema.sql` from this repo
   - Copy the entire contents
   - Paste into the SQL Editor
   - Click "Run" (bottom right)
   - ✅ You should see "Success. No rows returned"

3. **Run the subscriptions migration** (adds Stripe support):
   - Click "New query" again
   - Open `/supabase/migrations/add_subscriptions.sql` from this repo
   - Copy the entire contents
   - Paste into the SQL Editor
   - Click "Run"
   - ✅ You should see "Success. No rows returned"

4. **[OPTIONAL] Load sample data** (for testing):
   - Click "New query" again
   - Open `/supabase/migrations/seed_sample_data.sql` from this repo
   - Copy the entire contents
   - Paste into the SQL Editor
   - Click "Run"
   - ✅ You should see "Success. No rows returned"

---

## Step 4: Configure Environment Variables

1. **Copy the example environment file:**
   ```bash
   cp .env.local.example .env.local
   ```

2. **Edit `.env.local`** and add your Supabase credentials:
   ```bash
   # REQUIRED - From Step 2
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

   # OPTIONAL - Stripe (only if you want to test payments)
   # STRIPE_SECRET_KEY=sk_test_your-secret-key
   # STRIPE_MONTHLY_PRICE_ID=price_xxx
   # STRIPE_WEBHOOK_SECRET=whsec_xxx

   # OPTIONAL - App URL (defaults to localhost:3000)
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

3. **Save the file**

---

## Step 5: Install Dependencies and Start Development Server

1. **Install npm packages:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   - Go to: http://localhost:3000
   - ✅ You should see the marketing landing page!

---

## Step 6: Create a Test User Account

1. **Click "Start Free Trial"** or go to `/login`

2. **Sign up with a test email:**
   - Email: `test@example.com` (or any email you want)
   - Password: Create a password (remember it!)

3. **Check your email** (if using a real email):
   - Supabase will send a confirmation email
   - Click the confirmation link
   - OR: Disable email confirmation in Supabase (see below)

4. **[OPTIONAL] Disable email confirmation** (for faster testing):
   - Go to: https://app.supabase.com/project/_/auth/providers
   - Click "Email" provider
   - Scroll to "Confirm email"
   - Toggle OFF
   - Click "Save"

---

## Step 7: Verify Everything Works

1. **Test the marketing page:**
   - Visit: http://localhost:3000
   - ✅ You should see: Hero section, Feature Grid, Footer

2. **Test authentication:**
   - Go to `/login`
   - Sign up or log in
   - ✅ You should be redirected to `/dashboard`

3. **Test the dashboard:**
   - Visit: http://localhost:3000/dashboard
   - ✅ You should see exam sections (AUD, FAR, REG, BEC)

4. **Test exam sections:**
   - Click "Start Practice" on any exam (e.g., FAR)
   - ✅ You should see exam interface (if you ran seed data)
   - ❌ If no data: You'll see "No questions available" (expected if you skipped seed data)

---

## Troubleshooting

### ❌ "Your project's URL and Key are required to create a Supabase client!"

**Solution:** You haven't set up `.env.local` yet. Go back to Step 4.

### ❌ "relation 'exam_sections' does not exist"

**Solution:** You haven't run the database schema yet. Go back to Step 3.

### ❌ "Invalid login credentials"

**Solution:**
- Check if email confirmation is required (Step 6)
- Try resetting password in Supabase Auth dashboard

### ❌ "No questions available" on exam page

**Solution:** This is expected if you didn't run the seed data. Either:
- Go back to Step 3.4 and run `seed_sample_data.sql`
- OR: Create your own questions via the admin portal (Phase 7)

### ❌ Port 3000 already in use

**Solution:**
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- -p 3001
```

---

## Optional: Set Up Stripe (for Payment Testing)

If you want to test the subscription/payment features:

1. **Create a Stripe account:**
   - Visit: https://dashboard.stripe.com/register
   - Use test mode (don't enable live mode)

2. **Get your API keys:**
   - Go to: https://dashboard.stripe.com/test/apikeys
   - Copy your "Secret key" (starts with `sk_test_`)

3. **Create a product and price:**
   - Go to: https://dashboard.stripe.com/test/products
   - Click "Add product"
   - Name: "Breakthrough CPA - Monthly"
   - Pricing: Recurring, $49/month
   - Click "Save product"
   - Copy the **Price ID** (starts with `price_`)

4. **Set up webhook (for subscription updates):**
   - Go to: https://dashboard.stripe.com/test/webhooks
   - Click "Add endpoint"
   - Endpoint URL: `http://localhost:3000/api/webhooks/stripe`
   - Listen to events: Select "checkout.session.completed" and "customer.subscription.*"
   - Click "Add endpoint"
   - Copy the "Signing secret" (starts with `whsec_`)
   - **Note:** For local testing, you'll need Stripe CLI or ngrok

5. **Update `.env.local`:**
   ```bash
   STRIPE_SECRET_KEY=sk_test_your-secret-key
   STRIPE_MONTHLY_PRICE_ID=price_xxx
   STRIPE_WEBHOOK_SECRET=whsec_xxx
   ```

6. **Restart your dev server**

7. **Test payments:**
   - Go to `/pricing`
   - Click "Subscribe"
   - Use test card: `4242 4242 4242 4242`
   - Expiry: Any future date
   - CVC: Any 3 digits

---

## Next Steps

✅ Your local development environment is ready!

**What you can do now:**
- Explore the marketing landing page
- Create an account and try the dashboard
- Start practicing exams (if you loaded seed data)
- Review the codebase and make improvements
- Set up Stripe for payment testing (optional)

**Want to add your own questions?**
- You'll need to use the admin portal or directly insert into the database
- See `/supabase/migrations/seed_sample_data.sql` for examples

**Need help?**
- Check the codebase documentation
- Review the database schema comments in `schema.sql`
- Consult Supabase docs: https://supabase.com/docs
- Consult Next.js docs: https://nextjs.org/docs

---

## Summary Checklist

- [ ] Created Supabase project
- [ ] Copied API credentials (URL + keys)
- [ ] Ran `schema.sql` in SQL Editor
- [ ] Ran `add_subscriptions.sql` in SQL Editor
- [ ] [Optional] Ran `seed_sample_data.sql`
- [ ] Created `.env.local` with Supabase credentials
- [ ] Ran `npm install`
- [ ] Started dev server with `npm run dev`
- [ ] Created test user account
- [ ] Verified dashboard loads
- [ ] [Optional] Set up Stripe for payments

**You're all set! 🚀**
