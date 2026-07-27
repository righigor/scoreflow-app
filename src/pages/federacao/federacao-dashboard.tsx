import { useOutletContext } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { FederacaoContextType } from "@/types/federacao/federacao-context";

export default function FederacaoDashboard() {
  const { federacao, isPending } = useOutletContext<FederacaoContextType>();

  console.log(federacao)

  if (isPending) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!federacao) {
    return (
      <div className="p-4 text-sm text-destructive">
        Erro: Dados da federação não encontrados.
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Cabeçalho da Página */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral do sistema da {federacao.name}
        </p>
      </div>

      {/* Card de Boas Vindas usando os dados do contexto */}
      <Card>
        <CardHeader>
          <CardTitle>Bem-vindo(a) de volta!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Federação:</span>
            <span className="text-sm font-medium">{federacao.name}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Sigla:</span>
            <span className="text-sm font-medium">{federacao.sigla}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Identificador:</span>
            <span className="text-sm font-mono bg-zinc-100 px-2 py-1 rounded">{federacao.slug}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}