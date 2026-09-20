# Security Policy

## Supported

- Latest `main` branch (in development).

## Reporting a vulnerability

Do **not** open a public issue. Open a **private** GitHub Security Advisory
(Repository → Security → Report a vulnerability) with reproduction steps.

## Security context

- Firebase Authentication + Firestore security rules deployed in `firestore.rules`.
- Firebase config is environment-driven (`VITE_FIREBASE_*`); never commit the real project keys.
- **Known limitation:** the parent-portal PIN check is currently client-side.
  It must move to a secure backend (Firebase Cloud Function / Callable) before production.
- Demo credentials (`admin@tkd.local / demo123`) are for local testing only.

## Responsible disclosure

Acknowledged within a few days. Findings welcome — this is learning code, and feedback improves it.