import type { ModalityIdArrayType } from "../modality/modality-type";

export interface ClubType {
  id: string;
  federation_id: string;
  name: string;
  short_name: string;
  sigla: string;
  email: string;
  status: "PENDING" | "ACTIVE" | "INACTIVE";
  cnpj: string | null;
  address: string | null;
  phone: string | null;
  image_url: string | null;
  bio: string | null;
  president: string | null;
  foundation_date: string | null;
  created_at: string;
}

export interface ClubWithModalitiesType extends ClubType {
  club_modalities: ModalityIdArrayType;
}
