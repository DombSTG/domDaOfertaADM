'use client'

import { useActionState, useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { changePassword } from '@/src/actions/auth-actions'
import { toast } from 'sonner'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export function ChangePasswordModal({ isOpen, onClose }: Props) {
  const [state, formAction, pending] = useActionState(changePassword, {})
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  useEffect(() => {
    if (state?.error) toast.error(state.error)
    if (state?.success) {
      toast.success('Senha alterada!')
      onClose()
    }
  }, [state])

  const mismatch = newPassword.length > 0 && confirmPassword.length > 0 && newPassword !== confirmPassword

  const inputClass =
    'w-full px-3 py-2 rounded-[8px] border border-gray-200 text-[13px] text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent'

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-full max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-[14px] font-semibold text-gray-900">Alterar Senha</DialogTitle>
        </DialogHeader>
        <form action={formAction} className="space-y-3 pt-2">
          <div className="space-y-1.5">
            <label htmlFor="currentPassword" className="text-[13px] font-medium text-gray-700">
              Senha Atual
            </label>
            <input
              id="currentPassword"
              name="currentPassword"
              type="password"
              required
              className={inputClass}
              placeholder="Sua senha atual"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="newPassword" className="text-[13px] font-medium text-gray-700">
              Nova Senha
            </label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              required
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={inputClass}
              placeholder="Mínimo 6 caracteres"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="confirmPassword" className="text-[13px] font-medium text-gray-700">
              Confirmar Nova Senha
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`${inputClass} ${mismatch ? 'border-red-400 focus:ring-red-400' : ''}`}
              placeholder="Repita a nova senha"
            />
            {mismatch && (
              <p className="text-[11px] text-red-500">As senhas não coincidem.</p>
            )}
          </div>
          <button
            type="submit"
            disabled={pending || !!mismatch}
            className="w-full px-4 py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-[13px] font-medium rounded-[8px] transition-colors"
          >
            {pending ? 'Salvando...' : 'Alterar Senha'}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
