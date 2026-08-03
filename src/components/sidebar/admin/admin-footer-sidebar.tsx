import { Link } from "react-router-dom";
import {
  SidebarFooter,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { ChevronsUpDown, LogOut, Settings, UserCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { useLogout } from "@/hooks/auth/use-logout";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function AdminFooterSidebar() {
  const { isMobile } = useSidebar();
  const { mutate: logout } = useLogout();

  return (
    <SidebarFooter>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground w-full flex justify-between"
          >
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-[10px] bg-transparent text-current">
                  ADM
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">Administrador</span>
              <span className="truncate text-xs text-muted-foreground">
                SYSADMIN
              </span>
            </div>

            <ChevronsUpDown className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="w-(--radix-dropdown-menu-trigger-width) p-2 rounded-lg"
          side={isMobile ? "bottom" : "right"}
          align="end"
          sideOffset={4}
        >
          <DropdownMenuItem className="cursor-pointer">
            <Link to="/admin/perfil" className="flex items-center gap-2 w-full">
              <UserCircle className="size-4" />
              Meu Perfil
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem className="cursor-pointer">
            <Link
              to="/admin/configuracoes"
              className="flex items-center gap-2 w-full"
            >
              <Settings className="size-4" />
              Configurações
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="flex items-center justify-between cursor-default p-2"
            onSelect={(e) => e.preventDefault()}
          >
            <span className="text-sm">Tema</span>
            <ThemeToggle />
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => logout()}
            className="text-red-600 cursor-pointer"
          >
            <LogOut className="size-4" />
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarFooter>
  );
}
