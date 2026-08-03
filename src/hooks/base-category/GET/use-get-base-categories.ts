import { supabase } from "@/lib/supabase/client";
import type { BaseCategoryType } from "@/types/category/category-type";
import { useQuery } from "@tanstack/react-query";

export function useGetBaseCategories() {
  return useQuery({
    queryKey: ["base_categories"],
    queryFn: async (): Promise<BaseCategoryType[]> => {
      const { data, error } = await supabase
        .from("base_categories")
        .select("*")
        .order("name");

      if (error) throw new Error(error.message);
      return data ?? [];
    },
  });
}
