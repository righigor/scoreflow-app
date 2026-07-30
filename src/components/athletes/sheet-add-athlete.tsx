import { PlusIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  createAthleteSchema,
  type CreateAthleteSchemaType,
} from "@/schemas/athlete/create-athlete-schema";
import { useGetClubModalities } from "@/hooks/club/GET/use-get-club-modalities";
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { useCreateAthlete } from "@/hooks/athletes/POST/use-create-athlete";

interface SheetAddAthleteProps {
  defaultModalityId?: string;
}

export default function SheetAddAthlete({ defaultModalityId }: SheetAddAthleteProps) {
  const [open, setOpen] = useState(false);
  const { data: clubModalities } = useGetClubModalities();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateAthleteSchemaType>({
    // Se veio do card de 1 modalidade única, já preenche o array do Zod
    defaultValues: {
      modalities: defaultModalityId ? [defaultModalityId] : [],
    },
    resolver: zodResolver(createAthleteSchema),
  });

  const { mutate, isPending } = useCreateAthlete();

  const onSubmit = (data: CreateAthleteSchemaType) => {
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
          Novo Atleta
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Adicione um Atleta</SheetTitle>
          <SheetDescription>
            Preencha os dados principais. Os documentos podem ser enviados depois.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="flex flex-col gap-4 px-4 overflow-y-auto max-h-[calc(100vh-200px)]">
            
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Nome Completo</Label>
              <Input id="name" {...register("name")} placeholder="Nome do atleta" />
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
                {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="birthdate">Data de Nascimento</Label>
                <Input id="birthdate" type="date" {...register("birthdate")} />
                {errors.birthdate && <p className="text-sm text-destructive">{errors.birthdate.message}</p>}
              </div>

              <Controller
                control={control}
                name="gender"
                render={({ field }) => (
                  <div className="flex flex-col gap-1.5">
                    <Label>Gênero</Label>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
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
                )}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="instagram_url">Instagram (Opcional)</Label>
              <Input id="instagram_url" {...register("instagram_url")} placeholder="https://instagram.com/..." />
            </div>

            {/* Seleção de Modalidades com Checkboxes */}
            <Controller
              control={control}
              name="modalities"
              render={({ field }) => (
                <div className="flex flex-col gap-2">
                  <Label>Modalidades</Label>
                  <Card className="p-3">
                    <CardContent className="p-0 flex flex-col gap-2">
                      {clubModalities?.map((mod) => {
                        const isChecked = field.value?.includes(mod.modality_id);
                        return (
                          <label
                            key={mod.modality_id}
                            className="flex items-center space-x-2 cursor-pointer"
                          >
                            <Checkbox
                              checked={isChecked}
                              disabled={clubModalities.length === 1} // Trava se tiver só 1 opção
                              onCheckedChange={(checked) => {
                                const currentValue = field.value || [];
                                if (checked) {
                                  field.onChange([...currentValue, mod.modality_id]);
                                } else {
                                  field.onChange(currentValue.filter((id) => id !== mod.modality_id));
                                }
                              }}
                            />
                            <span className="text-sm font-medium leading-none">
                              {mod.name}
                            </span>
                          </label>
                        );
                      })}
                    </CardContent>
                  </Card>
                  {errors.modalities && (
                    <p className="text-sm text-destructive">{errors.modalities.message}</p>
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
              Cadastrar Atleta
            </LoadingBtn>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}