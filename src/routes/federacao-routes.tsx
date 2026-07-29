import FederacaoArbitragemPage from "@/pages/federacao/federacao-arbitragem-page";
import FederacaoCampeonatosPage from "@/pages/federacao/federacao-campeonatos.page";
import FederacaoDashboard from "@/pages/federacao/federacao-dashboard";
import { ProtectedRoute } from "./protected-route";
import FederacaoLayout from "@/layouts/federacao-layout";
import FederacaoEquipesPage from "@/pages/federacao/federacao-equipes-page";

export const federationRoutes = [
  {
    element: <ProtectedRoute allowedRoles={["FEDERATION_ADMIN"]} />,
    children: [
      {
        path: "/federacao",
        element: <FederacaoLayout />,
        children: [
          { index: true, element: <FederacaoDashboard /> },
          { path: "arbitros", element: <FederacaoArbitragemPage /> },
          { path: "campeonatos", element: <FederacaoCampeonatosPage /> },
          { path: "equipes", element: <FederacaoEquipesPage /> },
        ],
      },
    ],
  },
];
