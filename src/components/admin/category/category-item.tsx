import { Badge } from "@/components/ui/badge";
import type { BaseCategoryType } from "@/types/category/category-type";
import { Tags } from "lucide-react";

const genderLabels = { F: "Feminino", M: "Masculino", MIXED: "Misto" };

export default function CategoryItem({ category }: { category: BaseCategoryType }) {
  return (
    <div className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50">
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
          <Tags className="h-5 w-5 text-muted-foreground" />
        </div>
        <div>
          <p className="font-medium">{category.name}</p>
          <p className="text-xs text-muted-foreground">Slug: {category.slug}</p>
        </div>
      </div>
      <Badge variant="outline">{genderLabels[category.gender]}</Badge>
    </div>
  );
}