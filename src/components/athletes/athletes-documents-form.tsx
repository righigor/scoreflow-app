/* eslint-disable @typescript-eslint/no-unused-vars */
import { FileText, FileCheck, Upload } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase/client";

interface AthleteDocumentsFormProps {
  // Do Banco
  identityPath: string | null;
  residencePath: string | null;
  imageRightPath: string | null;
  // Novo: Do estado local (Arquivo acabou de ser selecionado)
  pendingIdentity: File | null;
  pendingResidence: File | null;
  pendingImageRight: File | null;
  // Ações
  onIdentityChange: (file: File | null) => void;
  onResidenceChange: (file: File | null) => void;
  onImageRightChange: (file: File | null) => void;
}

export function AthleteDocumentsForm({
  identityPath,
  residencePath,
  imageRightPath,
  pendingIdentity,
  pendingResidence,
  pendingImageRight,
  onIdentityChange,
  onResidenceChange,
  onImageRightChange,
}: AthleteDocumentsFormProps) {
  const handleViewDocument = async (path: string | null, docName: string) => {
    if (!path) return toast.info("Nenhum documento enviado ainda.");
    try {
      const { data, error } = await supabase.storage
        .from("documents")
        .createSignedUrl(path, 3600);
      if (error) throw error;
      window.open(data.signedUrl, "_blank");
    } catch {
      toast.error("Erro ao gerar link do documento.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Documentos</CardTitle>
        <CardDescription>
          Faça o upload dos documentos obrigatórios. Os arquivos são armazenados com segurança.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <DocumentCard
            id="doc-identity"
            label="Identidade (RG/CNH)"
            filePath={identityPath}
            pendingFile={pendingIdentity} // Passa o pendente
            onView={() => handleViewDocument(identityPath, "Identidade")}
            onFileChange={onIdentityChange}
          />

          <DocumentCard
            id="doc-residence"
            label="Comprovante de Residência"
            filePath={residencePath}
            pendingFile={pendingResidence} // Passa o pendente
            onView={() => handleViewDocument(residencePath, "Residência")}
            onFileChange={onResidenceChange}
          />

          <DocumentCard
            id="doc-image-right"
            label="Termo Uso de Imagem"
            filePath={imageRightPath}
            pendingFile={pendingImageRight} // Passa o pendente
            onView={() => handleViewDocument(imageRightPath, "Termo de Imagem")}
            onFileChange={onImageRightChange}
          />

        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------
// COMPONENTE AUXILIAR PRIVADO (O Card Visual)
// ---------------------------------------------------------
interface DocumentCardProps {
  id: string;
  label: string;
  filePath: string | null;
  pendingFile: File | null;
  onView: () => void;
  onFileChange: (file: File | null) => void;
}

function DocumentCard({ id, label, filePath, pendingFile, onView, onFileChange }: DocumentCardProps) {
  // Tem arquivo no banco OU no estado local
  const hasFile = !!filePath || !!pendingFile;
  
  // O arquivo JÁ ESTÁ no banco (pode visualizar)?
  const isSaved = !!filePath;

  const triggerUpload = () => {
    const inputElement = document.getElementById(id) as HTMLInputElement | null;
    inputElement?.click();
  };

  return (
    <div className="relative">
      <input
        id={id}
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={(e) => onFileChange(e.target.files?.[0] || null)}
      />

      <Card
        className={cn(
          "flex flex-col items-center justify-center gap-3 p-6 min-h-[160px] transition-all cursor-pointer",
          hasFile
            ? "border-primary/50 bg-primary/5 hover:bg-primary/10"
            : "border-dashed border-muted-foreground/25 hover:border-primary hover:bg-muted/50"
        )}
        onClick={!hasFile ? triggerUpload : undefined}
      >
        <CardContent className="p-0 flex flex-col items-center gap-3 text-center">
          {hasFile ? (
            <FileCheck className="size-10 text-primary" />
          ) : (
            <FileText className="size-10 text-muted-foreground/50" />
          )}

          <span className="font-medium text-sm leading-tight">{label}</span>

          {hasFile ? (
            <div className="flex items-center gap-2 mt-1">
              {/* SÓ PERMITE VISUALIZAR SE O ARQUIVO JÁ FOI SALVO NO BANCO */}
              {isSaved ? (
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  className="text-xs h-7 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onView();
                  }}
                >
                  Visualizar PDF
                </Button>
              ) : (
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  className="text-xs h-7 cursor-not-allowed opacity-70"
                  disabled
                >
                  Pendente salvamento...
                </Button>
              )}
              
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7 text-muted-foreground hover:text-primary cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  triggerUpload();
                }}
              >
                <Upload className="size-3.5" />
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1">
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                className="text-xs text-muted-foreground cursor-pointer"
                onClick={triggerUpload}
              >
                <Upload className="size-3.5 mr-1.5" />
                Enviar PDF
              </Button>
              <span className="text-[10px] text-muted-foreground/60 font-medium">
                Formato aceito: PDF
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}