import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { StaffRoleType } from "@/types/staff/staff-type";
import { useDeleteStaffRole } from "@/hooks/staff/DELETE/use-delete-staff-role";

interface StaffRoleListProps {
  roles: StaffRoleType[];
  isLoading: boolean;
  onEdit: (role: StaffRoleType) => void;
}

export default function StaffRoleList({ roles, isLoading, onEdit }: StaffRoleListProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { mutate: deleteRole, isPending: isDeleting } = useDeleteStaffRole();

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Funções Cadastradas</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-10 text-sm text-muted-foreground">Carregando...</div>
          ) : roles.length === 0 ? (
            <div className="flex items-center justify-center py-10 text-sm text-muted-foreground">Nenhuma função cadastrada.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome da Função</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead className="w-25 text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell className="font-medium">{role.name}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{role.slug}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer" onClick={() => onEdit(role)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive cursor-pointer" onClick={() => setDeleteId(role.id)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Atenção: Membros da comissão técnica que possuem esta função não serão excluídos, mas perderão a vinculação com ela.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteRole(deleteId!, { onSuccess: () => setDeleteId(null) })} disabled={isDeleting} className="bg-destructive text-white hover:bg-destructive/90 cursor-pointer">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}