import { useState } from "react";
import { PlusIcon } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createApparatusSchema,
  type CreateApparatusSchemaType,
} from "@/schemas/apparatus/create-apparatus-schema";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { LoadingBtn } from "@/components/buttons/loading-btn";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller } from "react-hook-form";
import { useGetModalities } from "@/hooks/admin/GET/use-get-modalities";
import { useCreateApparatus } from "@/hooks/admin/POST/use-create-apparatus";

export default function SheetAddApparatus() {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useCreateApparatus();
  const { data: modalities } = useGetModalities();
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("image_file", file);
      setPreview(URL.createObjectURL(file));
    } else {
      setValue("image_file", undefined);
      setPreview(null);
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<CreateApparatusSchemaType>({
    resolver: zodResolver(createApparatusSchema),
    defaultValues: {
      name: "",
      slug: "",
      modality_id: "",
    },
  });

  const onSubmit = (data: CreateApparatusSchemaType) => {
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
          Novo Aparelho
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Adicionar Aparelho</SheetTitle>
          <SheetDescription>
            Aparelhos são dados globais usados por todas as federações ao criar
            campeonatos.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="space-y-4 px-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="image_file">Imagem do Aparelho (Opcional)</Label>
              <Input
                id="image_file"
                type="file"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleFileChange}
                className="cursor-pointer"
              />
              <p className="text-xs text-muted-foreground">
                Será convertida automaticamente para WebP.
              </p>

              {preview && (
                <div className="relative mt-2 w-24 h-24 rounded-lg overflow-hidden border">
                  <img
                    src={preview}
                    alt="Preview"
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
            </div>
            <Controller
              control={control}
              name="modality_id"
              render={({ field }) => (
                <div className="flex flex-col gap-1.5">
                  <Label>Modalidade</Label>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a modalidade" />
                    </SelectTrigger>
                    <SelectContent>
                      {modalities?.map((mod) => (
                        <SelectItem key={mod.id} value={mod.id}>
                          <span>{mod.name}</span>
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
              <Label htmlFor="name">Nome do Aparelho</Label>
              <Input id="name" placeholder="Ex: Bola" {...register("name")} />
              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="slug">Slug (Identificador Único)</Label>
              <Input
                id="slug"
                placeholder="Ex: bola-ritmica"
                {...register("slug")}
              />
              {errors.slug && (
                <p className="text-sm text-destructive">
                  {errors.slug.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Usado no banco de dados e URLs. Letras minúsculas e hífens.
              </p>
            </div>
          </div>

          <SheetFooter className="px-4">
            <LoadingBtn
              isLoading={isPending}
              type="submit"
              className="w-full cursor-pointer"
            >
              Salvar Aparelho
            </LoadingBtn>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
