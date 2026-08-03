import { SidebarHeader } from "@/components/ui/sidebar";
import { ShieldCheck } from "lucide-react";

export function AdminHeaderSidebar() {
  return (
    <SidebarHeader className="py-4 px-2">
      <div className="group flex items-center flex-col gap-2 justify-center">
        <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
          <ShieldCheck size={18} />
        </div>
        <span className="font-bold text-sm group-data-[collapsible=icon]:hidden">
          ScoreFlow Admin
        </span>
      </div>
    </SidebarHeader>
  );
}
