import { z } from "zod";

export const createApparatusSchema = z.object({
  modality_id: z.string().min(1, "Selecione uma modalidade"),
  name: z.string().min(2, "Mínimo 2 caracteres"),
  slug: z.string().min(2, "Mínimo 2 caracteres").regex(/^[a-z0-9-]+$/, "Apenas letras minúsculas e hífens"),
  image_file: z.any().optional(),
});

export type CreateApparatusSchemaType = z.infer<typeof createApparatusSchema>;