import { useState } from "react";
import { cn } from "@/lib/utils";

interface AppImageProps extends Omit<
  React.ImgHTMLAttributes<HTMLImageElement>,
  "src"
> {
  src?: string | null;
  fallbackSrc?: string;
}

export function AppImage({
  src,
  alt = "Imagem",
  fallbackSrc = "/fallbacks/default.webp",
  className,
  ...props
}: AppImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  const shouldUseFallback = !src || failedSrc === src;
  const finalSrc = shouldUseFallback ? fallbackSrc : src;

  const handleError = () => {
    if (finalSrc !== fallbackSrc) {
      setFailedSrc(src ?? null);
    }
  };

  return (
    <img
      src={finalSrc}
      alt={alt}
      onError={handleError}
      className={cn(className)}
      {...props}
    />
  );
}
