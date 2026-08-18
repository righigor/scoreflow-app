import { useState, useEffect, useRef } from "react";
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
  const inputRef = useRef<HTMLInputElement>(null);

  const displayUrl = previewUrl ?? currentImageUrl;

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] ?? null;

    if (selectedFile) {
      setPreviewUrl(URL.createObjectURL(selectedFile));
      onFileSelect(selectedFile);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPreviewUrl(null);
    onFileSelect(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleContainerClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="flex flex-col gap-1.5 w-fit">
      {/* Input escondido — sempre renderizado */}
      <input
        ref={inputRef}
        id="image-upload-input"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Container sempre clicável para trocar a imagem */}
      <div
        onClick={handleContainerClick}
        className={cn(
          "group relative rounded-md overflow-hidden border border-dashed hover:border-primary transition-colors bg-muted/50 flex items-center justify-center cursor-pointer",
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
            {/* Overlay sutil ao passar o mouse */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Upload className="h-5 w-5 text-white" />
            </div>
            {/* Botão de remover — stopPropagation para não abrir o seletor */}
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full h-5 w-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10"
            >
              <X className="h-3 w-3" />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full w-full p-2">
            <Upload className="h-5 w-5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground mt-1 text-center leading-tight">
              {label}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}