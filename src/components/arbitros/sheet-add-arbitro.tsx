// src/components/arbitros/sheet-add-arbitro.tsx

import { PlusIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
import {
  Select,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  createArbitroSchema,
  type CreateArbitroSchemaType,
} from "@/schemas/arbitro/create-arbitro-schema";
import { useCreateArbitro } from "@/hooks/judges/POST/use-create-arbitro";
import { useGetModalities } from "@/hooks/modality/GET/use-get-modalities";

export default function SheetAddArbitros() {
  const [open, setOpen] = useState(false);

  const { data: modalities } = useGetModalities();
  const { mutate, isPending } = useCreateArbitro();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateArbitroSchemaType>({
    defaultValues: {
      modalities: [],
    },
    resolver: zodResolver(createArbitroSchema),
  });

  const onSubmit = (data: CreateArbitroSchemaType) => {
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
          <PlusIcon className="h-4 w-4" />
          Adicionar Árbitro
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Adicionar Árbitro</SheetTitle>
          <SheetDescription>
            Convide os dados do árbitro para convidá-lo ao sistema.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4 overflow-y-auto max-h-[calc(100vh-10rem)] scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-300 ">
          <div className="flex flex-col gap-4 px-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
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
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
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
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                {...register("telefone")}
                placeholder="Telefone (opcional)"
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
                        {(
                          [
                            "ESTADUAL",
                            "NACIONAL",
                            "INTERNACIONAL",
                            "SECRETARIO",
                          ] as const
                        ).map((b) => (
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

          <Controller
            control={control}
            name="modalities"
            render={({ field }) => (
              <div className="px-4">
                <Card className="p-4">
                  <CardContent className="p-0 flex flex-col gap-3">
                    <label className="text-sm font-medium">
                      Modalidades
                      <span className="text-destructive ml-1">*</span>
                    </label>
                    {modalities?.map((modality) => {
                      const isChecked = field.value?.includes(modality.id);
                      return (
                        <label
                          key={modality.id}
                          className="flex items-center space-x-2 cursor-pointer"
                        >
                          <Checkbox
                            checked={isChecked}
                            onCheckedChange={(checked) => {
                              const current = field.value ?? [];
                              field.onChange(
                                checked
                                  ? [...current, modality.id]
                                  : current.filter((id) => id !== modality.id),
                              );
                            }}
                          />
                          <span className="text-sm font-medium">
                            {modality.name}
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

          <SheetFooter>
            <LoadingBtn
              isLoading={isPending}
              type="submit"
              className="w-full cursor-pointer"
            >
              Adicionar Árbitro
            </LoadingBtn>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
