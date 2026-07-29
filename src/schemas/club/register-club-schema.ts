import { z } from "zod";

export const registerClubSchema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres"),
  short_name: z.string().min(2, "Nome curto obrigatório"),
  sigla: z.string().min(2, "Sigla obrigatória").max(5, "Máximo 5 letras"),
  email: z.email("E-mail inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  passwordConfirm: z.string(),
  modalities: z.array(z.string()).min(1, "Selecione pelo menos uma modalidade"),
}).refine((data) => data.password === data.passwordConfirm, {
  message: "As senhas não coincidem",
  path: ["passwordConfirm"],
});

export type RegisterClubSchemaType = z.infer<typeof registerClubSchema>;