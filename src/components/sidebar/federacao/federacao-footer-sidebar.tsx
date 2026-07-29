import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  BadgeCheck,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  UserCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { useLogout } from "@/hooks/auth/use-logout";
import type { FederacaoType } from "@/types/federacao/federacao-type";

interface NavUserProps {
  federation: FederacaoType;
  isPending?: boolean;
}

export function FederacaoFooterSidebar({
  federation,
  isPending,
}: NavUserProps) {
  const { isMobile } = useSidebar();
  const { mutate: logout } = useLogout();

  if (!federation || isPending) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={federation.imageUrl!} alt={federation.name} />
                <AvatarFallback className="rounded-lg">
                  {federation.sigla}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{federation.name}</span>
                <span className="truncate text-xs">{federation.sigla}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <div className="p-2 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={federation.imageUrl!}
                    alt={federation.name}
                  />
                  <AvatarFallback className="rounded-lg">
                    {federation.sigla}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {federation.name}
                  </span>
                  <span className="truncate text-xs">{federation.sigla}</span>
                </div>
              </div>
            </div>

            <DropdownMenuSeparator />

            <DropdownMenuItem className="cursor-pointer">
              <Link to="/federacao/perfil" className="flex items-center gap-2">
                <UserCircle />
                Meu Perfil
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem className="cursor-pointer">
              <BadgeCheck />
              Configurações
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <CreditCard />
              Pagamentos
            </DropdownMenuItem>

            <DropdownMenuItem 
              className="flex items-center justify-between cursor-default"
              onSelect={(e) => e.preventDefault()}
            >
              <ThemeToggle />
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => logout()}
              className="text-red-600 focus:bg-red-50 cursor-pointer"
            >
              <LogOut />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
