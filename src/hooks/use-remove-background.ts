import { useState } from "react";

export function useRemoveBackground() {
  const [isProcessing, setIsProcessing] = useState(false);

  const remove = async (file: File): Promise<File> => {
    setIsProcessing(true);

    try {
      // Dynamic import para não carregar o WASM (~10MB) se não usar
      const { removeBackground } = await import(
        "@imgly/background-removal"
      );

      const blob = await removeBackground(file, {
        progress: (key: string, current: number, total: number) => {
          // Opcional: usar para barra de progresso no futuro
        },
      });

      const processedFile = new File(
        [blob],
        file.name.replace(/\.[^/.]+$/, "-no-bg.webp"),
        { type: "image/webp" },
      );

      setIsProcessing(false);
      return processedFile;
    } catch (error) {
      setIsProcessing(false);
      // Se falhar, retorna o original para não bloquear o fluxo
      console.warn("Falha ao remover fundo, usando imagem original:", error);
      return file;
    }
  };

  return { remove, isProcessing };
}