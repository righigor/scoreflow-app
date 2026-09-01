import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, User } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { JudgeSimpleType } from "@/types/championship/championship-type";
import { useGetFederationJudges } from "@/hooks/arbitros/GET/use-get-federation-judges";

interface DialogSelectJudgeProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  excludeIds: string[];
  onSelect: (judge: JudgeSimpleType) => void;
  title?: string;
}

export function DialogSelectJudge({
  open,
  onOpenChange,
  excludeIds,
  onSelect,
  title = "Selecionar Árbitro",
}: DialogSelectJudgeProps) {
  const [search, setSearch] = useState("");
  const { data: judges, isLoading } = useGetFederationJudges(search);

  const filtered = judges?.filter((j) => !excludeIds.includes(j.id)) ?? [];

  const handleSelect = (judge: JudgeSimpleType) => {
    onSelect(judge);
    onOpenChange(false);
    setSearch("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Busque pelo nome do árbitro da sua federação.
          </DialogDescription>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            autoFocus
          />
        </div>

        <div className="max-h-64 overflow-y-auto space-y-1">
          {isLoading && (
            <div className="space-y-2 pt-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          )}

          {!isLoading && filtered.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-6">
              {search.trim()
                ? "Nenhum árbitro encontrado."
                : "Nenhum árbitro disponível."}
            </p>
          )}

          {filtered.map((judge) => (
            <button
              key={judge.id}
              type="button"
              onClick={() => handleSelect(judge)}
              className="flex items-center gap-3 w-full rounded-lg p-2.5 text-left transition-colors hover:bg-muted cursor-pointer"
            >
              <div className="size-9 rounded-full bg-muted flex items-center justify-center shrink-0">
                <User className="size-4 text-muted-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{judge.name}</p>
                {judge.brevet && (
                  <p className="text-xs text-muted-foreground">
                    Brevet: {judge.brevet}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}