# Go Details (Next.js)

Réplica em **Next.js** da landing [go-details.com](https://go-details.com), com imagens do CDN Webflow, quizzes de agendamento, tema claro/escuro e inbox demo para atendimento.

## Deploy na Vercel

1. Importe o repositório [github.com/brunomelod/go-details](https://github.com/brunomelod/go-details).
2. **Framework Preset:** Next.js (detectado automaticamente).
3. **Build Command:** `npm run build` (padrão).
4. **Output:** padrão do Next.js App Router.
5. **Variáveis de ambiente** (opcional, em *Project → Settings → Environment Variables*):

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `NEXT_PUBLIC_GHL_CHAT` | Não | `true` para widget GoHighLevel; omita ou `false` para chat próprio → fila `/dashboard`. |
| `NEXT_PUBLIC_GHL_WIDGET_ID` | Só com GHL | ID do widget (ver `.env.example`). |

Não commite `.env.local`. Use `.env.example` como referência.

## Demo admin (local ou preview)

- [/login](/login) — usuário `Admin`, senha `123` (`sessionStorage`)
- [/dashboard](/dashboard) — inbox demo (chat, formulário, quizzes)

## Quizzes

- `/quiz-intro` — escolha do serviço
- `/quiz-auto-detailing`, `/quiz-property-cleaning`, `/quiz-commercial-cleaning`, `/quiz-bundles`

## Desenvolvimento

```bash
npm install
cp .env.example .env.local   # opcional
npm run dev
```

```bash
npm run build
npm start
```
