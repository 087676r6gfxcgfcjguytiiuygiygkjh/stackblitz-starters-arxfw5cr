'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { useRouter } from 'next/navigation'

export default function Header() {
  const [email, setEmail] = useState('')
  const router = useRouter()

  useEffect(() => {
    const getUserEmail = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        setEmail(user.email || '')
      }
    }

    getUserEmail()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <header className="bg-white shadow-md p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 rounded-md mb-6">
      <span className="text-sm text-gray-700">
        Logado como: <strong>{email}</strong>
      </span>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
      >
        Sair
      </button>
    </header>
  )
}
