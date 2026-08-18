import type { ModalityIdArrayType } from "../modality/modality-type";

// Tipo auxiliar para o join de endereço (1:1)
export interface ClubAddressType {
  street: string | null;
  number: string | null;
  complement: string | null;
  neighborhood: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
}

export interface ClubType {
  id: string;
  federation_id: string;
  name: string;
  short_name: string;
  sigla: string;
  email: string;
  status: "PENDING" | "ACTIVE" | "INACTIVE";
  
  // Dados Atualizados (Padronizado com Federação)
  cnpj: string | null;
  address_id: string | null;
  contact_email: string | null;
  image_url: string | null;
  bio: string | null;
  instagram_url: string | null;
  foundation_date: string | null;
  
  // Diretoria
  president_name: string | null;
  president_instagram: string | null;
  vice_president_name: string | null;
  vice_president_instagram: string | null;
  
  // Visual
  primary_color: string | null;
  secondary_color: string | null;
  
  // Arrays/JSONBs
  phones: string[] | null;
  social_links: Record<string, string> | null;
  
  // Join do Endereço (Vai virar objeto graças ao Hook)
  addresses: ClubAddressType | null; 
  
  created_at: string;
}

export interface ClubWithModalitiesType extends ClubType {
  club_modalities: ModalityIdArrayType;
}