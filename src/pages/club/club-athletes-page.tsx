import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import SheetAddAthlete from "@/components/athletes/sheet-add-athlete";
import { useGetClubModalities } from "@/hooks/club/GET/use-get-club-modalities";
import { useGetAthletesByClubId } from "@/hooks/club/GET/use-get-athletes-by-club-id";
import AthletesList from "@/components/athletes/athletes-list";

export default function ClubAthletesPage() {
  const [selectedModalityId, setSelectedModalityId] = useState<string | null>(null);

  // Hooks de busca (vamos criá-los daqui a pouco)
  const { data: clubModalities, isPending: isPendingModalities } = useGetClubModalities();
  const { data: athletes, isPending: isPendingAthletes } = useGetAthletesByClubId();

  // Lógica de UX: Se tiver só 1 modalidade, já seleciona ela direto. Se tiver mais, usa o estado do clique.
  const activeModalityId = 
    clubModalities?.length === 1 
      ? clubModalities[0].modality_id 
      : selectedModalityId;

  // Filtra os atletas no front (exatamente o mesmo padrão que você usou no árbitro)
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
        {/* Só habilita o botão de adicionar se uma modalidade estiver selecionada */}
        {activeModalityId && (
          <SheetAddAthlete defaultModalityId={activeModalityId} />
        )}
      </div>

      {/* CARDS DE MODALIDADES (Aparece apenas se o clube tiver mais de 1) */}
      {clubModalities && clubModalities.length > 1 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {clubModalities.map((mod) => (
            <Card
              key={mod.modality_id}
              className={`cursor-pointer transition-all hover:border-primary ${
                activeModalityId === mod.modality_id
                  ? "border-primary bg-muted/50"
                  : ""
              }`}
              onClick={() => setSelectedModalityId(mod.modality_id)}
            >
              <CardContent className="p-6 flex items-center justify-center h-24">
                <span className="font-semibold text-lg">{mod.name}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* LISTAGEM DE ATLETES */}
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

      {clubModalities && clubModalities.length > 1 && !activeModalityId && (
        <p className="text-muted-foreground text-center py-10">
          Selecione uma modalidade acima para ver os atletas.
        </p>
      )}
    </div>
  );
}