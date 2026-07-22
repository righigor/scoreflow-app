import { useState, type SetStateAction } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useGetCampeonatos } from "@/hooks/campeonato/GET/use-get-campeonatos";
import { Button } from "@/components/ui/button";
import CampeonatosList from "@/components/campeonatos/campeonato-list";

export default function FederacaoCampeonatosPage() {
  const [search, setSearch] = useState("");

  const [pageLive, setPageLive] = useState(1);
  const [pageUpcoming, setPageUpcoming] = useState(1);
  const [pageFinished, setPageFinished] = useState(1);

  const [sortBy, setSortBy] = useState("start_date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const live = useGetCampeonatos({
    search,
    status: ["LIVE"],
    page: pageLive,
    sortBy: "start_date",
    sortOrder: "asc",
  });
  const upcoming = useGetCampeonatos({
    search,
    status: ["UPCOMING"],
    page: pageUpcoming,
    sortBy: "start_date",
    sortOrder: "asc",
  });
  const finished = useGetCampeonatos({
    search,
    status: ["FINISHED"],
    page: pageFinished,
    sortBy,
    sortOrder,
  });

  const isLoading = live.isLoading || upcoming.isLoading || finished.isLoading;

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-2xl">Campeonatos</h2>
        <Button>Criar</Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Buscar campeonato pelo nome..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPageLive(1);
            setPageUpcoming(1);
            setPageFinished(1);
          }}
          className="pl-9"
        />
      </div>

      {live.data?.data && live.data.data.length > 0 && (
        <CampeonatosList
          title="🔥 Acontecendo Agora"
          campeonatos={live.data.data}
          isLoading={isLoading}
          page={pageLive}
          totalPages={live.data.totalPages}
          onPageChange={setPageLive}
          showSortOptions={false}
        />
      )}

      <CampeonatosList
        title="📅 Próximos Campeonatos"
        campeonatos={upcoming.data?.data || []}
        isLoading={isLoading}
        page={pageUpcoming}
        totalPages={upcoming.data?.totalPages ?? 0}
        onPageChange={setPageUpcoming}
        emptyMessage="Nenhum campeonato agendado."
        showSortOptions={false}
      />

      <CampeonatosList
        title="🏆 Arquivo / Campeonatos Passados"
        campeonatos={finished.data?.data || []}
        isLoading={isLoading}
        page={pageFinished}
        totalPages={finished.data?.totalPages ?? 0}
        onPageChange={setPageFinished}
        emptyMessage="Nenhum campeonato finalizado."
        showSortOptions={true}
        sortBy={sortBy}
        onSortChange={(field: SetStateAction<string>) => {
          if (sortBy === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
          } else {
            setSortBy(field);
            setSortOrder("asc");
          }
          setPageFinished(1);
        }}
        sortOrder={sortOrder}
      />
    </div>
  );
}
