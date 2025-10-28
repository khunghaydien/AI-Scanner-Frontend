import { AuthGate } from '@/features/auth';

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  return <AuthGate>{children}</AuthGate>;
}
