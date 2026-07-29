import LoginPage from "@/pages/login-page";
import UnauthorizedPage from "@/pages/unauthorized-page";
import RegisterClubPage from "@/pages/public/register-club-page";

export const publicRoutes = [
  { path: "/", element: <LoginPage /> },
  { path: "/unauthorized", element: <UnauthorizedPage /> },
  { path: "/inscrever-clube", element: <RegisterClubPage /> },
];