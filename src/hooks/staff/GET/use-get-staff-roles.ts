import { supabase } from "@/lib/supabase/client";
import type { StaffRoleType } from "@/types/staff/staff-type";
import { useQuery } from "@tanstack/react-query";

export function useGetStaffRoles() {
  return useQuery({
    queryKey: ["staff_roles"],
    queryFn: async (): Promise<StaffRoleType[]> => {
      const { data, error } = await supabase
        .from("staff_roles")
        .select("*")
        .order("name");

      if (error) throw new Error(error.message);
      return data ?? [];
    },
  });
}
