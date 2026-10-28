import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe, UserPlus } from "lucide-react";
import { ArbitrationRoleSelect } from "./arbitration-role-select";
import { ArbitrationPanel } from "./arbitration-panel";
import type {
  ArbitrationConfig,
  JudgeSimpleType,
  PanelRole,
} from "@/types/championship/championship-type";

interface ChampionshipArbitrationFormProps {
  arbitration: ArbitrationConfig;
  onArbitrationChange: (config: ArbitrationConfig) => void;
}

function getSelectedIds(config: ArbitrationConfig): string[] {
  const ids: string[] = [];
  if (config.director.judge_id) ids.push(config.director.judge_id);
  if (config.secretary.judge_id) ids.push(config.secretary.judge_id);
  for (const panel of Object.values(config.panels)) {
    for (const slot of panel) {
      if (slot.judge_id) ids.push(slot.judge_id);
    }
  }
  return ids;
}

const PANEL_ROLES: PanelRole[] = ["A", "E", "DA", "DB"];

export function ChampionshipArbitrationForm({
  arbitration,
  onArbitrationChange,
}: ChampionshipArbitrationFormProps) {
  const excludeIds = getSelectedIds(arbitration);

  const setDirector = (judge: JudgeSimpleType) =>
    onArbitrationChange({
      ...arbitration,
      director: { judge_id: judge.id, judge_name: judge.name },
    });

  const setSecretary = (judge: JudgeSimpleType) =>
    onArbitrationChange({
      ...arbitration,
      secretary: { judge_id: judge.id, judge_name: judge.name },
    });

  const setSlot = (role: PanelRole, index: number, judge: JudgeSimpleType) =>
    onArbitrationChange({
      ...arbitration,
      panels: {
        ...arbitration.panels,
        [role]: arbitration.panels[role].map((s, i) =>
          i === index ? { judge_id: judge.id, judge_name: judge.name } : s,
        ),
      },
    });

  const clearSlot = (role: PanelRole, index: number) =>
    onArbitrationChange({
      ...arbitration,
      panels: {
        ...arbitration.panels,
        [role]: arbitration.panels[role].map((s, i) =>
          i === index ? { judge_id: null, judge_name: null } : s,
        ),
      },
    });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Arbitragem</CardTitle>
        <CardDescription>
          Configure a banca arbitral. Essa etapa é opcional — você pode definir
          os árbitros depois de criar o campeonato.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <ArbitrationRoleSelect
              label="Diretor de Prova"
              slot={arbitration.director}
              excludeIds={excludeIds}
              onSelect={setDirector}
              onClear={() =>
                onArbitrationChange({
                  ...arbitration,
                  director: { judge_id: null, judge_name: null },
                })
              }
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="shrink-0 cursor-not-allowed opacity-50"
            disabled
            title="Em breve"
          >
            <Globe className="size-3.5 mr-1.5" />
            Outras Fed.
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="shrink-0 cursor-not-allowed opacity-50"
            disabled
            title="Em breve"
          >
            <UserPlus className="size-3.5 mr-1.5" />
            Convidado
          </Button>
        </div>

        {/* Secretário */}
        <ArbitrationRoleSelect
          label="Secretário"
          slot={arbitration.secretary}
          excludeIds={excludeIds}
          onSelect={setSecretary}
          onClear={() =>
            onArbitrationChange({
              ...arbitration,
              secretary: { judge_id: null, judge_name: null },
            })
          }
        />

        <div className="border-t" />

        {/* 4 Quadrantes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PANEL_ROLES.map((role) => (
            <ArbitrationPanel
              key={role}
              role={role}
              slots={arbitration.panels[role]}
              excludeIds={excludeIds}
              onSelectSlot={(index, judge) => setSlot(role, index, judge)}
              onClearSlot={(index) => clearSlot(role, index)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
