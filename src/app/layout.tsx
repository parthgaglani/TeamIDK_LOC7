import './globals.css';
import { Press_Start_2P } from 'next/font/google';
import { AuthProvider } from '@/lib/AuthContext';
import Navigation from '@/app/components/Navigation';
import type { Metadata } from 'next';

const pressStart2P = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ExpenseAI - Retro Gaming Edition',
  description: 'AI-powered expense management with a retro gaming twist',
  keywords: 'expense management, AI, automation, retro gaming, cyberpunk',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={pressStart2P.className}>
        <AuthProvider>
          <div className="min-h-screen bg-grid-animation">
            <Navigation>{children}</Navigation>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
} 