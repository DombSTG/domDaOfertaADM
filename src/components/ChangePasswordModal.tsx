'use client'

import { useActionState, useEffect, useState } from 'react'
import { X } from 'lucide-react'
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

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    if (isOpen) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen])

  const mismatch =
    newPassword.length > 0 && confirmPassword.length > 0 && newPassword !== confirmPassword

  return (
    <>
      <div className={`drawer-overlay${isOpen ? ' open' : ''}`} onClick={onClose} />
      <div className={`drawer modal-mode${isOpen ? ' open' : ''}`} style={{ width: 'min(400px, 92vw)' }}>
        <div className="drawer-header">
          <button className="icon-btn" onClick={onClose} aria-label="Fechar">
            <X size={16} />
          </button>
          <div className="drawer-title-block">
            <div className="drawer-eyebrow">Conta</div>
            <div className="drawer-title">Alterar senha</div>
          </div>
        </div>

        <div className="drawer-body">
          <form id="change-pwd-form" action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="field-group">
              <label className="field-label" htmlFor="currentPassword">Senha atual</label>
              <input
                id="currentPassword"
                name="currentPassword"
                type="password"
                required
                className="field-input"
                placeholder="Sua senha atual"
              />
            </div>
            <div className="field-group">
              <label className="field-label" htmlFor="newPassword">Nova senha</label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="field-input"
                placeholder="Mínimo 6 caracteres"
              />
            </div>
            <div className="field-group">
              <label className="field-label" htmlFor="confirmPassword">Confirmar nova senha</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`field-input${mismatch ? ' field-input-error' : ''}`}
                style={mismatch ? { borderColor: 'var(--danger)', boxShadow: '0 0 0 3px var(--danger-soft)' } : undefined}
                placeholder="Repita a nova senha"
              />
              {mismatch && (
                <p style={{ fontSize: 11, color: 'var(--danger)', marginTop: 2 }}>
                  As senhas não coincidem.
                </p>
              )}
            </div>
          </form>
        </div>

        <div className="drawer-footer">
          <button className="btn btn-ghost" onClick={onClose} disabled={pending}>
            Cancelar
          </button>
          <div style={{ flex: 1 }} />
          <button
            type="submit"
            form="change-pwd-form"
            className="btn btn-primary"
            disabled={pending || !!mismatch}
          >
            {pending ? 'Salvando...' : 'Alterar senha'}
          </button>
        </div>
      </div>
    </>
  )
}
