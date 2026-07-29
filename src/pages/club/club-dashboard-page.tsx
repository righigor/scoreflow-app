import { ShieldCheck } from "lucide-react";

export default function ClubDashboard() {
  return (
    <div className="p-8 space-y-4">
      <h2 className="text-2xl font-bold">Dashboard do Clube</h2>
      <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
        <ShieldCheck className="mx-auto h-12 w-12 text-green-500 mb-4" />
        <p className="text-lg font-medium">Acesso Liberado!</p>
        <p className="text-sm">Aqui ficarão os resumos de atletas e campeonatos (Sprint 3).</p>
      </div>
    </div>
  );
}