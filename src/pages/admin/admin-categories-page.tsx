import { useState } from "react";
import BaseCategoryList from "@/components/categories/base-category-list";
import SheetBaseCategory from "@/components/categories/sheet-base-category";
import { useGetModalities } from "@/hooks/modality/GET/use-get-modalities";
import type { BaseCategoryType } from "@/types/category/category-type";
import { useGetBaseCategories } from "@/hooks/base-category/GET/use-get-base-categories";
import { ModalityFilterCards } from "@/components/modality-filter-cards";

export default function AdminCategoriesPage() {
  const [selectedModalityId, setSelectedModalityId] = useState<string | null>(null);
  const [categoryToEdit, setCategoryToEdit] = useState<BaseCategoryType | null>(null);

  const { data: modalities } = useGetModalities();
  const { data: categories, isPending } = useGetBaseCategories();

  const activeModalityId = modalities?.length === 1 ? modalities[0].id : selectedModalityId;

  const filteredCategories = activeModalityId
    ? categories?.filter((cat) => cat.modality_id === activeModalityId) || []
    : [];

  return (
    <div className="space-y-4 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-2xl">Categorias Base</h2>
          <p className="text-sm text-muted-foreground">Gerencie as categorias por modalidade e gênero.</p>
        </div>
        {activeModalityId && !categoryToEdit && (
          <SheetBaseCategory defaultModalityId={activeModalityId} categoryToEdit={null} clearEdit={() => setCategoryToEdit(null)} />
        )}
      </div>

      <ModalityFilterCards 
        modalities={modalities ?? []} 
        activeId={activeModalityId} 
        onSelect={setSelectedModalityId}
        showImage 
      />

      {activeModalityId && (
        <BaseCategoryList 
          categories={filteredCategories} 
          isLoading={isPending} 
          onEdit={(cat) => setCategoryToEdit(cat)}
          modalities={modalities ?? []}
        />
      )}

      {categoryToEdit && (
        <SheetBaseCategory 
          categoryToEdit={categoryToEdit} 
          clearEdit={() => setCategoryToEdit(null)} 
        />
      )}
    </div>
  );
}