export interface StaffRoleType {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export type StatusStaffType = "ACTIVE" | "INACTIVE" | "RETIRED" | "FREE_AGENT";

export interface StaffType {
  id: string;
  club_id: string;
  staff_role_id: string;
  previous_athlete_id: string | null;
  name: string;
  cpf: string | null;
  phone: string | null;
  gender: "F" | "M" | "OTHER";
  profile_picture_url: string | null;
  status: StatusStaffType;
  instagram_url: string | null;
  identity_pdf_url: string | null;
  residence_proof_pdf_url: string | null;
  image_right_term_pdf_url: string | null;
  created_at: string;
  updated_at: string;
}

export type ModalityIdArrayType = {
  modality_id: string;
}[];

export interface StaffWithModalitiesType extends StaffType {
  role_name?: string;
  staff_modalities: ModalityIdArrayType;
}
