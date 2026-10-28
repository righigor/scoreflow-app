import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { uploadImage } from "@/lib/supabase/upload-image";
import { supabase } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/auth-store";
import type { CreateChampionshipSchemaType } from "@/schemas/championship/create-championship-schema";
import type {
  CategoryWithApparatus,
  ArbitrationConfig,
  ArbitrationRole,
  PanelRole,
} from "@/types/championship/championship-type";

interface CreateChampionshipParams {
  modalityId: string;
  data: CreateChampionshipSchemaType;
  logoFile: File | null;
  trophyFile: File | null;
  regulationFile: File | null;
  categories: CategoryWithApparatus[];
  arbitration: ArbitrationConfig;
}

async function uploadPdf(file: File, path: string): Promise<string> {
  const { error } = await supabase.storage
    .from("documents")
    .upload(path, file, { contentType: "application/pdf", upsert: false });

  if (error) throw new Error(error.message);
  return path;
}

export function useCreateChampionship() {
  const queryClient = useQueryClient();
  const federationId = useAuthStore((state) => state.profile?.federation_id);

  return useMutation({
    mutationFn: async ({
      modalityId,
      data,
      logoFile,
      trophyFile,
      regulationFile,
      categories,
      arbitration,
    }: CreateChampionshipParams) => {
      if (!federationId) throw new Error("Usuário sem federação.");

      // Gera ID antecipado para os uploads
      const id = crypto.randomUUID();
      const basePath = `championships/${id}`;

      // 1. Uploads em paralelo
      const [logoUrl, trophyUrl, regulationPath] = await Promise.all([
        logoFile
          ? uploadImage(logoFile, basePath, "logo").catch(() => null)
          : Promise.resolve(null),
        trophyFile
          ? uploadImage(trophyFile, basePath, "trophy").catch(() => null)
          : Promise.resolve(null),
        regulationFile
          ? uploadPdf(regulationFile, `${basePath}/regulamento.pdf`).catch(
              () => null,
            )
          : Promise.resolve(null),
      ]);

      // 2. Insert championship
      const { error: champError } = await supabase
        .from("championships")
        .insert({
          id,
          federation_id: federationId,
          modality_id: modalityId,
          name: data.name,
          location: data.location || null,
          start_date: data.start_date || null,
          end_date: data.end_date || null,
          inscription_start_date: data.inscription_start_date || null,
          inscription_end_date: data.inscription_end_date || null,
          description: data.description || null,
          fee_per_athlete: data.fee_per_athlete
            ? parseFloat(data.fee_per_athlete)
            : 0,
          logo_url: logoUrl,
          trophy_image_url: trophyUrl,
          regulation_pdf_url: regulationPath,
          status: "DRAFT",
        })
        .single();

      if (champError) throw new Error(champError.message);

      // 3. Insert categorias (com select para pegar os IDs gerados)
      if (categories.length > 0) {
        const { data: insertedCategories, error: catError } = await supabase
          .from("championship_categories")
          .insert(
            categories.map((cat) => ({
              championship_id: id,
              base_category_id: cat.base_category_id,
            })),
          )
          .select("id, base_category_id");

        if (catError) throw new Error(catError.message);

        // 4. Insert aparelhos por categoria (com sort_order na ordem de adição)
        let sortOrder = 0;
        const apparatusRows =
          insertedCategories
            ?.map((cat) => {
              const config = categories.find(
                (c) => c.base_category_id === cat.base_category_id,
              );
              if (!config) return [];
              return config.apparatus_ids.map((apparatusId) => ({
                championship_category_id: cat.id,
                apparatus_id: apparatusId,
                sort_order: ++sortOrder,
              }));
            })
            .flat() ?? [];

        if (apparatusRows.length > 0) {
          const { error: appError } = await supabase
            .from("championship_category_apparatus")
            .insert(apparatusRows);

          if (appError) throw new Error(appError.message);
        }
      }

      // 5. Insert arbitragem
      const { director, secretary, panels } = arbitration;
      const arbitrationRows: {
        championship_id: string;
        judge_id: string;
        role: ArbitrationRole;
        slot_position: number | null;
      }[] = [];

      if (director.judge_id) {
        arbitrationRows.push({
          championship_id: id,
          judge_id: director.judge_id,
          role: "DIRECTOR",
          slot_position: null,
        });
      }

      if (secretary.judge_id) {
        arbitrationRows.push({
          championship_id: id,
          judge_id: secretary.judge_id,
          role: "SECRETARY",
          slot_position: null,
        });
      }

      const panelRoles: PanelRole[] = ["A", "E", "DA", "DB"];
      for (const role of panelRoles) {
        panels[role].forEach((slot, index) => {
          if (slot.judge_id) {
            arbitrationRows.push({
              championship_id: id,
              judge_id: slot.judge_id,
              role,
              slot_position: index + 1,
            });
          }
        });
      }

      if (arbitrationRows.length > 0) {
        const { error: arbError } = await supabase
          .from("championship_arbitration_assignments")
          .insert(arbitrationRows);

        if (arbError) throw new Error(arbError.message);

        // TODO: Substituir por disparo real de email (Edge Function)
        arbitrationRows.forEach((row) => {
          console.log(
            `[DUMMY EMAIL] Convocação: Juiz ${row.judge_id} atribuído como ${row.role}${row.slot_position ? ` slot ${row.slot_position}` : ""} no campeonato ${id}`,
          );
        });
      }

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campeonatos"] });
      toast.success("Campeonato criado com sucesso!");
    },
    onError: (error) =>
      toast.error("Erro ao criar campeonato", {
        description: error.message,
      }),
  });
}
