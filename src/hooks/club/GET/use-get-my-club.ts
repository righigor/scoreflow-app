import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth-store";
import { supabase } from "@/lib/supabase/client";
import type { ClubType } from "@/types/club/club-type";

export function useGetMyClub() {
  const clubId = useAuthStore((state) => state.profile?.club_id);

  return useQuery({
    queryKey: ["club", clubId],
    queryFn: async () => {
      if (!clubId) throw new Error("Sem clube");
      
      const { data, error } = await supabase
        .from("clubs")
        .select(`
          *,
          addresses (
            street, number, complement, neighborhood, city, state, zip_code
          )
        `)
        .eq("id", clubId)
        .single();
        
      if (error) throw new Error(error.message);

      // >>> A MÁGICA ACONTECE AQUI <<<
      // O Supabase SEMPRE retorna relacionamentos dentro de Arrays.
      // Se não transformarmos em objeto, o form tenta ler: Array.street (que é undefined)
      const formattedClub = {
        ...data,
        addresses: Array.isArray(data.addresses) ? data.addresses[0] : data.addresses,
      };

      return formattedClub as ClubType;
    },
    enabled: !!clubId,
  });
}