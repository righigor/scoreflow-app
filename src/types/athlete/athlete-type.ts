import type { ModalityIdArrayType } from "../modality/modality-type";

export type StatusAthleteType = "ACTIVE" | "INJURED" | "INACTIVE" | "RETIRED" | "FREE_AGENT";

export interface AthleteType {
  id: string;
  club_id: string;
  name: string;
  cpf: string | null;
  phone: string | null;
  birthdate: string | null;
  gender: "F" | "M" | "OTHER";
  profile_picture_url: string | null;
  status: StatusAthleteType;
  instagram_url: string | null;
  identity_pdf_url: string | null;
  residence_proof_pdf_url: string | null;
  image_right_term_pdf_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface AthleteWithModalitiesType extends AthleteType {
  athlete_modalities: ModalityIdArrayType;
}