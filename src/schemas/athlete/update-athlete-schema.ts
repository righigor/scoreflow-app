import { z } from "zod";

export const updateAthleteSchema = z.object({
  name: z.string().min(2, "Nome é obrigatório (mín. 2 caracteres)"),
  cpf: z.string().or(z.literal("")),
  phone: z.string().or(z.literal("")),
  birthdate: z.string().or(z.literal("")),
  gender: z.enum(["F", "M", "OTHER"]),
  instagram_url: z.string().or(z.literal("")),
  status: z.enum(["ACTIVE", "INJURED", "INACTIVE", "RETIRED", "FREE_AGENT"]),
  modalities: z.array(z.string()).min(1, "Selecione ao menos uma modalidade"),
});

export type UpdateAthleteSchemaType = z.infer<typeof updateAthleteSchema>;