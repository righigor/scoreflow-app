import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth-store";
import { supabase } from "@/lib/supabase/client";

interface UseGetChampionshipsProps {
  search?: string;
  status: string[];
  page: number;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

export function useGetCampeonatos({
  search = "",
  status,
  page,
  sortBy,
  sortOrder,
}: UseGetChampionshipsProps) {
  const federationId = useAuthStore((state) => state.profile?.federation_id);
  const pageSize = 10;

  return useQuery({
    queryKey: [
      "championships",
      federationId,
      { search, status, page, sortBy, sortOrder },
    ],
    queryFn: async () => {
      if (!federationId) throw new Error("Sem federação");

      let query = supabase
        .from("championships")
        .select("*", { count: "exact" })
        .eq("federation_id", federationId)
        .in("status", status);

      if (search) {
        query = query.ilike("name", `%${search}%`);
      }

      query = query.order(sortBy, { ascending: sortOrder === "asc" });

      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw new Error(error.message);

      return {
        data: data || [],
        totalCount: count || 0,
        totalPages: Math.ceil((count || 0) / pageSize),
      };
    },
    enabled: !!federationId,
  });
}
