export interface FederationType {
  id: string;
  name: string;
  slug: string;
  sigla: string;
  image_url: string | null;
  status: "ACTIVE" | "INACTIVE" | "TRIAL";
  created_at: string;
}