import { z } from "zod";

export const createBaseCategorySchema = z.object({
  modality_id: z.string().min(1, "Selecione uma modalidade"),
  name: z.string().min(2, "Mínimo 2 caracteres"),
  gender: z.enum(["F", "M", "MIXED"], {
    message: "Selecione o gênero da categoria",
  }),
});

export type CreateBaseCategorySchemaType = z.infer<
  typeof createBaseCategorySchema
>;
