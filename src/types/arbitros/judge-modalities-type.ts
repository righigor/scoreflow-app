import type { ModalityType } from "@/types/modality/modality-type";

export interface JudgeModalityType {
  judge_id: string;
  modality_id: string;
}

export interface JudgeWithModalitiesType extends ModalityType {
  judge_modalities: { modality_id: string }[];
}