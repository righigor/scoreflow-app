import { useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Upload, X, FileCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChampionshipRegulationFormProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
}

export function ChampionshipRegulationForm({
  file,
  onFileChange,
}: ChampionshipRegulationFormProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    if (selected && selected.type !== "application/pdf") {
      onFileChange(null);
      return;
    }
    onFileChange(selected);
  };

  const handleRemove = () => {
    onFileChange(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Regulamento</CardTitle>
        <CardDescription>
          Faça o upload do PDF do regulamento. Ele ficará disponível para
          visualização pública e na inscrição.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={handleFileChange}
        />

        {file ? (
          <div
            className={cn(
              "flex items-center justify-between gap-4 rounded-lg border p-4",
              "border-primary/50 bg-primary/5",
            )}
          >
            <div className="flex items-center gap-3">
              <FileCheck className="size-8 text-primary shrink-0" />
              <div>
                <p className="text-sm font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="shrink-0 cursor-pointer"
              onClick={handleRemove}
            >
              <X className="size-4" />
            </Button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className={cn(
              "flex flex-col items-center justify-center gap-3 rounded-lg",
              "border-2 border-dashed border-muted-foreground/25 p-8",
              "hover:border-primary hover:bg-muted/50 transition-colors cursor-pointer w-full",
            )}
          >
            <FileText className="size-8 text-muted-foreground/50" />
            <div className="text-center">
              <span className="text-sm font-medium">Clique para enviar</span>
              <p className="text-xs text-muted-foreground mt-1">
                Formato aceito: PDF
              </p>
            </div>
            <Upload className="size-4 text-muted-foreground/50" />
          </button>
        )}
      </CardContent>
    </Card>
  );
}