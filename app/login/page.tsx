'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()

  // Detecta token na URL e loga o usuário
  useEffect(() => {
    const hash = window.location.hash
    if (hash.includes('access_token')) {
      const params = new URLSearchParams(hash.substring(1))
      const access_token = params.get('access_token')
      const refresh_token = params.get('refresh_token')

      if (access_token && refresh_token) {
        supabase.auth.setSession({ access_token, refresh_token }).then(({ error }) => {
          if (!error) {
            router.push('/painel')
          } else {
            setMessage('Erro ao autenticar. Tente novamente.')
          }
        })
      }
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithOtp({ email })

    if (error) {
      setMessage('Erro ao enviar link. Verifique seu e-mail e tente novamente.')
    } else {
      setMessage('Um link de acesso foi enviado para seu e-mail. Verifique sua caixa de entrada para continuar.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Entrar</h1>
        <form onSubmit={handleLogin} className="flex flex-col space-y-4">
          <input
            type="email"
            placeholder="Seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border p-2 rounded-md"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition"
          >
            Entrar com link mágico
          </button>
        </form>
        {message && <p className="text-center text-sm mt-4">{message}</p>}
      </div>
    </div>
  )
}
