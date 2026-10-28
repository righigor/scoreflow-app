import { User, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/utils/get-initials";

interface ArbitrationSlotProps {
  label: string;
  judgeName: string | null;
  onClick: () => void;
  onClear?: () => void;
}

export function ArbitrationSlot({
  label,
  judgeName,
  onClick,
  onClear,
}: ArbitrationSlotProps) {
  const isFilled = !!judgeName;

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative group">
        <button
          type="button"
          onClick={onClick}
          className={cn(
            "size-11 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer",
            isFilled
              ? "border-green-500 bg-green-500/10"
              : "border-muted-foreground/30 bg-muted/50 hover:border-primary",
          )}
        >
          {isFilled ? (
            <span className="text-[11px] font-bold text-green-700">
              {getInitials(judgeName!)}
            </span>
          ) : (
            <User className="size-4 text-muted-foreground/50" />
          )}
        </button>

        {isFilled && onClear && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
            className="absolute -top-1 -right-1 size-4 bg-destructive text-destructive-foreground rounded-full items-center justify-center hidden group-hover:flex cursor-pointer"
          >
            <X className="size-2.5" />
          </button>
        )}
      </div>

      <span
        className={cn(
          "text-[10px] font-medium text-center leading-tight max-w-16 truncate",
          isFilled ? "text-foreground" : "text-muted-foreground/60",
        )}
      >
        {isFilled ? judgeName : label}
      </span>
    </div>
  );
}
