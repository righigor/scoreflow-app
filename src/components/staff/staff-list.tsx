import { Link } from "react-router-dom";
import type { StaffWithModalitiesType } from "@/types/staff/staff-type";
import { AppImage } from "@/components/app-image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface StaffListProps {
  staff: StaffWithModalitiesType[];
  isLoading: boolean;
  title: string;
}

function getStatusVariant(
  status: string,
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "ACTIVE":
      return "default";
    case "INACTIVE":
    case "RETIRED":
      return "secondary";
    case "FREE_AGENT":
      return "outline";
    default:
      return "secondary";
  }
}

function getStatusLabel(status: string): string {
  switch (status) {
    case "ACTIVE":
      return "Ativo";
    case "INACTIVE":
      return "Inativo";
    case "RETIRED":
      return "Aposentado";
    case "FREE_AGENT":
      return "Free Agent";
    default:
      return status;
  }
}

export default function StaffList({
  staff,
  isLoading,
  title,
}: StaffListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-10 text-sm text-muted-foreground">
            Carregando comissão técnica...
          </div>
        ) : staff.length === 0 ? (
          <div className="flex items-center justify-center py-10 text-sm text-muted-foreground">
            Nenhum membro encontrado nesta modalidade.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Membro</TableHead>
                <TableHead className="w-40">Função</TableHead>
                <TableHead className="w-35">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staff.map((member) => {
                const fallbackAvatar =
                  member.gender === "F"
                    ? "/fallbacks/athlete-f.webp"
                    : "/fallbacks/athlete-m.webp";

                return (
                  <TableRow
                    key={member.id}
                    className="cursor-pointer hover:bg-muted/50"
                  >
                    <TableCell>
                      <Link
                        to={`/equipe/comissao/${member.id}`}
                        className="flex items-center gap-3 group"
                      >
                        <div className="size-16 shrink-0 overflow-hidden rounded-md">
                          <AppImage
                            src={member.profile_picture_url}
                            alt={member.name}
                            fallbackSrc={fallbackAvatar}
                            className="size-full object-cover"
                          />
                        </div>
                        <span className="font-medium group-hover:underline">
                          {member.name}
                        </span>
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {member.role_name}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(member.status)}>
                        {getStatusLabel(member.status)}
                      </Badge>
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