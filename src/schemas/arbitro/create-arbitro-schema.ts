import { z } from "zod";

export const Brevet = [
  "ESTADUAL",
  "NACIONAL",
  "INTERNACIONAL",
  "SECRETARIO",
] as const;
export type Brevet = (typeof Brevet)[number];

export const createArbitroSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  email: z.email("Email inválido"),
  telefone: z.string().or(z.literal("")),
  brevet: z.enum(Brevet, { message: "O brevet é obrigatório" }),
  modalities: z
    .array(z.string())
    .min(1, "Selecione ao menos uma modalidade"),
});

export type CreateArbitroSchemaType = z.infer<typeof createArbitroSchema>;