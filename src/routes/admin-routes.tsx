import AdminLayout from "@/layouts/admin-layout";
import { ProtectedRoute } from "./protected-route";
import AdminCategoriesPage from "@/pages/admin/admin-categories-page";
import AdminDashboardPage from "@/pages/admin/admin-dashboard-page";
import AdminPerfilPage from "@/pages/admin/admin-perfil-page";
import AdminConfiguracoesPage from "@/pages/admin/admin-configuracoes-page";
import AdminModalidadesPage from "@/pages/admin/admin-modalities-page";
import AdminApparatusPage from "@/pages/admin/admin-apparatus-page";
import AdminStaffRolesPage from "@/pages/admin/admin-staff-role-page";
import AdminFederacoesPage from "@/pages/admin/admin-federacoes-page";

export const adminRoutes = [
  {
    element: <ProtectedRoute allowedRoles={["SYSADMIN"]} />,
    children: [
      {
        path: "/admin",
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminDashboardPage /> },
          { path: "aparelhos", element: <AdminApparatusPage /> },
          { path: "categorias", element: <AdminCategoriesPage /> },
          { path: "perfil", element: <AdminPerfilPage /> },
          { path: "configuracoes", element: <AdminConfiguracoesPage /> },
          { path: "modalidades", element: <AdminModalidadesPage /> },
          { path: "staff", element: <AdminStaffRolesPage /> },
          { path: "federacoes", element: <AdminFederacoesPage />}
        ],
      },
    ],
  },
];
