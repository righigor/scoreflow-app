export interface FederationType {
  id: string;
  name: string;
  slug: string;
  sigla: string;
  image_url: string | null;
  status: "ACTIVE" | "INACTIVE" | "TRIAL";
  primary_color: string;
  secondary_color: string;
  address_id: string | null;
  bio: string | null;
  contact_email: string | null;
  cnpj: string | null;
  foundation_date: string | null;
  president_name: string | null;
  president_instagram: string | null;
  vice_president_name: string | null;
  vice_president_instagram: string | null;
  phones: string[];
  social_links: Record<string, string>;
  created_at: string;
}

export interface AddressType {
  id: string;
  street: string | null;
  number: string | null;
  complement: string | null;
  neighborhood: string | null;
  city: string;
  state: string;
  zip_code: string | null;
}

export interface FederationWithAddressType extends FederationType {
  addresses: AddressType | null;
}