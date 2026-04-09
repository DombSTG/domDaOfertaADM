'use client'

import { useActionState, useEffect } from 'react'
import { login } from '@/src/actions/auth-actions'
import { toast } from 'sonner'

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, { error: undefined })

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error)
    }
  }, [state])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm">
        {/* Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-8">
            <div className="h-7 w-7 rounded-[6px] bg-violet-600 flex items-center justify-center shrink-0">
              <span className="text-white text-[12px] font-bold leading-none">D</span>
            </div>
            <span className="text-[15px] font-semibold text-gray-900">Dom da Oferta</span>
          </div>

          <h1 className="text-[18px] font-semibold text-gray-900 mb-1">Entrar</h1>
          <p className="text-[13px] text-gray-500 mb-6">Acesse o painel administrativo.</p>

          <form action={formAction} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-[13px] font-medium text-gray-700">
                E-mail
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="w-full px-3 py-2 rounded-[8px] border border-gray-200 text-[13px] text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                placeholder="seu@email.com"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-[13px] font-medium text-gray-700">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="w-full px-3 py-2 rounded-[8px] border border-gray-200 text-[13px] text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={pending}
              className="w-full py-2 px-4 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-[13px] font-medium rounded-[8px] transition-colors"
            >
              {pending ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
