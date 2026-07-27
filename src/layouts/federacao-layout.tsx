import { Outlet } from "react-router-dom";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Loader2 } from "lucide-react";
import { useGetFederacaoProfile } from "@/hooks/federacao/use-get-federacao-profile";
import FederacaoSidebar from "@/components/sidebar/federacao/federacao-sidebar";

export default function FederacaoLayout() {
  const { data: federation, isPending, error } = useGetFederacaoProfile();

  if (isPending) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin size-8 text-muted-foreground" />
      </div>
    );
  }

  if (!federation) return null;

  return (
    <SidebarProvider>
      <FederacaoSidebar federation={federation} isPending={isPending} />
      
      <SidebarInset>
        <main>
          <div className="flex items-center gap-2 px-4 py-2 border-b">
            <SidebarTrigger className="-ml-1" />
          </div>
          <Outlet context={{ federacao: federation, isPending, error }} />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}