import { useState } from "react";
import { AppImage } from "@/components/app-image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { AlertTriangle, CheckCircle, XCircle, Link2 } from "lucide-react";
import { useGenerateInvite } from "@/hooks/federacao/use-generate-invite";
import { useGetPendingClubs } from "@/hooks/federacao/GET/use-get-pending-clubs";
import { useGetActiveClubs } from "@/hooks/federacao/GET/use-get-active-clubs";
import { useUpdateClubStatus } from "@/hooks/federacao/PUT/use-update-club-status";
import { useGetModalities } from "@/hooks/admin/GET/use-get-modalities";

export default function FederacaoEquipesPage() {
  const { mutate: generateInvite, isPending: isGenerating } = useGenerateInvite();
  const { data: pendingClubs, isPending: isLoadingPending } = useGetPendingClubs();
  const { data: activeClubs, isPending: isLoadingActive } = useGetActiveClubs();
  const { mutate: updateStatus } = useUpdateClubStatus();
  const { data: modalities } = useGetModalities();
  const [openPending, setOpenPending] = useState(false);

  // Agrupa clubes ativos por modalidade
  const clubsByModality = modalities?.map((mod) => ({
    ...mod,
    clubs: activeClubs?.filter(c => c.club_modalities.some(cm => cm.modality_id === mod.id)) || []
  }));

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Equipes Filiadas</h2>
          <p className="text-sm text-muted-foreground">Gerencie os clubes e convites.</p>
        </div>
        <Button onClick={() => generateInvite()} disabled={isGenerating} className="cursor-pointer">
          <Link2 className="h-4 w-4 mr-2" />
          {isGenerating ? "Gerando..." : "Gerar Link de Inscrição"}
        </Button>
      </div>

      {pendingClubs && pendingClubs.length > 0 && (
        <Card className="border-yellow-300 bg-yellow-800">
          <CardContent className="p-4">
            <Sheet open={openPending} onOpenChange={setOpenPending}>
              <SheetTrigger>
                <button className="flex items-center gap-3 w-full text-left">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="font-semibold text-yellow-200">
                      {pendingClubs.length} clube(s) aguardando aprovação
                    </p>
                    <p className="text-xs text-yellow-300">
                      Clique aqui para analisar e aprovar/rejeitar.
                    </p>
                  </div>
                </button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-lg">
                <SheetHeader>
                  <SheetTitle>Clubes Pendentes</SheetTitle>
                </SheetHeader>
                <div className="space-y-4 px-4 pb-4 max-h-[70vh] overflow-y-auto">
                  {isLoadingPending && <p className="text-sm text-muted-foreground">Carregando...</p>}
                  {pendingClubs.map((club) => (
                    <Card key={club.id}>
                      <CardContent className="flex items-center gap-4 p-4">
                        <AppImage src={club.image_url} fallbackSrc="/fallbacks/apparatus.webp" className="h-10 w-10 rounded-full" />
                        <div className="flex-1">
                          <p className="font-medium">{club.name}</p>
                          <p className="text-xs text-muted-foreground">{club.email}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="text-green-600 border-green-300 hover:bg-green-50 cursor-pointer"
                            onClick={() => updateStatus({ clubId: club.id, newStatus: 'ACTIVE' })}>
                            <CheckCircle className="h-4 w-4 mr-1" /> Aceitar
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600 border-red-300 hover:bg-red-50 cursor-pointer"
                            onClick={() => updateStatus({ clubId: club.id, newStatus: 'INACTIVE' })}>
                            <XCircle className="h-4 w-4 mr-1" /> Rejeitar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </CardContent>
        </Card>
      )}

      {/* Cards por Modalidade */}
      {isLoadingActive ? (
        <p className="text-sm text-muted-foreground">Carregando clubes ativos...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clubsByModality?.map((mod) => (
            <Card key={mod.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{mod.name}</CardTitle>
              </CardHeader>
              <CardContent>
                {mod.clubs.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">Nenhum clube nesta modalidade.</p>
                ) : (
                  <div className="space-y-2">
                    {mod.clubs.map((club) => (
                      <div key={club.id} className="flex items-center gap-3 p-2 rounded-md border">
                        <AppImage src={club.image_url} fallbackSrc="/fallbacks/apparatus.webp" className="h-8 w-8 rounded-md" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{club.short_name}</p>
                          <p className="text-xs text-muted-foreground truncate">{club.sigla}</p>
                        </div>
                        <Badge variant="secondary" className="text-xs shrink-0">Ativo</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}