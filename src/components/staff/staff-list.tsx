import type { StaffWithModalitiesType, StatusStaffType } from "@/types/staff/staff-type";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface StaffListProps {
  staff: StaffWithModalitiesType[];
  isLoading: boolean;
  title: string;
}

function getStatusVariant(status: StatusStaffType): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "ACTIVE": return "default";
    case "INACTIVE":
    case "RETIRED": return "secondary";
    case "FREE_AGENT": return "outline";
    default: return "secondary";
  }
}

export default function StaffList({ staff, isLoading, title }: StaffListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-10 text-sm text-muted-foreground">Carregando...</div>
        ) : staff.length === 0 ? (
          <div className="flex items-center justify-center py-10 text-sm text-muted-foreground">Nenhum membro encontrado.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Função</TableHead>
                <TableHead className="w-35">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staff.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>{member.role_name}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(member.status)}>
                      {member.status === "FREE_AGENT" ? "Free Agent" : member.status === "INACTIVE" ? "Inativo" : member.status === "RETIRED" ? "Aposentado" : "Ativo"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}