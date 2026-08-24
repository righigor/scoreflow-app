import { useGetSysadminStats } from "@/hooks/admin/GET/use-get-sysadmin-stats";
import { StatCard } from "../../stat-card";
import { Building2, UserCheck, UserCog, Users } from "lucide-react";

export default function VisaoGeral() {
  const { data: stats, isPending } = useGetSysadminStats();
  return (
    <div>
      <h2 className="font-semibold text-xl mb-4">Visão Geral da Plataforma</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Federações Ativas"
          value={isPending ? "..." : String(stats?.federations ?? 0)}
          icon={<Building2 className="h-5 w-5 text-muted-foreground" />}
        />
        <StatCard
          title="Clubes Filiados"
          value={isPending ? "..." : String(stats?.clubs ?? 0)}
          icon={<Users className="h-5 w-5 text-muted-foreground" />}
        />
        <StatCard
          title="Atletas Cadastrados"
          value={isPending ? "..." : String(stats?.athletes ?? 0)}
          icon={<UserCheck className="h-5 w-5 text-muted-foreground" />}
        />
        <StatCard
          title="Comissão Técnica"
          value={isPending ? "..." : String(stats?.staff ?? 0)}
          icon={<UserCog className="h-5 w-5 text-muted-foreground" />}
        />
      </div>
    </div>
  );
}
