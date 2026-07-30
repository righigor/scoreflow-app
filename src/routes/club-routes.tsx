import { ProtectedRoute } from "./protected-route";
import ClubLayout from "@/layouts/club-layout";
import ClubAthletesPage from "@/pages/club/club-athletes-page";
import ClubDashboard from "@/pages/club/club-dashboard-page";
import ClubStaffPage from "@/pages/club/club-staff-page";

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
        ],
      },
    ],
  },
];
