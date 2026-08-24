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
import { Flag, Gavel, Home, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { HeaderSidebar } from "../header-sidebar";
import { PortalFooterSidebar } from "../footer-sidebar";
import { useGetFederationProfile } from "@/hooks/federacao/GET/use-get-federation-profile";

export default function FederacaoSidebar() {
  const { data: federation } = useGetFederationProfile();
  const items = [
    {
      title: "Home",
      url: `/federacao`,
      icon: Home,
    },
    {
      title: "Campeonatos",
      url: `/federacao/campeonatos`,
      icon: Trophy,
    },
    {
      title: "Equipes",
      url: `/federacao/equipes`,
      icon: Flag,
    },
    {
      title: "Árbitros",
      url: `/federacao/arbitros`,
      icon: Gavel,
    },
  ];
  return (
    <Sidebar collapsible="icon">
      <HeaderSidebar subtitle="ScoreFlow - Federação" />
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
      <SidebarFooter>
        <PortalFooterSidebar
          profileRoute={`/federacao/perfil`}
          settingsRoute={`/federacao/configuracoes`}
          entityImageUrl={federation?.image_url}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
