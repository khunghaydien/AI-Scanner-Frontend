'use client';
import { AuthGate } from '@/features/auth';
import { Layout } from '@/components/layout';
import { AppHeader } from '@/components/layout/app-header';
import { HomeFooter } from '@/components/layout/app-footer';
export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGate>
      <Layout>
        <Layout.Header>
          <AppHeader />
        </Layout.Header>
        <Layout.Main>
          {children}
        </Layout.Main>
        <Layout.Footer>
          <HomeFooter />
        </Layout.Footer>
      </Layout>
    </AuthGate>
  );
}
