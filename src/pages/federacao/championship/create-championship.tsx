import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { LoadingBtn } from "@/components/buttons/loading-btn";
import {
  createChampionshipSchema,
  type CreateChampionshipSchemaType,
} from "@/schemas/championship/create-championship-schema";
import { ChampionshipBasicForm } from "@/components/championship/championship-basic-form";
import { ChampionshipImagesForm } from "@/components/championship/championship-images-form";
import { ChampionshipRegulationForm } from "@/components/championship/championship-regulation-form";
import { ChampionshipCategoriesForm } from "@/components/championship/championship-categories-form";
import { useGetCategoriesByModality } from "@/hooks/championship/GET/use-get-categories-by-modality";
import { useGetModalities } from "@/hooks/modality/GET/use-get-modalities";
import { useGetApparatusByModality } from "@/hooks/apparatus/GET/use-get-apparatus-by-modality";
import {
  createEmptyArbitration,
  type ArbitrationConfig,
  type CategoryWithApparatus,
} from "@/types/championship/championship-type";
import { ChampionshipArbitrationForm } from "@/components/championship/championship-arbitration-form";

export default function CreateChampionshipPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const modalityId = searchParams.get("modalityId");

  const { data: modalities } = useGetModalities();
  const { data: categories } = useGetCategoriesByModality(modalityId);
  const { data: apparatus } = useGetApparatusByModality(modalityId);

  const modalityName = modalities?.find((m) => m.id === modalityId)?.name;

  const [regulationFile, setRegulationFile] = useState<File | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [trophyFile, setTrophyFile] = useState<File | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<
    CategoryWithApparatus[]
  >([]);
  const [categoriesError, setCategoriesError] = useState("");
  const [arbitration, setArbitration] = useState<ArbitrationConfig>(
    createEmptyArbitration(),
  );

  const form = useForm<CreateChampionshipSchemaType>({
    resolver: zodResolver(createChampionshipSchema),
    defaultValues: {
      name: "",
      location: "",
      start_date: "",
      end_date: "",
      inscription_start_date: "",
      inscription_end_date: "",
      description: "",
      fee_per_athlete: "",
    },
  });

  useEffect(() => {
    if (!modalityId) navigate("/federacao/campeonatos");
  }, [modalityId, navigate]);

  const onSubmit = (data: CreateChampionshipSchemaType) => {
    if (selectedCategories.length === 0) {
      setCategoriesError("Adicione ao menos uma categoria.");
      return;
    }
    setCategoriesError("");

    // TODO: hook de criação (após definir arbitragem)
    console.log({
      modalityId,
      basicData: data,
      logoFile,
      trophyFile,
      regulationFile,
      categories: selectedCategories,
    });
  };

  if (!modalityId) return null;

  return (
    <div className="space-y-8 p-8">
      <div className="flex items-center gap-4">
        <Link to="/federacao/campeonatos">
          <Button variant="ghost" size="icon" className="cursor-pointer">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Criar Campeonato</h1>
          <p className="text-muted-foreground">
            Modalidade:{" "}
            <span className="font-medium text-foreground">{modalityName}</span>
          </p>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <ChampionshipBasicForm form={form} />

        <ChampionshipImagesForm
          logoFile={logoFile}
          trophyFile={trophyFile}
          onLogoChange={setLogoFile}
          onTrophyChange={setTrophyFile}
          isProcessingTrophy={false}
        />

        <Separator />

        <ChampionshipRegulationForm
          file={regulationFile}
          onFileChange={setRegulationFile}
        />

        <Separator />

        <ChampionshipCategoriesForm
          availableCategories={categories ?? []}
          availableApparatus={apparatus ?? []}
          categories={selectedCategories}
          onCategoriesChange={(cats) => {
            setSelectedCategories(cats);
            if (cats.length > 0) setCategoriesError("");
          }}
          error={categoriesError}
        />

        <Separator />

        <ChampionshipArbitrationForm
          arbitration={arbitration}
          onArbitrationChange={setArbitration}
        />

        <div className="flex justify-end">
          <LoadingBtn
            type="submit"
            isLoading={false}
            className="md:min-w-50 cursor-pointer"
          >
            Criar Campeonato
          </LoadingBtn>
        </div>
      </form>
    </div>
  );
}
