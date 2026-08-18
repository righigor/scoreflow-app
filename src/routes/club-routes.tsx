import { ProtectedRoute } from "./protected-route";
import ClubLayout from "@/layouts/club-layout";
import ClubDashboard from "@/pages/club/club-dashboard-page";
import ClubAthletesPage from "@/pages/club/club-athletes-page";
import ClubStaffPage from "@/pages/club/club-staff-page";
import ClubPerfilPage from "@/pages/club/club-perfil-page";
import ClubConfiguracoesPage from "@/pages/club/club-configuracoes-page";

export const clubRoutes = [
  {
    element: <ProtectedRoute allowedRoles={["CLUB_ADMIN"]} />,
    children: [
      {
        path: "/equipe",
        element: <ClubLayout />,
        children: [
          { index: true, element: <ClubDashboard /> },
          { path: "atletas", element: <ClubAthletesPage /> },
          { path: "comicao", element: <ClubStaffPage /> },
          { path: "perfil", element: <ClubPerfilPage /> },
          { path: "configuracoes", element: <ClubConfiguracoesPage /> },
        ],
      },
    ],
  },
];