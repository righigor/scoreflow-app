import { type UseFormReturn } from "react-hook-form";
import { Controller } from "react-hook-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUpload } from "@/components/image-upload";
import type { UpdateStaffSchemaType } from "@/schemas/staff/update-staff-schema";
import type { StaffRoleType } from "@/types/staff/staff-type";

interface StaffPersonalDataFormProps {
  form: UseFormReturn<UpdateStaffSchemaType>;
  currentImageUrl: string | null;
  staffRoles: StaffRoleType[];
  onImageSelect: (file: File | null) => void;
}

const GENDERS = [
  { value: "F", label: "Feminino" },
  { value: "M", label: "Masculino" },
  { value: "OTHER", label: "Outro" },
] as const;

export function StaffPersonalDataForm({
  form,
  currentImageUrl,
  staffRoles,
  onImageSelect,
}: StaffPersonalDataFormProps) {
  const {
    register,
    control,
    formState: { errors },
  } = form;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Dados Pessoais</CardTitle>
      </CardHeader>
      <CardContent className="flex gap-6">
        <div className="flex flex-col gap-4 w-1/3 items-center justify-center">
          <div className="flex justify-center p-2">
            <ImageUpload
              currentImageUrl={currentImageUrl}
              onFileSelect={onImageSelect}
              previewClassName="w-50 h-64 rounded-md"
              label="Foto do Membro"
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 w-2/3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">
              Nome Completo <span className="text-destructive">*</span>
            </Label>
            <Input id="name" {...register("name")} />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>CPF</Label>
            <Input {...register("cpf")} placeholder="000.000.000-00" />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Telefone</Label>
            <Input {...register("phone")} placeholder="(00) 00000-0000" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              control={control}
              name="gender"
              render={({ field }) => {
                const selectedGender = GENDERS.find(
                  (g) => g.value === field.value,
                );
                return (
                  <div className="flex flex-col gap-1.5">
                    <Label>
                      Gênero <span className="text-destructive">*</span>
                    </Label>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione">
                          {selectedGender?.label}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {GENDERS.map((gender) => (
                            <SelectItem key={gender.value} value={gender.value}>
                              {gender.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {errors.gender && (
                      <p className="text-xs text-destructive">
                        {errors.gender.message}
                      </p>
                    )}
                  </div>
                );
              }}
            />

            <Controller
              control={control}
              name="staff_role_id"
              render={({ field }) => {
                const selectedRole = staffRoles.find(
                  (r) => r.id === field.value,
                );
                return (
                  <div className="flex flex-col gap-1.5">
                    <Label>
                      Função <span className="text-destructive">*</span>
                    </Label>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a função">
                          {selectedRole?.name}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {staffRoles.map((role) => (
                            <SelectItem key={role.id} value={role.id}>
                              {role.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {errors.staff_role_id && (
                      <p className="text-xs text-destructive">
                        {errors.staff_role_id.message}
                      </p>
                    )}
                  </div>
                );
              }}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Instagram</Label>
            <Input {...register("instagram_url")} placeholder="@membro" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}