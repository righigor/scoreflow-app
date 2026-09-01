export type ChampionshipStatusType =
  | "DRAFT"
  | "OPEN"
  | "IN_PROGRESS"
  | "FINISHED";

export interface ChampionshipType {
  id: string;
  federation_id: string;
  modality_id: string;
  name: string;
  slug: string;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  inscription_start_date: string | null;
  inscription_end_date: string | null;
  description: string | null;
  regulation_pdf_url: string | null;
  fee_per_athlete: number | null;
  status: ChampionshipStatusType;
  inscription_token: string;
  logo_url: string | null;
  trophy_image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface CategoryWithApparatus {
  base_category_id: string;
  category_name: string;
  apparatus_ids: string[];
}

// ── Arbitragem ──

export interface JudgeSimpleType {
  id: string;
  name: string;
  brevet: string | null;
}

export interface ArbitrationSlot {
  judge_id: string | null;
  judge_name: string | null;
}

export type PanelRole = "A" | "E" | "DA" | "DB";

export interface ArbitrationConfig {
  director: ArbitrationSlot;
  secretary: ArbitrationSlot;
  panels: Record<PanelRole, ArbitrationSlot[]>;
}

export const EMPTY_SLOT: ArbitrationSlot = {
  judge_id: null,
  judge_name: null,
};

export const createEmptyPanel = (): ArbitrationSlot[] =>
  Array.from({ length: 4 }, () => ({ ...EMPTY_SLOT }));

export const createEmptyArbitration = (): ArbitrationConfig => ({
  director: { ...EMPTY_SLOT },
  secretary: { ...EMPTY_SLOT },
  panels: {
    A: createEmptyPanel(),
    E: createEmptyPanel(),
    DA: createEmptyPanel(),
    DB: createEmptyPanel(),
  },
});