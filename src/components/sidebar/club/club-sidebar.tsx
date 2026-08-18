// src/components/sidebar/club/club-sidebar.tsx
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Users, UserCheck, CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";
import { HeaderSidebar } from "../header-sidebar";
import { PortalFooterSidebar } from "../footer-sidebar";
import { useGetMyClub } from "@/hooks/club/GET/use-get-my-club";

const items = [
  { title: "Home", url: "/equipe", icon: Users },
  { title: "Meus Atletas", url: "/equipe/atletas", icon: Users },
  { title: "Comissão Técnica", url: "/equipe/comicao", icon: UserCheck },
  { title: "Campeonatos", url: "/equipe/campeonatos", icon: CalendarDays },
];

export default function ClubSidebar() {
  const { data: club } = useGetMyClub();

  return (
    <Sidebar collapsible="icon">
      <HeaderSidebar subtitle="ScoreFlow - Equipe" />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Seus Itens</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton>
                    <Link
                      to={item.url}
                      className="flex justify-center items-center gap-2"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <PortalFooterSidebar
          profileRoute="/equipe/perfil"
          settingsRoute="/equipe/configuracoes"
          entityImageUrl={club?.image_url}
        />
      </SidebarFooter>
    </Sidebar>
  );
}