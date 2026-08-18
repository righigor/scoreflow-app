import { Separator } from "@/components/ui/separator";
import VisaoGeral from "@/components/admin/dashboard/visao-geral";
import { MasterDataSection } from "@/components/admin/dashboard/master-data-section";
import { FinancialSection } from "@/components/admin/dashboard/financial-section";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="font-bold text-3xl">Painel Administrativo</h1>
        <p className="text-muted-foreground">
          Visão geral do sistema ScoreFlow.
        </p>
      </div>
      <Separator />
      <VisaoGeral />
      <Separator />
      <MasterDataSection />
      <Separator />
      <FinancialSection />
    </div>
  );
}
