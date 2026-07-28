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

const router = createBrowserRouter([
  ...publicRoutes,
  ...adminRoutes,
  ...federationRoutes,

  { path: "*", element: <Navigate to="/" replace /> },
]);

export function AppRouter() {
  const setProfile = useAuthStore((state) => state.setProfile);
  const setLoading = useAuthStore((state) => state.setLoading);

  useEffect(() => {
    const initAuth = async () => {
      const {
        data: { session },
      } = await createClient().auth.getSession();

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
    };

    initAuth();
  }, [setProfile, setLoading]);

  return <RouterProvider router={router} />;
}
