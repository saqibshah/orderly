import Sidebar from '../components/Sidebar';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Dashboard',
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}
