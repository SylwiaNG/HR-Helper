'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

type ActionState = {
  error?: string
  success?: string
} | null

export async function signIn(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // Walidacja danych
  if (!email || !password) {
    return { error: 'Email i hasło są wymagane' }
  }

  if (!email.includes('@')) {
    return { error: 'Nieprawidłowy format adresu email' }
  }

  if (password.length < 6) {
    return { error: 'Hasło musi mieć co najmniej 6 znaków' }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signUp(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  // Walidacja danych
  if (!email || !password || !confirmPassword) {
    return { error: 'Wszystkie pola są wymagane' }
  }

  if (!email.includes('@')) {
    return { error: 'Nieprawidłowy format adresu email' }
  }

  if (password.length < 6) {
    return { error: 'Hasło musi mieć co najmniej 6 znaków' }
  }

  if (password !== confirmPassword) {
    return { error: 'Hasła nie są identyczne' }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  return { success: 'Sprawdź swoją skrzynkę email, aby potwierdzić rejestrację' }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}
