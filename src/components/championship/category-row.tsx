import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ApparatusChip } from "./apparatus-chip";
import type { CategoryWithApparatus } from "@/types/championship/championship-type";

const MAX_APPARATUS = 4;

interface ApparatusType {
  id: string;
  name: string;
  image_url: string | null;
}

interface CategoryRowProps {
  category: CategoryWithApparatus;
  apparatuses: ApparatusType[];
  isMaxReached: boolean;
  onToggleApparatus: (apparatusId: string) => void;
  onRemove: () => void;
}

export function CategoryRow({
  category,
  apparatuses,
  isMaxReached,
  onToggleApparatus,
  onRemove,
}: CategoryRowProps) {
  const count = category.apparatus_ids.length;
  const isLastApparatus = count <= 1;

  return (
    <div className="flex items-center gap-4 rounded-lg border p-3">
      <span className="font-bold text-lg shrink-0 min-w-28">
        {category.category_name}
      </span>

      <div className="h-8 w-px bg-border shrink-0" />

      <div className="flex flex-wrap items-center gap-2 flex-1">
        {apparatuses.map((app) => {
          const isSelected = category.apparatus_ids.includes(app.id);
          const isDisabled = !isSelected && isMaxReached;
          const isLocked = isSelected && isLastApparatus;
          return (
            <ApparatusChip
              key={app.id}
              name={app.name}
              imageUrl={app.image_url}
              isSelected={isSelected}
              isDisabled={isDisabled}
              isLocked={isLocked}
              onClick={() => onToggleApparatus(app.id)}
            />
          );
        })}
      </div>

      <div className="h-8 w-px bg-border shrink-0" />

      <div className="flex items-center gap-2 shrink-0">
        <span
          className={cn(
            "text-xs font-medium tabular-nums whitespace-nowrap",
            count === 0
              ? "text-destructive"
              : count >= MAX_APPARATUS
                ? "text-green-600"
                : "text-muted-foreground",
          )}
        >
          {count}/{MAX_APPARATUS}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-7 text-muted-foreground hover:text-destructive cursor-pointer"
          onClick={onRemove}
        >
          <X className="size-4" />
        </Button>
      </div>
    </div>
  );
}
