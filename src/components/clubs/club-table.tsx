import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { AppImage } from "@/components/app-image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Search, Ban, CheckCircle } from "lucide-react";
import type { ClubType } from "@/types/club/club-type";

const PAGE_SIZE = 10;

interface ClubTableProps {
  clubs: ClubType[];
  isLoading: boolean;
  title: string;
  emptyMessage: string;
  status: "ACTIVE" | "INACTIVE";
  onToggleStatus: (clubId: string, newStatus: "ACTIVE" | "INACTIVE") => void;
}

export function ClubTable({
  clubs,
  isLoading,
  title,
  emptyMessage,
  status,
  onToggleStatus,
}: ClubTableProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const term = search.toLowerCase().trim();
    if (!term) return clubs;
    return clubs.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        c.sigla.toLowerCase().includes(term)
    );
  }, [clubs, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const isActive = status === "ACTIVE";
  const newStatus: "ACTIVE" | "INACTIVE" = isActive ? "INACTIVE" : "ACTIVE";

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou sigla..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-10 text-sm text-muted-foreground">
            Carregando...
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex items-center justify-center py-10 text-sm text-muted-foreground">
            {search
              ? "Nenhum clube encontrado para esta busca."
              : emptyMessage}
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-14"></TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Sigla</TableHead>
                  <TableHead>Data de Entrada</TableHead>
                  <TableHead className="w-25 text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((club) => (
                  <TableRow key={club.id}>
                    <TableCell>
                      <AppImage
                        src={club.image_url}
                        alt={club.name}
                        fallbackSrc="/fallbacks/club.png"
                        className="size-10 rounded-md object-cover"
                      />
                    </TableCell>
                    <TableCell>
                      <Link
                        to={`/federacao/equipe/${club.id}`}
                        className="font-medium hover:underline"
                      >
                        {club.name}
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {club.sigla}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {club.created_at
                        ? format(new Date(club.created_at), "dd/MM/yyyy")
                        : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-8 w-8 cursor-pointer ${
                          isActive
                            ? "text-muted-foreground hover:text-red-600"
                            : "text-muted-foreground hover:text-green-600"
                        }`}
                        onClick={() => onToggleStatus(club.id, newStatus)}
                        title={
                          isActive ? "Desativar clube" : "Reativar clube"
                        }
                      >
                        {isActive ? (
                          <Ban className="h-4 w-4" />
                        ) : (
                          <CheckCircle className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4">
                <p className="text-sm text-muted-foreground">
                  Mostrando {(safePage - 1) * PAGE_SIZE + 1}-
                  {Math.min(safePage * PAGE_SIZE, filtered.length)} de{" "}
                  {filtered.length}
                </p>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setPage(safePage - 1)}
                        className={safePage <= 1 ? "pointer-events-none opacity-50 cursor-pointer" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setPage(safePage + 1)}
                        className={safePage >= totalPages ? "pointer-events-none opacity-50 cursor-pointer" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}