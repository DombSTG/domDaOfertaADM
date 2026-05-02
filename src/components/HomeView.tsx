'use client'

import { useState, useEffect } from 'react'
import {
  Sparkline,
  LineChart,
  BarChart,
  DonutChart,
  Heatmap,
  fmtNum,
  TIME_RANGES,
  type RangeKey,
  type BarItem,
  type DonutItem,
} from '@/src/components/HomeCharts'

interface AnalyticsData {
  totalClicks: number
  uniqueClicks: number
  totalImpressions: number
  ctrGlobal: number
  ctrUnique: number
  submittedToday: number
  clicksSeries: number[]
  uniquesSeries: number[]
  ctrGlobalSeries: number[]
  ctrUniqueSeries: number[]
  approvedSeries: number[]
  clicksByStore: BarItem[]
  clicksByCategory: DonutItem[]
  heatmap: number[][]
}

interface HomeViewProps {
  pendingCount: number
}

const ACCENT = 'oklch(0.55 0.2 295)'
const ACCENT2 = 'oklch(0.65 0.16 30)'
const EMPTY_HEATMAP = Array.from({ length: 7 }, () => new Array(24).fill(0))

function zeros(n: number) {
  return new Array(n).fill(0)
}

export function HomeView({ pendingCount }: HomeViewProps) {
  const [range, setRange] = useState<RangeKey>('30d')
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const days = TIME_RANGES[range].days
    setLoading(true)
    fetch(`/api/analytics?range=${days}`)
      .then(r => r.json())
      .then((d: AnalyticsData) => {
        setData(d)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [range])

  const days = TIME_RANGES[range].days

  const sumClicks = data?.totalClicks ?? 0
  const sumUnique = data?.uniqueClicks ?? 0
  const avgCtrGlobal = data?.ctrGlobal.toFixed(1) ?? '0.0'
  const avgCtrUnique = data?.ctrUnique.toFixed(1) ?? '0.0'
  const sumApproved = data?.approvedSeries?.reduce((s, v) => s + v, 0) ?? 0

  const clicksSeries = data?.clicksSeries ?? zeros(days)
  const uniquesSeries = data?.uniquesSeries ?? zeros(days)
  const ctrGlobalSeries = data?.ctrGlobalSeries ?? zeros(days)
  const ctrUniqueSeries = data?.ctrUniqueSeries ?? zeros(days)
  const approvedSeries = data?.approvedSeries ?? zeros(days)
  const heatmap = data?.heatmap ?? EMPTY_HEATMAP
  const clicksByStore = data?.clicksByStore ?? []
  const clicksByCategory = data?.clicksByCategory ?? []

  const val = (v: string | number) => (loading ? '—' : v)

  const metric = (
    label: string,
    value: string | number,
    sub: string,
    series: number[],
    color: string,
  ) => (
    <div className="home-metric">
      <div className="home-metric-label">{label}</div>
      <div className="home-metric-value tabular">{val(value)}</div>
      <div className="home-metric-sub">{sub}</div>
      <div style={{ marginTop: 8 }}>
        <Sparkline data={series} color={color} />
      </div>
    </div>
  )

  const empty = (
    <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
      Sem dados no período
    </div>
  )

  return (
    <div className="home-layout">
      <aside className="home-aside">
        <div className="home-aside-head">
          <div className="section-label">Métricas</div>
          <div className="range-toggle">
            {(Object.keys(TIME_RANGES) as RangeKey[]).map(k => (
              <button
                key={k}
                className={`range-btn${range === k ? ' active' : ''}`}
                onClick={() => setRange(k)}
              >
                {k}
              </button>
            ))}
          </div>
        </div>

        {metric(
          'Cliques totais',
          fmtNum(sumClicks),
          `${range} · total`,
          clicksSeries,
          ACCENT,
        )}
        {metric(
          'Cliques únicos',
          fmtNum(sumUnique),
          sumClicks > 0 ? `~${Math.round((sumUnique / sumClicks) * 100)}% das sessões` : '—',
          uniquesSeries,
          ACCENT2,
        )}
        {metric('CTR global', `${avgCtrGlobal}%`, 'Cliques / impressões', ctrGlobalSeries, 'oklch(0.65 0.16 220)')}
        {metric('CTR único', `${avgCtrUnique}%`, 'Por sessão única', ctrUniqueSeries, 'oklch(0.65 0.14 150)')}
        {metric(
          'Aprovadas',
          sumApproved,
          `${range} · ${days > 0 ? Math.round(sumApproved / days) : 0}/dia`,
          approvedSeries,
          'oklch(0.65 0.16 295)',
        )}

        <div className="home-aside-pending">
          <div className="home-metric-label" style={{ marginBottom: 8 }}>Precisa de atenção</div>
          <div className="pending-row">
            <span className="dot" style={{ background: 'var(--warning)' }} />
            <span style={{ flex: 1 }}>Pendentes na fila</span>
            <span className="tabular" style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
              {pendingCount}
            </span>
          </div>
          <div className="pending-row">
            <span className="dot" style={{ background: 'var(--accent)' }} />
            <span style={{ flex: 1 }}>Submetidas hoje</span>
            <span className="tabular" style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
              {loading ? '—' : (data?.submittedToday ?? 0)}
            </span>
          </div>
        </div>
      </aside>

      <main className="home-main">
        <div className="home-card home-card-wide">
          <div className="home-card-head">
            <div>
              <div className="home-card-title">Cliques ao longo do tempo</div>
              <div className="home-card-sub">Total e únicos por sessão · últimos {days} dias</div>
            </div>
            <div className="home-legend">
              <span className="legend-item">
                <span className="legend-dot" style={{ background: ACCENT }} /> Total
              </span>
              <span className="legend-item">
                <span className="legend-dot" style={{ background: ACCENT2 }} /> Únicos
              </span>
            </div>
          </div>
          <LineChart
            days={days}
            datasets={[
              { id: 'clk-total', data: clicksSeries, color: ACCENT },
              { id: 'clk-unique', data: uniquesSeries, color: ACCENT2 },
            ]}
          />
        </div>

        <div className="home-card home-card-wide">
          <div className="home-card-head">
            <div>
              <div className="home-card-title">CTR ao longo do tempo</div>
              <div className="home-card-sub">CTR global e único · últimos {days} dias</div>
            </div>
            <div className="home-legend">
              <span className="legend-item">
                <span className="legend-dot" style={{ background: 'oklch(0.65 0.16 220)' }} /> Global
              </span>
              <span className="legend-item">
                <span className="legend-dot" style={{ background: 'oklch(0.65 0.14 150)' }} /> Único
              </span>
            </div>
          </div>
          <LineChart
            days={days}
            yFormat={v => `${v.toFixed(1)}%`}
            datasets={[
              { id: 'ctr-global', data: ctrGlobalSeries, color: 'oklch(0.65 0.16 220)' },
              { id: 'ctr-unique', data: ctrUniqueSeries, color: 'oklch(0.65 0.14 150)' },
            ]}
          />
        </div>

        <div className="home-card">
          <div className="home-card-head">
            <div>
              <div className="home-card-title">Cliques por marketplace</div>
              <div className="home-card-sub">Cliques acumulados · {range}</div>
            </div>
          </div>
          {clicksByStore.length > 0 ? <BarChart data={clicksByStore} /> : empty}
        </div>

        <div className="home-card">
          <div className="home-card-head">
            <div>
              <div className="home-card-title">Distribuição por categoria</div>
              <div className="home-card-sub">Cliques · {range}</div>
            </div>
          </div>
          {clicksByCategory.length > 0 ? <DonutChart data={clicksByCategory} /> : empty}
        </div>

        <div className="home-card home-card-wide">
          <div className="home-card-head">
            <div>
              <div className="home-card-title">Horários de pico de clique</div>
              <div className="home-card-sub">Mapa de calor por dia da semana e hora · {range}</div>
            </div>
          </div>
          <Heatmap data={heatmap} />
        </div>
      </main>
    </div>
  )
}
