import { Logo } from "@/assets/logo";
import { SidebarHeader, SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";

export function FederacaoHeaderSidebar() {
  return (
    <SidebarHeader className="py-4">
      <SidebarMenu>
        <SidebarMenuItem>
          <div className="flex w-full items-center justify-center overflow-hidden">
            <Logo />
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
}