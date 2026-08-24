import { z } from "zod";

export const modalitySchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
});

export type ModalitySchemaType = z.infer<typeof modalitySchema>;