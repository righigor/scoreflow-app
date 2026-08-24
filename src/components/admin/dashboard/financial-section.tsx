import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Wallet, BarChart3 } from "lucide-react";
import { StatCard } from "../../stat-card";

const DUMMY_FINANCE = {
  receita: "R$ 0,00",
  despesas: "R$ 130,00",
  lucro: "R$ -130,00",
};

export function FinancialSection() {
  return (
    <div>
      <h2 className="font-semibold text-xl mb-4">Financeiro</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <StatCard
          title="Receita Mensal"
          value={DUMMY_FINANCE.receita}
          icon={<TrendingUp className="h-5 w-5 text-green-500" />}
        />
        <StatCard
          title="Despesas Mensais"
          value={DUMMY_FINANCE.despesas}
          icon={<TrendingDown className="h-5 w-5 text-red-500" />}
        />
        <StatCard
          title="Lucro Líquido"
          value={DUMMY_FINANCE.lucro}
          icon={<Wallet className="h-5 w-5 text-muted-foreground" />}
        />
      </div>

      {/* Placeholder do Gráfico */}
      <Card className="flex flex-col items-center justify-center h-64 bg-muted/30 border-dashed">
        <BarChart3 className="h-12 w-12 text-muted-foreground/50 mb-2" />
        <p className="text-sm text-muted-foreground font-medium">
          Gráfico de Receitas x Despesas (Em breve)
        </p>
      </Card>
    </div>
  );
}
