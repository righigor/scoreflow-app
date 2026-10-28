import { z } from "zod";
import { Brevet } from "./create-arbitro-schema";

export const updateArbitroSchema = z.object({
  name: z
    .string()
    .min(3, "O nome deve ter pelo menos 3 caracteres")
    .max(100, "Nome muito longo"),
  email: z.email("Insira um e-mail válido"),
  telefone: z.string().optional().or(z.literal("")),
  brevet: z.enum(Brevet, { message: "O brevet é obrigatório" }),
  modalities: z.array(z.string()).min(1, "Selecione ao menos uma modalidade"),
});

export type UpdateArbitroSchemaType = z.infer<typeof updateArbitroSchema>;
