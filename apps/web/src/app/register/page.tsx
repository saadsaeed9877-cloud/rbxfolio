'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signUpWithEmail } from '@/lib/auth-client';
import { apiFetch } from '@/lib/api';
import {
  AuthLayout,
  AuthCard,
  AuthInput,
  AuthButton,
  AuthLink,
} from '@/components/auth-layout';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
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

    setLoading(true);

    const result = await signUpWithEmail(email, password, name);
    if (result.error) {
      setError(result.error.message ?? 'Registration failed');
      setLoading(false);
      return;
    }

    try {
      await apiFetch('/users/me/profile', {
        method: 'PATCH',
        auth: true,
        body: JSON.stringify({
          displayName: name || email.split('@')[0],
        }),
      });
    } catch {
      // Profile auto-created on first API call if missing
    }

    router.push('/dashboard/profile');
    router.refresh();
  }

  return (
    <AuthLayout>
      <AuthCard
        title="Create your portfolio"
        subtitle="Join the Roblox creator community"
      >
        <form onSubmit={handleSubmit}>
          <AuthInput
            label="Display name"
            placeholder="Your name"
            value={name}
            onChange={setName}
            required
          />
          <AuthInput
            label="Email address"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={setEmail}
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
          <AuthInput
            label="Confirm password"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={setConfirmPassword}
            error={error}
            required
          />
          <AuthButton type="submit" loading={loading}>
            Create account
          </AuthButton>
        </form>
        <AuthLink
          text="Already have an account?"
          link="Sign in"
          href="/login"
        />
      </AuthCard>
    </AuthLayout>
  );
}
