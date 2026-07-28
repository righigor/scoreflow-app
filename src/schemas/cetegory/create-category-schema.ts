import { z } from "zod";

export const createCategorySchema = z.object({
  modality_id: z.string().min(1, "Selecione uma modalidade"),
  name: z.string().min(2, "Mínimo 2 caracteres"),
  slug: z.string().min(2, "Mínimo 2 caracteres").regex(/^[a-z0-9-]+$/, "Apenas letras minúsculas e hífens"),
  gender: z.enum(['F', 'M', 'MIXED'] as const, { message: "Selecione o gênero" }),
});

export type CreateCategorySchemaType = z.infer<typeof createCategorySchema>;