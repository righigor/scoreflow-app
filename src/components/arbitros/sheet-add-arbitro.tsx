import { PlusIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  Brevet,
  createArbitroSchema,
  type CreateArbitroSchemaType,
} from "@/schemas/arbitro/create-arbitro-schema";
import { useCreateArbitro } from "@/hooks/arbitros/POST/use-create-arbitro";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { LoadingBtn } from "../buttons/loading-btn";
import {
  Select,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "../ui/select";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

export default function SheetAddArbitros() {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateArbitroSchemaType>({
    defaultValues: {},
    resolver: zodResolver(createArbitroSchema),
  });

  const { mutate, isPending } = useCreateArbitro();

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
          Adicionar Árbitros
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Adicione um Árbitro</SheetTitle>
          <SheetDescription>
            Formulário para adicionar um novo árbitro.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          {/* Inputs permanecem iguais, só removi o wrapper desnecessário px-8 */}
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
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                {...register("cpf")}
                placeholder="CPF do árbitro"
              />
              {errors.cpf && (
                <p className="text-sm text-destructive">{errors.cpf.message}</p>
              )}
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
