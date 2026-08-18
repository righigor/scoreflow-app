import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ExternalLink, HardDrive, AlertTriangle } from "lucide-react";

export default function AdminConfiguracoesPage() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const isProduction = !supabaseUrl.includes("localhost");

  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="font-bold text-3xl">Configurações do Sistema</h1>
        <p className="text-muted-foreground">
          Painel de controle e informações técnicas do ScoreFlow.
        </p>
      </div>

      <Separator />

      {/* Seção 1: Ambiente */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            Informações do Ambiente
          </CardTitle>
          <CardDescription>
            Detalhes da instância atual do banco de dados.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Status</span>
            <Badge variant={isProduction ? "default" : "secondary"}>
              {isProduction ? "Produção" : "Desenvolvimento (Local)"}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              URL de Conexão
            </span>
            <span className="rounded-md bg-muted px-[0.3rem] py-[0.2rem] font-mono text-xs">
              {supabaseUrl}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Seção 2: Armazenamento */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <HardDrive className="h-4 w-4" />
            Armazenamento (Storage)
          </CardTitle>
          <CardDescription>
            Buckets disponíveis para upload de arquivos.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <p className="font-medium text-sm">images</p>
              <p className="text-xs text-muted-foreground">
                Armazena avatares, logos e imagens de aparelhos (WebP).
              </p>
            </div>
            <Button variant="outline" size="sm">
              <a
                href={`${supabaseUrl.replace("/rest/v1", "")}/storage/buckets`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-3 w-3" />
                Abrir Painel
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Seção 3: Zona de Perigo */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-4 w-4" />
            Zona de Perigo
          </CardTitle>
          <CardDescription>
            Ações irreversíveis. Tenha cuidado ao utilizar as opções abaixo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-3 border border-destructive/30 rounded-lg bg-destructive/5">
            <div>
              <p className="font-medium text-sm">Limpar Dados de Teste</p>
              <p className="text-xs text-muted-foreground">
                Apaga atletas, staff e clubes de teste (Apenas em Dev).
              </p>
            </div>
            <Button variant="destructive" size="sm" disabled={isProduction}>
              Limpar Tudo
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
