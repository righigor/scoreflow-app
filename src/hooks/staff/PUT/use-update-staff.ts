import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { uploadImage } from "@/lib/supabase/upload-image";
import { supabase } from "@/lib/supabase/client";
import type { UpdateStaffSchemaType } from "@/schemas/staff/update-staff-schema";

interface StaffFiles {
  profilePicture?: File | null;
  identityPdf?: File | null;
  residencePdf?: File | null;
  imageRightPdf?: File | null;
}

async function uploadFile(
  file: File,
  path: string,
  contentType: string,
): Promise<string> {
  const { error } = await supabase.storage
    .from("documents")
    .upload(path, file, { contentType, upsert: true });

  if (error) throw new Error(error.message);
  return path;
}

export function useUpdateStaff(staffId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      data,
      files,
    }: {
      data: UpdateStaffSchemaType;
      files: StaffFiles;
    }) => {
      const basePath = `staff/${staffId}`;

      const uploadPromises = [
        files.profilePicture
          ? uploadImage(files.profilePicture, basePath, data.name).catch(
              () => null,
            )
          : Promise.resolve(null),

        files.identityPdf
          ? uploadFile(
              files.identityPdf,
              `${basePath}/${staffId}-identity.pdf`,
              "application/pdf",
            ).catch(() => null)
          : Promise.resolve(null),

        files.residencePdf
          ? uploadFile(
              files.residencePdf,
              `${basePath}/${staffId}-residence.pdf`,
              "application/pdf",
            ).catch(() => null)
          : Promise.resolve(null),

        files.imageRightPdf
          ? uploadFile(
              files.imageRightPdf,
              `${basePath}/${staffId}-image-right.pdf`,
              "application/pdf",
            ).catch(() => null)
          : Promise.resolve(null),
      ];

      const [profileUrl, identityPath, residencePath, imageRightPath] =
        await Promise.all(uploadPromises);

      const updatePayload = {
        name: data.name,
        cpf: data.cpf || null,
        phone: data.phone || null,
        gender: data.gender,
        instagram_url: data.instagram_url || null,
        staff_role_id: data.staff_role_id,
        status: data.status,
        ...(profileUrl ? { profile_picture_url: profileUrl } : {}),
        ...(identityPath ? { identity_pdf_url: identityPath } : {}),
        ...(residencePath ? { residence_proof_pdf_url: residencePath } : {}),
        ...(imageRightPath
          ? { image_right_term_pdf_url: imageRightPath }
          : {}),
      };

      const { error: staffError } = await supabase
        .from("staff")
        .update(updatePayload)
        .eq("id", staffId);

      if (staffError) throw new Error(staffError.message);

      await supabase.from("staff_modalities").delete().eq("staff_id", staffId);

      if (data.modalities.length > 0) {
        const newModalities = data.modalities.map((mod_id) => ({
          staff_id: staffId,
          modality_id: mod_id,
        }));
        const { error: modError } = await supabase
          .from("staff_modalities")
          .insert(newModalities);
        if (modError) throw new Error(modError.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff", staffId] });
      queryClient.invalidateQueries({ queryKey: ["staff", "by_club"] });
      toast.success("Dados da comissão atualizados com sucesso!");
    },
    onError: (error) =>
      toast.error("Erro ao atualizar comissão", {
        description: error.message,
      }),
  });
}