import { useEffect, useState } from "react";
import { Pencil, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  modalitySchema,
  type ModalitySchemaType,
} from "@/schemas/modality/modality-schema";
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

import type { ModalityType } from "@/types/modality/modality-type";
import { useCreateModality } from "@/hooks/modality/POST/use-create-modality";
import { useUpdateModality } from "@/hooks/modality/PUT/use-update-modality";
import { ImageUpload } from "../image-upload";

interface SheetModalityProps {
  modalityToEdit: ModalityType | null;
  clearEdit: () => void;
}

export default function SheetModality({
  modalityToEdit,
  clearEdit,
}: SheetModalityProps) {
  const [open, setOpen] = useState(!!modalityToEdit); // Já abre true se for edição
  const [file, setFile] = useState<File | null>(null);
  const isEditing = !!modalityToEdit;

  const { convert, isConverting } = useConvertToWebp();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ModalitySchemaType>({
    resolver: zodResolver(modalitySchema),
  });

  const { mutate: createMutate, isPending: isCreating } = useCreateModality();
  const { mutate: updateMutate, isPending: isUpdating } = useUpdateModality();

  useEffect(() => {
    if (modalityToEdit) {
      reset({ name: modalityToEdit.name });
    }
  }, [modalityToEdit, reset]);

  const onSubmit = async (data: ModalitySchemaType) => {
    try {
      let webpFile: File | undefined;
      if (file) {
        webpFile = await convert(file);
      }

      if (isEditing && modalityToEdit) {
        updateMutate(
          { id: modalityToEdit.id, data, file: webpFile },
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
          {isEditing ? "Editar Modalidade" : "Nova Modalidade"}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            {isEditing ? "Editar Modalidade" : "Adicionar Modalidade"}
          </SheetTitle>
          <SheetDescription>
            {isEditing
              ? "Altere os dados da modalidade abaixo."
              : "O slug será gerado automaticamente com base no nome."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid py-4">
          <div className="px-4 flex flex-col gap-6 justify-center items-center w-full">
            <ImageUpload
              currentImageUrl={isEditing ? modalityToEdit?.image_url : null}
              onFileSelect={setFile}
              previewClassName="h-32 w-32"
              label="Imagem da Modalidade"
            />

            <div className="flex flex-col gap-1.5 w-full">
              <Label htmlFor="name">Nome da Modalidade</Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="Ex: Ginástica Artística"
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
                  : "Criar Modalidade"}
            </LoadingBtn>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
