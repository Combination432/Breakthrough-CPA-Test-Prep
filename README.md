# Breakthrough CPA Test Prep

A professional CPA exam preparation platform built with Next.js 14, Supabase, and shadcn/ui.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Database & Auth**: Supabase (PostgreSQL + Auth)
- **State Management**: React Query (TanStack Query) for server state, Zustand for client state
- **Icons**: Lucide React

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── login/             # Authentication pages
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── navbar.tsx        # Global navigation
├── lib/                   # Utility functions
│   ├── supabase/         # Supabase client utilities
│   └── utils.ts          # Helper functions
├── supabase/             # Database migrations
│   └── migrations/       # SQL schema files
└── hooks/                # Custom React hooks
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account and project

### 1. Clone and Install

```bash
git clone <repository-url>
cd Breakthrough-CPA-Test-Prep
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings > API to get your credentials
3. Run the database migrations:
   - Open the SQL Editor in your Supabase dashboard
   - Run `supabase/migrations/schema.sql` first
   - Then run `supabase/migrations/seed_sample_data.sql` (optional)

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Replace `your-project-url` and `your-anon-key` with values from your Supabase project settings.

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

### Phase 1: Database Schema ✅
- Polymorphic questions table supporting MCQ and TBS
- Task-Based Simulations with JSONB structure
- Comprehensive progress tracking
- Row-Level Security (RLS) policies

### Phase 2: Infrastructure & Auth ✅
- Next.js 14 with App Router
- Supabase authentication (email/password)
- Server and client-side auth utilities
- Protected routes and user sessions
- Responsive navbar with auth state

### Coming Soon
- Exam section selection
- Interactive testlets
- TBS renderer (spreadsheet & form modes)
- Progress tracking dashboard
- Analytics and scoring

## Database Schema

The database supports the CPA exam structure:
- **Exam Sections**: AUD, FAR, REG, BEC
- **Testlets**: 5 per exam (2 MCQ, 3 TBS)
- **Questions**: Polymorphic design for MCQ and TBS
- **User Progress**: Time tracking, flagging, navigation state

See `supabase/migrations/README.md` for detailed schema documentation.

## Authentication Flow

1. Users can sign up or sign in at `/login`
2. Supabase Auth handles session management via cookies
3. Server Components check auth state using `createClient()` from `lib/supabase/server.ts`
4. Client Components use `createClient()` from `lib/supabase/client.ts`
5. Protected routes redirect to `/login` if not authenticated

## Development Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Contributing

This is a private project for CPA exam preparation.

## License

Proprietary - All rights reserved
