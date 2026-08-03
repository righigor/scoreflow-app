import { Dumbbell, Tags, Briefcase, Landmark, Activity } from "lucide-react";
import { MasterDataCard } from "./master-data-card";

export function MasterDataSection() {
  return (
    <div>
      <h2 className="font-semibold text-xl mb-4">
        Catálogo Global (Master Data)
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <MasterDataCard
          title="Modalidades"
          description="Gerenciar tipos de ginástica"
          icon={<Activity className="h-6 w-6" />}
          href="/admin/modalidades"
        />
        <MasterDataCard
          title="Aparelhos"
          description="Gerenciar aparelhos por modalidade"
          icon={<Dumbbell className="h-6 w-6" />}
          href="/admin/aparelhos"
        />
        <MasterDataCard
          title="Categorias Base"
          description="Gerenciar categorias"
          icon={<Tags className="h-6 w-6" />}
          href="/admin/categorias"
        />
        <MasterDataCard
          title="Funções de Staff"
          description="Gerenciar cargos da comissão"
          icon={<Briefcase className="h-6 w-6" />}
          href="/admin/funcoes-staff"
        />
        <MasterDataCard
          title="Federações"
          description="Gerenciar inquilinos do sistema"
          icon={<Landmark className="h-6 w-6" />}
          href="/admin/federacoes"
        />
      </div>
    </div>
  );
}
