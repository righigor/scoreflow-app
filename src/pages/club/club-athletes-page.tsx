import { useState } from "react";
import { ModalityFilterCards } from "@/components/modality-filter-cards";
import SheetAddAthlete from "@/components/athletes/sheet-add-athlete";
import { useGetClubModalities } from "@/hooks/club/GET/use-get-club-modalities";
import { useGetAthletesByClubId } from "@/hooks/club/GET/use-get-athletes-by-club-id";
import AthletesList from "@/components/athletes/athletes-list";

export default function ClubAthletesPage() {
  const [selectedModalityId, setSelectedModalityId] = useState<string | null>(null);

  const { data: clubModalities, isPending: isPendingModalities } = useGetClubModalities();
  const { data: athletes, isPending: isPendingAthletes } = useGetAthletesByClubId();

  // 1. ADAPTADOR: Traduz o formato do Banco (modality_id) para o formato da UI (id)
  const formattedModalities = clubModalities?.map((mod) => ({
    id: mod.modality_id, // A mágica acontece aqui
    name: mod.name,
    image_url: null, // O clube não tem imagem customizada por modalidade ainda
  }));

  // 2. Lógica de UX: Se tiver só 1, já seleciona (agora usando o formato novo)
  const activeModalityId = 
    formattedModalities?.length === 1 
      ? formattedModalities[0].id 
      : selectedModalityId;

  // 3. Filtra os atletas no front (A lógica continua idêntica! O valor é a mesma string UUID)
  const filteredAthletes = activeModalityId
    ? athletes?.filter((a) => 
        a.athlete_modalities?.some((m) => m.modality_id === activeModalityId)
      ) || []
    : [];

  const selectedModalityName = clubModalities?.find(
    (m) => m.modality_id === activeModalityId
  )?.name;

  return (
    <div className="space-y-4 p-8">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-2xl">Meus Atletas</h2>
        {activeModalityId && (
          <SheetAddAthlete defaultModalityId={activeModalityId} />
        )}
      </div>

      {/* 4. O COMPONENTE REUTILIZÁVEL ENTRA AQUI */}
      <ModalityFilterCards
        modalities={formattedModalities || []}
        activeId={activeModalityId}
        onSelect={setSelectedModalityId}
      />

      {/* LISTAGEM DE ATLETAS */}
      {activeModalityId && (
        <AthletesList
          athletes={filteredAthletes}
          isLoading={isPendingAthletes || isPendingModalities}
          title={`Atletas - ${selectedModalityName || ""}`}
        />
      )}

      {/* STATES VAZIOS */}
      {clubModalities?.length === 0 && !isPendingModalities && (
        <p className="text-muted-foreground text-center py-10">
          Nenhuma modalidade cadastrada para o seu clube.
        </p>
      )}

      {formattedModalities && formattedModalities.length > 1 && !activeModalityId && (
        <p className="text-muted-foreground text-center py-10">
          Selecione uma modalidade acima para ver os atletas.
        </p>
      )}
    </div>
  );
}