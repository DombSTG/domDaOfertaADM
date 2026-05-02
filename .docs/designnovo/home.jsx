// Home view — analytics dashboard

function HomeView({ counts }) {
  const { Sparkline, LineChart, BarChart, DonutChart, Heatmap, genTimeSeries, fmtNum, TIME_RANGES } = window.HomeCharts;
  const [range, setRange] = React.useState('30d');
  const days = TIME_RANGES[range].days;

  // Generate mock data based on range
  const data = React.useMemo(() => {
    const clicksTotal = genTimeSeries(days, 180, 80, true, 7);
    const clicksUnique = clicksTotal.map(v => v * (0.62 + Math.random() * 0.05));
    const ctrGlobal = genTimeSeries(days, 6.4, 1.2, true, 11);
    const ctrUnique = genTimeSeries(days, 4.8, 1.0, true, 13);
    const approvedSeries = genTimeSeries(days, 12, 5, true, 17);
    const sumClicks = Math.round(clicksTotal.reduce((s, v) => s + v, 0));
    const sumUnique = Math.round(clicksUnique.reduce((s, v) => s + v, 0));
    const avgCtrGlobal = (ctrGlobal.reduce((s, v) => s + v, 0) / days).toFixed(1);
    const avgCtrUnique = (ctrUnique.reduce((s, v) => s + v, 0) / days).toFixed(1);
    const sumApproved = Math.round(approvedSeries.reduce((s, v) => s + v, 0));

    // Heatmap: 7 days x 24 hours, peaks at lunch + evening
    const heatmap = [];
    const rand = (() => { let s = 42; return () => { s = (s*9301+49297)%233280; return s/233280; }; })();
    for (let d = 0; d < 7; d++) {
      const row = [];
      const weekendBoost = (d >= 5) ? 0.85 : 1.0;
      for (let h = 0; h < 24; h++) {
        let v = 5;
        if (h >= 7 && h <= 10) v += 25 + rand()*15;
        if (h >= 12 && h <= 14) v += 50 + rand()*20;
        if (h >= 19 && h <= 22) v += 80 + rand()*30;
        if (h >= 0 && h <= 5) v *= 0.15;
        v *= weekendBoost;
        row.push(v);
      }
      heatmap.push(row);
    }

    return {
      clicksTotal, clicksUnique, ctrGlobal, ctrUnique, approvedSeries, heatmap,
      sumClicks, sumUnique, avgCtrGlobal, avgCtrUnique, sumApproved,
    };
  }, [days]);

  const pendingToday = 12;
  const pendingNow = counts.pending;

  // Marketplace bars
  const mpData = [
    { label: 'Amazon', sublabel: '57%', value: 1240, color: 'oklch(0.7 0.15 60)' },
    { label: 'Mercado Livre', sublabel: '28%', value: 612, color: 'oklch(0.78 0.16 95)' },
    { label: 'Shopee', sublabel: '11%', value: 238, color: 'oklch(0.65 0.18 30)' },
    { label: 'Magalu', sublabel: '4%', value: 86, color: 'oklch(0.62 0.16 240)' },
  ];

  const catData = [
    { label: 'Suplementos', value: 412, color: 'oklch(0.6 0.18 295)' },
    { label: 'Eletrônicos', value: 287, color: 'oklch(0.65 0.15 220)' },
    { label: 'Beleza', value: 198, color: 'oklch(0.7 0.16 350)' },
    { label: 'Casa', value: 142, color: 'oklch(0.65 0.14 150)' },
    { label: 'Moda', value: 98, color: 'oklch(0.7 0.15 60)' },
    { label: 'Outros', value: 67, color: 'oklch(0.62 0.04 280)' },
  ];

  const accent = 'oklch(0.55 0.2 295)';
  const accent2 = 'oklch(0.65 0.16 30)';

  const metric = (label, value, sub, series, color) => (
    <div className="home-metric">
      <div className="home-metric-label">{label}</div>
      <div className="home-metric-value tabular">{value}</div>
      <div className="home-metric-sub">{sub}</div>
      <div style={{marginTop:8}}>
        <Sparkline data={series} color={color}/>
      </div>
    </div>
  );

  return (
    <div className="home-layout">
      {/* Aside metrics */}
      <aside className="home-aside">
        <div className="home-aside-head">
          <div className="section-label">Métricas</div>
          <div className="range-toggle">
            {Object.keys(TIME_RANGES).map(k => (
              <button key={k} className={`range-btn ${range === k ? 'active' : ''}`} onClick={() => setRange(k)}>
                {k}
              </button>
            ))}
          </div>
        </div>

        {metric('Cliques totais', fmtNum(data.sumClicks), `${range} · +12% vs anterior`, data.clicksTotal, accent)}
        {metric('Cliques únicos', fmtNum(data.sumUnique), `~${Math.round(data.sumUnique/data.sumClicks*100)}% das sessões`, data.clicksUnique, accent2)}
        {metric('CTR global', `${data.avgCtrGlobal}%`, 'Cliques / impressões', data.ctrGlobal, 'oklch(0.65 0.16 220)')}
        {metric('CTR único', `${data.avgCtrUnique}%`, 'Por sessão única', data.ctrUnique, 'oklch(0.65 0.14 150)')}
        {metric('Aprovadas', data.sumApproved, `${range} · ${Math.round(data.sumApproved/days)}/dia`, data.approvedSeries, 'oklch(0.65 0.16 295)')}

        <div className="home-aside-pending">
          <div className="home-metric-label" style={{marginBottom:8}}>Precisa de atenção</div>
          <div className="pending-row">
            <span className="dot" style={{background:'var(--warning)'}}></span>
            <span style={{flex:1}}>Pendentes na fila</span>
            <span className="tabular" style={{fontFamily:'var(--font-mono)', fontWeight:600}}>{pendingNow}</span>
          </div>
          <div className="pending-row">
            <span className="dot" style={{background:'var(--accent)'}}></span>
            <span style={{flex:1}}>Submetidas hoje</span>
            <span className="tabular" style={{fontFamily:'var(--font-mono)', fontWeight:600}}>{pendingToday}</span>
          </div>
        </div>
      </aside>

      {/* Main charts */}
      <main className="home-main">
        <div className="home-card home-card-wide">
          <div className="home-card-head">
            <div>
              <div className="home-card-title">Cliques ao longo do tempo</div>
              <div className="home-card-sub">Total e únicos por sessão · últimos {days} dias</div>
            </div>
            <div className="home-legend">
              <span className="legend-item"><span className="legend-dot" style={{background: accent}}></span> Total</span>
              <span className="legend-item"><span className="legend-dot" style={{background: accent2}}></span> Únicos</span>
            </div>
          </div>
          <LineChart days={days} datasets={[
            { id: 'clk-total', data: data.clicksTotal, color: accent },
            { id: 'clk-unique', data: data.clicksUnique, color: accent2 },
          ]} />
        </div>

        <div className="home-card home-card-wide">
          <div className="home-card-head">
            <div>
              <div className="home-card-title">CTR ao longo do tempo</div>
              <div className="home-card-sub">CTR global e único · últimos {days} dias</div>
            </div>
            <div className="home-legend">
              <span className="legend-item"><span className="legend-dot" style={{background: 'oklch(0.65 0.16 220)'}}></span> Global</span>
              <span className="legend-item"><span className="legend-dot" style={{background: 'oklch(0.65 0.14 150)'}}></span> Único</span>
            </div>
          </div>
          <LineChart days={days} yFormat={(v) => `${v.toFixed(1)}%`} datasets={[
            { id: 'ctr-global', data: data.ctrGlobal, color: 'oklch(0.65 0.16 220)' },
            { id: 'ctr-unique', data: data.ctrUnique, color: 'oklch(0.65 0.14 150)' },
          ]} />
        </div>

        <div className="home-card">
          <div className="home-card-head">
            <div>
              <div className="home-card-title">Ofertas por marketplace</div>
              <div className="home-card-sub">Total acumulado · {range}</div>
            </div>
          </div>
          <BarChart data={mpData} />
        </div>

        <div className="home-card">
          <div className="home-card-head">
            <div>
              <div className="home-card-title">Distribuição por categoria</div>
              <div className="home-card-sub">Ofertas aprovadas · {range}</div>
            </div>
          </div>
          <DonutChart data={catData} />
        </div>

        <div className="home-card home-card-wide">
          <div className="home-card-head">
            <div>
              <div className="home-card-title">Horários de pico de clique</div>
              <div className="home-card-sub">Mapa de calor por dia da semana e hora · {range}</div>
            </div>
          </div>
          <Heatmap data={data.heatmap}/>
        </div>
      </main>
    </div>
  );
}

window.HomeView = HomeView;
