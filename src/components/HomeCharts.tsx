'use client'

export const TIME_RANGES = {
  '7d': { label: '7 dias', days: 7 },
  '30d': { label: '30 dias', days: 30 },
  '90d': { label: '90 dias', days: 90 },
} as const

export type RangeKey = keyof typeof TIME_RANGES

export function fmtNum(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1).replace('.0', '') + 'k'
  return Math.round(n).toString()
}

export function fmtDate(d: Date): string {
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

// ─── Sparkline ───────────────────────────────────────────────────────────────

interface SparklineProps {
  data: number[]
  color?: string
  height?: number
}

export function Sparkline({ data, color = 'var(--accent)', height = 28 }: SparklineProps) {
  if (!data.length) return null
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const w = 100
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w
      const y = height - ((v - min) / range) * (height - 2) - 1
      return `${x},${y}`
    })
    .join(' ')
  const last = data[data.length - 1]
  const lastX = w
  const lastY = height - ((last - min) / range) * (height - 2) - 1

  return (
    <svg
      viewBox={`0 0 ${w} ${height}`}
      preserveAspectRatio="none"
      style={{ width: '100%', height, display: 'block' }}
    >
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle cx={lastX} cy={lastY} r="2" fill={color} />
    </svg>
  )
}

// ─── LineChart ────────────────────────────────────────────────────────────────

export interface LineDataset {
  id: string
  data: number[]
  color: string
}

interface LineChartProps {
  datasets: LineDataset[]
  days: number
  height?: number
  yFormat?: (v: number) => string
}

