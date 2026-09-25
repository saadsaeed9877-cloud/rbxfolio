'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import {
  AuthLayout,
  AuthCard,
  AuthInput,
  AuthButton,
  AuthLink,
} from '@/components/auth-layout';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (!token) {
      setError('Invalid or expired reset link');
      return;
    }

    setLoading(true);

    const result = await authClient.resetPassword({
      newPassword: password,
      token,
    });

    if (result.error) {
      setError(result.error.message ?? 'Reset failed');
      setLoading(false);
      return;
    }

    router.push('/login');
  }

  return (
    <AuthCard
      title="Set new password"
      subtitle="Create a strong password for your account"
    >
      <form onSubmit={handleSubmit}>
        <AuthInput
          label="New password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={setPassword}
          required
        />
        <AuthInput
          label="Confirm password"
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={setConfirmPassword}
          error={error}
          required
        />
        <AuthButton type="submit" loading={loading || !token}>
          Reset password
        </AuthButton>
      </form>
      <AuthLink text="Remember your password?" link="Sign in" href="/login" />
    </AuthCard>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthLayout>
      <Suspense fallback={<div className="text-center text-white/45">Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </AuthLayout>
  );
}
