# Jaguar Markets

This repository contains the React trading dashboard and a server-side payment adapter for Uganda MTN MoMo and Airtel Money collections.

## Mobile money setup

The frontend must not call either provider directly. Start the payment API separately and configure credentials through environment variables:

```bash
cp .env.example .env
npm run payment-api
```

The adapter defaults to sandbox mode. Set `PAYMENT_ENV=production` only after the merchant accounts are approved and production credentials are configured. Never commit `.env` or provider secrets.

The collection endpoint is `POST /api/payments/collect` with JSON containing `provider` (`mtn` or `airtel`), `amount`, `currency`, and `phone`. The API returns `pending_customer_confirmation`; the customer must approve the prompt in their mobile-money wallet before funds are treated as settled.

This is an integration foundation, not a complete regulated financial service. Production launch still requires verified webhooks, persistent transaction records, authentication, KYC/AML controls, reconciliation, refund handling, and legal approval.

## Frontend development

Run the dashboard with:

```bash
npm run dev
```

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
