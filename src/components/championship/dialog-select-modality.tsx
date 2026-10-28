import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AppImage } from "@/components/app-image";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetModalities } from "@/hooks/modality/GET/use-get-modalities";

interface DialogSelectModalityProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DialogSelectModality({
  open,
  onOpenChange,
}: DialogSelectModalityProps) {
  const navigate = useNavigate();
  const { data: modalities, isLoading } = useGetModalities();

  const handleSelect = (modalityId: string) => {
    onOpenChange(false);
    navigate(`/federacao/campeonatos/novo?modalityId=${modalityId}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Criar Campeonato</DialogTitle>
          <DialogDescription>
            Selecione a modalidade do campeonato.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3 pt-2">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full rounded-lg" />
              ))
            : modalities?.map((mod) => (
                <button
                  key={mod.id}
                  type="button"
                  onClick={() => handleSelect(mod.id)}
                  className="flex items-center gap-3 rounded-lg border p-4 transition-all hover:border-primary hover:bg-muted/50 cursor-pointer text-left"
                >
                  <AppImage
                    src={mod.image_url}
                    alt={mod.name}
                    fallbackSrc="/fallbacks/default.webp"
                    className="size-10 rounded object-cover"
                  />
                  <span className="font-semibold text-sm">{mod.name}</span>
                </button>
              ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}