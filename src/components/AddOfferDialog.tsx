'use client'

import { useState, useTransition, useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { X } from 'lucide-react'
import { createOffer } from '@/src/actions/offer-actions'
import { CATEGORIES } from '@/src/lib/categories'

const STORES = ['Magazine Luiza', 'Shopee', 'Mercado Livre', 'Amazon', 'Outro']

interface AddOfferDialogProps {
  open: boolean
  onClose: () => void
}

export function AddOfferDialog({ open, onClose }: AddOfferDialogProps) {
  const [isPending, startTransition] = useTransition()
  const [store, setStore] = useState(STORES[0])
  const [customStore, setCustomStore] = useState('')
  const [title, setTitle] = useState('')
  const [currentPrice, setCurrentPrice] = useState('')
  const [oldPrice, setOldPrice] = useState('')
  const [originalUrl, setOriginalUrl] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [category, setCategory] = useState('')
  const overlayRef = useRef<HTMLDivElement>(null)

  function reset() {
    setStore(STORES[0]); setCustomStore(''); setTitle('')
    setCurrentPrice(''); setOldPrice(''); setOriginalUrl('')
    setImageUrl(''); setCategory('')
  }

  function handleClose() { reset(); onClose() }

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') handleClose() }
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      try {
        await createOffer({
          store: store === 'Outro' ? customStore : store,
          title, currentPrice, oldPrice, originalUrl, imageUrl, category,
        })
        toast.success('Oferta adicionada à fila!')
        handleClose()
      } catch {
        toast.error('Erro ao adicionar oferta. Verifique se a URL já existe.')
      }
    })
  }

  return (
    <>
      <div
        className={`drawer-overlay${open ? ' open' : ''}`}
        ref={overlayRef}
        onClick={handleClose}
      />
      <div className={`drawer modal-mode${open ? ' open' : ''}`}>
        <div className="drawer-header">
          <button className="icon-btn" onClick={handleClose} aria-label="Fechar">
            <X size={16} />
          </button>
          <div className="drawer-title-block">
            <div className="drawer-eyebrow">Nova oferta</div>
            <div className="drawer-title">Adicionar à fila</div>
          </div>
        </div>

        <div className="drawer-body">
          <form id="add-offer-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Loja */}
            <div className="field-group">
              <label className="field-label">Loja</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {STORES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStore(s)}
                    className={`chip${store === s ? ' active' : ''}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              {store === 'Outro' && (
                <input
                  className="field-input"
                  style={{ marginTop: 8 }}
                  value={customStore}
                  onChange={(e) => setCustomStore(e.target.value)}
                  placeholder="Nome da loja"
                  required
                />
              )}
            </div>

            {/* Título */}
            <div className="field-group">
              <label className="field-label" htmlFor="ao-title">Título</label>
              <input
                id="ao-title"
                className="field-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nome do produto"
                required
                disabled={isPending}
              />
            </div>

            {/* Preços */}
            <div className="field-row">
              <div className="field-group">
                <label className="field-label">Preço oferta</label>
                <div className="input-with-prefix">
                  <span className="prefix">R$</span>
                  <input
                    className="field-input"
                    value={currentPrice}
                    onChange={(e) => setCurrentPrice(e.target.value)}
                    placeholder="299,90"
                    required
                    disabled={isPending}
                  />
                </div>
              </div>
              <div className="field-group">
                <label className="field-label">Preço original</label>
                <div className="input-with-prefix">
                  <span className="prefix">R$</span>
                  <input
                    className="field-input"
                    value={oldPrice}
                    onChange={(e) => setOldPrice(e.target.value)}
                    placeholder="499,90"
                    disabled={isPending}
                  />
                </div>
              </div>
            </div>

            {/* URL */}
            <div className="field-group">
              <label className="field-label">URL do produto</label>
              <input
                className="field-input"
                style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5 }}
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                placeholder="https://..."
                required
                disabled={isPending}
              />
            </div>

            {/* Imagem */}
            <div className="field-group">
              <label className="field-label">URL da imagem <span style={{ textTransform: 'none', fontWeight: 400, color: 'var(--text-faint)' }}>(opcional)</span></label>
              <input
                className="field-input"
                style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5 }}
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
                disabled={isPending}
              />
            </div>

            {/* Categoria */}
            <div className="field-group">
              <label className="field-label">Categoria <span style={{ textTransform: 'none', fontWeight: 400, color: 'var(--text-faint)' }}>(opcional)</span></label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCategory(category === c ? '' : c)}
                    className={`chip${category === c ? ' active' : ''}`}
                    disabled={isPending}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </form>
        </div>

        <div className="drawer-footer">
          <button className="btn btn-ghost" onClick={handleClose} disabled={isPending}>
            Cancelar
          </button>
          <div style={{ flex: 1 }} />
          <button
            type="submit"
            form="add-offer-form"
            className="btn btn-primary"
            disabled={isPending || !title.trim() || !currentPrice.trim() || !originalUrl.trim()}
          >
            {isPending ? 'Adicionando...' : 'Adicionar à fila'}
          </button>
        </div>
      </div>
    </>
  )
}
