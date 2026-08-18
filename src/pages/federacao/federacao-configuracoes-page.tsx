import { useAuthStore } from "@/stores/auth-store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Info, ShieldCheck, AlertTriangle } from "lucide-react";

function getStatusInfo(status: string) {
  switch (status) {
    case "ACTIVE": return { label: "Ativa", variant: "default" as const };
    case "INACTIVE": return { label: "Inativa", variant: "destructive" as const };
    case "TRIAL": return { label: "Período de Teste", variant: "outline" as const };
    default: return { label: status, variant: "secondary" as const };
  }
}

export default function FederacaoConfiguracoesPage() {
  const profile = useAuthStore((state) => state.profile);
  const statusInfo = getStatusInfo(profile?.status || "ACTIVE");

  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="font-bold text-3xl">Configurações</h1>
        <p className="text-muted-foreground">
          Informações da sua conta e limites do sistema.
        </p>
      </div>

      <Separator />

      {/* Seção 1: Status da Conta */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            Status da Conta
          </CardTitle>
          <CardDescription>Detalhes da sua assinatura atual no ScoreFlow.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Plano Atual</span>
            <Badge variant="secondary">Plano Piloto (FMG)</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Status da Federação</span>
            <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Seção 2: Limites de Uso (Placeholder para V2) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Info className="h-4 w-4" />
            Limites de Uso
          </CardTitle>
          <CardDescription>
            Acompanhe o consumo da sua federação no sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 p-4 border rounded-lg bg-muted/30 border-dashed">
            <p className="text-sm text-muted-foreground text-center">
              O acompanhamento de limites (ex: máximo de clubes, atletas ou campeonatos simultâneos) estará disponível em breve quando as assinaturas pagas forem implementadas.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Seção 3: Zona de Perigo */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-4 w-4" />
            Zona de Perigo
          </CardTitle>
          <CardDescription>
            Ações irreversíveis. O cancelamento da conta deve ser feito entrando em contato com o suporte do ScoreFlow.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-3 border border-destructive/30 rounded-lg bg-destructive/5">
            <div>
              <p className="font-medium text-sm">Solicitar Cancelamento</p>
              <p className="text-xs text-muted-foreground">Entraremos em contato para avaliar a exclusão dos dados da sua federação.</p>
            </div>
            <Button variant="destructive" size="sm" disabled>
              Contatar Suporte
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}