'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { userData, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !userData) {
      router.push('/login');
    } else if (!loading && allowedRoles && !allowedRoles.includes(userData?.role || '')) {
      router.push(`/${userData?.role}/dashboard`);
    }
  }, [userData, loading, router, allowedRoles]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!userData || (allowedRoles && !allowedRoles.includes(userData.role))) {
    return null;
  }

  return <>{children}</>;
} 