import { useState } from "react";
import { User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DialogSelectJudge } from "./dialog-select-judge";
import type {
  ArbitrationSlot,
  JudgeSimpleType,
} from "@/types/championship/championship-type";
import { getInitials } from "@/lib/utils/get-initials";

interface ArbitrationRoleSelectProps {
  label: string;
  slot: ArbitrationSlot;
  excludeIds: string[];
  onSelect: (judge: JudgeSimpleType) => void;
  onClear: () => void;
}

export function ArbitrationRoleSelect({
  label,
  slot,
  excludeIds,
  onSelect,
  onClear,
}: ArbitrationRoleSelectProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const isFilled = !!slot.judge_name;

  return (
    <>
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium shrink-0 w-28">{label}</span>

        {isFilled ? (
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="size-8 rounded-full bg-green-500/10 border-2 border-green-500 flex items-center justify-center shrink-0">
              <span className="text-[10px] font-bold text-green-700">
                {getInitials(slot.judge_name!)}
              </span>
            </div>
            <span className="text-sm truncate">{slot.judge_name}</span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-7 shrink-0 text-muted-foreground hover:text-destructive cursor-pointer"
              onClick={onClear}
            >
              <X className="size-4" />
            </Button>
          </div>
        ) : (
          <Button
            type="button"
            variant="outline"
            className="flex-1 justify-start text-muted-foreground cursor-pointer"
            onClick={() => setDialogOpen(true)}
          >
            <User className="size-4 mr-2" />
            Buscar árbitro...
          </Button>
        )}
      </div>

      <DialogSelectJudge
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        excludeIds={excludeIds}
        onSelect={onSelect}
        title={`Selecionar ${label}`}
      />
    </>
  );
}
