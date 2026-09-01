import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CategoryRow } from "./category-row";
import type { CategoryWithApparatus } from "@/types/championship/championship-type";

interface BaseCategoryType {
  id: string;
  name: string;
}

interface ApparatusType {
  id: string;
  name: string;
  image_url: string | null;
}

interface ChampionshipCategoriesFormProps {
  availableCategories: BaseCategoryType[];
  availableApparatus: ApparatusType[];
  categories: CategoryWithApparatus[];
  onCategoriesChange: (categories: CategoryWithApparatus[]) => void;
  error?: string;
}

export function ChampionshipCategoriesForm({
  availableCategories,
  availableApparatus,
  categories,
  onCategoriesChange,
  error,
}: ChampionshipCategoriesFormProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>("");

  const addedIds = new Set(categories.map((c) => c.base_category_id));
  const remainingCategories = availableCategories.filter(
    (cat) => !addedIds.has(cat.id),
  );

  const handleAdd = () => {
    if (!selectedCategoryId) return;
    const cat = availableCategories.find((c) => c.id === selectedCategoryId);
    if (!cat) return;

    onCategoriesChange([
      ...categories,
      {
        base_category_id: cat.id,
        category_name: cat.name,
        apparatus_ids: [],
      },
    ]);
    setSelectedCategoryId("");
  };

  const handleRemove = (categoryId: string) => {
    onCategoriesChange(
      categories.filter((c) => c.base_category_id !== categoryId),
    );
  };

  const handleToggleApparatus = (categoryId: string, apparatusId: string) => {
    onCategoriesChange(
      categories.map((cat) => {
        if (cat.base_category_id !== categoryId) return cat;
        const has = cat.apparatus_ids.includes(apparatusId);
        if (has && cat.apparatus_ids.length <= 1) return cat;
        if (!has && cat.apparatus_ids.length >= 4) return cat;

        return {
          ...cat,
          apparatus_ids: has
            ? cat.apparatus_ids.filter((id) => id !== apparatusId)
            : [...cat.apparatus_ids, apparatusId],
        };
      }),
    );
  };

  const handleCategorySelect = (value: string | null) => {
    const id = value ?? "";
    setSelectedCategoryId(id);
    const cat = remainingCategories.find((c) => c.id === id);
    setSelectedCategoryName(cat?.name ?? "");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Categorias e Aparelhos</CardTitle>
            <CardDescription>
              Selecione as categorias e defina quais aparelhos serão disputados
              (mín. 1, máx. 4 por categoria).
            </CardDescription>
          </div>
          {categories.length > 0 && (
            <span className="text-sm text-muted-foreground font-medium">
              {categories.length} adicionada{categories.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-6">
          <Select
            value={selectedCategoryId}
            onValueChange={handleCategorySelect}
            disabled={remainingCategories.length === 0}
          >
            <SelectTrigger className="flex-1">
              <SelectValue
                placeholder={
                  remainingCategories.length === 0
                    ? "Todas as categorias já foram adicionadas"
                    : "Selecione uma categoria..."
                }
              >
                {selectedCategoryName || undefined}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {remainingCategories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            type="button"
            variant="outline"
            disabled={!selectedCategoryId}
            onClick={handleAdd}
            className="cursor-pointer"
          >
            <Plus className="size-4 mr-1.5" />
            Adicionar
          </Button>
        </div>

        {error && <p className="text-xs text-destructive">{error}</p>}

        {categories.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-6">
            Nenhuma categoria adicionada. Selecione acima para começar.
          </p>
        ) : (
          <div className="space-y-3">
            {categories.map((cat) => (
              <CategoryRow
                key={cat.base_category_id}
                category={cat}
                apparatuses={availableApparatus}
                isMaxReached={cat.apparatus_ids.length >= 4}
                onToggleApparatus={(apparatusId) =>
                  handleToggleApparatus(cat.base_category_id, apparatusId)
                }
                onRemove={() => handleRemove(cat.base_category_id)}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
