import type { Brevet } from "@/schemas/arbitro/create-arbitro-schema";

export interface ArbitroType {
  id: string;
  federation_id: string;
  name: string;
  image_url: string | null;
  email: string;
  brevet: Brevet;
  telefone: string | null;
  active: boolean;
  created_at: string;
  status: 'INVITED' | 'ACTIVE';
  updated_at: string;
}
