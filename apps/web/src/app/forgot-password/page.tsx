'use client';

import { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import {
  AuthLayout,
  AuthCard,
  AuthInput,
  AuthButton,
  AuthLink,
} from '@/components/auth-layout';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/auth/forget-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        redirectTo: `${window.location.origin}/reset-password`,
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.message ?? 'Failed to send reset email');
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  }

  return (
    <AuthLayout>
      <AuthCard
        title={sent ? 'Check your email' : 'Reset password'}
        subtitle={
          sent
            ? 'We sent a password reset link to your email'
            : "Enter your email and we'll send you a reset link"
        }
      >
        {sent ? (
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-[#b7ff3c]/10 p-3">
                <CheckCircle size={32} className="text-[#b7ff3c]" />
              </div>
            </div>
            <p className="mb-6 text-sm text-white/65">
              If an account exists for <strong>{email}</strong>, a password reset link has been sent to your email.
            </p>
            <AuthLink
              text="Didn't receive it?"
              link="Resend"
              href="/forgot-password"
            />
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <AuthInput
              label="Email address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={setEmail}
              error={error}
              required
            />
            <AuthButton type="submit" loading={loading}>
              Send reset link
            </AuthButton>
            <AuthLink
              text="Remember your password?"
              link="Sign in"
              href="/login"
            />
          </form>
        )}
      </AuthCard>
    </AuthLayout>
  );
}
