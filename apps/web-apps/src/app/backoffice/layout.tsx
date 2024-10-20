import { SidebarProvider, SidebarTrigger } from '@/shared/components/base';

import { AppSidebar } from './app-sidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full space-y-6 p-4">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
