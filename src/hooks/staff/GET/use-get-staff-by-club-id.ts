import { supabase } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/auth-store";
import type { StaffWithModalitiesType } from "@/types/staff/staff-type";
import { useQuery } from "@tanstack/react-query";

type StaffRaw = {
  id: string;
  club_id: string;
  staff_role_id: string;
  previous_athlete_id: string | null;
  name: string;
  cpf: string | null;
  phone: string | null;
  gender: "F" | "M" | "OTHER";
  profile_picture_url: string | null;
  status: "ACTIVE" | "INACTIVE" | "RETIRED" | "FREE_AGENT";
  instagram_url: string | null;
  identity_pdf_url: string | null;
  residence_proof_pdf_url: string | null;
  image_right_term_pdf_url: string | null;
  created_at: string;
  updated_at: string;
  staff_roles: { name: string } | null;
  staff_modalities: { modality_id: string }[];
};

export function useGetStaffByClubId() {
  const clubId = useAuthStore((state) => state.profile?.club_id);

  return useQuery({
    queryKey: ["staff", "by_club", clubId],
    queryFn: async (): Promise<StaffWithModalitiesType[]> => {
      if (!clubId) return [];

      const { data, error } = await supabase
        .from("staff")
        .select("*, staff_roles(name), staff_modalities(modality_id)")
        .eq("club_id", clubId)
        .order("created_at", { ascending: false });

      if (error) throw new Error(error.message);

      return (
        (data as StaffRaw[])?.map(({ staff_roles, ...rest }) => ({
          ...rest,
          role_name: staff_roles?.name ?? "Sem Função",
        })) ?? []
      );
    },
    enabled: !!clubId,
  });
}
