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
import { Home, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { HeaderSidebar } from "../header-sidebar";
import { PortalFooterSidebar } from "../footer-sidebar";
import { useGetJudgeProfile } from "@/hooks/arbitros/GET/use-get-judge-profile";

interface ArbitroSidebarProps {
  liveChampionship?: { id: string; name: string } | null;
}

export default function ArbitroSidebar({
  liveChampionship,
}: ArbitroSidebarProps) {
  const { data: judge } = useGetJudgeProfile();

  const items = [
    {
      title: "Home",
      url: "/arbitro",
      icon: Home,
    },
    {
      title: "Campeonatos",
      url: "/arbitro/campeonatos",
      icon: Trophy,
    },
  ];

  return (
    <Sidebar collapsible="icon">
      <HeaderSidebar subtitle="ScoreFlow - Árbitro" />
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

        {liveChampionship && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-red-500">
              AO VIVO
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Link
                      to={`/arbitro/campeonatos/${liveChampionship.id}`}
                      className="flex items-center gap-2"
                    >
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                      </span>
                      <span className="text-sm font-medium truncate">
                        {liveChampionship.name}
                      </span>
                      <span className="ml-auto text-[10px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded">
                        LIVE
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter>
        <PortalFooterSidebar
          profileRoute="/arbitro/perfil"
          settingsRoute="/arbitro/configuracoes"
          entityImageUrl={judge?.image_url}
        />
      </SidebarFooter>
    </Sidebar>
  );
}