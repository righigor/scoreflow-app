import SkeletonCard from "../skeletons/skeleton-card";
import { Card, CardContent, CardHeader } from "../ui/card";

interface TotalArbitrosAtivosProps {
  total: number;
  isLoading?: boolean;
}

export default function TotalArbitrosAtivos({
  total,
  isLoading,
}: TotalArbitrosAtivosProps) {
  if (isLoading) {
    return <SkeletonCard />;
  }

  return (
    <Card className="text-center">
      <CardHeader className="font-bold text-md">
        Total de Árbitros ativos:
      </CardHeader>
      <CardContent className="text-2xl font-bold">
        {total}{" "}
        <span className="text-sm font-normal">
          {total === 1 ? "árbitro ativo" : "árbitros ativos"}
        </span>{" "}
      </CardContent>
    </Card>
  );
}
