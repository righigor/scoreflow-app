import { z } from "zod";

export const createStaffSchema = z.object({
  name: z.string().min(2, "Nome do membro é obrigatório (mín. 2 caracteres)"),
  cpf: z.string().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  gender: z.enum(["F", "M", "OTHER"] as const, "Selecione o gênero"),
  instagram_url: z.string().optional().or(z.literal("")),
  staff_role_id: z.string().min(1, "Selecione a função no clube"),
  modalities: z.array(z.string()).min(1, "Selecione pelo menos uma modalidade"),
});

export type CreateStaffSchemaType = z.infer<typeof createStaffSchema>;