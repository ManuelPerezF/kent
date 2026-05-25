import type { ReactNode } from "react";

import Sidebar from "@/shared/layout/sidebar";

type AppShellProps = {
  children: ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="app-shell flex min-h-screen">
      <Sidebar />
      <main className="flex min-h-screen flex-1 flex-col">{children}</main>
    </div>
  );
}
