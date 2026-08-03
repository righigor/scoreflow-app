import { supabase } from "@/lib/supabase/client";
import { generateSlug } from "@/lib/utils/generate-slug";
import type { CreateStaffRoleSchemaType } from "@/schemas/staff/create-staff-role-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useCreateStaffRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateStaffRoleSchemaType) => {
      const slug = generateSlug(data.name);
      const { error } = await supabase.from("staff_roles").insert([{ name: data.name, slug }]);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "staff_roles"] });
      toast.success("Função criada com sucesso!");
    },
    onError: (error) => toast.error("Erro ao criar", { description: error.message }),
  });
}