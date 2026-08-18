import type { AthleteWithModalitiesType } from "@/types/athlete/athlete-type";
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

// Função auxiliar para formatar a data no padrão BR
function formatBirthdate(dateString: string | null): string {
  if (!dateString) return "-";
  // O "T00:00:00" garante que o fuso horário do navegador não atrapalhe a data
  const date = new Date(dateString + "T00:00:00");
  return date.toLocaleDateString("pt-BR");
}

// Função auxiliar para definir a cor do Badge baseado no status
function getStatusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "ACTIVE":
      return "default"; // Cor primária do tema (Geralmente verde ou azul no shadcn)
    case "INJURED":
      return "destructive"; // Vermelho
    case "INACTIVE":
    case "RETIRED":
      return "secondary"; // Cinza
    case "FREE_AGENT":
      return "outline"; // Apenas borda
    default:
      return "secondary";
  }
}

export default function AthletesList({ athletes, isLoading, title }: AthletesListProps) {
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
                <TableHead>Nome</TableHead>
                <TableHead className="w-[100px]">Gênero</TableHead>
                <TableHead className="w-[120px]">Nascimento</TableHead>
                <TableHead className="w-[140px]">Status</TableHead>
                {/* Colunas futuras para Documentos e Ações podem entrar aqui */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {athletes.map((athlete) => (
                <TableRow key={athlete.id}>
                  <TableCell className="font-medium">{athlete.name}</TableCell>
                  <TableCell>
                    {athlete.gender === "F" ? "Feminino" : 
                     athlete.gender === "M" ? "Masculino" : "Outro"}
                  </TableCell>
                  <TableCell>{formatBirthdate(athlete.birthdate)}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(athlete.status)}>
                      {athlete.status === "FREE_AGENT" ? "Free Agent" : 
                       athlete.status === "INJURED" ? "Lesionado" :
                       athlete.status === "INACTIVE" ? "Inativo" :
                       athlete.status === "RETIRED" ? "Aposentado" : "Ativo"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}