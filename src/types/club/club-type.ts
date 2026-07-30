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
}

export interface ClubWithModalitiesType {
  id: string;
  name: string;
  short_name: string;
  sigla: string;
  image_url: string | null;
  status: string;
  club_modalities: ModalityIdArrayType;
}
