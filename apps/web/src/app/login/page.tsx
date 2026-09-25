'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmail } from '@/lib/auth-client';
import {
  AuthLayout,
  AuthCard,
  AuthInput,
  AuthButton,
  AuthLink,
} from '@/components/auth-layout';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await signInWithEmail(email, password);
    if (result.error) {
      setError(result.error.message ?? 'Login failed');
      setLoading(false);
      return;
    }

    router.push('/dashboard');
    router.refresh();
  }

  return (
    <AuthLayout>
      <AuthCard
        title="Welcome back"
        subtitle="Sign in to your RbxFolio portfolio"
      >
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
          <AuthInput
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={setPassword}
            required
          />
          <AuthButton type="submit" loading={loading}>
            Sign in
          </AuthButton>
        </form>
        <div className="mt-6 flex flex-col gap-3 text-xs">
          <AuthLink
            text="Forgot your password?"
            link="Reset it"
            href="/forgot-password"
          />
          <AuthLink
            text="Don't have an account?"
            link="Create one"
            href="/register"
          />
        </div>
      </AuthCard>
    </AuthLayout>
  );
}
