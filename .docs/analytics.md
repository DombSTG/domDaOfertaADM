# Analytics — Dados Disponíveis no Banco

Este documento descreve a camada de coleta de dados de cliques e impressões do Dom da Oferta. Use-o para construir os gráficos e métricas do dashboard.

---

## Banco de Dados

**Provider:** Neon (serverless Postgres)
**Variável de conexão:** `DATABASE_URL`

---

## Tabelas de Analytics

### `offer_impressions`

Registra cada vez que um card de oferta foi visto no viewport do usuário (IntersectionObserver, threshold 10%).

| Coluna       | Tipo             | Notas                                      |
|--------------|------------------|--------------------------------------------|
| `id`         | `uuid`           | PK, gerado automaticamente                 |
| `offer_id`   | `uuid` (nullable)| FK → `offers.id`. `NULL` se oferta deletada |
| `session_id` | `varchar(36)`    | UUID v4 da sessão do visitante             |
| `created_at` | `timestamp`      | Momento da impressão (UTC)                 |

**Comportamento:**
- Uma impressão é registrada apenas quando o card entra fisicamente na tela — não no carregamento da página.
- Um mesmo `(offer_id, session_id)` pode aparecer múltiplas vezes se o usuário acessar o site em sessões diferentes (cada sessão dura 30 min rolling).
- Se a oferta for deletada, `offer_id` vira `NULL` mas a linha é preservada.

---

### `click_events`

Registra cada clique em um card de oferta.

| Coluna       | Tipo             | Notas                                      |
|--------------|------------------|--------------------------------------------|
| `id`         | `uuid`           | PK, gerado automaticamente                 |
| `offer_id`   | `uuid` (nullable)| FK → `offers.id`. `NULL` se oferta deletada |
| `session_id` | `varchar(36)`    | UUID v4 da sessão do visitante             |
| `created_at` | `timestamp`      | Momento do clique (UTC)                    |

**Comportamento:**
- Só registra cliques em ofertas com `status = 'approved'` (validado pela API).
- Um mesmo usuário pode clicar múltiplas vezes — deduplicação por `session_id` é feita na query.

---

## Sessões (`session_id`)

A sessão é gerenciada por um cookie `dom-session` (UUID v4) criado/renovado pelo middleware do Next.js em cada request.

| Atributo  | Valor                        |
|-----------|------------------------------|
| Nome      | `dom-session`                |
| Duração   | 30 minutos (rolling)         |
| HttpOnly  | `false` (lido pelo JS)       |
| SameSite  | `lax`                        |
| Secure    | `true` em produção           |

Cada `session_id` representa uma janela de atividade de 30 min de um visitante único (aproximação).

---

## Métricas e Queries Sugeridas

### Cliques Totais

```sql
SELECT COUNT(*) AS total_clicks
FROM click_events;
```

### Cliques Únicos (por sessão)

```sql
SELECT COUNT(DISTINCT session_id) AS unique_clicks
FROM click_events;
```

### Impressões Totais

```sql
SELECT COUNT(*) AS total_impressions
FROM offer_impressions;
```

### Sessões que Viram pelo Menos 1 Oferta

```sql
SELECT COUNT(DISTINCT session_id) AS total_sessions
FROM offer_impressions;
```

### CTR Global

```
CTR Global = total_clicks / total_impressions
```

```sql
SELECT
  COUNT(ce.id)::float / NULLIF(COUNT(oi.id), 0) AS ctr_global
FROM offer_impressions oi
LEFT JOIN click_events ce ON true;
```

Ou mais direto:

```sql
SELECT
  (SELECT COUNT(*) FROM click_events)::float /
  NULLIF((SELECT COUNT(*) FROM offer_impressions), 0) AS ctr_global;
```

### CTR Único (por sessão)

```
CTR Único = sessões que clicaram / sessões que tiveram impressões
```

```sql
SELECT
  (SELECT COUNT(DISTINCT session_id) FROM click_events)::float /
  NULLIF((SELECT COUNT(DISTINCT session_id) FROM offer_impressions), 0) AS ctr_unico;
```

### Cliques ao Longo do Tempo (agrupado por dia)

```sql
SELECT
  DATE_TRUNC('day', created_at) AS dia,
  COUNT(*) AS total_clicks,
  COUNT(DISTINCT session_id) AS unique_clicks
FROM click_events
GROUP BY 1
ORDER BY 1;
```

### CTR ao Longo do Tempo (por dia)

```sql
WITH daily_clicks AS (
  SELECT DATE_TRUNC('day', created_at) AS dia, COUNT(*) AS clicks
  FROM click_events GROUP BY 1
),
daily_impressions AS (
  SELECT DATE_TRUNC('day', created_at) AS dia, COUNT(*) AS impressions
  FROM offer_impressions GROUP BY 1
)
SELECT
  COALESCE(c.dia, i.dia) AS dia,
  COALESCE(c.clicks, 0) AS clicks,
  COALESCE(i.impressions, 0) AS impressions,
  COALESCE(c.clicks, 0)::float / NULLIF(COALESCE(i.impressions, 0), 0) AS ctr
FROM daily_clicks c
FULL OUTER JOIN daily_impressions i ON c.dia = i.dia
ORDER BY 1;
```

### Top Ofertas por Cliques

```sql
SELECT
  ce.offer_id,
  o.title,
  o.store,
  COUNT(*) AS total_clicks,
  COUNT(DISTINCT ce.session_id) AS unique_clicks
FROM click_events ce
LEFT JOIN offers o ON o.id = ce.offer_id
WHERE ce.offer_id IS NOT NULL
GROUP BY ce.offer_id, o.title, o.store
ORDER BY total_clicks DESC
LIMIT 20;
```

### CTR por Oferta

```sql
SELECT
  oi.offer_id,
  o.title,
  COUNT(DISTINCT oi.session_id) AS sessions_impressed,
  COUNT(DISTINCT ce.session_id) AS sessions_clicked,
  COUNT(DISTINCT ce.session_id)::float / NULLIF(COUNT(DISTINCT oi.session_id), 0) AS ctr_unico
FROM offer_impressions oi
LEFT JOIN click_events ce ON ce.offer_id = oi.offer_id AND ce.session_id = oi.session_id
LEFT JOIN offers o ON o.id = oi.offer_id
WHERE oi.offer_id IS NOT NULL
GROUP BY oi.offer_id, o.title
ORDER BY ctr_unico DESC;
```

---

## Observações para o Dashboard

- **Fuso horário:** `created_at` está em UTC. Converta para `America/Sao_Paulo` nas queries ou no frontend se necessário (`AT TIME ZONE 'America/Sao_Paulo'`).
- **Filtragem de bots:** A camada de coleta já rejeita User-Agents de bots conhecidos e valida origin. Os dados no banco são de usuários reais.
- **Dados históricos:** Rows com `offer_id = NULL` representam ofertas deletadas — incluí-los ou não nas métricas globais depende da intenção (geralmente incluir para não subnotificar).
- **Granularidade de sessão:** Uma sessão ≈ 30 min de atividade contínua. Não é equivalente a "visitante único por dia" — um mesmo usuário pode gerar múltiplas sessões.
