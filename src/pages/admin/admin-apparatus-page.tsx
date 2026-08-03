import { useState } from "react";
import type { ApparatusType } from "@/types/apparatus/apparatus-type";
import ApparatusList from "@/components/apparatus/apparatus-list";
import SheetApparatus from "@/components/apparatus/sheet-apparatus";
import { useGetApparatus } from "@/hooks/apparatus/GET/use-get-apparatus";
import { useGetModalities } from "@/hooks/modality/GET/use-get-modalities";
import { ModalityFilterCards } from "@/components/modality-filter-cards";

export default function AdminApparatusPage() {
  const [selectedModalityId, setSelectedModalityId] = useState<string | null>(
    null,
  );
  const [apparatusToEdit, setApparatusToEdit] = useState<ApparatusType | null>(
    null,
  );

  const { data: modalities, isPending: isPendingModalities } =
    useGetModalities();
  const { data: apparatus, isPending: isPendingApparatus } = useGetApparatus();

  const activeModalityId =
    modalities?.length === 1 ? modalities[0].id : selectedModalityId;

  const filteredApparatus = activeModalityId
    ? apparatus?.filter((app) => app.modality_id === activeModalityId) || []
    : [];

  return (
    <div className="space-y-4 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-2xl">Aparelhos</h2>
          <p className="text-sm text-muted-foreground">
            Gerencie os aparelhos por modalidade.
          </p>
        </div>
        {activeModalityId && !apparatusToEdit && (
          <SheetApparatus
            defaultModalityId={activeModalityId}
            apparatusToEdit={null}
            clearEdit={() => setApparatusToEdit(null)}
          />
        )}
      </div>

      <ModalityFilterCards
        modalities={modalities ?? []}
        activeId={activeModalityId}
        onSelect={setSelectedModalityId}
        showImage
      />

      {activeModalityId && (
        <ApparatusList
          apparatus={filteredApparatus}
          isLoading={isPendingApparatus || isPendingModalities}
          onEdit={(app) => setApparatusToEdit(app)}
          modality={modalities ?? []}
        />
      )}

      {apparatusToEdit && (
        <SheetApparatus
          apparatusToEdit={apparatusToEdit}
          clearEdit={() => setApparatusToEdit(null)}
        />
      )}
    </div>
  );
}
