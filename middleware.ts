import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Add admin emails here
const ADMIN_EMAILS = [
  'admin@breakthrough-cpa.com',
  // Add your email here
]

// Free sample exam ID
const FREE_EXAM_ID = 'sample-exam'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Admin route protection
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Check if user is authenticated
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Check if user is admin
    const isAdmin = ADMIN_EMAILS.includes(user.email || '')

    if (!isAdmin) {
      // Redirect non-admin users to dashboard
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  // Exam route protection (premium content gating)
  if (request.nextUrl.pathname.startsWith('/exam/')) {
    // Allow access to sample exam
    if (request.nextUrl.pathname.includes(FREE_EXAM_ID)) {
      return response
    }

    // Require authentication for all other exams
    if (!user) {
      return NextResponse.redirect(new URL('/login?redirect=' + request.nextUrl.pathname, request.url))
    }

    // Check subscription status
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('subscription_status')
      .eq('user_id', user.id)
      .single()

    const status = subscription?.subscription_status || 'none'
    const hasAccess = status === 'active' || status === 'trialing'

    if (!hasAccess) {
      // Redirect to pricing page if not subscribed
      return NextResponse.redirect(new URL('/pricing', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to fit your needs.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
