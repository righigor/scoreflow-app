import { useState, useEffect } from "react";
import { AppImage } from "@/components/app-image";
import { X, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  currentImageUrl?: string | null;
  onFileSelect: (file: File | null) => void;
  previewClassName?: string;
  label?: string;
}

export function ImageUpload({
  currentImageUrl,
  onFileSelect,
  previewClassName = "h-24 w-24",
  label = "Clique para enviar",
}: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Prioriza o preview da nova imagem selecionada, senão mostra a que já existe
  const displayUrl = previewUrl ?? currentImageUrl;

  // Limpa a URL temporária da memória do navegador ao sair
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] ?? null;

    if (selectedFile) {
      // Cria preview instantânea
      setPreviewUrl(URL.createObjectURL(selectedFile));
      // Manda o File original para o componente pai
      onFileSelect(selectedFile);
    } else {
      setPreviewUrl(null);
      onFileSelect(null);
    }
  };

  const handleRemove = () => {
    // Limpa o estado interno e avisa o pai que o arquivo foi removido
    setPreviewUrl(null);
    onFileSelect(null);
  };

  return (
    <div className="flex flex-col gap-1.5 w-fit">
      <div
        className={cn(
          "group relative rounded-md overflow-hidden border border-dashed hover:border-primary transition-colors bg-muted/50 flex items-center justify-center",
          previewClassName,
        )}
      >
        {displayUrl ? (
          <>
            <AppImage
              src={displayUrl}
              alt="Preview"
              className="h-full w-full"
            />
            {/* Botão de remover que aparece ao passar o mouse */}
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full h-5 w-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <X className="h-3 w-3" />
            </button>
          </>
        ) : (
          // Área de Upload
          <label
            htmlFor="image-upload-input"
            className="flex flex-col items-center justify-center h-full w-full cursor-pointer p-2"
          >
            <Upload className="h-5 w-5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground mt-1 text-center leading-tight">
              {label}
            </span>
          </label>
        )}
      </div>

      {/* Input escondido */}
      <input
        id="image-upload-input"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
