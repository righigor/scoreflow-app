import { z } from "zod";
import { Brevet } from "./create-arbitro-schema";

export const updateArbitroSchema = z.object({
  name: z
    .string()
    .min(3, "O nome deve ter pelo menos 3 caracteres")
    .max(100, "Nome muito longo"),

  email: z.email("Insira um e-mail válido"),
  cpf: z
    .string()
    .refine(
      (val) => {
        if (!val || val.trim() === "") return true;
        // return DataValidator.checkCPF(val);
        return val.length === 11;
      },
      {
        message: "CPF inválido",
      },
    )
    .optional()
    .or(z.literal("")),

  telefone: z.string().optional().or(z.literal("")),

  brevet: z.enum(Brevet, {
    message: "O brevet é obrigatório",
  }),
});

export type UpdateArbitroSchemaType = z.infer<typeof updateArbitroSchema>;
