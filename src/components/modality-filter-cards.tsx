import { Card, CardContent } from "@/components/ui/card";
import { AppImage } from "@/components/app-image";

type ModalityItem = {
  id: string;
  name: string;
  image_url?: string | null;
};

interface ModalityFilterCardsProps {
  modalities: ModalityItem[];
  activeId: string | null;
  onSelect: (id: string) => void;
  showImage?: boolean;
}

export function ModalityFilterCards({
  modalities,
  activeId,
  onSelect,
  showImage = false,
}: ModalityFilterCardsProps) {
  if (!modalities || modalities.length <= 1) {
    return null;
  }

  return (
    <div
      className={`grid gap-4 ${showImage ? "grid-cols-2 lg:grid-cols-3" : "grid-cols-2 md:grid-cols-3"}`}
    >
      {modalities.map((mod) => (
        <Card
          key={mod.id}
          className={`cursor-pointer transition-all hover:border-primary ${
            activeId === mod.id ? "border-primary bg-muted/50" : ""
          }`}
          onClick={() => onSelect(mod.id)}
        >
          <CardContent
            className={`flex items-center gap-3 ${showImage ? "p-4" : "p-6 justify-center h-24"}`}
          >
            {showImage && (
              <AppImage
                src={mod.image_url}
                alt={mod.name}
                className="size-14 rounded object-cover"
              />
            )}
            <span
              className={`font-semibold ${showImage ? "text-sm" : "text-lg"}`}
            >
              {mod.name}
            </span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
