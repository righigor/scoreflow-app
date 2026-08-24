import { supabase } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";

export interface SysadminStatsType {
  federations: number;
  clubs: number;
  athletes: number;
  staff: number;
}

export function useGetSysadminStats() {
  return useQuery({
    queryKey: ["sysadmin", "stats"],
    queryFn: async (): Promise<SysadminStatsType> => {
      const [fedRes, clubRes, athRes, staffRes] = await Promise.all([
        supabase
          .from("federations")
          .select("*", { count: "exact", head: true })
          .eq("status", "ACTIVE"),
        supabase
          .from("clubs")
          .select("*", { count: "exact", head: true })
          .eq("status", "ACTIVE"),
        supabase.from("athletes").select("*", { count: "exact", head: true }),
        supabase.from("staff").select("*", { count: "exact", head: true }),
      ]);

      if (fedRes.error) throw new Error(fedRes.error.message);
      if (clubRes.error) throw new Error(clubRes.error.message);
      if (athRes.error) throw new Error(athRes.error.message);
      if (staffRes.error) throw new Error(staffRes.error.message);

      return {
        federations: fedRes.count ?? 0,
        clubs: clubRes.count ?? 0,
        athletes: athRes.count ?? 0,
        staff: staffRes.count ?? 0,
      };
    },
  });
}
