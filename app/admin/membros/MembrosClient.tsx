'use client'

import { useActionState, useEffect, useState, useTransition } from 'react'
import { registerUser, deleteUser } from '@/src/actions/auth-actions'
import { toast } from 'sonner'
import { KeyRound, Trash2 } from 'lucide-react'
import { ChangePasswordModal } from '@/src/components/ChangePasswordModal'
import { useRouter } from 'next/navigation'

type Membro = {
  id: string
  email: string
  createdAt: Date
  approvedCount: number
  rejectedCount: number
}

const AVATAR_COLORS = [
  'var(--accent)',
  'oklch(0.55 0.16 150)',
  'oklch(0.55 0.18 25)',
  'oklch(0.55 0.15 220)',
  'oklch(0.6 0.15 60)',
  '#0b4fae',
]

function avatarColor(email: string): string {
  let hash = 0
  for (const c of email) hash = (hash * 31 + c.charCodeAt(0)) & 0xffffffff
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

export function MembrosClient({ membros }: { membros: Membro[] }) {
  const [state, formAction, pending] = useActionState(registerUser, { error: undefined, success: undefined })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [isDeleting, startTransition] = useTransition()
  const router = useRouter()

  function handleDelete(id: string) {
    startTransition(async () => {
      const result = await deleteUser(id)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Usuário excluído com sucesso!')
        setConfirmDeleteId(null)
        router.refresh()
      }
    })
  }

  useEffect(() => {
    if (state?.error) toast.error(state.error)
    if (state?.success) toast.success('Usuário criado com sucesso!')
  }, [state])

  return (
    <div>
      {/* Member grid */}
      <div className="members-grid">
        {membros.map((m) => (
          <div className="member-card" key={m.id}>
            <div className="member-head">
              <div
                className="member-avatar"
                style={{ background: avatarColor(m.email) }}
              >
                {m.email[0].toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="member-name">{m.email.split('@')[0]}</span>
                  <span className="member-role-badge admin">Admin</span>
                </div>
                <div className="member-email">{m.email}</div>
              </div>
            </div>

            <div className="member-stats">
              <div className="stat">
                <div className="stat-value success tabular">{m.approvedCount}</div>
                <div className="stat-label">Aprovadas</div>
              </div>
              <div className="stat">
                <div className="stat-value danger tabular">{m.rejectedCount}</div>
                <div className="stat-label">Rejeitadas</div>
              </div>
            </div>

            <div className="member-foot">
              <span>Entrou em {new Date(m.createdAt).toLocaleDateString('pt-BR')}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                {confirmDeleteId === m.id ? (
                  <div className="member-confirm-row">
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(m.id)}
                      disabled={isDeleting}
                    >
                      {isDeleting ? '...' : 'Confirmar'}
                    </button>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => setConfirmDeleteId(null)}
                      disabled={isDeleting}
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      className="icon-btn"
                      title="Alterar senha"
                      onClick={() => setIsModalOpen(true)}
                      style={{ width: 28, height: 28 }}
                    >
                      <KeyRound size={13} />
                    </button>
                    <button
                      className="icon-btn"
                      title="Excluir usuário"
                      onClick={() => setConfirmDeleteId(m.id)}
                      style={{ width: 28, height: 28, color: 'var(--danger)' }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}

        {membros.length === 0 && (
          <div className="empty" style={{ gridColumn: '1 / -1' }}>
            <div className="empty-title">Nenhum membro cadastrado.</div>
          </div>
        )}
      </div>

      {/* New member form */}
      <div style={{ padding: '0 24px 24px' }}>
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 24 }}>
          <div className="members-form-title">Novo usuário</div>
          <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 400 }}>
            <div className="field-group">
              <label className="field-label" htmlFor="email">E-mail</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="field-input"
                placeholder="novo@email.com"
              />
            </div>
            <div className="field-group">
              <label className="field-label" htmlFor="password">Senha</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                className="field-input"
                placeholder="Mínimo 6 caracteres"
              />
            </div>
            <div>
              <button
                type="submit"
                disabled={pending}
                className="btn btn-primary"
              >
                {pending ? 'Cadastrando...' : 'Cadastrar usuário'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <ChangePasswordModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}
