'use client';
import { AuthGate } from '@/features/auth';
import { AppHeader } from '@/components/app-header';
import { HomeFooter } from '@/features/home/home-footer';
import { usePathname } from 'next/navigation';
export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const footer = {
    '/': <HomeFooter />,
    "/document": <HomeFooter />,
    "/tool": <HomeFooter />,
    "/me": <HomeFooter />,
  }
  return (
    <AuthGate>
      <div className="relative bg-background flex flex-col h-screen">
        <AppHeader />
        <main className="flex-1 overflow-y-auto h-[calc(100vh-112px)] my-16 space-y-4">
          {children}
        </main>
        <footer className="flex-shrink-0">
          {footer[pathname as keyof typeof footer]}
        </footer>
      </div>
    </AuthGate>
  );
}
