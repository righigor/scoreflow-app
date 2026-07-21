import type { Brevet } from "@/zod/arbitro/create-arbitro-schema";

export interface ArbitroType {
  id: string;
  federation_id: string;
  name: string;
  email: string;
  cpf: string | null;
  brevet: Brevet;
  telefone: string | null;
  active: boolean;
  created_at: string;
  // updated_at não colocamos na criação da tabela, mas se quiser, basta adicionar lá no SQL
}
