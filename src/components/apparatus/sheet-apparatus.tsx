import { useEffect, useState } from "react";
import { Pencil, Plus } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createApparatusSchema,
  type CreateApparatusSchemaType,
} from "@/schemas/apparatus/create-apparatus-schema";
import { useConvertToWebp } from "@/hooks/use-convert-to-webp";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LoadingBtn } from "@/components/buttons/loading-btn";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import type { ApparatusType } from "@/types/apparatus/apparatus-type";
import { useGetModalities } from "@/hooks/modality/GET/use-get-modalities";
import { useCreateApparatus } from "@/hooks/apparatus/POST/use-create-apparatus";
import { useUpdateApparatus } from "@/hooks/apparatus/PUT/use-update-apparatus";
import { ImageUpload } from "../image-upload";

interface SheetApparatusProps {
  apparatusToEdit: ApparatusType | null;
  clearEdit: () => void;
  defaultModalityId?: string;
}

export default function SheetApparatus({
  apparatusToEdit,
  clearEdit,
  defaultModalityId,
}: SheetApparatusProps) {
  const [open, setOpen] = useState(!!apparatusToEdit);
  const [file, setFile] = useState<File | null>(null);
  const isEditing = !!apparatusToEdit;

  const { convert, isConverting } = useConvertToWebp();
  const { data: modalities } = useGetModalities();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<CreateApparatusSchemaType>({
    resolver: zodResolver(createApparatusSchema),
    defaultValues: {
      modality_id: defaultModalityId || "",
      name: "",
    },
  });

  // Sincroniza os dados quando for editar
  useEffect(() => {
    if (apparatusToEdit) {
      reset({
        modality_id: apparatusToEdit.modality_id,
        name: apparatusToEdit.name,
      });
    }
  }, [apparatusToEdit, reset]);

  const { mutate: createMutate, isPending: isCreating } = useCreateApparatus();
  const { mutate: updateMutate, isPending: isUpdating } = useUpdateApparatus();

  const onSubmit = async (data: CreateApparatusSchemaType) => {
    try {
      let webpFile: File | undefined;
      if (file) {
        webpFile = await convert(file);
      }

      if (isEditing && apparatusToEdit) {
        updateMutate(
          { id: apparatusToEdit.id, data, file: webpFile },
          {
            onSuccess: () => {
              setOpen(false);
              reset();
              setFile(null);
              clearEdit();
            },
          },
        );
      } else {
        createMutate(
          { data, file: webpFile },
          {
            onSuccess: () => {
              setOpen(false);
              reset();
              setFile(null);
            },
          },
        );
      }
    } catch (error) {
      toast.error("Erro ao processar a imagem", {
        description:
          error instanceof Error ? error.message : "Tente outra imagem.",
      });
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      reset();
      setFile(null);
      clearEdit();
    }
  };

  const isSaving = isCreating || isUpdating || isConverting;

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger>
        <Button className="cursor-pointer">
          {isEditing ? (
            <Pencil className="h-4 w-4 mr-2" />
          ) : (
            <Plus className="h-4 w-4 mr-2" />
          )}
          {isEditing ? "Editar Aparelho" : "Novo Aparelho"}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            {isEditing ? "Editar Aparelho" : "Adicionar Aparelho"}
          </SheetTitle>
          <SheetDescription>
            Defina a qual modalidade este aparelho pertence.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="px-4 flex flex-col gap-6 justify-center items-center w-full">
            <ImageUpload
              currentImageUrl={apparatusToEdit?.image_url}
              onFileSelect={setFile}
              previewClassName="h-32 w-32 p-2"
              label="Imagem do Aparelho"
            />

            <div className="flex flex-col gap-1.5 w-full">
              <Label>Modalidade</Label>
              <Controller
                control={control}
                name="modality_id"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {modalities?.map((mod) => (
                          <SelectItem key={mod.id} value={mod.id}>
                            {mod.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.modality_id && (
                <p className="text-sm text-destructive">
                  {errors.modality_id.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5 w-full">
              <Label htmlFor="name">Nome do Aparelho</Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="Ex: Arco"
                autoFocus
              />
              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>
          </div>

          <SheetFooter>
            <LoadingBtn
              isLoading={isSaving}
              type="submit"
              className="w-full cursor-pointer"
            >
              {isConverting
                ? "Convertendo imagem..."
                : isEditing
                  ? "Salvar Alterações"
                  : "Criar Aparelho"}
            </LoadingBtn>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
