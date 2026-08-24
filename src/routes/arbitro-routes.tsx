import { ProtectedRoute } from "./protected-route";
import ArbitroLayout from "@/layouts/arbitro-layout";
import ArbitroConfiguracoesPage from "@/pages/arbitro/arbitro-configuracoes-page";
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
          { path: "configuracoes", element: <ArbitroConfiguracoesPage /> },
        ],
      },
    ],
  },
];