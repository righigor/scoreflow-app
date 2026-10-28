import type { Brevet } from "@/schemas/arbitro/create-arbitro-schema";
import type { ModalityType } from "@/types/modality/modality-type";

export type ArbitroStatus = "INVITED" | "ACTIVE" | "INACTIVE" | "INJURED" | "RETIRED" | "FREE_AGENT";

export interface ArbitroType {
  id: string;
  federation_id: string;
  name: string;
  image_url: string | null;
  email: string;
  brevet: Brevet;
  telefone: string | null;
  active: boolean;
  status: ArbitroStatus;
  judge_modalities: ModalityType[];
  created_at: string;
  updated_at: string;
}

export interface JudgeSimpleType {
  id: string;
  name: string;
  brevet: Brevet;
  judge_modalities: ModalityIdArrayType;
}

export type ModalityIdArrayType = {
  modality_id: string;
}[];