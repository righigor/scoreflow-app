import { useState } from "react";

export function useConvertToWebp() {
  const [isConverting, setIsConverting] = useState(false);

  const convert = async (file: File, quality: number = 0.8): Promise<File> => {
    setIsConverting(true);
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = image.width;
          canvas.height = image.height;

          const ctx = canvas.getContext("2d");
          if (!ctx) throw new Error("Falha ao obter contexto do canvas");

          ctx.drawImage(image, 0, 0);

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error("Falha ao converter para WebP"));
                setIsConverting(false);
                return;
              }
              const webpFile = new File(
                [blob],
                file.name.replace(/\.[^/.]+$/, ".webp"),
                {
                  type: "image/webp",
                },
              );
              setIsConverting(false);
              resolve(webpFile);
            },
            "image/webp",
            quality,
          );
        } catch (error) {
          setIsConverting(false);
          reject(error);
        }
      };
      image.onerror = () => {
        setIsConverting(false);
        reject(new Error("Falha ao carregar a imagem"));
      };
      image.src = URL.createObjectURL(file);
    });
  };

  return { convert, isConverting };
}
