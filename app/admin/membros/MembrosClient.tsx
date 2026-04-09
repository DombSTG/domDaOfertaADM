'use client'

import { useActionState, useEffect } from 'react'
import { registerUser } from '@/src/actions/auth-actions'
import { toast } from 'sonner'

type Membro = {
  id: string
  email: string
  createdAt: Date
}

export function MembrosClient({ membros }: { membros: Membro[] }) {
  const [state, formAction, pending] = useActionState(registerUser, { error: undefined, success: undefined })

  useEffect(() => {
    if (state?.error) toast.error(state.error)
    if (state?.success) toast.success('Usuário criado com sucesso!')
  }, [state])

  return (
    <div className="max-w-xl space-y-8">
      {/* Lista de membros */}
      <div>
        <h2 className="text-[12px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
          Usuários cadastrados
        </h2>
        <div className="border border-gray-100 rounded-[10px] overflow-hidden">
          {membros.length === 0 ? (
            <p className="px-4 py-3 text-[13px] text-gray-400">Nenhum usuário cadastrado.</p>
          ) : (
            membros.map((m, i) => (
              <div
                key={m.id}
                className={`flex items-center justify-between px-4 py-3 ${
                  i !== membros.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                <span className="text-[13px] text-gray-900">{m.email}</span>
                <span className="text-[11px] text-gray-400">
                  {new Date(m.createdAt).toLocaleDateString('pt-BR')}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Formulário de novo usuário */}
      <div>
        <h2 className="text-[12px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
          Novo usuário
        </h2>
        <form action={formAction} className="space-y-3">
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-[13px] font-medium text-gray-700">
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-3 py-2 rounded-[8px] border border-gray-200 text-[13px] text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              placeholder="novo@email.com"
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
              minLength={6}
              className="w-full px-3 py-2 rounded-[8px] border border-gray-200 text-[13px] text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              placeholder="Mínimo 6 caracteres"
            />
          </div>
          <button
            type="submit"
            disabled={pending}
            className="px-4 py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-[13px] font-medium rounded-[8px] transition-colors"
          >
            {pending ? 'Cadastrando...' : 'Cadastrar usuário'}
          </button>
        </form>
      </div>
    </div>
  )
}
