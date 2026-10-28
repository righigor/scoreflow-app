import { type UseFormReturn } from "react-hook-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CreateChampionshipSchemaType } from "@/schemas/championship/create-championship-schema";

interface ChampionshipBasicFormProps {
  form: UseFormReturn<CreateChampionshipSchemaType>;
}

export function ChampionshipBasicForm({
  form,
}: ChampionshipBasicFormProps) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Dados do Campeonato</CardTitle>
        <CardDescription>
          Informações básicas que serão exibidas publicamente.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <Label htmlFor="name">
            Nome do Campeonato <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            placeholder="Ex: Campeonato Mineiro de Ginástica Rítmica 2025"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5 md:col-span-2">
          <Label htmlFor="location">Local</Label>
          <Input
            id="location"
            placeholder="Ex: Belo Horizonte - MG"
            {...register("location")}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="start_date">
            Data de Início <span className="text-destructive">*</span>
          </Label>
          <Input id="start_date" type="date" {...register("start_date")} />
          {errors.start_date && (
            <p className="text-xs text-destructive">
              {errors.start_date.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="end_date">
            Data de Fim <span className="text-destructive">*</span>
          </Label>
          <Input id="end_date" type="date" {...register("end_date")} />
          {errors.end_date && (
            <p className="text-xs text-destructive">
              {errors.end_date.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="inscription_start_date">
            Início das Inscrições <span className="text-destructive">*</span>
          </Label>
          <Input
            id="inscription_start_date"
            type="date"
            {...register("inscription_start_date")}
          />
          {errors.inscription_start_date && (
            <p className="text-xs text-destructive">
              {errors.inscription_start_date.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="inscription_end_date">
            Fim das Inscrições <span className="text-destructive">*</span>
          </Label>
          <Input
            id="inscription_end_date"
            type="date"
            {...register("inscription_end_date")}
          />
          {errors.inscription_end_date && (
            <p className="text-xs text-destructive">
              {errors.inscription_end_date.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="fee_per_athlete">Taxa por Atleta (R$)</Label>
          <Input
            id="fee_per_athlete"
            placeholder="0,00"
            {...register("fee_per_athlete")}
          />
          <p className="text-[11px] text-muted-foreground">
            Valor de referência exibido na inscrição. Sem cobrança automática.
          </p>
        </div>

        <div className="flex flex-col gap-1.5 md:col-span-2">
          <Label htmlFor="description">Descrição</Label>
          <textarea
            id="description"
            rows={3}
            placeholder="Informações adicionais sobre o campeonato..."
            className="flex min-h-20 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            {...register("description")}
          />
        </div>
      </CardContent>
    </Card>
  );
}