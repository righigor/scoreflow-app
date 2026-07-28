import AdminLayout from "@/layouts/admin-layout";
import { ProtectedRoute } from "./protected-route";
import AdminApparatusPage from "@/pages/admin/admin-apparatus-page";


export const adminRoutes = [
  {
    element: <ProtectedRoute allowedRoles={['SYSADMIN']} />,
    children: [
      {
        path: "/admin",
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminApparatusPage /> },
          // Futuro: { path: "categorias", element: <AdminCategoriasPage /> }
        ],
      },
    ],
  },
];