import { useState } from "react";
import { AppImage } from "@/components/app-image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import type { ClubType } from "@/types/club/club-type";

interface PendingClubsAlertProps {
  clubs: ClubType[];
  isLoading: boolean;
  onApprove: (clubId: string) => void;
  onReject: (clubId: string) => void;
}

export function PendingClubsAlert({
  clubs,
  isLoading,
  onApprove,
  onReject,
}: PendingClubsAlertProps) {
  const [open, setOpen] = useState(false);

  if (clubs.length === 0) return null;

  return (
    <Card className="border-yellow-300 bg-yellow-800">
      <CardContent className="p-4">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger>
            <button className="flex items-center gap-3 w-full text-left">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="font-semibold text-yellow-200">
                  {clubs.length} clube(s) aguardando aprovação
                </p>
                <p className="text-xs text-yellow-300">
                  Clique aqui para analisar e aprovar/rejeitar.
                </p>
              </div>
            </button>
          </SheetTrigger>
          <SheetContent className="w-full sm:max-w-lg">
            <SheetHeader>
              <SheetTitle>Clubes Pendentes</SheetTitle>
            </SheetHeader>
            <div className="space-y-4 px-4 pb-4 max-h-[70vh] overflow-y-auto">
              {isLoading && (
                <p className="text-sm text-muted-foreground">Carregando...</p>
              )}
              {clubs.map((club) => (
                <Card key={club.id}>
                  <CardContent className="flex items-center gap-4 p-4">
                    <AppImage
                      src={club.image_url}
                      fallbackSrc="/fallbacks/club.webp"
                      className="h-10 w-10 rounded-full"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{club.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {club.email}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-green-600 border-green-300 hover:bg-green-50 cursor-pointer"
                        onClick={() => onApprove(club.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" /> Aceitar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-300 hover:bg-red-50 cursor-pointer"
                        onClick={() => onReject(club.id)}
                      >
                        <XCircle className="h-4 w-4 mr-1" /> Rejeitar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </CardContent>
    </Card>
  );
}