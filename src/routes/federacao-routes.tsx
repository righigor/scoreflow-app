import FederacaoArbitragemPage from "@/pages/federacao/federacao-arbitragem-page";
import FederacaoCampeonatosPage from "@/pages/federacao/federacao-campeonatos.page";
import FederacaoDashboard from "@/pages/federacao/federacao-dashboard";
import { ProtectedRoute } from "./protected-route";
import FederacaoLayout from "@/layouts/federacao-layout";


export const federationRoutes = [
  {
    element: <ProtectedRoute allowedRoles={['FEDERATION_ADMIN']} />,
    children: [
      {
        path: "/federation",
        element: <FederacaoLayout />,
        children: [
          { index: true, element: <FederacaoDashboard /> },
          { path: "arbitros", element: <FederacaoArbitragemPage /> },
          { path: "campeonatos", element: <FederacaoCampeonatosPage /> },
        ],
      },
    ],
  },
];