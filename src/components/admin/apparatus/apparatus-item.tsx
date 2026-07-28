import { AppImage } from "@/components/app-image";
import type { ApparatusType } from "@/types/apparatus/apparatus-type";


interface ApparatusItemProps {
  apparatus: ApparatusType;
}

export default function ApparatusItem({ apparatus }: ApparatusItemProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50">
      <div className="flex items-center gap-4">
        <div className="flex size-12 p-1 bg-white items-center justify-center overflow-hidden rounded-lg">
          <AppImage 
            src={apparatus.image_url} 
            alt={apparatus.name} 
            fallbackSrc="/fallbacks/apparatus.webp"
            className="h-full w-full"
          />
        </div>
        <div>
          <p className="font-medium">{apparatus.name}</p>
          <p className="text-xs text-muted-foreground">
            Slug: {apparatus.slug} • Ordem: {apparatus.display_order}
          </p>
        </div>
      </div>
      {/* Futuro: Botões de Editar e Excluir */}
    </div>
  );
}