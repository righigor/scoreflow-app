// src/pages/federacao/federacao-equipes-page.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link2 } from "lucide-react";
import { useGenerateInvite } from "@/hooks/federacao/use-generate-invite";
import { useGetPendingClubs } from "@/hooks/federacao/GET/use-get-pending-clubs";
import { useGetFederationClubs } from "@/hooks/federacao/GET/use-get-federation-clubs";
import { useUpdateClubStatus } from "@/hooks/federacao/PUT/use-update-club-status";
import { useGetModalities } from "@/hooks/modality/GET/use-get-modalities";
import { ModalityFilterCards } from "@/components/modality-filter-cards";
import { PendingClubsAlert } from "@/components/clubs/pending-clubs-alert";
import { ClubTable } from "@/components/clubs/club-table";

export default function FederacaoEquipesPage() {
  const { mutate: generateInvite, isPending: isGenerating } =
    useGenerateInvite();
  const { data: pendingClubs, isPending: isLoadingPending } =
    useGetPendingClubs();
  const { data: allClubs, isPending: isLoadingClubs } =
    useGetFederationClubs();
  const { mutate: updateStatus } = useUpdateClubStatus();
  const { data: modalities } = useGetModalities();

  const [selectedModalityId, setSelectedModalityId] = useState<string | null>(
    null
  );

  const activeModalityId =
    modalities?.length === 1 ? modalities[0].id : selectedModalityId;

  const selectedModality = modalities?.find((m) => m.id === activeModalityId);

  const clubsOfModality = activeModalityId
    ? allClubs?.filter((c) =>
        c.club_modalities.some((cm) => cm.modality_id === activeModalityId)
      ) || []
    : [];

  const activeClubsList = clubsOfModality.filter(
    (c) => c.status === "ACTIVE"
  );
  const inactiveClubsList = clubsOfModality.filter(
    (c) => c.status === "INACTIVE"
  );

  const handleToggleStatus = (
    clubId: string,
    newStatus: "ACTIVE" | "INACTIVE"
  ) => {
    updateStatus({ clubId, newStatus });
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Equipes Filiadas
          </h2>
          <p className="text-sm text-muted-foreground">
            Gerencie os clubes e convites.
          </p>
        </div>
        <Button
          onClick={() => generateInvite()}
          disabled={isGenerating}
          className="cursor-pointer"
        >
          <Link2 className="h-4 w-4 mr-2" />
          {isGenerating ? "Gerando..." : "Gerar Link de Inscrição"}
        </Button>
      </div>

      <PendingClubsAlert
        clubs={pendingClubs ?? []}
        isLoading={isLoadingPending}
        onApprove={(clubId) =>
          updateStatus({ clubId, newStatus: "ACTIVE" })
        }
        onReject={(clubId) =>
          updateStatus({ clubId, newStatus: "INACTIVE" })
        }
      />

      <ModalityFilterCards
        modalities={modalities ?? []}
        activeId={activeModalityId}
        onSelect={setSelectedModalityId}
        showImage
      />

      {activeModalityId ? (
        <div className="space-y-6">
          <ClubTable
            clubs={activeClubsList}
            isLoading={isLoadingClubs}
            title={`Clubes Ativos — ${selectedModality?.name ?? ""}`}
            emptyMessage="Nenhum clube ativo nesta modalidade."
            status="ACTIVE"
            onToggleStatus={handleToggleStatus}
          />

          <ClubTable
            clubs={inactiveClubsList}
            isLoading={isLoadingClubs}
            title={`Clubes Inativos — ${selectedModality?.name ?? ""}`}
            emptyMessage="Nenhum clube inativo nesta modalidade."
            status="INACTIVE"
            onToggleStatus={handleToggleStatus}
          />
        </div>
      ) : (
        <p className="text-sm text-muted-foreground text-center py-8">
          Selecione uma modalidade para ver os clubes.
        </p>
      )}
    </div>
  );
}