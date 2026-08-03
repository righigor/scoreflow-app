export interface ModalityType {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  created_at: string;
}

export type ModalityIdArrayType = {
  modality_id: string;
}[];