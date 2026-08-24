import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Users, UserCheck, UserCog, Link2 } from "lucide-react";
import { useGetFederationStats } from "@/hooks/federacao/GET/use-get-federation-stats";
import { useGenerateInvite } from "@/hooks/federacao/use-generate-invite";
import { StatCard } from "@/components/stat-card";

export default function FederacaoDashboardPage() {
  const { data: stats, isPending } = useGetFederationStats();
  const { mutate: generateInvite, isPending: isGeneratingInvite } =
    useGenerateInvite();

  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="font-bold text-3xl">Painel da Federação</h1>
        <p className="text-muted-foreground">
          Visão geral dos seus clubes, atletas e comissão técnica.
        </p>
      </div>

      <Separator />

      {/* 1. VISÃO GERAL */}
      <div>
        <h2 className="font-semibold text-xl mb-4">Visão Geral</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="Clubes Ativos"
            value={isPending ? "..." : String(stats?.activeClubs ?? 0)}
            icon={<Users className="h-5 w-5 text-muted-foreground" />}
          />
          <StatCard
            title="Total de Atletas"
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

      <Separator />

      {/* 2. AÇÕES RÁPIDAS */}
      <div>
        <h2 className="font-semibold text-xl mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="hover:border-primary transition-colors">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Link2 className="h-4 w-4" />
                Convite para Clubes
              </CardTitle>
              <CardDescription>
                Gere um link único para enviar a novos clubes que desejam se
                filiar à sua federação.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Chamada limpa, sem any e sem onSuccess customizado, pois o hook já faz tudo */}
              <Button
                onClick={() => generateInvite()}
                disabled={isGeneratingInvite}
                className="cursor-pointer"
              >
                {isGeneratingInvite
                  ? "Gerando..."
                  : "Gerar Novo Link de Convite"}
              </Button>
            </CardContent>
          </Card>

          <Card className="flex flex-col items-center justify-center bg-muted/30 border-dashed">
            <p className="text-sm text-muted-foreground font-medium">
              Mais ações em breve
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
