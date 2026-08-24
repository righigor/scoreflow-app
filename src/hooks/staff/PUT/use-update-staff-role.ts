import { supabase } from "@/lib/supabase/client";
import { generateSlug } from "@/lib/utils/generate-slug";
import type { CreateStaffRoleSchemaType } from "@/schemas/staff/create-staff-role-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useUpdateStaffRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CreateStaffRoleSchemaType }) => {
      const slug = generateSlug(data.name);
      const { error } = await supabase.from("staff_roles").update({ name: data.name, slug }).eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "staff_roles"] });
      toast.success("Função atualizada!");
    },
    onError: (error) => toast.error("Erro ao atualizar", { description: error.message }),
  });
}