import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
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
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Jeśli użytkownik jest na root path "/"
  if (request.nextUrl.pathname === '/') {
    if (user) {
      // Zalogowany użytkownik -> przekieruj do dashboardu (który jest w (authed)/page.tsx)
      return NextResponse.redirect(new URL('/dashboard', request.url))
    } else {
      // Niezalogowany użytkownik -> przekieruj do logowania
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Sprawdź czy użytkownik próbuje dostać się do chronionej strony
  const isPublicPath = request.nextUrl.pathname.startsWith('/login') ||
                       request.nextUrl.pathname.startsWith('/register') ||
                       request.nextUrl.pathname.startsWith('/reset-password') ||
                       request.nextUrl.pathname.startsWith('/update-password')

  // Jeśli nie jest to publiczna ścieżka i użytkownik nie jest zalogowany
  if (!isPublicPath && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Jeśli użytkownik jest zalogowany i próbuje dostać się do stron publicznych
  if (isPublicPath && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
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
     * - public files (images, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
