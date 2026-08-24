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
import { useGetStaffRoles } from "@/hooks/staff/GET/use-get-staff-roles";
import { useUpdateStaff } from "@/hooks/staff/PUT/use-update-staff";
import { useGetStaffById } from "@/hooks/staff/GET/use-get-staff-by-id";
import { useConvertToWebp } from "@/hooks/use-convert-to-webp";
import {
  updateStaffSchema,
  type UpdateStaffSchemaType,
} from "@/schemas/staff/update-staff-schema";
import { AthleteDocumentsForm } from "@/components/athletes/athletes-documents-form";
import { StaffPersonalDataForm } from "@/components/staff/staff-personal-data-form";
import { StaffModalitiesStatusForm } from "@/components/staff/staff-modalities-status-form";

export default function ClubStaffDetailsPage() {
  const { staffId } = useParams<{ staffId: string }>();

  const { data: staff, isLoading } = useGetStaffById(staffId!);
  const { data: clubModalities } = useGetClubModalities();
  const { data: staffRoles } = useGetStaffRoles();
  const { mutate: updateStaff, isPending } = useUpdateStaff(staffId!);
  const { convert, isConverting } = useConvertToWebp();

  const [files, setFiles] = useState({
    profilePicture: null as File | null,
    identityPdf: null as File | null,
    residencePdf: null as File | null,
    imageRightPdf: null as File | null,
  });

  const form = useForm<UpdateStaffSchemaType>({
    resolver: zodResolver(updateStaffSchema),
    defaultValues: {
      name: "",
      cpf: "",
      phone: "",
      gender: undefined,
      instagram_url: "",
      staff_role_id: "",
      status: "ACTIVE",
      modalities: [],
    },
  });

  useEffect(() => {
    if (!staff) return;

    form.reset({
      name: staff.name,
      cpf: staff.cpf || "",
      phone: staff.phone || "",
      gender: staff.gender,
      instagram_url: staff.instagram_url || "",
      staff_role_id: staff.staff_role_id,
      status: staff.status,
      modalities:
        staff.staff_modalities?.map((m) => m.modality_id) ?? [],
    });
  }, [staff, form]);

  const onSubmit = async (data: UpdateStaffSchemaType) => {
    try {
      let processedPicture = files.profilePicture;

      if (processedPicture) {
        processedPicture = await convert(processedPicture);
      }

      updateStaff({
        data,
        files: {
          ...files,
          profilePicture: processedPicture,
        },
      });
    } catch (error) {
      toast.error("Erro ao processar a imagem", {
        description:
          error instanceof Error ? error.message : "Tente novamente.",
      });
    }
  };

  if (isLoading || !staff) {
    return (
      <div className="p-8 text-muted-foreground">
        Carregando membro da comissão...
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8">
      <div className="flex items-center gap-4">
        <Link to="/equipe/comissao">
          <Button variant="ghost" size="icon" className="cursor-pointer">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Editar Membro</h1>
          <p className="text-muted-foreground">
            Atualize dados, gerencie status e faça upload de documentos.
          </p>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <StaffPersonalDataForm
          form={form}
          currentImageUrl={staff.profile_picture_url}
          staffRoles={staffRoles ?? []}
          onImageSelect={(file) =>
            setFiles((prev) => ({ ...prev, profilePicture: file }))
          }
        />

        <Separator />

        <StaffModalitiesStatusForm
          form={form}
          clubModalities={clubModalities}
        />

        <Separator />

        {/* Reaproveita o componente de documentos — as props são genéricas */}
        <AthleteDocumentsForm
          identityPath={staff.identity_pdf_url}
          residencePath={staff.residence_proof_pdf_url}
          imageRightPath={staff.image_right_term_pdf_url}
          pendingIdentity={files.identityPdf}
          pendingResidence={files.residencePdf}
          pendingImageRight={files.imageRightPdf}
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