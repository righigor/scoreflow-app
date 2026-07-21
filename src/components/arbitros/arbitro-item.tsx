import type { ArbitroType } from "@/types/arbitros/arbitro-type";
import { CheckCircle, CircleOff } from "lucide-react";
import { LoadingBtn } from "../buttons/loading-btn";
import EditArbitroDialog from "./edit-arbitro-dialog";
import { useToggleArbitroStatus } from "@/hooks/arbitros/UPDATE/use-toggle-arbitro-status";

interface ArbitroItemProps {
  arbitro: ArbitroType;
}

export default function ArbitroItem({ arbitro }: ArbitroItemProps) {
  // Sem useParams! O hook sabe o que fazer.
  const { mutate, isPending } = useToggleArbitroStatus();

  const handleToggleActive = () => {
    mutate({ arbitroId: arbitro.id, active: !arbitro.active });
  };

  return (
    <div className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50">
      {/* Lado Esquerdo: Informações */}
      <div className="flex-1">
        <p className="font-medium">{arbitro.name}</p>
        <p className="text-sm text-muted-foreground">
          Brevet: {arbitro.brevet}
          {arbitro.telefone && ` | Tel: ${arbitro.telefone}`}
          {arbitro.email && ` | ${arbitro.email}`}
        </p>
      </div>

      {/* Lado Direito: Ações */}
      <div className="flex items-center gap-2 ml-4">
        <LoadingBtn
          isLoading={isPending}
          onClick={handleToggleActive}
          variant="outline"
          size="sm"
        >
          <span className="flex items-center gap-2">
            {arbitro.active ? (
              <CheckCircle size={16} className="text-green-600" />
            ) : (
              <CircleOff size={16} className="text-red-600" />
            )}
            <span>{arbitro.active ? "Ativo" : "Inativo"}</span>
          </span>
        </LoadingBtn>

        <EditArbitroDialog arbitro={arbitro} />
      </div>
    </div>
  );
}
