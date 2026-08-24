import { Link } from "react-router-dom";
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { BadgeCheck, ChevronsUpDown, LogOut, UserCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { useLogout } from "@/hooks/auth/use-logout";
import { useAuthStore } from "@/stores/auth-store";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getRoleLabel } from "@/lib/utils/get-role-label";

interface PortalFooterSidebarProps {
  profileRoute: string;
  settingsRoute?: string;
  entityImageUrl?: string | null;
}

export function PortalFooterSidebar({
  profileRoute,
  settingsRoute,
  entityImageUrl,
}: PortalFooterSidebarProps) {
  const { isMobile } = useSidebar();
  const { mutate: logout } = useLogout();
  const profile = useAuthStore((state) => state.profile);

  const name = profile?.full_name || "Carregando...";
  const role = profile?.role || "FEDERATION_ADMIN";

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger className="w-full -ml-2">
              <SidebarMenuButton
                size="lg"
                className="w-full data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground group-data-[collapsible=icon]:p-0"
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Avatar className="h-8 w-8 rounded-md">
                    {entityImageUrl ? (
                      <img
                        src={entityImageUrl}
                        alt="Avatar"
                        className="h-full w-full object-cover rounded-md"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          const nextSibling = e.currentTarget.nextElementSibling as HTMLElement | null;
                          if (nextSibling) {
                            nextSibling.style.display = "flex";
                          }
                        }}
                      />
                    ) : (
                      <AvatarFallback className="text-[10px] bg-transparent text-current">
                        {initials}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </div>

                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{name}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {getRoleLabel(role)}
                  </span>
                </div>

                <ChevronsUpDown className="size-4 group-data-[collapsible=icon]:hidden" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuItem className="cursor-pointer">
                <Link
                  to={profileRoute}
                  className="flex items-center gap-2 w-full"
                >
                  <UserCircle className="size-4" />
                  Meu Perfil
                </Link>
              </DropdownMenuItem>

              {settingsRoute && (
                <DropdownMenuItem className="cursor-pointer">
                  <Link
                    to={settingsRoute}
                    className="flex items-center gap-2 w-full"
                  >
                    <BadgeCheck className="size-4" />
                    Configurações
                  </Link>
                </DropdownMenuItem>
              )}

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
                className="text-red-600 focus:bg-red-50 focus:text-red-600 cursor-pointer"
              >
                <LogOut className="size-4" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
}
