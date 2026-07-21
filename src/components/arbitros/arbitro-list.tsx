import type { ArbitroType } from "@/types/arbitros/arbitro-type";
import ArbitroItem from "./arbitro-item";
import { Card, CardContent, CardHeader } from "../ui/card";
import SkeletonItem from "../skeletons/skeleton-item";


interface RefereeListProps {
  arbitros: ArbitroType[]
  isLoading: boolean;
  title: string;
}

export default function ArbitrosList({ arbitros, isLoading, title }: RefereeListProps) {

  return (
    <Card>
      <CardHeader className="font-bold text-xl" >{title}</CardHeader>
      <CardContent className="space-y-4">
        {isLoading && <SkeletonItem />}

        {arbitros && !isLoading && arbitros.length === 0 && (
          <div className="p-4 text-center text-gray-500">Nenhum árbitro encontrado.</div>
        )}

        {arbitros && arbitros.map((ref) => (
          <ArbitroItem key={ref.id} arbitro={ref} />
        ))}
      </CardContent>
    </Card>
  );
}
