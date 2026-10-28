import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth-store";
import { supabase } from "@/lib/supabase/client";
import type { JudgeFullProfileType } from "@/types/arbitros/judge-full-profile";
import type { ArbitroType } from "@/types/arbitros/arbitro-type";
import type { ModalityType } from "@/types/modality/modality-type";

type JudgeRaw = {
  id: string;
  federation_id: string;
  name: string;
  email: string;
  brevet: string;
  telefone: string | null;
  image_url: string | null;
  active: boolean;
  status: string;
  judge_modalities:
    | { modality_id: string; modalities: ModalityType | null }[]
    | null;
  created_at: string;
  updated_at: string;
  judge_profile: {
    id: string;
    judge_id: string;
    cpf: string | null;
    pis: string | null;
    phone: string | null;
    bank: string | null;
    bank_branch: string | null;
    bank_account: string | null;
    pix_key: string | null;
    created_at: string;
    updated_at: string;
  } | null;
};

export function useGetJudgeProfile() {
  const judgeId = useAuthStore((state) => state.profile?.judge_id);

  return useQuery({
    queryKey: ["judge", "profile"],
    queryFn: async (): Promise<JudgeFullProfileType> => {
      if (!judgeId) throw new Error("Sem juiz vinculado");

      const { data, error } = await supabase
        .from("judges")
        .select(
          "*, judge_modalities(modality_id, modalities(*)), judge_profile(*)",
        )
        .eq("id", judgeId)
        .single();

      if (error) throw new Error(error.message);

      const raw = data as JudgeRaw;
      return {
        judge: {
          id: raw.id,
          federation_id: raw.federation_id,
          name: raw.name,
          email: raw.email,
          brevet: raw.brevet as ArbitroType["brevet"],
          telefone: raw.telefone,
          image_url: raw.image_url,
          active: raw.active,
          status: raw.status as ArbitroType["status"],
          judge_modalities: (raw.judge_modalities ?? [])
            .map(({ modalities }) => modalities)
            .filter((modality): modality is ModalityType => modality !== null),
          created_at: raw.created_at,
          updated_at: raw.updated_at,
        },
        profile: raw.judge_profile
          ? {
              id: raw.judge_profile.id,
              judge_id: raw.judge_profile.judge_id,
              cpf: raw.judge_profile.cpf,
              pis: raw.judge_profile.pis,
              phone: raw.judge_profile.phone,
              bank: raw.judge_profile.bank,
              bank_branch: raw.judge_profile.bank_branch,
              bank_account: raw.judge_profile.bank_account,
              pix_key: raw.judge_profile.pix_key,
              created_at: raw.judge_profile.created_at,
              updated_at: raw.judge_profile.updated_at,
            }
          : {
              id: "",
              judge_id: "",
              cpf: null,
              pis: null,
              phone: null,
              bank: null,
              bank_branch: null,
              bank_account: null,
              pix_key: null,
              created_at: "",
              updated_at: "",
            },
      };
    },
    enabled: !!judgeId,
  });
}
