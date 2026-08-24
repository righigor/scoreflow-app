import { useState } from "react";
import type { ModalityType } from "@/types/modality/modality-type";
import ModalityList from "@/components/modalities/modality-list";
import SheetModality from "@/components/modalities/sheet-modality";
import { useGetModalities } from "@/hooks/modality/GET/use-get-modalities";

export default function AdminModalidadesPage() {
  const [modalityToEdit, setModalityToEdit] = useState<ModalityType | null>(
    null,
  );
  const { data: modalities, isPending } = useGetModalities();

  return (
    <div className="space-y-4 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-2xl">Modalidades</h2>
          <p className="text-sm text-muted-foreground">
            Gerencie os tipos de ginástica disponíveis no sistema.
          </p>
        </div>

        {/* Só mostra o botão principal "Nova Modalidade" se NÃO estiver editando */}
        {!modalityToEdit && (
          <SheetModality
            modalityToEdit={null}
            clearEdit={() => setModalityToEdit(null)}
          />
        )}
      </div>

      <ModalityList
        modalities={modalities ?? []}
        isLoading={isPending}
        onEdit={(mod) => setModalityToEdit(mod)}
      />

      {/* Sheet de Edição flutuante (aparece quando o state não é nulo) */}
      {modalityToEdit && (
        <SheetModality
          modalityToEdit={modalityToEdit}
          clearEdit={() => setModalityToEdit(null)}
        />
      )}
    </div>
  );
}
