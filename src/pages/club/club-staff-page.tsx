import { useState } from "react";
import { ModalityFilterCards } from "@/components/modality-filter-cards";
import SheetAddStaff from "@/components/staff/sheet-add-staff";
import { useGetClubModalities } from "@/hooks/club/GET/use-get-club-modalities";
import { useGetStaffByClubId } from "@/hooks/staff/GET/use-get-staff-by-club-id";
import StaffList from "@/components/staff/staff-list";

export default function ClubStaffPage() {
  const [selectedModalityId, setSelectedModalityId] = useState<string | null>(
    null,
  );

  const { data: clubModalities, isPending: isPendingModalities } =
    useGetClubModalities();
  const { data: staff, isPending: isPendingStaff } = useGetStaffByClubId();

  const formattedModalities = clubModalities?.map((mod) => ({
    id: mod.modality_id,
    name: mod.name,
    image_url: null,
  }));

  const activeModalityId =
    formattedModalities?.length === 1
      ? formattedModalities[0].id
      : selectedModalityId;

  const filteredStaff = activeModalityId
    ? staff?.filter((s) =>
        s.staff_modalities?.some((m) => m.modality_id === activeModalityId),
      ) || []
    : [];

  const selectedModalityName = clubModalities?.find(
    (m) => m.modality_id === activeModalityId,
  )?.name;

  return (
    <div className="space-y-4 p-8">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-2xl">Comissão Técnica</h2>
        {activeModalityId && (
          <SheetAddStaff defaultModalityId={activeModalityId} />
        )}
      </div>

      <ModalityFilterCards
        modalities={formattedModalities || []}
        activeId={activeModalityId}
        onSelect={setSelectedModalityId}
      />

      {activeModalityId && (
        <StaffList
          staff={filteredStaff}
          isLoading={isPendingStaff || isPendingModalities}
          title={`Comissão - ${selectedModalityName || ""}`}
        />
      )}

      {clubModalities?.length === 0 && !isPendingModalities && (
        <p className="text-muted-foreground text-center py-10">
          Nenhuma modalidade cadastrada para o seu clube.
        </p>
      )}

      {formattedModalities &&
        formattedModalities.length > 1 &&
        !activeModalityId && (
          <p className="text-muted-foreground text-center py-10">
            Selecione uma modalidade acima para ver a comissão.
          </p>
        )}
    </div>
  );
}