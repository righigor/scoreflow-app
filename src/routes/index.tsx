import { useEffect } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { useAuthStore } from "@/stores/auth-store";
import { createClient } from "@/lib/supabase/client";
import LoginPage from "@/pages/login-page";
import UnauthorizedPage from "@/pages/unauthorized-page";
import { ProtectedRoute } from "./protected-route";
import FederacaoLayout from "@/layouts/federacao-layout";
import FederacaoDashboard from "@/pages/federacao/federacao-dashboard";
import FederacaoArbitragemPage from "@/pages/federacao/federacao-arbitragem-page";


const supabase = createClient();

const router = createBrowserRouter([
  { path: "/", element: <LoginPage /> },
  { path: "/unauthorized", element: <UnauthorizedPage /> },

  {
    element: <ProtectedRoute allowedRoles={["FEDERATION_ADMIN"]} />,
    children: [
      {
        path: "/federacao",
        element: <FederacaoLayout />,
        children: [
          { index: true, element: <FederacaoDashboard /> },
          { path: "campeonatos", element: <p>Campeonatos (Em breve)</p> },
          { path: "arbitros", element: <FederacaoArbitragemPage /> },
        ],
      },
    ],
  },

  // --- BLOCO PROTEGIDO: CLUBE (Esqueleto para o futuro) ---
  // {
  //   element: <ProtectedRoute allowedRoles={['CLUB_ADMIN']} />,
  //   children: [
  //     { path: "/club", element: <ClubLayout />, children: [...] }
  //   ]
  // },

  // --- BLOCO PROTEGIDO: ÁRBITRO (Esqueleto para o futuro) ---
  // {
  //   element: <ProtectedRoute allowedRoles={['JUDGE']} />,
  //   children: [
  //     { path: "/scoring", element: <ScoringLayout />, children: [...] }
  //   ]
  // },

  // Fallback para rotas não encontradas
  { path: "*", element: <Navigate to="/" replace /> },
]);

export function AppRouter() {
  const setProfile = useAuthStore((state) => state.setProfile);
  const setLoading = useAuthStore((state) => state.setLoading);

  useEffect(() => {
    const initAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (profile) {
          setProfile(profile);
        } else {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    initAuth();
  }, [setProfile, setLoading]);

  return <RouterProvider router={router} />;
}
