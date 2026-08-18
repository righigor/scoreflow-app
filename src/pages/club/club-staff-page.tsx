import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import StaffList from "@/components/staff/staff-list";
import { useGetClubModalities } from "@/hooks/club/GET/use-get-club-modalities";
import { useGetStaffByClubId } from "@/hooks/staff/GET/use-get-staff-by-club-id";
import SheetAddStaff from "@/components/staff/sheet-add-staff";


export default function ClubStaffPage() {
  const [selectedModalityId, setSelectedModalityId] = useState<string | null>(null);

  const { data: clubModalities, isPending: isPendingModalities } = useGetClubModalities();
  const { data: staff, isPending: isPendingStaff } = useGetStaffByClubId();

  const activeModalityId = clubModalities?.length === 1 ? clubModalities[0].modality_id : selectedModalityId;

  const filteredStaff = activeModalityId
    ? staff?.filter((s) => s.staff_modalities?.some((m) => m.modality_id === activeModalityId)) || []
    : [];

  const selectedModalityName = clubModalities?.find((m) => m.modality_id === activeModalityId)?.name;

  return (
    <div className="space-y-4 p-8">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-2xl">Comissão Técnica</h2>
        {activeModalityId && <SheetAddStaff defaultModalityId={activeModalityId} />}
      </div>

      {clubModalities && clubModalities.length > 1 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {clubModalities.map((mod) => (
            <Card key={mod.modality_id} className={`cursor-pointer transition-all hover:border-primary ${activeModalityId === mod.modality_id ? "border-primary bg-muted/50" : ""}`} onClick={() => setSelectedModalityId(mod.modality_id)}>
              <CardContent className="p-6 flex items-center justify-center h-24">
                <span className="font-semibold text-lg">{mod.name}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeModalityId && (
        <StaffList staff={filteredStaff} isLoading={isPendingStaff || isPendingModalities} title={`Comissão - ${selectedModalityName || ""}`} />
      )}

      {clubModalities?.length === 0 && !isPendingModalities && (
        <p className="text-muted-foreground text-center py-10">Nenhuma modalidade cadastrada para o seu clube.</p>
      )}
      {clubModalities && clubModalities.length > 1 && !activeModalityId && (
        <p className="text-muted-foreground text-center py-10">Selecione uma modalidade acima para ver a comissão.</p>
      )}
    </div>
  );
}