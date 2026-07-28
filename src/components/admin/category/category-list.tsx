import { Skeleton } from "@/components/ui/skeleton";
import CategoryItem from "./category-item";
import type { BaseCategoryType } from "@/types/category/category-type";

interface CategoryListProps {
  categories: BaseCategoryType[];
  isLoading: boolean;
}

export default function CategoryList({
  categories,
  isLoading,
}: CategoryListProps) {
  if (isLoading)
    return (
      <div className="space-y-3">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  if (categories.length === 0)
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Nenhuma categoria base cadastrada.
        </p>
      </div>
    );

  return (
    <div className="space-y-3">
      {categories.map((item) => (
        <CategoryItem key={item.id} category={item} />
      ))}
    </div>
  );
}
