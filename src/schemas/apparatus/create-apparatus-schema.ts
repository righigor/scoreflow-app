import { z } from "zod";

export const createApparatusSchema = z.object({
  modality_id: z.string().min(1, "Selecione uma modalidade"),
  name: z.string().min(2, "Mínimo 2 caracteres"),
});

export type CreateApparatusSchemaType = z.infer<typeof createApparatusSchema>;