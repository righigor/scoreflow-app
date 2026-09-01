import { Check } from "lucide-react";
import { AppImage } from "@/components/app-image";
import { cn } from "@/lib/utils";

interface ApparatusChipProps {
  name: string;
  imageUrl: string | null;
  isSelected: boolean;
  isDisabled: boolean;
  isLocked: boolean;
  onClick: () => void;
}

export function ApparatusChip({
  name,
  imageUrl,
  isSelected,
  isDisabled,
  isLocked,
  onClick,
}: ApparatusChipProps) {
  return (
    <button
      type="button"
      disabled={isDisabled}
      onClick={onClick}
      title={
        isLocked
          ? "Mínimo 1 aparelho obrigatório"
          : isDisabled
            ? "Máximo de 4 aparelhos atingido"
            : name
      }
      className={cn(
        "relative flex flex-col items-center gap-1.5 p-2 rounded-lg border-2 transition-all",
        isSelected
          ? "border-green-500 bg-green-500/10 cursor-pointer"
          : isDisabled
            ? "border-muted opacity-40 cursor-not-allowed"
            : "border-muted hover:border-primary cursor-pointer",
      )}
    >
      <div className="relative size-12">
        <AppImage
          src={imageUrl}
          alt={name}
          fallbackSrc="/fallbacks/default.webp"
          className="size-full rounded object-contain p-0.5 bg-white"
        />
        {isSelected && (
          <div className="absolute -top-1 -right-1 size-4 bg-green-500 rounded-full flex items-center justify-center">
            <Check className="size-2.5 text-white" />
          </div>
        )}
      </div>
      <span
        className={cn(
          "text-[11px] font-medium leading-tight text-center",
          isSelected
            ? "text-green-700 dark:text-green-400"
            : "text-muted-foreground",
        )}
      >
        {name}
      </span>
    </button>
  );
}