import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash } from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { BaseCategoryType } from "@/types/category/category-type";
import { useDeleteBaseCategory } from "@/hooks/base-category/DELETE/use-delete-base-category";
import type { ModalityType } from "@/types/modality/modality-type";

function getGenderInfo(gender: string) {
  switch (gender) {
    case "F": return { label: "Feminino", variant: "default" as const };
    case "M": return { label: "Masculino", variant: "secondary" as const };
    case "MIXED": return { label: "Misto", variant: "outline" as const };
    default: return { label: gender, variant: "secondary" as const };
  }
}

interface BaseCategoryListProps {
  categories: BaseCategoryType[];
  isLoading: boolean;
  onEdit: (category: BaseCategoryType) => void;
  modalities: ModalityType[];
}

export default function BaseCategoryList({ categories, isLoading, onEdit, modalities }: BaseCategoryListProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteBaseCategory();

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Aparelhos Cadastrados {modalities.filter((m) => categories.some((cat) => cat.modality_id === m.id)).length > 0 && `(${modalities.filter((m) => categories.some((cat) => cat.modality_id === m.id)).map((m) => m.name).join(", ")})`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-10 text-sm text-muted-foreground">Carregando...</div>
          ) : categories.length === 0 ? (
            <div className="flex items-center justify-center py-10 text-sm text-muted-foreground">Nenhuma categoria nesta modalidade.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead className="w-30">Gênero</TableHead>
                  <TableHead className="w-25 text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((cat) => {
                  const genderInfo = getGenderInfo(cat.gender);
                  return (
                    <TableRow key={cat.id}>
                      <TableCell className="font-medium">{cat.name}</TableCell>
                      <TableCell>
                        <Badge variant={genderInfo.variant}>{genderInfo.label}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer" onClick={() => onEdit(cat)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive cursor-pointer" onClick={() => setDeleteId(cat.id)}>
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>Esta ação não pode ser desfeita. Isso excluirá a categoria permanentemente.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteCategory(deleteId!, { onSuccess: () => setDeleteId(null) })} disabled={isDeleting} className="bg-destructive text-white hover:bg-destructive/90 cursor-pointer">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}