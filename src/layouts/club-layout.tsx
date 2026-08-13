import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Loader2, Clock } from "lucide-react";
import { useGetMyClub } from "@/hooks/club/GET/use-get-my-club";
import { AppImage } from "@/components/app-image";
import ClubSidebar from "@/components/sidebar/club/club-sidebar";

export default function ClubLayout() {
  const { data: club, isPending, error } = useGetMyClub();

  if (isPending) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin size-8 text-muted-foreground" />
      </div>
    );
  }

  if (!club || error) return null;

  // BARRIEIRA DE APROVAÇÃO
  if (club.status === 'PENDING') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4 bg-zinc-50 dark:bg-zinc-950">
        <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-4 border-zinc-200 bg-white">
          <AppImage src={club.image_url} alt={club.name} fallbackSrc="/fallbacks/apparatus.webp" className="h-full w-full object-cover" />
        </div>
        <h1 className="text-2xl font-bold">{club.name}</h1>
        <div className="flex items-center gap-2 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-yellow-800 dark:bg-yellow-950 dark:border-yellow-800 dark:text-yellow-200">
          <Clock className="h-5 w-5" />
          <div>
            <p className="font-medium">Cadastro em Análise</p>
            <p className="text-sm">Sua conta foi criada com sucesso! Agora você deve aguardar a Federação aprovar seu cadastro para liberar o acesso total ao sistema.</p>
          </div>
        </div>
      </div>
    );
  }

  // LAYOUT NORMAL (QUANDO ATIVO)
  return (
    <SidebarProvider>
      <ClubSidebar club={club} />
      <SidebarInset>
        <main>
          <div className="flex items-center gap-2 px-4 py-2 border-b">
            <SidebarTrigger className="-ml-1" />
            <span className="text-sm text-muted-foreground">Painel do Clube</span>
          </div>
          <Outlet context={{ club }} />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}