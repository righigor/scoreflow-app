import ApparatusList from "@/components/admin/apparatus/apparatus-list";
import SheetAddApparatus from "@/components/admin/apparatus/sheet-add-apparatus";
import { useGetApparatus } from "@/hooks/admin/GET/use-get-apparatus";


export default function AdminApparatusPage() {
  const { data, isPending } = useGetApparatus();

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Aparelhos</h2>
          <p className="text-sm text-muted-foreground">
            Gerencie os aparelhos padrão disponíveis para todos os campeonatos.
          </p>
        </div>
        <SheetAddApparatus />
      </div>

      <ApparatusList apparatus={data || []} isLoading={isPending} />
    </div>
  );
}