## Plan: Envio para Múltiplos Grupos do Telegram

Permitir o envio simultâneo de mensagens para múltiplos grupos na mesma função, lendo uma variável de ambiente com IDs separados por vírgula e utilizando `Promise.all` para maximizar a velocidade de envio das requisições.

**Steps**
1. Atualizar a variável de ambiente no arquivo `.env` para usar vírgulas como delimitador de múltiplos IDs.
2. Modificar a função principal no serviço do Telegram para separar o valor lido do ambiente em um array de IDs.
3. Extrair a lógica de envio (payload e fetch da API do Telegram) para processar as requisições em paralelo interando pelo array gerado, usando o `Promise.all`.

**Relevant files**
- `.env` — Adicionar ou atualizar a chave `TELEGRAM_CHAT_ID` agrupando os IDs desejados.
- `lib/telegram.ts` — Alterar a validação e processamento de `process.env.TELEGRAM_CHAT_ID` dividindo-o com `.split(',')` e englobar o envio (`fetch`) em múltiplas chamadas concorrentes.

**Verification**
1. Inserir mais de um ID válido de grupo do Telegram no arquivo `.env`.
2. Forçar/acionar o envio de uma oferta.
3. Verificar se a mensagem chegou quase instantaneamente nos dois/múltiplos grupos.
4. Checar os logs (console) garantindo que falhas em apenas um grupo (como um ID incorreto ou bloqueado) não abortem as requisições enviadas para os demais.

**Decisions**
- O uso de `Promise.all` garante a opção mais "rápida" visando disparo paralelo, reduzindo o tempo de espera total da operação de rede.
- Manter a mesma chave de ambiente `TELEGRAM_CHAT_ID` apenas alterando seu valor e lógica de interpretação simplifica a migração e implantação no servidor (Vercel ou similar).