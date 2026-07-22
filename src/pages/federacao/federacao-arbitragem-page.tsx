import ArbitrosList from "@/components/arbitros/arbitro-list";
import SheetAddArbitros from "@/components/arbitros/sheet-add-arbitro";
import TotalArbitrosAtivos from "@/components/arbitros/total-arbitros-ativos";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useGetArbitros } from "@/hooks/arbitros/GET/use-get-arbitros";

export default function FederacaoArbitragemPage() {
  const { data, isPending } = useGetArbitros();

  const pendingArbitros = data?.filter((a) => a.status === "INVITED") || [];
  const activeArbitros =
    data?.filter((a) => a.status === "ACTIVE" && a.active === true) || [];
  const inactiveArbitros =
    data?.filter((a) => a.status === "ACTIVE" && a.active === false) || [];

  return (
    <div className="space-y-4 p-8">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-2xl">Árbitros</h2>
        <SheetAddArbitros />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <TotalArbitrosAtivos
          total={activeArbitros.length}
          isLoading={isPending}
        />
        <Card>
          <CardHeader>Análise de Desempenho</CardHeader>
          <CardContent>Gráfico de desempenho dos árbitros</CardContent>
        </Card>
      </div>

      <ArbitrosList
        arbitros={activeArbitros}
        isLoading={isPending}
        title="Árbitros Ativos"
      />
      <ArbitrosList
        arbitros={inactiveArbitros}
        isLoading={isPending}
        title="Árbitros Inativos"
      />
      <ArbitrosList
        arbitros={pendingArbitros}
        isLoading={isPending}
        title="Árbitros com Cadastro Pendente"
      />
    </div>
  );
}
