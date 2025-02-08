'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';

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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!userData || (allowedRoles && !allowedRoles.includes(userData.role))) {
    return null;
  }

  return <>{children}</>;
} 