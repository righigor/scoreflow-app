import { CalendarDays, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { CampeonatoType } from "@/types/campeonatos/campeonato-type";
import { formatDate } from "@/lib/utils/format-date";

const statusConfig = {
  LIVE: { label: "Ao Vivo", variant: "destructive" as const },
  UPCOMING: { label: "Por Vir", variant: "secondary" as const },
  FINISHED: { label: "Finalizado", variant: "outline" as const },
};

interface CampeonatoItemProps {
  campeonato: CampeonatoType;
}

export default function CampeonatoItem({ campeonato }: CampeonatoItemProps) {
  const config = statusConfig[campeonato.status];

  return (
    <div className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50">
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-3">
          <p className="font-medium">{campeonato.name}</p>
          <Badge variant={config.variant} className="text-xs">{config.label}</Badge>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {campeonato.location && (
            <span className="flex items-center gap-1">
              <MapPin size={14} />
              {campeonato.location}
            </span>
          )}
          <span className="flex items-center gap-1">
            <CalendarDays size={14} />
            {formatDate(campeonato.start_date)} - {formatDate(campeonato.end_date)}
          </span>
        </div>
      </div>
      
      <div className="ml-4 flex items-center gap-2">
        <Badge variant="outline" className="cursor-pointer hover:bg-accent">
          Gerenciar
        </Badge>
      </div>
    </div>
  );
}