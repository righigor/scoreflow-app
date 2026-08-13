import { Outlet } from "react-router-dom";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import ArbitroSidebar from "@/components/sidebar/arbitro/arbitro-sidebar";

export default function ArbitroLayout() {
  return (
    <SidebarProvider>
      <ArbitroSidebar />
      <SidebarInset>
        <main>
          <div className="flex items-center gap-2 px-4 py-2 border-b">
            <SidebarTrigger className="-ml-1" />
          </div>
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
