import { Skeleton } from "@/components/ui/skeleton";
import type { ApparatusType } from "@/types/apparatus/apparatus-type";
import ApparatusItem from "./apparatus-item";


interface ApparatusListProps {
  apparatus: ApparatusType[];
  isLoading: boolean;
}

export default function ApparatusList({ apparatus, isLoading }: ApparatusListProps) {
  if (isLoading) {
    return <div className="space-y-3">
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-20 w-full" />
    </div>;
  }

  if (apparatus.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Nenhum aparelho cadastrado ainda.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {apparatus.map((item) => (
        <ApparatusItem key={item.id} apparatus={item} />
      ))}
    </div>
  );
}