import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { LoadingBtn } from "@/components/buttons/loading-btn";
import { useGetClubModalities } from "@/hooks/club/GET/use-get-club-modalities";
import { useUpdateAthlete } from "@/hooks/athletes/PUT/use-update-athlete";
import { useGetAthleteById } from "@/hooks/athletes/GET/use-get-athlete-by-id";
import { useConvertToWebp } from "@/hooks/use-convert-to-webp";
import {
  updateAthleteSchema,
  type UpdateAthleteSchemaType,
} from "@/schemas/athlete/update-athlete-schema";
import { AthletePersonalDataForm } from "@/components/athletes/athletes-personal-data-form";
import { AthleteModalitiesStatusForm } from "@/components/athletes/athletes-modalities-status-form";
import { AthleteDocumentsForm } from "@/components/athletes/athletes-documents-form";

export default function ClubAthleteDetailsPage() {
  const { athleteId } = useParams<{ athleteId: string }>();

  const { data: athlete, isLoading } = useGetAthleteById(athleteId!);
  const { data: clubModalities } = useGetClubModalities();
  const { mutate: updateAthlete, isPending } = useUpdateAthlete(athleteId!);
  
  // 3. Inicializar o hook de conversão
  const { convert, isConverting } = useConvertToWebp();

  const [files, setFiles] = useState({
    profilePicture: null as File | null,
    identityPdf: null as File | null,
    residencePdf: null as File | null,
    imageRightPdf: null as File | null,
  });

  const form = useForm<UpdateAthleteSchemaType>({
    resolver: zodResolver(updateAthleteSchema),
    defaultValues: {
      name: "",
      cpf: "",
      phone: "",
      birthdate: "",
      gender: undefined,
      instagram_url: "",
      status: "ACTIVE",
      modalities: [],
    },
  });

  useEffect(() => {
    if (!athlete) return;

    form.reset({
      name: athlete.name,
      cpf: athlete.cpf || "",
      phone: athlete.phone || "",
      birthdate: athlete.birthdate || "",
      gender: athlete.gender,
      instagram_url: athlete.instagram_url || "",
      status: athlete.status,
      modalities: athlete.athlete_modalities?.map((modality) => modality.modality_id) ?? [],
    });
  }, [athlete, form]);

  // 4. Lógica atualizada do Submit com conversão real para WebP
  const onSubmit = async (data: UpdateAthleteSchemaType) => {
    try {
      let processedPicture = files.profilePicture;

      if (processedPicture) {
        // Converte o arquivo real usando o Canvas antes de enviar
        processedPicture = await convert(processedPicture);
      }

      updateAthlete({
        data,
        files: {
          ...files,
          profilePicture: processedPicture, // Envia o arquivo convertido
        },
      });
    } catch (error) {
      toast.error("Erro ao processar a imagem", {
        description: error instanceof Error ? error.message : "Tente novamente.",
      });
    }
  };

  if (isLoading || !athlete) {
    return <div className="p-8 text-muted-foreground">Carregando atleta...</div>;
  }

  return (
    <div className="space-y-8 p-8">
      <div className="flex items-center gap-4">
        <Link to="/equipe/atletas">
          <Button variant="ghost" size="icon" className="cursor-pointer">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Editar Atleta</h1>
          <p className="text-muted-foreground">
            Atualize dados, gerencie status e faça upload de documentos.
          </p>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <AthletePersonalDataForm
          form={form}
          currentImageUrl={athlete.profile_picture_url}
          onImageSelect={(file) => setFiles((prev) => ({ ...prev, profilePicture: file }))}
        />

        <Separator />

        <AthleteModalitiesStatusForm form={form} clubModalities={clubModalities} />

        <Separator />

        {/* SEÇÃO 3 */}
        <AthleteDocumentsForm
          identityPath={athlete.identity_pdf_url}
          residencePath={athlete.residence_proof_pdf_url}
          imageRightPath={athlete.image_right_term_pdf_url}
          /* Novas props passando o estado local do React */
          pendingIdentity={files.identityPdf}
          pendingResidence={files.residencePdf}
          pendingImageRight={files.imageRightPdf}
          /* -------------------------------------------- */
          onIdentityChange={(file) =>
            setFiles((prev) => ({ ...prev, identityPdf: file }))
          }
          onResidenceChange={(file) =>
            setFiles((prev) => ({ ...prev, residencePdf: file }))
          }
          onImageRightChange={(file) =>
            setFiles((prev) => ({ ...prev, imageRightPdf: file }))
          }
        />

        {/* 5. Botão atualizado com o estado de conversão */}
        <div className="flex justify-end">
          <LoadingBtn
            type="submit"
            isLoading={isPending || isConverting}
            className="w-full cursor-pointer md:w-auto md:min-w-50"
          >
            {isConverting ? "Processando Imagem..." : "Salvar Alterações"}
          </LoadingBtn>
        </div>
      </form>
    </div>
  );
}