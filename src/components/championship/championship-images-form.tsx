import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ImageUpload } from "@/components/image-upload";
import { useConvertToWebp } from "@/hooks/use-convert-to-webp";
import { useRemoveBackground } from "@/hooks/use-remove-background";
import { Loader2, Sparkles } from "lucide-react";

interface ChampionshipImagesFormProps {
  logoFile: File | null;
  trophyFile: File | null;
  onLogoChange: (file: File | null) => void;
  onTrophyChange: (file: File | null) => void;
  isProcessingTrophy: boolean;
}

export function ChampionshipImagesForm({
  logoFile,
  trophyFile,
  onLogoChange,
  onTrophyChange,
  isProcessingTrophy,
}: ChampionshipImagesFormProps) {
  const { convert: convertLogo, isConverting: isConvertingLogo } =
    useConvertToWebp();
  const { convert: convertTrophy, isConverting: isConvertingTrophy } =
    useConvertToWebp();
  const { remove: removeBg, isProcessing: isRemovingBg } =
    useRemoveBackground();

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
    // 1. Remove fundo
    const noBg = await removeBg(file);
    // 2. Converte para WebP
    const webp = await convertTrophy(noBg);
    onTrophyChange(webp);
  };

  const isLogoBusy = isConvertingLogo;
  const isTrophyBusy =
    isRemovingBg || isConvertingTrophy || isProcessingTrophy;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Imagens</CardTitle>
        <CardDescription>
          Logo do campeonato e imagem do troféu. O troféu terá o fundo
          removido automaticamente.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col md:flex-row gap-8">
        {/* Logo */}
        <div className="flex flex-col items-center gap-2 flex-1">
          <div className="relative">
            <ImageUpload
              currentImageUrl={null}
              onFileSelect={handleLogoSelect}
              previewClassName="w-40 h-40 rounded-lg"
              label="Logo do Campeonato"
            />
            {isLogoBusy && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg">
                <Loader2 className="size-6 animate-spin text-white" />
              </div>
            )}
          </div>
          <span className="text-xs text-muted-foreground font-medium">
            Logo
          </span>
        </div>

        {/* Troféu */}
        <div className="flex flex-col items-center gap-2 flex-1">
          <div className="relative">
            <ImageUpload
              currentImageUrl={null}
              onFileSelect={handleTrophySelect}
              previewClassName="w-40 h-40 rounded-lg"
              label="Troféu / Medalha"
            />
            {isTrophyBusy && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 rounded-lg gap-2">
                <Sparkles className="size-5 text-yellow-400 animate-pulse" />
                <span className="text-[10px] text-white font-medium">
                  {isRemovingBg
                    ? "Removendo fundo..."
                    : "Convertendo..."}
                </span>
              </div>
            )}
          </div>
          <span className="text-xs text-muted-foreground font-medium">
            Troféu / Medalha
            <span className="text-[10px] block text-muted-foreground/60">
              Fundo removido automaticamente
            </span>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}