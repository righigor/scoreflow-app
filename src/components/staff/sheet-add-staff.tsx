import { PlusIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { createStaffSchema, type CreateStaffSchemaType } from "@/schemas/staff/create-staff-schema";
import { useGetClubModalities } from "@/hooks/club/GET/use-get-club-modalities";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { LoadingBtn } from "@/components/buttons/loading-btn";
import { Select, SelectGroup, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { useGetStaffRoles } from "@/hooks/staff/GET/use-get-staff-roles";
import { useCreateStaff } from "@/hooks/staff/POST/use-create-staff";

interface SheetAddStaffProps {
  defaultModalityId?: string;
}

export default function SheetAddStaff({ defaultModalityId }: SheetAddStaffProps) {
  const [open, setOpen] = useState(false);
  const { data: clubModalities } = useGetClubModalities();
  const { data: staffRoles, isPending: isLoadingRoles } = useGetStaffRoles();

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<CreateStaffSchemaType>({
    defaultValues: { modalities: defaultModalityId ? [defaultModalityId] : [] },
    resolver: zodResolver(createStaffSchema),
  });

  const { mutate, isPending } = useCreateStaff();

  const onSubmit = (data: CreateStaffSchemaType) => {
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
        <Button className="cursor-pointer"><PlusIcon className="h-4 w-4" />Novo Membro</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Adicione à Comissão</SheetTitle>
          <SheetDescription>Preencha os dados do membro da comissão técnica.</SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="flex flex-col gap-4 px-4 overflow-y-auto max-h-[calc(100vh-200px)]">
            
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Nome Completo</Label>
              <Input id="name" {...register("name")} placeholder="Nome do membro" />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="cpf">CPF</Label>
                <Input id="cpf" {...register("cpf")} placeholder="000.000.000-00" />
                {errors.cpf && <p className="text-sm text-destructive">{errors.cpf.message}</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="phone">Telefone</Label>
                <Input id="phone" {...register("phone")} placeholder="(00) 00000-0000" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Controller control={control} name="gender" render={({ field }) => (
                <div className="flex flex-col gap-1.5">
                  <Label>Gênero</Label>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="F">Feminino</SelectItem>
                        <SelectItem value="M">Masculino</SelectItem>
                        <SelectItem value="OTHER">Outro</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {errors.gender && <p className="text-sm text-destructive">{errors.gender.message}</p>}
                </div>
              )} />

              <Controller control={control} name="staff_role_id" render={({ field }) => (
                <div className="flex flex-col gap-1.5">
                  <Label>Função</Label>
                  <Select onValueChange={field.onChange} value={field.value} disabled={isLoadingRoles}>
                    <SelectTrigger><SelectValue placeholder="Selecione a função" /></SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {staffRoles?.map((role) => (
                          <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {errors.staff_role_id && <p className="text-sm text-destructive">{errors.staff_role_id.message}</p>}
                </div>
              )} />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="instagram_url">Instagram (Opcional)</Label>
              <Input id="instagram_url" {...register("instagram_url")} placeholder="https://instagram.com/..." />
            </div>

            <Controller control={control} name="modalities" render={({ field }) => (
              <div className="flex flex-col gap-2">
                <Label>Modalidades</Label>
                <Card className="p-3">
                  <CardContent className="p-0 flex flex-col gap-2">
                    {clubModalities?.map((mod) => {
                      const isChecked = field.value?.includes(mod.modality_id);
                      return (
                        <label key={mod.modality_id} className="flex items-center space-x-2 cursor-pointer">
                          <Checkbox checked={isChecked} disabled={clubModalities.length === 1} onCheckedChange={(checked) => {
                            const currentValue = field.value || [];
                            field.onChange(checked ? [...currentValue, mod.modality_id] : currentValue.filter((id) => id !== mod.modality_id));
                          }} />
                          <span className="text-sm font-medium leading-none">{mod.name}</span>
                        </label>
                      );
                    })}
                  </CardContent>
                </Card>
                {errors.modalities && <p className="text-sm text-destructive">{errors.modalities.message}</p>}
              </div>
            )} />
          </div>

          <SheetFooter>
            <LoadingBtn isLoading={isPending} type="submit" className="w-full cursor-pointer">Cadastrar Membro</LoadingBtn>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}