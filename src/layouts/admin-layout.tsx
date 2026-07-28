import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import AdminSidebar from "@/components/admin/admin-sidebar";

export default function AdminLayout() {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <main>
          <div className="flex items-center gap-2 px-4 py-2 border-b">
            <SidebarTrigger className="-ml-1" />
            <span className="text-sm text-muted-foreground">Painel de Administração Global</span>
          </div>
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}