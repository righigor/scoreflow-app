import CategoryList from "@/components/admin/category/category-list";
import SheetAddCategory from "@/components/admin/category/sheet-add-category";
import { useGetCategories } from "@/hooks/admin/GET/use-get-categories";


export default function AdminCategoriesPage() {
  const { data, isPending } = useGetCategories();
  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Categorias Base</h2>
          <p className="text-sm text-muted-foreground">Gerencie as categorias padrão (ex: Mirim, Infantil).</p>
        </div>
        <SheetAddCategory />
      </div>
      <CategoryList categories={data || []} isLoading={isPending} />
    </div>
  );
}