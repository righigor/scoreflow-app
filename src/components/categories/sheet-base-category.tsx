import { useEffect, useState } from "react";
import { Pencil, Plus } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { LoadingBtn } from "@/components/buttons/loading-btn";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectGroup, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";
import type { BaseCategoryType } from "@/types/category/category-type";
import { useGetModalities } from "@/hooks/modality/GET/use-get-modalities";
import { createBaseCategorySchema, type CreateBaseCategorySchemaType } from "@/schemas/base-category/create-base-category";
import { useCreateBaseCategory } from "@/hooks/base-category/POST/use-create-base-category";
import { useUpdateBaseCategory } from "@/hooks/base-category/PUT/use-update-base-category";

interface SheetBaseCategoryProps {
  categoryToEdit: BaseCategoryType | null;
  clearEdit: () => void;
  defaultModalityId?: string;
}

export default function SheetBaseCategory({ categoryToEdit, clearEdit, defaultModalityId }: SheetBaseCategoryProps) {
  const [open, setOpen] = useState(!!categoryToEdit);
  const isEditing = !!categoryToEdit;
  const { data: modalities } = useGetModalities();

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<CreateBaseCategorySchemaType>({
    resolver: zodResolver(createBaseCategorySchema),
    defaultValues: {
      modality_id: defaultModalityId || "",
      name: "",
      gender: undefined,
    },
  });

  useEffect(() => {
    if (categoryToEdit) {
      reset({
        modality_id: categoryToEdit.modality_id,
        name: categoryToEdit.name,
        gender: categoryToEdit.gender,
      });
    }
  }, [categoryToEdit, reset]);

  const { mutate: createMutate, isPending: isCreating } = useCreateBaseCategory();
  const { mutate: updateMutate, isPending: isUpdating } = useUpdateBaseCategory();

  const onSubmit = (data: CreateBaseCategorySchemaType) => {
    if (isEditing && categoryToEdit) {
      updateMutate(
        { id: categoryToEdit.id, data },
        { onSuccess: () => { setOpen(false); reset(); clearEdit(); } }
      );
    } else {
      createMutate(
        data,
        { onSuccess: () => { setOpen(false); reset(); } }
      );
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) { reset(); clearEdit(); }
  };

  const isSaving = isCreating || isUpdating;

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger>
        <Button className="cursor-pointer">
          {isEditing ? <Pencil className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
          {isEditing ? "Editar Categoria" : "Nova Categoria"}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{isEditing ? "Editar Categoria" : "Adicionar Categoria"}</SheetTitle>
          <SheetDescription>Defina a qual modalidade e qual gênero esta categoria pertence.</SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="px-4 flex flex-col gap-6 w-full">
            
            <Controller
              control={control}
              name="modality_id"
              render={({ field }) => (
                <div className="flex flex-col gap-1.5">
                  <Label>Modalidade</Label>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {modalities?.map((mod) => (
                          <SelectItem key={mod.id} value={mod.id}>{mod.name}</SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {errors.modality_id && <p className="text-sm text-destructive">{errors.modality_id.message}</p>}
                </div>
              )}
            />

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Nome da Categoria</Label>
              <Input id="name" {...register("name")} placeholder="Ex: Mirim" autoFocus />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <Controller
              control={control}
              name="gender"
              render={({ field }) => (
                <div className="flex flex-col gap-1.5">
                  <Label>Gênero</Label>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="F">Feminino</SelectItem>
                        <SelectItem value="M">Masculino</SelectItem>
                        <SelectItem value="MIXED">Misto</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {errors.gender && <p className="text-sm text-destructive">{errors.gender.message}</p>}
                </div>
              )}
            />
          </div>

          <SheetFooter>
            <LoadingBtn isLoading={isSaving} type="submit" className="w-full cursor-pointer">
              {isEditing ? "Salvar Alterações" : "Criar Categoria"}
            </LoadingBtn>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}