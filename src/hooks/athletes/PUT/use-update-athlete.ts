import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { uploadImage } from "@/lib/supabase/upload-image";
import type { UpdateAthleteSchemaType } from "@/schemas/athlete/update-athlete-schema";
import { supabase } from "@/lib/supabase/client";

interface AthleteFiles {
  profilePicture?: File | null;
  identityPdf?: File | null;
  residencePdf?: File | null;
  imageRightPdf?: File | null;
}

export function useUpdateAthlete(athleteId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      data,
      files,
    }: {
      data: UpdateAthleteSchemaType;
      files: AthleteFiles;
    }) => {
      const basePath = `athletes/${athleteId}`;

      const uploadPromises = [
        files.profilePicture
          ? uploadImage(files.profilePicture, `${basePath}/profile`, data.name).catch(() => null)
          : Promise.resolve(null),

        // NOVA NOMENCLATURA AQUI: Agora é athleteId-identity.pdf
        files.identityPdf
          ? uploadFile(files.identityPdf, `${basePath}/${athleteId}-identity.pdf`, "application/pdf").catch(() => null)
          : Promise.resolve(null),

        // NOVA NOMENCLATURA AQUI: Agora é athleteId-residence.pdf
        files.residencePdf
          ? uploadFile(files.residencePdf, `${basePath}/${athleteId}-residence.pdf`, "application/pdf").catch(() => null)
          : Promise.resolve(null),

        // NOVA NOMENCLATURA AQUI: Agora é athleteId-image-right.pdf
        files.imageRightPdf
          ? uploadFile(files.imageRightPdf, `${basePath}/${athleteId}-image-right.pdf`, "application/pdf").catch(() => null)
          : Promise.resolve(null),
      ];

      const [profileUrl, identityPath, residencePath, imageRightPath] = await Promise.all(uploadPromises);

      const updatePayload = {
        name: data.name,
        cpf: data.cpf || null,
        phone: data.phone || null,
        birthdate: data.birthdate || null,
        gender: data.gender,
        instagram_url: data.instagram_url || null,
        status: data.status,
        ...(profileUrl ? { profile_picture_url: profileUrl } : {}),
        ...(identityPath ? { identity_pdf_url: identityPath } : {}),
        ...(residencePath ? { residence_proof_pdf_url: residencePath } : {}),
        ...(imageRightPath ? { image_right_term_pdf_url: imageRightPath } : {}),
      };

      const { error: athleteError } = await supabase
        .from("athletes")
        .update(updatePayload)
        .eq("id", athleteId);

      if (athleteError) throw new Error(athleteError.message);

      await supabase.from("athlete_modalities").delete().eq("athlete_id", athleteId);

      if (data.modalities.length > 0) {
        const newModalities = data.modalities.map((mod_id) => ({
          athlete_id: athleteId,
          modality_id: mod_id,
        }));
        const { error: modError } = await supabase.from("athlete_modalities").insert(newModalities);
        if (modError) throw new Error(modError.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["athlete", athleteId] });
      queryClient.invalidateQueries({ queryKey: ["athletes", "by_club"] });
      toast.success("Dados do atleta atualizados com sucesso!");
    },
    onError: (error) =>
      toast.error("Erro ao atualizar atleta", { description: error.message }),
  });
}

async function uploadFile(file: File, path: string, contentType: string): Promise<string> {
  const { error } = await supabase.storage
    .from("documents")
    .upload(path, file, { contentType, upsert: true });
    
  if (error) throw new Error(error.message);
  return path; 
}