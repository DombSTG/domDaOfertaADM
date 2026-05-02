import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

const STORE_COLORS: Record<string, string> = {
  Amazon: 'oklch(0.7 0.15 60)',
  'Mercado Livre': 'oklch(0.78 0.16 95)',
  Shopee: 'oklch(0.65 0.18 30)',
  Magalu: 'oklch(0.62 0.16 240)',
}

const CATEGORY_COLORS = [
  'oklch(0.6 0.18 295)',
  'oklch(0.65 0.15 220)',
  'oklch(0.7 0.16 350)',
  'oklch(0.65 0.14 150)',
  'oklch(0.7 0.15 60)',
  'oklch(0.62 0.04 280)',
]

type Row = Record<string, unknown>

function dayKey(d: Date): string {
  return d.toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' })
}

function buildSeries(rows: Row[], days: number, key: string): number[] {
  const map = new Map<string, number>()
  for (const row of rows) {
    const dk = String(row.day ?? '').substring(0, 10)
    map.set(dk, Number(row[key] ?? 0))
  }
  const result: number[] = []
  const today = new Date()
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    result.push(map.get(dayKey(d)) ?? 0)
  }
  return result
}

export async function GET(request: NextRequest) {
  const sql = neon(process.env.DATABASE_URL!)
  const { searchParams } = new URL(request.url)
  const rangeParam = parseInt(searchParams.get('range') ?? '30')
  const days = [7, 30, 90].includes(rangeParam) ? rangeParam : 30

  try {
    const [
      totalsRaw,
      clicksByDayRaw,
      impressionsByDayRaw,
      heatmapRaw,
      approvedByDayRaw,
      clicksByStoreRaw,
      clicksByCategoryRaw,
      submittedTodayRaw,
    ] = await Promise.all([
      sql`
        SELECT
          (SELECT COUNT(*) FROM click_events WHERE created_at >= NOW() - make_interval(days => ${days})) AS total_clicks,
          (SELECT COUNT(DISTINCT session_id) FROM click_events WHERE created_at >= NOW() - make_interval(days => ${days})) AS unique_clicks,
          (SELECT COUNT(*) FROM offer_impressions WHERE created_at >= NOW() - make_interval(days => ${days})) AS total_impressions,
          (SELECT COUNT(DISTINCT session_id) FROM offer_impressions WHERE created_at >= NOW() - make_interval(days => ${days})) AS total_sessions
      `,
      sql`
        SELECT
          TO_CHAR(DATE_TRUNC('day', created_at AT TIME ZONE 'America/Sao_Paulo'), 'YYYY-MM-DD') AS day,
          COUNT(*)::int AS total,
          COUNT(DISTINCT session_id)::int AS unique
        FROM click_events
        WHERE created_at >= NOW() - make_interval(days => ${days})
        GROUP BY 1 ORDER BY 1
      `,
      sql`
        SELECT
          TO_CHAR(DATE_TRUNC('day', created_at AT TIME ZONE 'America/Sao_Paulo'), 'YYYY-MM-DD') AS day,
          COUNT(*)::int AS total,
          COUNT(DISTINCT session_id)::int AS unique
        FROM offer_impressions
        WHERE created_at >= NOW() - make_interval(days => ${days})
        GROUP BY 1 ORDER BY 1
      `,
      sql`
        SELECT
          (EXTRACT(ISODOW FROM created_at AT TIME ZONE 'America/Sao_Paulo')::int - 1) AS dow,
          EXTRACT(HOUR FROM created_at AT TIME ZONE 'America/Sao_Paulo')::int AS hour,
          COUNT(*)::int AS clicks
        FROM click_events
        WHERE created_at >= NOW() - make_interval(days => ${days})
        GROUP BY 1, 2
      `,
      sql`
        SELECT
          TO_CHAR(DATE_TRUNC('day', approved_at AT TIME ZONE 'America/Sao_Paulo'), 'YYYY-MM-DD') AS day,
          COUNT(*)::int AS total
        FROM offers
        WHERE status = 'approved' AND approved_at >= NOW() - make_interval(days => ${days})
        GROUP BY 1 ORDER BY 1
      `,
      sql`
        SELECT o.store, COUNT(*)::int AS clicks
        FROM click_events ce
        JOIN offers o ON o.id = ce.offer_id
        WHERE ce.created_at >= NOW() - make_interval(days => ${days})
          AND ce.offer_id IS NOT NULL
        GROUP BY o.store
        ORDER BY clicks DESC
        LIMIT 8
      `,
      sql`
        SELECT o.category, COUNT(*)::int AS clicks
        FROM click_events ce
        JOIN offers o ON o.id = ce.offer_id
        WHERE ce.created_at >= NOW() - make_interval(days => ${days})
          AND ce.offer_id IS NOT NULL
          AND o.category IS NOT NULL
        GROUP BY o.category
        ORDER BY clicks DESC
        LIMIT 6
      `,
      sql`
        SELECT COUNT(*)::int AS total
        FROM offers
        WHERE DATE_TRUNC('day', created_at AT TIME ZONE 'America/Sao_Paulo')
            = DATE_TRUNC('day', NOW() AT TIME ZONE 'America/Sao_Paulo')
      `,
    ])

    const totalRow = (totalsRaw as Row[])[0] ?? {}
    const totalClicks = Number(totalRow.total_clicks ?? 0)
    const uniqueClicks = Number(totalRow.unique_clicks ?? 0)
    const totalImpressions = Number(totalRow.total_impressions ?? 0)
    const totalSessions = Number(totalRow.total_sessions ?? 0)
    const ctrGlobal = totalImpressions > 0
      ? parseFloat(((totalClicks / totalImpressions) * 100).toFixed(1))
      : 0
    const ctrUnique = totalSessions > 0
      ? parseFloat(((uniqueClicks / totalSessions) * 100).toFixed(1))
      : 0

    const clicksSeries = buildSeries(clicksByDayRaw as Row[], days, 'total')
    const uniquesSeries = buildSeries(clicksByDayRaw as Row[], days, 'unique')
    const impressionsSeries = buildSeries(impressionsByDayRaw as Row[], days, 'total')
    const uniqueImpressionsSeries = buildSeries(impressionsByDayRaw as Row[], days, 'unique')

    const ctrGlobalSeries = clicksSeries.map((c, i) =>
      impressionsSeries[i] > 0 ? parseFloat(((c / impressionsSeries[i]) * 100).toFixed(2)) : 0
    )
    const ctrUniqueSeries = uniquesSeries.map((c, i) =>
      uniqueImpressionsSeries[i] > 0 ? parseFloat(((c / uniqueImpressionsSeries[i]) * 100).toFixed(2)) : 0
    )
    const approvedSeries = buildSeries(approvedByDayRaw as Row[], days, 'total')

    const heatmap: number[][] = Array.from({ length: 7 }, () => new Array(24).fill(0))
    for (const row of heatmapRaw as Row[]) {
      const dow = Number(row.dow)
      const hour = Number(row.hour)
      if (dow >= 0 && dow < 7 && hour >= 0 && hour < 24) {
        heatmap[dow][hour] = Number(row.clicks)
      }
    }

    const totalStoreClicks = (clicksByStoreRaw as Row[]).reduce((s, r) => s + Number(r.clicks), 0)
    const clicksByStore = (clicksByStoreRaw as Row[]).map((r, i) => ({
      label: String(r.store),
      sublabel: totalStoreClicks > 0
        ? `${Math.round((Number(r.clicks) / totalStoreClicks) * 100)}%`
        : '0%',
      value: Number(r.clicks),
      color: STORE_COLORS[String(r.store)] ?? CATEGORY_COLORS[i % CATEGORY_COLORS.length],
    }))

    const clicksByCategory = (clicksByCategoryRaw as Row[]).map((r, i) => ({
      label: String(r.category),
      value: Number(r.clicks),
      color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
    }))

    const submittedToday = Number(((submittedTodayRaw as Row[])[0])?.total ?? 0)

    return NextResponse.json({
      totalClicks,
      uniqueClicks,
      totalImpressions,
      ctrGlobal,
      ctrUnique,
      submittedToday,
      clicksSeries,
      uniquesSeries,
      ctrGlobalSeries,
      ctrUniqueSeries,
      approvedSeries,
      clicksByStore,
      clicksByCategory,
      heatmap,
    })
  } catch (err) {
    console.error('[analytics]', err)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}
