import { useEffect, useState } from "react";
import { Pencil, Plus } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createFederationSchema,
  type CreateFederationSchemaType,
} from "@/schemas/federation/create-federation-schema";
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
import type { FederationType } from "@/types/federacao/federacao-type";
import { useCreateFederation } from "@/hooks/federacao/POST/use-create-federation";
import { useUpdateFederation } from "@/hooks/federacao/PUT/use-update-federation";
import { ImageUpload } from "../image-upload";

interface SheetFederationProps {
  federationToEdit: FederationType | null;
  clearEdit: () => void;
}

export default function SheetFederation({
  federationToEdit,
  clearEdit,
}: SheetFederationProps) {
  const [open, setOpen] = useState(!!federationToEdit);
  const [file, setFile] = useState<File | null>(null);
  const isEditing = !!federationToEdit;

  const { convert, isConverting } = useConvertToWebp();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<CreateFederationSchemaType>({
    resolver: zodResolver(createFederationSchema),
  });

  useEffect(() => {
    if (federationToEdit) {
      reset({
        name: federationToEdit.name,
        sigla: federationToEdit.sigla,
        status: federationToEdit.status,
      });
    }
  }, [federationToEdit, reset]);

  const { mutate: createMutate, isPending: isCreating } = useCreateFederation();
  const { mutate: updateMutate, isPending: isUpdating } = useUpdateFederation();

  const onSubmit = async (data: CreateFederationSchemaType) => {
    try {
      let webpFile: File | undefined;
      if (file) webpFile = await convert(file);

      if (isEditing && federationToEdit) {
        updateMutate(
          { id: federationToEdit.id, data, file: webpFile },
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
          {isEditing ? "Editar Federação" : "Nova Federação"}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            {isEditing ? "Editar Federação" : "Cadastrar Nova Federação"}
          </SheetTitle>
          <SheetDescription>
            {isEditing
              ? "Altere os dados da federação."
              : "Preencha os dados para adicionar um novo inquilino ao sistema."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="px-4 flex flex-col gap-6 justify-center items-center w-full">
            <ImageUpload
              currentImageUrl={federationToEdit?.image_url}
              onFileSelect={setFile}
              previewClassName="h-24 w-24 rounded-full"
              label="Logo da Federação"
            />

            <div className="flex flex-col gap-1.5 w-full">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="Ex: Federação Mineira de Ginástica"
                autoFocus
              />
              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="sigla">Sigla</Label>
                <Input
                  id="sigla"
                  {...register("sigla")}
                  placeholder="Ex: FMG"
                />
                {errors.sigla && (
                  <p className="text-sm text-destructive">
                    {errors.sigla.message}
                  </p>
                )}
              </div>

              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <div className="flex flex-col gap-1.5">
                    <Label>Status</Label>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="ACTIVE">Ativa</SelectItem>
                          <SelectItem value="TRIAL">
                            Em Teste (Trial)
                          </SelectItem>
                          <SelectItem value="INACTIVE">Inativa</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {errors.status && (
                      <p className="text-sm text-destructive">
                        {errors.status.message}
                      </p>
                    )}
                  </div>
                )}
              />
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
                  : "Cadastrar Federação"}
            </LoadingBtn>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
