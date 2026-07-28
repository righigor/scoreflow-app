export interface BaseCategoryType {
  id: string;
  name: string;
  slug: string;
  modality_id: string;
  gender: 'F' | 'M' | 'MIXED';
}