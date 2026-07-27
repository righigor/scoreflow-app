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
import { FederacaoFooterSidebar } from "./federacao-footer-sidebar";
import { FederacaoHeaderSidebar } from "./federacao-header-sidebar";
import type { FederacaoType } from "@/types/federacao/federacao-type";

interface FederacaoSidebarProps extends React.ComponentProps<typeof Sidebar> {
  federation: FederacaoType;
  isPending?: boolean;
}

export default function FederacaoSidebar({
  federation,
  isPending,
  ...props
}: FederacaoSidebarProps) {
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
    <Sidebar collapsible="icon" {...props}>
      <FederacaoHeaderSidebar />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Seus Itens</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton>
                    <a
                      href={item.url}
                      className="flex justify-center items-center gap-2"
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <FederacaoFooterSidebar federation={federation} isPending={isPending} />
      </SidebarFooter>
    </Sidebar>
  );
}