export function LineChart({ datasets, days, height = 220, yFormat = fmtNum }: LineChartProps) {
  const w = 800
  const h = height
  const padL = 40, padR = 12, padT = 12, padB = 28
  const innerW = w - padL - padR
  const innerH = h - padT - padB
  const allValues = datasets.flatMap(d => d.data)
  const max = Math.max(...allValues, 1) * 1.1
  const min = 0
  const range = max - min || 1
  const yTicks = 4
  const today = new Date()

  const labelCount = days <= 7 ? 7 : 6
  const xLabels = Array.from({ length: labelCount }, (_, i) => {
    const idx = Math.round((i / (labelCount - 1)) * (days - 1))
    const d = new Date(today)
    d.setDate(d.getDate() - (days - 1 - idx))
    return { idx, label: fmtDate(d) }
  })

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      style={{ width: '100%', height: 'auto', display: 'block' }}
      preserveAspectRatio="none"
    >
      {Array.from({ length: yTicks + 1 }).map((_, i) => {
        const y = padT + (i / yTicks) * innerH
        const v = max - (i / yTicks) * range
        return (
          <g key={i}>
            <line x1={padL} y1={y} x2={w - padR} y2={y} stroke="var(--border)" strokeWidth="1" />
            <text
              x={padL - 6}
              y={y + 3}
              fontSize="10"
              fill="var(--text-muted)"
              textAnchor="end"
              fontFamily="var(--font-mono)"
            >
              {yFormat(v)}
            </text>
          </g>
        )
      })}
      {xLabels.map((l, i) => {
        const x = padL + (l.idx / (days - 1)) * innerW
        return (
          <text
            key={i}
            x={x}
            y={h - 8}
            fontSize="10"
            fill="var(--text-muted)"
            textAnchor="middle"
            fontFamily="var(--font-mono)"
          >
            {l.label}
          </text>
        )
      })}
      {datasets.map((ds, di) => {
        if (ds.data.length < 2) return null
        const pts = ds.data.map((v, i) => {
          const x = padL + (i / Math.max(ds.data.length - 1, 1)) * innerW
          const y = padT + (1 - (v - min) / range) * innerH
          return [x, y] as [number, number]
        })
        const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ')
        const areaPath =
          `${linePath} L${pts[pts.length - 1][0]},${padT + innerH} L${pts[0][0]},${padT + innerH} Z`
        return (
          <g key={di}>
            <defs>
              <linearGradient id={`grad-${ds.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={ds.color} stopOpacity="0.18" />
                <stop offset="100%" stopColor={ds.color} stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={areaPath} fill={`url(#grad-${ds.id})`} />
            <path
              d={linePath}
              fill="none"
              stroke={ds.color}
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </g>
        )
      })}
    </svg>
  )
}

// ─── BarChart ─────────────────────────────────────────────────────────────────

export interface BarItem {
  label: string
  sublabel: string
  value: number
  color: string
}

interface BarChartProps {
  data: BarItem[]
  height?: number
}

export function BarChart({ data, height = 220 }: BarChartProps) {
  const w = 800
  const h = height
  const padL = 40, padR = 12, padT = 12, padB = 36
  const innerW = w - padL - padR
  const innerH = h - padT - padB
  const max = Math.max(...data.map(d => d.value), 1) * 1.15
  const barW = (innerW / data.length) * 0.55
  const gap = innerW / data.length

  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
      {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
        const y = padT + t * innerH
        const v = max - t * max
        return (
          <g key={i}>
            <line x1={padL} y1={y} x2={w - padR} y2={y} stroke="var(--border)" />
            <text
              x={padL - 6}
              y={y + 3}
              fontSize="10"
              fill="var(--text-muted)"
              textAnchor="end"
              fontFamily="var(--font-mono)"
            >
              {fmtNum(v)}
            </text>
          </g>
        )
      })}
      {data.map((d, i) => {
        const barH = (d.value / max) * innerH
        const x = padL + i * gap + (gap - barW) / 2
        const y = padT + innerH - barH
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={barH} fill={d.color} rx="3" />
            <text
              x={x + barW / 2}
              y={y - 6}
              fontSize="11"
              fill="var(--text)"
              textAnchor="middle"
              fontFamily="var(--font-mono)"
              fontWeight="600"
            >
              {fmtNum(d.value)}
            </text>
            <text x={x + barW / 2} y={h - 16} fontSize="11" fill="var(--text-soft)" textAnchor="middle">
              {d.label}
            </text>
            <text x={x + barW / 2} y={h - 4} fontSize="10" fill="var(--text-muted)" textAnchor="middle">
              {d.sublabel}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

// ─── DonutChart ───────────────────────────────────────────────────────────────

export interface DonutItem {
  label: string
  value: number
  color: string
}

interface DonutChartProps {
  data: DonutItem[]
  size?: number
}

export function DonutChart({ data, size = 200 }: DonutChartProps) {
  const total = data.reduce((s, d) => s + d.value, 0)
  const r = size / 2 - 10
  const cx = size / 2
  const cy = size / 2
  const inner = r * 0.62
  let acc = 0

  const arcs = data.map(d => {
    const start = (acc / total) * Math.PI * 2 - Math.PI / 2
    acc += d.value
    const end = (acc / total) * Math.PI * 2 - Math.PI / 2
    const large = end - start > Math.PI ? 1 : 0
    const x1 = cx + Math.cos(start) * r
    const y1 = cy + Math.sin(start) * r
    const x2 = cx + Math.cos(end) * r
    const y2 = cy + Math.sin(end) * r
    const x3 = cx + Math.cos(end) * inner
    const y3 = cy + Math.sin(end) * inner
    const x4 = cx + Math.cos(start) * inner
    const y4 = cy + Math.sin(start) * inner
    const path = `M${x1},${y1} A${r},${r} 0 ${large} 1 ${x2},${y2} L${x3},${y3} A${inner},${inner} 0 ${large} 0 ${x4},${y4} Z`
    return {
      path,
      color: d.color,
      label: d.label,
      value: d.value,
      pct: total > 0 ? ((d.value / total) * 100).toFixed(0) : '0',
    }
  })

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
        {arcs.map((a, i) => <path key={i} d={a.path} fill={a.color} />)}
        <text
          x={cx}
          y={cy - 4}
          textAnchor="middle"
          fontSize="22"
          fontWeight="700"
          fill="var(--text)"
          fontFamily="var(--font-display)"
        >
          {total}
        </text>
        <text x={cx} y={cy + 14} textAnchor="middle" fontSize="11" fill="var(--text-muted)">
          ofertas
        </text>
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1, minWidth: 140 }}>
        {arcs.map((a, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
            <span
              style={{ width: 10, height: 10, borderRadius: 3, background: a.color, flexShrink: 0 }}
            />
            <span style={{ flex: 1, color: 'var(--text-soft)' }}>{a.label}</span>
            <span
              className="tabular"
              style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text)' }}
            >
              {a.value}
            </span>
            <span
              className="tabular"
              style={{
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-muted)',
                fontSize: 11,
                width: 32,
                textAlign: 'right',
              }}
            >
              {a.pct}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Heatmap ──────────────────────────────────────────────────────────────────

interface HeatmapProps {
  data: number[][]
}

export function Heatmap({ data }: HeatmapProps) {
  const dayLabels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']
  const max = Math.max(...data.flat(), 1)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', gap: 3, paddingLeft: 38 }}>
        {Array.from({ length: 24 }).map((_, h) => (
          <div
            key={h}
            style={{
              flex: 1,
              fontSize: 9,
              color: 'var(--text-muted)',
              textAlign: 'center',
              fontFamily: 'var(--font-mono)',
            }}
          >
            {h % 3 === 0 ? String(h).padStart(2, '0') : ''}
          </div>
        ))}
      </div>
      {data.map((row, di) => (
        <div key={di} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <div
            style={{
              width: 34,
              fontSize: 11,
              color: 'var(--text-soft)',
              textAlign: 'right',
              paddingRight: 4,
            }}
          >
            {dayLabels[di]}
          </div>
          {row.map((v, hi) => {
            const intensity = v / max
            const bg =
              intensity < 0.05
                ? 'var(--bg-sunken)'
                : `oklch(${0.95 - intensity * 0.55} ${0.04 + intensity * 0.14} 295 / ${0.3 + intensity * 0.7})`
            return (
              <div
                key={hi}
                title={`${dayLabels[di]} ${String(hi).padStart(2, '0')}:00 — ${Math.round(v)} cliques`}
                style={{
                  flex: 1,
                  aspectRatio: '1',
                  borderRadius: 3,
                  background: bg,
                  border: '1px solid var(--border)',
                  minHeight: 14,
                }}
              />
            )
          })}
        </div>
      ))}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontSize: 11,
          color: 'var(--text-muted)',
          marginTop: 8,
          justifyContent: 'flex-end',
        }}
      >
        <span>Menos</span>
        {[0.1, 0.3, 0.55, 0.8, 1].map((t, i) => (
          <div
            key={i}
            style={{
              width: 14,
              height: 14,
              borderRadius: 3,
              background: `oklch(${0.95 - t * 0.55} ${0.04 + t * 0.14} 295 / ${0.3 + t * 0.7})`,
              border: '1px solid var(--border)',
            }}
          />
        ))}
        <span>Mais</span>
      </div>
    </div>
  )
}
