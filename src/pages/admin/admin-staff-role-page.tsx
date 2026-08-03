import SheetStaffRole from "@/components/staff-role/sheet-staff-role";
import StaffRoleList from "@/components/staff-role/staff-role-list";
import { useGetStaffRoles } from "@/hooks/staff/GET/use-get-staff-roles";
import type { StaffRoleType } from "@/types/staff/staff-type";
import { useState } from "react";


export default function AdminStaffRolesPage() {
  const [roleToEdit, setRoleToEdit] = useState<StaffRoleType | null>(null);
  const { data: roles, isPending } = useGetStaffRoles();

  return (
    <div className="space-y-4 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-2xl">Funções de Staff</h2>
          <p className="text-sm text-muted-foreground">Gerencie os cargos da comissão técnica disponíveis no sistema.</p>
        </div>
        {!roleToEdit && (
          <SheetStaffRole roleToEdit={null} clearEdit={() => setRoleToEdit(null)} />
        )}
      </div>

      <StaffRoleList 
        roles={roles ?? []} 
        isLoading={isPending} 
        onEdit={(role) => setRoleToEdit(role)} 
      />

      {roleToEdit && (
        <SheetStaffRole 
          roleToEdit={roleToEdit} 
          clearEdit={() => setRoleToEdit(null)} 
        />
      )}
    </div>
  );
}