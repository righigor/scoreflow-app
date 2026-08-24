import { z } from "zod";

export const createFederationSchema = z.object({
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
  sigla: z.string().min(2, "Sigla obrigatória").max(10, "Máximo 10 letras"),
  status: z.enum(["ACTIVE", "INACTIVE", "TRIAL"], {
    message: "Selecione o status",
  }),
});

export type CreateFederationSchemaType = z.infer<typeof createFederationSchema>;