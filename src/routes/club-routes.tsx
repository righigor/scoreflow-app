import { ProtectedRoute } from "./protected-route";
import ClubLayout from "@/layouts/club-layout";
import ClubDashboard from "@/pages/club/club-dashboard-page";

export const clubRoutes = [
  {
    element: <ProtectedRoute allowedRoles={['CLUB_ADMIN']} />,
    children: [
      {
        path: "/equipe",
        element: <ClubLayout />,
        children: [
          { index: true, element: <ClubDashboard /> },
          // { path: "atletas", element: <ClubAthletesPage /> } -> Futuro
        ],
      },
    ],
  },
];