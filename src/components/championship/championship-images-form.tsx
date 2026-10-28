import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ImageUpload } from "@/components/image-upload";
import { useConvertToWebp } from "@/hooks/use-convert-to-webp";
import { Loader2 } from "lucide-react";

interface ChampionshipImagesFormProps {
  onLogoChange: (file: File | null) => void;
  onTrophyChange: (file: File | null) => void;
}

export function ChampionshipImagesForm({
  onLogoChange,
  onTrophyChange,
}: ChampionshipImagesFormProps) {
  const { convert: convertLogo, isConverting: isConvertingLogo } =
    useConvertToWebp();
  const { convert: convertTrophy, isConverting: isConvertingTrophy } =
    useConvertToWebp();

  const handleLogoSelect = async (file: File | null) => {
    if (!file) {
      onLogoChange(null);
      return;
    }
    const webp = await convertLogo(file);
    onLogoChange(webp);
  };

  const handleTrophySelect = async (file: File | null) => {
    if (!file) {
      onTrophyChange(null);
      return;
    }
    const webp = await convertTrophy(file);
    onTrophyChange(webp);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Imagens</CardTitle>
        <CardDescription>
          Logo do campeonato e imagem do troféu ou medalha.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col md:flex-row gap-8">
        <div className="flex flex-col items-center gap-2 flex-1">
          <div className="relative">
            <ImageUpload
              currentImageUrl={null}
              onFileSelect={handleLogoSelect}
              previewClassName="w-40 h-40 rounded-lg"
              label="Logo do Campeonato"
            />
            {isConvertingLogo && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg">
                <Loader2 className="size-6 animate-spin text-white" />
              </div>
            )}
          </div>
          <span className="text-xs text-muted-foreground font-medium">
            Logo
          </span>
        </div>

        <div className="flex flex-col items-center gap-2 flex-1">
          <div className="relative">
            <ImageUpload
              currentImageUrl={null}
              onFileSelect={handleTrophySelect}
              previewClassName="w-40 h-40 rounded-lg"
              label="Troféu / Medalha"
            />
            {isConvertingTrophy && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg">
                <Loader2 className="size-6 animate-spin text-white" />
              </div>
            )}
          </div>
          <span className="text-xs text-muted-foreground font-medium">
            Troféu / Medalha
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
