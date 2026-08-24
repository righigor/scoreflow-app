import type { UserRole } from "@/stores/auth-store";

export function getRoleLabel(role: UserRole): string {
  switch (role) {
    case "FEDERATION_ADMIN": return "Adm da Federação";
    case "CLUB_ADMIN": return "Adm do Clube";
    case "JUDGE": return "Árbitro";
    default: return role;
  }
}