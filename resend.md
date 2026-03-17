# Resend Setup Guide (Pensar)

This document explains everything needed to enable real OTP email delivery in production once your domain is ready.

## Current Status

The codebase already supports OTP for:

- Sign up email verification
- Forgot-password / password reset

Both are currently controlled by feature flags and can stay disabled until domain/email is configured.

## Feature Flags

Set these variables in your environment:

- `NEXT_PUBLIC_AUTH_SIGNUP_OTP_ENABLED=false`
- `NEXT_PUBLIC_AUTH_PASSWORD_RESET_OTP_ENABLED=false`
- `AUTH_EMAIL_DELIVERY_ENABLED=true`

Behavior:

- `NEXT_PUBLIC_AUTH_SIGNUP_OTP_ENABLED=true`: requires OTP verification after sign up.
- `NEXT_PUBLIC_AUTH_PASSWORD_RESET_OTP_ENABLED=true`: enables OTP for forgot-password.
- `AUTH_EMAIL_DELIVERY_ENABLED=false`: disables real email sending and logs OTP on server for local testing.

## Resend Account Checklist

1. Create or log into your Resend account.
2. Add and verify your sending domain in Resend.
3. Configure DNS records in your domain provider exactly as Resend requests:
   - SPF
   - DKIM
   - (optional but recommended) DMARC
4. Wait until domain status is verified in Resend dashboard.
5. Create an API key with sending permissions.

## Sender Address

Current code uses:

- `Pensar <onboarding@resend.dev>`

When your domain is verified, update sender to your domain identity in:

- `apps/web/src/lib/auth.ts`

Recommended format:

- `Pensar <no-reply@yourdomain.com>`

## Environment Variables (Production)

In your hosting provider (for example Vercel), set:

- `RESEND_API_KEY=...`
- `BETTER_AUTH_URL=https://yourdomain.com`
- `NEXT_PUBLIC_BETTER_AUTH_URL=https://yourdomain.com`
- `NEXT_PUBLIC_AUTH_SIGNUP_OTP_ENABLED=true`
- `NEXT_PUBLIC_AUTH_PASSWORD_RESET_OTP_ENABLED=true`
- `AUTH_EMAIL_DELIVERY_ENABLED=true`

If you want to roll out gradually:

1. Enable only password reset first.
2. Validate deliverability and UX.
3. Enable sign-up OTP.

## Local Testing Modes

### Mode A: Full local testing without sending real emails

Use:

- `AUTH_EMAIL_DELIVERY_ENABLED=false`
- OTP feature flags can be true

Result:

- OTP is generated but printed in server logs.
- Useful before domain is ready.

### Mode B: Real email testing

Use:

- `AUTH_EMAIL_DELIVERY_ENABLED=true`
- valid `RESEND_API_KEY`

Result:

- Emails are sent through Resend.

## Activation Steps When Domain Is Ready

1. Verify domain in Resend and set DNS records.
2. Put production sender email in `apps/web/src/lib/auth.ts`.
3. Set production env vars listed above.
4. Deploy.
5. Validate end-to-end:
   - sign up creates account and requires OTP
   - OTP verification enables login
   - forgot-password sends OTP and resets password

## Recommended Post-Activation Checks

- Check spam folder placement.
- Check OTP expiry behavior (10 minutes).
- Check resend cooldown behavior in UI.
- Confirm login blocks unverified users when sign-up OTP is enabled.
- Confirm logs do not expose OTP in production (`AUTH_EMAIL_DELIVERY_ENABLED` must be `true`).

## Security Notes

- Keep `RESEND_API_KEY` server-side only.
- Do not expose service keys in client code.
- Keep OTP feature flags explicit per environment.
- Avoid enabling OTP in production until sender domain is verified.
