import { ProtectedRoute } from "./protected-route";
import ArbitroLayout from "@/layouts/arbitro-layout";
import ArbitroDashboard from "@/pages/arbitro/arbitro-dashboard";
import ArbitroPerfilPage from "@/pages/arbitro/arbitro-perfil-page";

export const arbitroRoutes = [
  {
    element: <ProtectedRoute allowedRoles={["JUDGE"]} />,
    children: [
      {
        path: "/arbitro",
        element: <ArbitroLayout />,
        children: [
          { index: true, element: <ArbitroDashboard /> },
          { path: "perfil", element: <ArbitroPerfilPage /> },
        ],
      },
    ],
  },
];