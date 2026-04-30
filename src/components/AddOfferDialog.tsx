'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createOffer } from '@/src/actions/offer-actions'

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

  function reset() {
    setStore(STORES[0])
    setCustomStore('')
    setTitle('')
    setCurrentPrice('')
    setOldPrice('')
    setOriginalUrl('')
    setImageUrl('')
    setCategory('')
  }

  function handleClose() {
    reset()
    onClose()
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      try {
        await createOffer({
          store: store === 'Outro' ? customStore : store,
          title,
          currentPrice,
          oldPrice,
          originalUrl,
          imageUrl,
          category,
        })
        toast.success('Oferta adicionada à fila!')
        handleClose()
      } catch {
        toast.error('Erro ao adicionar oferta. Verifique se a URL já existe.')
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[15px] font-semibold">Adicionar Oferta</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 pt-1">
          {/* Loja */}
          <div className="space-y-1.5">
            <Label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Loja</Label>
            <div className="flex flex-wrap gap-1.5">
              {STORES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStore(s)}
                  className={`px-2.5 py-1 rounded-[5px] text-[12px] font-medium border transition-colors ${
                    store === s
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            {store === 'Outro' && (
              <Input
                value={customStore}
                onChange={(e) => setCustomStore(e.target.value)}
                placeholder="Nome da loja"
                required
                className="h-8 text-sm mt-1"
              />
            )}
          </div>

          {/* Título */}
          <div className="space-y-1.5">
            <Label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Título</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nome do produto"
              required
              disabled={isPending}
              className="h-8 text-sm"
            />
          </div>

          {/* Preços */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1.5">
              <Label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Preço Oferta</Label>
              <Input
                value={currentPrice}
                onChange={(e) => setCurrentPrice(e.target.value)}
                placeholder="ex: 299,90"
                required
                disabled={isPending}
                className="h-8 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Preço Original</Label>
              <Input
                value={oldPrice}
                onChange={(e) => setOldPrice(e.target.value)}
                placeholder="ex: 499,90"
                disabled={isPending}
                className="h-8 text-sm"
              />
            </div>
          </div>

          {/* URL */}
          <div className="space-y-1.5">
            <Label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">URL do Produto</Label>
            <Input
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              placeholder="https://..."
              required
              disabled={isPending}
              className="h-8 text-sm"
            />
          </div>

          {/* Imagem */}
          <div className="space-y-1.5">
            <Label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">URL da Imagem <span className="normal-case font-normal text-gray-300">(opcional)</span></Label>
            <Input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
              disabled={isPending}
              className="h-8 text-sm"
            />
          </div>

          {/* Categoria */}
          <div className="space-y-1.5">
            <Label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Categoria <span className="normal-case font-normal text-gray-300">(opcional)</span></Label>
            <Input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="ex: Eletrônicos"
              disabled={isPending}
              className="h-8 text-sm"
            />
          </div>

          <Button
            type="submit"
            disabled={isPending || !title.trim() || !currentPrice.trim() || !originalUrl.trim()}
            className="mt-1 h-9 text-[13px] bg-gray-900 hover:bg-gray-800 text-white"
          >
            {isPending ? 'Adicionando...' : 'Adicionar à Fila'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
