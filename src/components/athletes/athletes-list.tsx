import { Link } from "react-router-dom";
import type { AthleteWithModalitiesType } from "@/types/athlete/athlete-type";
import { AppImage } from "@/components/app-image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface AthletesListProps {
  athletes: AthleteWithModalitiesType[];
  isLoading: boolean;
  title: string;
}

function formatBirthdate(dateString: string | null): string {
  if (!dateString) return "-";
  const date = new Date(dateString + "T00:00:00");
  return date.toLocaleDateString("pt-BR");
}

function getStatusVariant(
  status: string,
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "ACTIVE":
      return "default";
    case "INJURED":
      return "destructive";
    case "INACTIVE":
    case "RETIRED":
      return "secondary";
    case "FREE_AGENT":
      return "outline";
    default:
      return "secondary";
  }
}

export default function AthletesList({
  athletes,
  isLoading,
  title,
}: AthletesListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-10 text-sm text-muted-foreground">
            Carregando atletas...
          </div>
        ) : athletes.length === 0 ? (
          <div className="flex items-center justify-center py-10 text-sm text-muted-foreground">
            Nenhum atleta encontrado nesta modalidade.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Atleta</TableHead>
                <TableHead className="w-25">Gênero</TableHead>
                <TableHead className="w-30">Nascimento</TableHead>
                <TableHead className="w-35">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {athletes.map((athlete) => {
                const fallbackAvatar =
                  athlete.gender === "F"
                    ? "/fallbacks/athlete-f.webp"
                    : "/fallbacks/athlete-m.webp";

                return (
                  <TableRow
                    key={athlete.id}
                    className="cursor-pointer hover:bg-muted/50"
                  >
                    <TableCell>
                      <Link
                        to={`/equipe/atletas/${athlete.id}`}
                        className="flex items-center gap-3 group"
                      >
                        <div className="size-16 shrink-0 overflow-hidden rounded-md">
                          <AppImage
                            src={athlete.profile_picture_url}
                            alt={athlete.name}
                            fallbackSrc={fallbackAvatar}
                            className="size-full object-cover"
                          />
                        </div>
                        <span className="font-medium group-hover:underline">
                          {athlete.name}
                        </span>
                      </Link>
                    </TableCell>
                    <TableCell>
                      {athlete.gender === "F"
                        ? "Feminino"
                        : athlete.gender === "M"
                          ? "Masculino"
                          : "Outro"}
                    </TableCell>
                    <TableCell>{formatBirthdate(athlete.birthdate)}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(athlete.status)}>
                        {athlete.status === "FREE_AGENT"
                          ? "Free Agent"
                          : athlete.status === "INJURED"
                            ? "Lesionado"
                            : athlete.status === "INACTIVE"
                              ? "Inativo"
                              : athlete.status === "RETIRED"
                                ? "Aposentado"
                                : "Ativo"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
