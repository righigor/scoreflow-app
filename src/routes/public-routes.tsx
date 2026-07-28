import LoginPage from "@/pages/login-page";
import UnauthorizedPage from "@/pages/unauthorized-page";

export const publicRoutes = [
  { path: "/", element: <LoginPage /> },
  { path: "/unauthorized", element: <UnauthorizedPage /> },
];