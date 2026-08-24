import { useEffect } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/auth-store";
import { adminRoutes } from "./admin-routes";
import { federationRoutes } from "./federacao-routes";
import { publicRoutes } from "./public-routes";
import { clubRoutes } from "./club-routes";
import { arbitroRoutes } from "./arbitro-routes";

const router = createBrowserRouter([
  ...publicRoutes,
  ...adminRoutes,
  ...federationRoutes,
  ...clubRoutes,
  ...arbitroRoutes,
  { path: "*", element: <Navigate to="/" replace /> },
]);

export function AppRouter() {
  const setProfile = useAuthStore((state) => state.setProfile);
  const setLoading = useAuthStore((state) => state.setLoading);

  useEffect(() => {
    const initAuth = async () => {
      try {
        let {
          data: { session },
        } = await createClient().auth.getSession();

        if (!session) {
          await new Promise((resolve) => setTimeout(resolve, 500));
          const retry = await createClient().auth.getSession();
          session = retry.data.session;
        }

        if (session?.user) {
          const { data: profile } = await createClient()
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
      } catch (error) {
        console.error("Erro ao inicializar autenticação:", error);
        setLoading(false);
      }
    };

    initAuth();
  }, [setProfile, setLoading]);

  return <RouterProvider router={router} />;
}
