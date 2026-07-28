import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader } from "@/components/ui/sidebar";
import { ShieldCheck, Dumbbell, Tags } from "lucide-react";

const items = [
  { title: "Aparelhos", url: "/admin", icon: Dumbbell },
  { title: "Categorias Base", url: "/admin/categorias", icon: Tags },
];

export default function AdminSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="py-4 px-2">
        <div className="flex items-center gap-2">
          <div className="bg-primary text-primary-foreground p-1.5 rounded-lg"><ShieldCheck size={18} /></div>
          <span className="font-bold text-sm">ScoreFlow Admin</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dados Mestres</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton>
                    <a href={item.url}><item.icon /><span>{item.title}</span></a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}