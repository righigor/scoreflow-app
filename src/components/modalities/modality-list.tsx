import { useState } from "react";
import type { ModalityType } from "@/types/modality/modality-type";
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
import { useDeleteModality } from "@/hooks/modality/DELETE/use-delete-modality";
import { AppImage } from "../app-image";

interface ModalityListProps {
  modalities: ModalityType[];
  isLoading: boolean;
  onEdit: (modality: ModalityType) => void;
}

export default function ModalityList({
  modalities,
  isLoading,
  onEdit,
}: ModalityListProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { mutate: deleteModality, isPending: isDeleting } = useDeleteModality();

  const handleDelete = () => {
    if (deleteId) {
      deleteModality(deleteId, { onSuccess: () => setDeleteId(null) });
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Modalidades Cadastradas
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-10 text-sm text-muted-foreground">
              Carregando...
            </div>
          ) : modalities.length === 0 ? (
            <div className="flex items-center justify-center py-10 text-sm text-muted-foreground">
              Nenhuma modalidade cadastrada.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Imagem</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead className="w-25 text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {modalities.map((mod) => (
                  <TableRow key={mod.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <AppImage
                          src={mod.image_url}
                          alt={mod.name}
                          fallbackSrc="/fallbacks/modality.webp"
                          className="size-12 rounded object-cover"
                        />
                      </div>
                    </TableCell>

                    <TableCell className="font-medium">{mod.name}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {mod.slug}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 cursor-pointer"
                          onClick={() => onEdit(mod)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive cursor-pointer"
                          onClick={() => setDeleteId(mod.id)}
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

      {/* Modal de Confirmação de Exclusão */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá a modalidade e
              todos os aparelhos e categorias vinculados a ela permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
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
