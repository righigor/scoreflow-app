import { z } from "zod";

export const createChampionshipSchema = z.object({
  name: z.string().min(2, "Nome é obrigatório (mín. 2 caracteres)"),
  location: z.string().or(z.literal("")),
  start_date: z.string().min(1, "Data de início é obrigatória"),
  end_date: z.string().min(1, "Data de fim é obrigatória"),
  inscription_start_date: z
    .string()
    .min(1, "Início das inscrições é obrigatório"),
  inscription_end_date: z
    .string()
    .min(1, "Fim das inscrições é obrigatório"),
  description: z.string().or(z.literal("")),
  fee_per_athlete: z.string().or(z.literal("")),
});

export type CreateChampionshipSchemaType = z.infer<
  typeof createChampionshipSchema
>;