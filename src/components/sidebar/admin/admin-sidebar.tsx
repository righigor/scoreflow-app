import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Dumbbell,
  Tags,
  Activity,
  Briefcase,
  Landmark,
  LayoutDashboard,
} from "lucide-react";
import { Link } from "react-router-dom";
import { HeaderSidebar } from "../header-sidebar";
import { AdminFooterSidebar } from "./admin-footer-sidebar";

const items = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Modalidades", url: "/admin/modalidades", icon: Activity },
  { title: "Aparelhos", url: "/admin/aparelhos", icon: Dumbbell },
  { title: "Categorias Base", url: "/admin/categorias", icon: Tags },
  { title: "Funções Staff", url: "/admin/staff", icon: Briefcase },
  { title: "Federações", url: "/admin/federacoes", icon: Landmark },
];

export default function AdminSidebar() {
  return (
    <Sidebar collapsible="icon">
     <HeaderSidebar />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dados Mestres</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton>
                    <Link to={item.url} className="flex items-center gap-2">
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <AdminFooterSidebar />
    </Sidebar>
  );
}
