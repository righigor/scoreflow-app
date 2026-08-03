export interface BaseCategoryType {
  id: string;
  modality_id: string;
  name: string;
  slug: string;
  gender: "F" | "M" | "MIXED";
  created_at: string;
}