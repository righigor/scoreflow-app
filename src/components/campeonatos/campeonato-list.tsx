import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { ArrowUpDown } from "lucide-react";
import CampeonatoItem from "./campeonato-item";
import type { CampeonatoType } from "@/types/campeonatos/campeonato-type";
import { generatePaginationNumbers } from "@/lib/utils/generate-pag-numbers";

interface CampeonatosListProps {
  title: string;
  campeonatos: CampeonatoType[];
  isLoading: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  emptyMessage?: string;
  showSortOptions?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  onSortChange?: (field: string) => void;
}

export default function CampeonatosList({
  title,
  campeonatos,
  isLoading,
  page,
  totalPages,
  onPageChange,
  emptyMessage = "Nenhum campeonato encontrado.",
  showSortOptions = false,
  sortBy,
  sortOrder,
  onSortChange,
}: CampeonatosListProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
        
        {showSortOptions && onSortChange && (
          <div className="flex items-center gap-2">
            <ArrowUpDown size={16} className="text-muted-foreground" />
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onSortChange('name')}
              className="h-8 text-xs"
            >
              Nome {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onSortChange('start_date')}
              className="h-8 text-xs"
            >
              Data {sortBy === 'start_date' && (sortOrder === 'asc' ? '↑' : '↓')}
            </Button>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {isLoading && (
          <div className="space-y-3">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        )}

        {!isLoading && campeonatos.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-6">
            {emptyMessage}
          </p>
        )}

        {!isLoading &&
          campeonatos.map((campeonato) => (
            <CampeonatoItem key={campeonato.id} campeonato={campeonato} />
          ))}

        {/* Paginação - Só aparece se tiver mais de 1 página */}
        {!isLoading && totalPages > 1 && (
          <Pagination className="pt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => onPageChange(page - 1)} 
                  className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>

              {generatePaginationNumbers(page, totalPages).map((item, index) => (
                <PaginationItem key={index}>
                  {item === '...' ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      onClick={() => onPageChange(item as number)}
                      isActive={page === item}
                      className="cursor-pointer"
                    >
                      {item}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext 
                  onClick={() => onPageChange(page + 1)} 
                  className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </CardContent>
    </Card>
  );
}