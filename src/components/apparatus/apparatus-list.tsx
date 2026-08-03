import { useState } from "react";
import type { ApparatusType } from "@/types/apparatus/apparatus-type";
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
import { Pencil, Trash } from "lucide-react";
import { AppImage } from "@/components/app-image";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteApparatus } from "@/hooks/apparatus/DELETE/use-delete-apparatus";
import type { ModalityType } from "@/types/modality/modality-type";

interface ApparatusListProps {
  apparatus: ApparatusType[];
  isLoading: boolean;
  onEdit: (apparatus: ApparatusType) => void;
  modality: ModalityType[];
}

export default function ApparatusList({
  apparatus,
  isLoading,
  onEdit,
  modality,
}: ApparatusListProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { mutate: deleteApparatus, isPending: isDeleting } =
    useDeleteApparatus();

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Aparelhos Cadastrados {modality.filter((m) => apparatus.some((app) => app.modality_id === m.id)).length > 0 && `(${modality.filter((m) => apparatus.some((app) => app.modality_id === m.id)).map((m) => m.name).join(", ")})`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-10 text-sm text-muted-foreground">
              Carregando...
            </div>
          ) : apparatus.length === 0 ? (
            <div className="flex items-center justify-center py-10 text-sm text-muted-foreground">
              Nenhum aparelho nesta modalidade.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Imagem</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead className="w-25 text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apparatus.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell>
                      <AppImage
                        src={app.image_url}
                        alt={app.name}
                        className="size-12 bg-white rounded p-1"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{app.name}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 cursor-pointer"
                          onClick={() => onEdit(app)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive cursor-pointer"
                          onClick={() => setDeleteId(app.id)}
                        >
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

      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá o aparelho
              permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deleteApparatus(deleteId!, {
                  onSuccess: () => setDeleteId(null),
                })
              }
              disabled={isDeleting}
              className="bg-destructive text-white hover:bg-destructive/90 cursor-pointer"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
