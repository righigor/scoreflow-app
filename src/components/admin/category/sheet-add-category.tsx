import { useState } from "react";
import { PlusIcon } from "lucide-react";
import { useCreateCategory } from "@/hooks/admin/POST/use-create-category";
import { useGetModalities } from "@/hooks/admin/GET/use-get-modalities";
import {
  createCategorySchema,
  type CreateCategorySchemaType,
} from "@/schemas/cetegory/create-category-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { LoadingBtn } from "@/components/buttons/loading-btn";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function SheetAddCategory() {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useCreateCategory();
  const { data: modalities } = useGetModalities();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateCategorySchemaType>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: { modality_id: "", name: "", slug: "", gender: undefined },
  });

  const onSubmit = (data: CreateCategorySchemaType) => {
    mutate(data, {
      onSuccess: () => {
        setOpen(false);
        reset();
      },
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>
        <Button className="cursor-pointer">
          <PlusIcon className="h-4 w-4 mr-2" />
          Nova Categoria
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Adicionar Categoria Base</SheetTitle>
          <SheetDescription>
            Categorias genéricas que serão usadas como base para os campeonatos.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="space-y-4 px-4">
            <Controller
              control={control}
              name="modality_id"
              render={({ field }) => (
                <div className="flex flex-col gap-1.5">
                  <Label>Modalidade</Label>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {modalities?.map((m) => (
                        <SelectItem key={m.id} value={m.id}>
                          <span>{m.name}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.modality_id && (
                    <p className="text-sm text-destructive">
                      {errors.modality_id.message}
                    </p>
                  )}
                </div>
              )}
            />

            <div className="flex flex-col gap-1.5">
              <Label>Nome</Label>
              <Input placeholder="Ex: Mirim" {...register("name")} />
              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>Slug</Label>
              <Input placeholder="mirim" {...register("slug")} />
              {errors.slug && (
                <p className="text-sm text-destructive">
                  {errors.slug.message}
                </p>
              )}
            </div>

            <Controller
              control={control}
              name="gender"
              render={({ field }) => (
                <div className="flex flex-col gap-1.5">
                  <Label>Gênero</Label>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="F">
                        <span>Feminino</span>
                      </SelectItem>
                      <SelectItem value="M">
                        <span>Masculino</span>
                      </SelectItem>
                      <SelectItem value="MIXED">
                        <span>Misto</span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.gender && (
                    <p className="text-sm text-destructive">
                      {errors.gender.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>
          <SheetFooter className="px-4">
            <LoadingBtn
              isLoading={isPending}
              type="submit"
              className="w-full cursor-pointer"
            >
              Salvar Categoria
            </LoadingBtn>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
