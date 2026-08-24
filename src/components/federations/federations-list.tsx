import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil } from "lucide-react";
import { AppImage } from "@/components/app-image";
import type { FederationType } from "@/types/federacao/federacao-type";
import { getStatusInfo } from "@/lib/utils/get-status-info";

interface FederationListProps {
  federations: FederationType[];
  isLoading: boolean;
  onEdit: (federation: FederationType) => void;
}

export default function FederationList({
  federations,
  isLoading,
  onEdit,
}: FederationListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          Federações Cadastradas
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-10 text-sm text-muted-foreground">
            Carregando...
          </div>
        ) : federations.length === 0 ? (
          <div className="flex items-center justify-center py-10 text-sm text-muted-foreground">
            Nenhuma federação cadastrada.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Logo</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Sigla</TableHead>
                <TableHead className="w-30">Status</TableHead>
                <TableHead className="w-25 text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {federations.map((fed) => {
                const statusInfo = getStatusInfo(fed.status);
                return (
                  <TableRow key={fed.id}>
                    <TableCell>
                      <AppImage
                        src={fed.image_url}
                        alt={fed.sigla}
                        className="h-8 w-8 rounded object-cover"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{fed.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {fed.sigla}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusInfo.variant}>
                        {statusInfo.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 cursor-pointer"
                        onClick={() => onEdit(fed)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
