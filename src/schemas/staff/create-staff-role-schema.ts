import { z } from "zod";

export const createStaffRoleSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
});

export type CreateStaffRoleSchemaType = z.infer<typeof createStaffRoleSchema>;