import { z } from "zod";

export const updateStaffSchema = z.object({
  name: z.string().min(2, "Nome é obrigatório (mín. 2 caracteres)"),
  cpf: z.string().or(z.literal("")),
  phone: z.string().or(z.literal("")),
  gender: z.enum(["F", "M", "OTHER"]),
  instagram_url: z.string().or(z.literal("")),
  staff_role_id: z.string().min(1, "Selecione uma função"),
  status: z.enum(["ACTIVE", "INACTIVE", "RETIRED", "FREE_AGENT"]),
  modalities: z.array(z.string()).min(1, "Selecione ao menos uma modalidade"),
});

export type UpdateStaffSchemaType = z.infer<typeof updateStaffSchema>;