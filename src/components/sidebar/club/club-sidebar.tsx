import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Users, CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";
import { AppImage } from "@/components/app-image";
import type { ClubType } from "@/types/club/club-type";
import { PortalFooterSidebar } from "../footer-sidebar";

interface ClubSidebarProps {
  club: ClubType;
}

const items = [
  { title: "Meus Atletas", url: "/equipe/atletas", icon: Users },
  { title: "Comição Técnica", url: "/equipe/comicao", icon: Users },
  { title: "Campeonatos", url: "/equipe/campeonatos", icon: CalendarDays },
];

export default function ClubSidebar({ club }: ClubSidebarProps) {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="py-4 px-2">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg border bg-white">
            <AppImage src={club.image_url} alt={club.name} fallbackSrc="/fallbacks/apparatus.webp" className="h-full w-full object-cover" />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-semibold truncate">{club.short_name}</p>
            <p className="text-xs text-muted-foreground truncate">{club.sigla}</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton>
                    <Link to={item.url}><item.icon className="h-4 w-4" /><span>{item.title}</span></Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <PortalFooterSidebar profileRoute="/equipe/perfil" settingsRoute="/equipe/configuracoes" />
    </Sidebar>
  );
}