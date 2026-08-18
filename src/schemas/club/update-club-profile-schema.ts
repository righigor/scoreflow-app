import { z } from "zod";

export const updateClubProfileSchema = z.object({
  // OBRIGATÓRIOS
  name: z.string().min(2, "Nome é obrigatório (mín. 2 caracteres)"),
  short_name: z.string().min(2, "Nome curto obrigatório").max(20, "Máximo 20 caracteres"),
  sigla: z.string().min(2, "Sigla obrigatória").max(5, "Máximo 5 letras"),
  email: z.string().email("E-mail inválido"),
  
  // OPCIONAIS (Aceitam vazio)
  contact_email: z.string().email("E-mail de contato inválido").or(z.literal("")),
  cnpj: z.string().or(z.literal("")),
  foundation_date: z.string().or(z.literal("")),
  bio: z.string().or(z.literal("")),
  instagram_url: z.string().or(z.literal("")),
  primary_color: z.string().or(z.literal("")),
  secondary_color: z.string().or(z.literal("")),
  
  // Endereço
  street: z.string().or(z.literal("")),
  number: z.string().or(z.literal("")),
  complement: z.string().or(z.literal("")),
  neighborhood: z.string().or(z.literal("")),
  city: z.string().or(z.literal("")),
  state: z.string().or(z.literal("")),
  zip_code: z.string().or(z.literal("")),

  // Diretoria
  president_name: z.string().or(z.literal("")),
  president_instagram: z.string().or(z.literal("")),
  vice_president_name: z.string().or(z.literal("")),
  vice_president_instagram: z.string().or(z.literal("")),

  // Arrays/Objetos
  phones: z.array(z.string()),
  social_links: z.record(z.string(), z.string()),
});

export type UpdateClubProfileSchemaType = z.infer<typeof updateClubProfileSchema>;