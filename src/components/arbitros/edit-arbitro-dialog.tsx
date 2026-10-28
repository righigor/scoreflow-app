import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Brevet } from "@/schemas/arbitro/create-arbitro-schema";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingBtn } from "@/components/buttons/loading-btn";
import { useUpdateArbitro } from "@/hooks/judges/UPDATE/use-update-arbitro";
import type { ArbitroType } from "@/types/arbitros/arbitro-type";
import {
  updateArbitroSchema,
  type UpdateArbitroSchemaType,
} from "@/schemas/arbitro/update-arbitro-schema";
import { useGetModalities } from "@/hooks/modality/GET/use-get-modalities";

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
      telefone: arbitro.telefone ?? "",
      brevet: arbitro.brevet,
      modalities: arbitro.judge_modalities?.map((m) => m.id) ?? [],
    },
  });

  const { data: modalities } = useGetModalities();
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
          <Edit size={16} className="m-2" />
          Editar
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg overflow-y-auto max-h-[90vh] scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-300">
        <DialogHeader>
          <DialogTitle>Editar Árbitro</DialogTitle>
          <DialogDescription>
            Atualize os dados e modalidades do árbitro.
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

            <div className="flex flex-col gap-1.5">
              <Label>Telefone</Label>
              <Input
                id="tel-edit"
                {...register("telefone")}
                placeholder="(00) 00000-0000"
              />
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

            <Controller
              control={control}
              name="modalities"
              render={({ field }) => (
                <div className="flex flex-col gap-2">
                  <Label>
                    Modalidades
                    <span className="text-destructive ml-1">*</span>
                  </Label>
                  <Card className="p-3">
                    <CardContent className="p-0 flex flex-col gap-2">
                      {modalities?.map((mod) => {
                        const isChecked = field.value?.includes(mod.id);
                        return (
                          <label
                            key={mod.id}
                            className="flex items-center space-x-2 cursor-pointer"
                          >
                            <Checkbox
                              checked={isChecked}
                              onCheckedChange={(checked) => {
                                const current = field.value ?? [];
                                field.onChange(
                                  checked
                                    ? [...current, mod.id]
                                    : current.filter((id) => id !== mod.id),
                                );
                              }}
                            />
                            <span className="text-sm font-medium">
                              {mod.name}
                            </span>
                          </label>
                        );
                      })}
                      {errors.modalities && (
                        <p className="text-xs text-destructive">
                          {errors.modalities.message}
                        </p>
                      )}
                    </CardContent>
                  </Card>
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
