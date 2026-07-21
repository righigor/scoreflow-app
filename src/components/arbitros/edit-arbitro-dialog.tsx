import { useUpdateArbitro } from "@/hooks/arbitros/UPDATE/use-update-arbitro";
import type { ArbitroType } from "@/types/arbitros/arbitro-type";
import {
  updateArbitroSchema,
  type UpdateArbitroSchemaType,
} from "@/zod/arbitro/update-arbitro-schema";

import { zodResolver } from "@hookform/resolvers/zod";
import { Edit } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Brevet } from "@/zod/arbitro/create-arbitro-schema";
import {
  Select,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "../ui/select";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { LoadingBtn } from "../buttons/loading-btn";

interface EditArbitroDialogProps {
  arbitro: ArbitroType;
}

export default function EditArbitroDialog({ arbitro }: EditArbitroDialogProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<UpdateArbitroSchemaType>({
    resolver: zodResolver(updateArbitroSchema),
    defaultValues: {
      name: arbitro.name,
      email: arbitro.email,
      cpf: arbitro.cpf ?? "",
      telefone: arbitro.telefone ?? "",
      brevet: arbitro.brevet,
    },
  });

  const { mutate, isPending } = useUpdateArbitro();

  const onSubmit = (data: UpdateArbitroSchemaType) => {
    mutate({
      id: arbitro.id,
      data,
    });
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="outline" size="sm" className="cursor-pointer">
          <Edit size={16} className="mr-2" />
          Editar
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar Árbitro</DialogTitle>
          <DialogDescription>
            Faça as alterações no árbitro aqui. Clique em salvar quando
            terminar.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="grid gap-4 px-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name-edit">Nome</Label>
              <Input
                id="name-edit"
                {...register("name")}
                placeholder="Nome do árbitro"
              />
              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email-edit">Email</Label>
              <Input
                id="email-edit"
                type="email"
                {...register("email")}
                placeholder="Email do árbitro"
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="cpf-edit">CPF</Label>
                <Input
                  id="cpf-edit"
                  {...register("cpf")}
                  placeholder="000.000.000-00"
                />
                {errors.cpf && (
                  <p className="text-sm text-destructive">
                    {errors.cpf.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label>Telefone</Label>
                <Input
                  id="tel-edit"
                  {...register("telefone")}
                  placeholder="(00) 00000-0000"
                />
              </div>
            </div>

            <Controller
              control={control}
              name="brevet"
              render={({ field }) => (
                <div className="flex flex-col gap-1.5">
                  <Label>Brevet</Label>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o brevet" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {Brevet.map((b) => (
                          <SelectItem key={b} value={b}>
                            {b}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {errors.brevet && (
                    <p className="text-sm text-destructive">
                      {errors.brevet.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          <DialogFooter className="px-4">
            <DialogClose>
              <Button variant="outline" type="button">
                Cancelar
              </Button>
            </DialogClose>
            <LoadingBtn
              isLoading={isPending}
              type="submit"
              className="cursor-pointer"
            >
              Atualizar árbitro
            </LoadingBtn>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
