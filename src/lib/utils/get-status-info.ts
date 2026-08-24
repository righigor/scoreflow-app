export function getStatusInfo(status: string) {
  switch (status) {
    case "ACTIVE": return { label: "Ativa", variant: "default" as const };
    case "INACTIVE": return { label: "Inativa", variant: "secondary" as const };
    case "TRIAL": return { label: "Teste", variant: "outline" as const };
    default: return { label: status, variant: "secondary" as const };
  }
}