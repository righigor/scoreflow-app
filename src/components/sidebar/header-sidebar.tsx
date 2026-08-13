import { SidebarHeader } from "@/components/ui/sidebar";
import { ShieldCheck } from "lucide-react";

interface HeaderSidebarProps {
  subtitle?: string;
}

export function HeaderSidebar({ subtitle = "ScoreFlow Admin" }: HeaderSidebarProps) {
  return (
    <SidebarHeader className="py-4 px-2">
      <div className="group flex items-center flex-col gap-2 justify-center">
        <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
          <ShieldCheck size={18} />
        </div>
        <span className="font-bold text-sm group-data-[collapsible=icon]:hidden">
          {subtitle}
        </span>
      </div>
    </SidebarHeader>
  );
}
