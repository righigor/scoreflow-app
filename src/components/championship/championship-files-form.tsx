import { useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Upload, X, FileCheck } from "lucide-react";
import { ImageUpload } from "@/components/image-upload";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useConvertToWebp } from "@/hooks/use-convert-to-webp";

interface ChampionshipFilesFormProps {
  logoFile: File | null;
  trophyFile: File | null;
  regulationFile: File | null;
  onLogoChange: (file: File | null) => void;
  onTrophyChange: (file: File | null) => void;
  onRegulationChange: (file: File | null) => void;
}

export function ChampionshipFilesForm({
  regulationFile,
  onLogoChange,
  onTrophyChange,
  onRegulationChange,
}: ChampionshipFilesFormProps) {
  const logoRef = useRef<HTMLInputElement>(null);
  const trophyRef = useRef<HTMLInputElement>(null);
  const regulationRef = useRef<HTMLInputElement>(null);

  const logoConvert = useConvertToWebp();
  const trophyConvert = useConvertToWebp();

  const handleLogoSelect = async (file: File | null) => {
    if (!file) {
      onLogoChange(null);
      if (logoRef.current) logoRef.current.value = "";
      return;
    }
    const webp = await logoConvert.convert(file);
    onLogoChange(webp);
  };

  const handleTrophySelect = async (file: File | null) => {
    if (!file) {
      onTrophyChange(null);
      if (trophyRef.current) trophyRef.current.value = "";
      return;
    }
    const webp = await trophyConvert.convert(file);
    onTrophyChange(webp);
  };

  const handleRegulationChange = (file: File | null) => {
    if (file && file.type !== "application/pdf") {
      onRegulationChange(null);
      return;
    }
    onRegulationChange(file);
  };

  const handleRemove = (ref: React.RefObject<HTMLInputElement | null>) => {
    if (ref.current) ref.current.value = "";
    onRegulationChange(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Arquivos do Campeonato</CardTitle>
        <CardDescription>
          Configure os arquivos do campeonato. Esses arquivos serão exibidos nos
          sites da federação e públicos para divulgação.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* LOGO */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative">
            <ImageUpload
              currentImageUrl={null}
              onFileSelect={handleLogoSelect}
              previewClassName="w-40 h-40 rounded-lg"
              label="Logo do Campeonato"
            />
            {logoConvert.isConverting && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg">
                <Loader2 className="size-6 animate-spin text-white" />
              </div>
            )}
          </div>
          <span className="text-xs text-muted-foreground font-medium">
            Logo
          </span>
        </div>

        {/* TROFÉU */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative">
            <ImageUpload
              currentImageUrl={null}
              onFileSelect={handleTrophySelect}
              previewClassName="w-40 h-40 rounded-lg"
              label="Troféu / Medalha"
            />
            {trophyConvert.isConverting && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg">
                <Loader2 className="size-6 animate-spin text-white" />
              </div>
            )}
          </div>
          <span className="text-xs text-muted-foreground font-medium">
            Troféu / Medalha
          </span>
        </div>

        {/* REGULAMENTO */}
        <div className="flex flex-col gap-2">
          <input
            ref={regulationRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={(e) => {
              handleRegulationChange(e.target.files?.[0] ?? null);
            }}
          />

          {regulationFile ? (
            <div className="rounded-lg border-2 border-primary/50 bg-primary/5 p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <FileCheck className="size-8 text-primary" />
                <div>
                  <p className="text-sm font-medium">{regulationFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(regulationFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="shrink-0 cursor-pointer"
                onClick={() => handleRemove(regulationRef)}
              >
                <X className="size-4" />
              </Button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => regulationRef.current?.click()}
              className={cn(
                "flex flex-col items-center justify-center gap-3 rounded-lg",
                "border-2 border-dashed border-muted-foreground/25 p-8",
                "hover:border-primary hover:bg-muted/50 transition-colors cursor-pointer w-full",
              )}
            >
              <FileText className="size-8 text-muted-foreground/50" />
              <div className="text-center">
                <span className="text-sm font-medium">Clique para enviar</span>
                <p className="text-xs text-muted-foreground mt-1">
                  Formato aceito: PDF
                </p>
              </div>
              <Upload className="size-4 text-muted-foreground/50" />
            </button>
          )}
          <div className="text-xs text-muted-foreground text-center">
            <span className="font-medium">Acesso:</span> Restrito a clubes.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
