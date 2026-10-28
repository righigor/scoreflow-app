import { useState } from "react";
import { ArbitrationSlot } from "./arbitration-slot";
import { DialogSelectJudge } from "./dialog-select-judge";
import type {
  ArbitrationSlot as SlotType,
  JudgeSimpleType,
  PanelRole,
} from "@/types/championship/championship-type";

const PANEL_INFO: Record<
  PanelRole,
  { label: string; description: string }
> = {
  A: {
    label: "A — Artística",
    description:
      "Avaliam expressão corporal, musicalidade, uso do espaço e harmonia com a música.",
  },
  E: {
    label: "E — Execução",
    description:
      "Avaliam a precisão técnica e aplicam deduções por falhas na execução dos movimentos.",
  },
  DA: {
    label: "DA — Dificuldade de Aparelho",
    description:
      "Avaliam a dificuldade dos lançamentos, recepções, rotações e manipulações do aparelho.",
  },
  DB: {
    label: "DB — Dificuldade Corporal",
    description:
      "Avaliam a dificuldade de equilíbrios, pivôs, saltos e flexibilidades do ginasta.",
  },
};

interface ArbitrationPanelProps {
  role: PanelRole;
  slots: SlotType[];
  excludeIds: string[];
  onSelectSlot: (index: number, judge: JudgeSimpleType) => void;
  onClearSlot: (index: number) => void;
}

export function ArbitrationPanel({
  role,
  slots,
  excludeIds,
  onSelectSlot,
  onClearSlot,
}: ArbitrationPanelProps) {
  const info = PANEL_INFO[role];
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeSlotIndex, setActiveSlotIndex] = useState(0);

  const handleOpenDialog = (index: number) => {
    setActiveSlotIndex(index);
    setDialogOpen(true);
  };

  const handleSelect = (judge: JudgeSimpleType) => {
    onSelectSlot(activeSlotIndex, judge);
  };

  return (
    <>
      <div className="rounded-lg border p-4 space-y-3">
        <div>
          <h4 className="text-sm font-semibold">{info.label}</h4>
          <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
            {info.description}
          </p>
        </div>

        <div className="flex items-center justify-center gap-8 pt-1">
          {slots.map((slot, index) => (
            <ArbitrationSlot
              key={index}
              label={`Árbitro ${index + 1}`}
              judgeName={slot.judge_name}
              onClick={() => handleOpenDialog(index)}
              onClear={slot.judge_id ? () => onClearSlot(index) : undefined}
            />
          ))}
        </div>
      </div>

      <DialogSelectJudge
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        excludeIds={excludeIds}
        onSelect={handleSelect}
        title={`Selecionar Árbitro — ${info.label}`}
      />
    </>
  );
}