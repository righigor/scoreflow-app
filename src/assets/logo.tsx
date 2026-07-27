/* eslint-disable no-useless-assignment */
import { useSidebar } from "@/components/ui/sidebar";
import { Activity } from "lucide-react";


export const Logo = () => {
  let isCollapsed = false;
  
  try {
    const context = useSidebar();
    isCollapsed = context.state === "collapsed";
  } catch (e) {
    console.log(e);
    isCollapsed = false; 
  }

  return (
    <div className="flex items-center gap-2 font-bold text-xl tracking-tight transition-all duration-300">
      {/* Ícone */}
      <div className="bg-blue-600 text-white p-1.5 rounded-lg shrink-0">
        <Activity size={18} />
      </div>

      {/* Texto - Só esconde se estiver explicitamente colapsado no Sidebar */}
      {!isCollapsed && (
        <span className="truncate">
          Score<span className="text-blue-600">flow</span>
        </span>
      )}
    </div>
  );
};