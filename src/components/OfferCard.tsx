'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ExternalLink } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { approveOffer, rejectOffer, updateOfferPrice } from '@/src/actions/offer-actions'
import type { Offer } from '@/src/db/schema'

interface OfferCardProps {
  offer: Offer
  onClose?: () => void
}

export function OfferCard({ offer, onClose }: OfferCardProps) {
  const [title, setTitle] = useState(offer.title)
  const [copy, setCopy] = useState(offer.copyText ?? '')
  const [editedPrice, setEditedPrice] = useState(offer.oldPrice ?? '')
  const [isPending, startTransition] = useTransition()

  const handleApprove = () => {
    startTransition(async () => {
      await approveOffer(offer.id, title, copy)
      toast.success('Oferta aprovada!', {
        description: title,
      })
      onClose?.()
    })
  }

  const handleReject = () => {
    startTransition(async () => {
      await rejectOffer(offer.id)
      toast.info('Oferta descartada.', {
        description: offer.title,
      })
      onClose?.()
    })
  }

  return (
    <div className="flex flex-col">
      {/* Imagem */}
      <div className="relative w-full bg-gray-50 border-b border-gray-100" style={{ aspectRatio: '16/9' }}>
        {offer.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={offer.imageUrl}
            alt={offer.title}
            className="h-full w-full object-contain p-3"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[13px] text-gray-400">
            Sem imagem
          </div>
        )}
      </div>

      {/* Meta */}
      <div className="px-5 pt-4 pb-3 border-b border-gray-100">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-gray-500 bg-gray-100 rounded-[4px] px-1.5 py-0.5">
              {offer.store}
            </span>
            <a
              href={offer.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-0.5 text-[11px] text-blue-500 hover:underline"
            >
              <ExternalLink size={11} />
              Abrir na Loja
            </a>
          </div>
          <span className="text-[11px] text-gray-400 tabular-nums">
            {new Date(offer.createdAt).toLocaleDateString('pt-BR')}
          </span>
        </div>
        <p className="text-[12px] text-gray-500 line-clamp-2 mb-2">{offer.title}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-[18px] font-bold text-gray-900 tabular-nums">
            R${' '}
            {Number(offer.currentPrice).toLocaleString('pt-BR', {
              minimumFractionDigits: 2,
            })}
          </span>
          {offer.oldPrice && (
            <span className="text-[13px] line-through text-gray-400 tabular-nums">
              R${' '}
              {Number(offer.oldPrice).toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
              })}
            </span>
          )}
        </div>
      </div>

      {/* Campos editáveis */}
      <div className="px-5 py-4 flex flex-col gap-3">
        <div className="space-y-1.5">
          <Label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            Corrigir Preço da Oferta
          </Label>
          <div className="flex gap-2">
            <Input
              value={editedPrice}
              onChange={(e) => setEditedPrice(e.target.value)}
              disabled={isPending}
              className="text-[13px] h-8"
            />
            <Button
              type="button"
              variant="secondary"
              className="h-8 text-[13px] shrink-0"
              disabled={isPending}
              onClick={() => {
                startTransition(async () => {
                  await updateOfferPrice(offer.id, editedPrice)
                  toast.success('Preço atualizado com sucesso!')
                })
              }}
            >
              Atualizar BD
            </Button>
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            Título do grupo
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Edite o título da oferta..."
            disabled={isPending}
            className="text-[13px] h-8"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            Copy para o grupo
          </label>
          <Textarea
            value={copy}
            onChange={(e) => setCopy(e.target.value)}
            placeholder="Escreva o texto promocional..."
            className="min-h-[80px] resize-none text-[13px]"
            disabled={isPending}
          />
        </div>
      </div>

      {/* Ações */}
      <div className="flex gap-2 px-5 pb-5">
        <Button
          className="flex-1 h-8 text-[13px] bg-gray-900 hover:bg-gray-800 text-white cursor-pointer"
          onClick={handleApprove}
          disabled={isPending || !title.trim()}
        >
          Aprovar
        </Button>
        <Button
          variant="outline"
          className="flex-1 h-8 text-[13px] text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 cursor-pointer"
          onClick={handleReject}
          disabled={isPending}
        >
          Reprovar
        </Button>
      </div>
    </div>
  )
}
