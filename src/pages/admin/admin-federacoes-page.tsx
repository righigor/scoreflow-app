import { useState } from "react";
import SheetFederation from "@/components/federations/sheet-federation";
import type { FederationType } from "@/types/federacao/federacao-type";
import { useGetFederations } from "@/hooks/federacao/GET/use-get-federations";
import FederationList from "@/components/federations/federations-list";

export default function AdminFederacoesPage() {
  const [federationToEdit, setFederationToEdit] = useState<FederationType | null>(null);
  const { data: federations, isPending } = useGetFederations();

  return (
    <div className="space-y-4 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-2xl">Federações</h2>
          <p className="text-sm text-muted-foreground">Gerencie os inquilinos do sistema (clientes SaaS).</p>
        </div>
        {!federationToEdit && (
          <SheetFederation federationToEdit={null} clearEdit={() => setFederationToEdit(null)} />
        )}
      </div>

      <FederationList 
        federations={federations ?? []} 
        isLoading={isPending} 
        onEdit={(fed) => setFederationToEdit(fed)} 
      />

      {federationToEdit && (
        <SheetFederation 
          federationToEdit={federationToEdit} 
          clearEdit={() => setFederationToEdit(null)} 
        />
      )}
    </div>
  );
}