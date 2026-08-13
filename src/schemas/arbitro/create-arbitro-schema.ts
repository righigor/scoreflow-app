import { z } from "zod";
// import DataValidator from "@/utils/data-validator"; 

export const isValidCPF = (cpf: string) => {
  // return DataValidator.checkCPF(cpf); 
  return cpf.length === 11;
};

export const Brevet = ["ESTADUAL", "NACIONAL", "INTERNACIONAL", "SECRETARIO"] as const;
export type Brevet = (typeof Brevet)[number];

export const createArbitroSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  email: z.email("Email inválido"), 
  telefone: z.string().optional().or(z.literal("")),
    
  brevet: z.enum(Brevet, {
    message: "O brevet é obrigatório",
  }),
});

export type CreateArbitroSchemaType = z.infer<typeof createArbitroSchema>;
