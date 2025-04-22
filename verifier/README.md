# Verifier
The authentication flow behaves similar to [BankID](https://www.bankid.com/).

## 🔐 Secure DID Auth Flow (Cross-Device via QR)

### 🧩 On Page Load (PC)

- 🔑 Server generates a **random session ID** (e.g., UUIDv4)
- 🗂 Stores session with `status = pending`
- 📦 Returns session ID to frontend (via template, JSON, or embedded JS)
- 📷 Frontend shows a QR code linking to:

  ```
  https://example.com/auth/receive?session=abc123
  ```

- 🔁 Frontend starts polling:

  ```http
  GET /auth/status?session=abc123
  ```

  every few seconds

---

### 📲 On Mobile Wallet

- Scans QR code and extracts `session=abc123`
- Creates and signs a **Verifiable Presentation (VP)** with:
  - `challenge = abc123` (or a nonce tied to session)
  - `domain = did:web:verifier.com` (or similar)
- Sends the VP to the verifier:

  ```http
  POST /auth/receive?session=abc123
  Content-Type: application/json

  {
    "vp": { ... }
  }
  ```

---

### 🧠 On Server – `/auth/receive`

- Verifies the VP:
  - Signature
  - Challenge matches session
  - Audience/domain matches verifier
- If valid:
  - Updates session: `status = authenticated`
  - Optionally stores user DID with session

---

### 🔁 On Server – `/auth/status`

- Validates session ID format (e.g., UUID)
- Always returns a generic response:

  ```json
  { "status": "pending" }
  ```

  or

  ```json
  { "status": "authenticated" }
  ```

- Never leak user data or session validity details
- Expires sessions after a short duration (e.g., 2–5 minutes)
- Applies rate limiting per IP (e.g., max 10 requests/minute)

---

### 🌐 On Frontend (Polling Response)

- If `status === "authenticated"`:
  - Set a session cookie or redirect to a logged-in page
- If `status === "pending"`:
  - Continue polling

---

### ✅ Security Summary

- Use **unguessable session IDs** (e.g., UUIDv4 or 128-bit random)
- Return **only generic status** from polling
- Enforce **short session expiration**
- Apply **IP-based rate limiting**
- **Set session cookie** only after verifying the VP


## Getting Started
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
