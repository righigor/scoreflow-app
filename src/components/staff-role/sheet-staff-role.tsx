import { useEffect, useState } from "react";
import { Pencil, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { LoadingBtn } from "@/components/buttons/loading-btn";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { StaffRoleType } from "@/types/staff/staff-type";
import { createStaffRoleSchema, type CreateStaffRoleSchemaType } from "@/schemas/staff/create-staff-role-schema";
import { useCreateStaffRole } from "@/hooks/staff/POST/use-create-staff-role";
import { useUpdateStaffRole } from "@/hooks/staff/PUT/use-update-staff-role";

interface SheetStaffRoleProps {
  roleToEdit: StaffRoleType | null;
  clearEdit: () => void;
}

export default function SheetStaffRole({ roleToEdit, clearEdit }: SheetStaffRoleProps) {
  const [open, setOpen] = useState(!!roleToEdit);
  const isEditing = !!roleToEdit;

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateStaffRoleSchemaType>({
    resolver: zodResolver(createStaffRoleSchema),
  });

  const { mutate: createMutate, isPending: isCreating } = useCreateStaffRole();
  const { mutate: updateMutate, isPending: isUpdating } = useUpdateStaffRole();

  useEffect(() => {
    if (roleToEdit) {
      reset({ name: roleToEdit.name });
    }
  }, [roleToEdit, reset]);

  const onSubmit = (data: CreateStaffRoleSchemaType) => {
    if (isEditing && roleToEdit) {
      updateMutate(
        { id: roleToEdit.id, data },
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
          {isEditing ? "Editar Função" : "Nova Função"}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{isEditing ? "Editar Função" : "Adicionar Função"}</SheetTitle>
          <SheetDescription>
            {isEditing ? "Altere o nome da função." : "O slug será gerado automaticamente com base no nome."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="px-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Nome da Função</Label>
              <Input id="name" {...register("name")} placeholder="Ex: Preparador Físico" autoFocus />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>
          </div>

          <SheetFooter>
            <LoadingBtn isLoading={isSaving} type="submit" className="w-full cursor-pointer">
              {isEditing ? "Salvar Alterações" : "Criar Função"}
            </LoadingBtn>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}