import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth-store";
import type {
  AddressType,
  FederationWithAddressType,
} from "@/types/federacao/federacao-type";
import { supabase } from "@/lib/supabase/client";

type FederationRaw = FederationWithAddressType & {
  addresses: AddressType | null;
};

export function useGetFederationProfile() {
  const federationId = useAuthStore((state) => state.profile?.federation_id);

  return useQuery({
    queryKey: ["federation", "profile"],
    queryFn: async (): Promise<FederationWithAddressType> => {
      if (!federationId) throw new Error("Sem federação");

      const { data, error } = await supabase
        .from("federations")
        .select("*, addresses(*)")
        .eq("id", federationId)
        .single();

      if (error) throw new Error(error.message);

      const rawData = data as FederationRaw;
      return {
        ...rawData,
        phones: rawData.phones ?? [],
        social_links: rawData.social_links ?? {},
      };
    },
    enabled: !!federationId,
  });
}
