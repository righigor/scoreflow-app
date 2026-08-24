import { z } from "zod";
import { Brevet } from "./create-arbitro-schema";

export const updateJudgeProfileSchema = z.object({
  // Dados pessoais (tabela judges)
  name: z.string().min(2, "Nome é obrigatório (mín. 2 caracteres)"),
  email: z.string().email("E-mail inválido"),

  // Brevet (aparece no form mas fica disable — validação existe para o tipo)
  brevet: z.enum(Brevet, {
    message: "O brevet é obrigatório",
  }),

  // Dados financeiros (tabela judge_profile)
  cpf: z.string().or(z.literal("")),
  pis: z.string().or(z.literal("")),
  phone: z.string().or(z.literal("")),
  bank: z.string().or(z.literal("")),
  bank_branch: z.string().or(z.literal("")),
  bank_account: z.string().or(z.literal("")),
  pix_key: z.string().or(z.literal("")),
});

export type UpdateJudgeProfileSchemaType = z.infer<
  typeof updateJudgeProfileSchema
>;