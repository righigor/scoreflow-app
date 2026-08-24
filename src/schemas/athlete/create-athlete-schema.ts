// src/schemas/athlete/create-athlete-schema.ts

import { z } from "zod";

export const createAthleteSchema = z.object({
  name: z.string().min(2, "Nome do atleta é obrigatório (mín. 2 caracteres)"),
  cpf: z.string().optional().or(z.literal("")), // Opcional na criação
  phone: z.string().optional().or(z.literal("")),
  birthdate: z.string().min(1, "Data de nascimento é obrigatória"),
  gender: z.enum(["F", "M", "OTHER"] as const, {
    message: "Selecione o gênero",
  }),
  instagram_url: z.string().optional().or(z.literal("")),
  modalities: z.array(z.string()).min(1, "Selecione pelo menos uma modalidade"),
});

// Corrigido em relação ao padrão anterior do repo (adicionado <typeof ...>)
export type CreateAthleteSchemaType = z.infer<typeof createAthleteSchema>;