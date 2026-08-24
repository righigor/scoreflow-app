import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import type { StaffWithModalitiesType } from "@/types/staff/staff-type";

type StaffRaw = {
  staff_roles: { name: string } | null;
  staff_modalities: { modality_id: string }[];
} & Omit<StaffWithModalitiesType, "role_name" | "staff_modalities">;

export function useGetStaffById(staffId: string) {
  return useQuery({
    queryKey: ["staff", staffId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("staff")
        .select("*, staff_roles(name), staff_modalities(modality_id)")
        .eq("id", staffId)
        .single();

      if (error) throw new Error(error.message);

      const raw = data as StaffRaw;
      return {
        ...raw,
        role_name: raw.staff_roles?.name ?? "Sem Função",
      } as StaffWithModalitiesType;
    },
    enabled: !!staffId,
  });
}