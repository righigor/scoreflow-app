import { Controller, type UseFormReturn } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { UpdateStaffSchemaType } from "@/schemas/staff/update-staff-schema";

interface ClubModalityType {
  modality_id: string;
  name: string;
}

interface StaffModalitiesStatusFormProps {
  form: UseFormReturn<UpdateStaffSchemaType>;
  clubModalities: ClubModalityType[] | undefined;
}

const STAFF_STATUSES = [
  { value: "ACTIVE", label: "Ativo" },
  { value: "INACTIVE", label: "Inativo" },
  { value: "RETIRED", label: "Aposentado" },
  { value: "FREE_AGENT", label: "Free Agent" },
] as const;

export function StaffModalitiesStatusForm({
  form,
  clubModalities,
}: StaffModalitiesStatusFormProps) {
  const {
    control,
    formState: { errors },
  } = form;

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Modalidades <span className="text-destructive">*</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Controller
            control={control}
            name="modalities"
            render={({ field }) => (
              <div className="flex flex-col gap-3">
                {clubModalities?.map((modality) => {
                  const isChecked = field.value?.includes(
                    modality.modality_id,
                  );
                  return (
                    <label
                      key={modality.modality_id}
                      className="flex cursor-pointer items-center space-x-2"
                    >
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={(checked) => {
                          const current = field.value ?? [];
                          if (checked) {
                            field.onChange([...current, modality.modality_id]);
                            return;
                          }
                          field.onChange(
                            current.filter((id) => id !== modality.modality_id),
                          );
                        }}
                      />
                      <span className="text-sm font-medium">
                        {modality.name}
                      </span>
                    </label>
                  );
                })}
                {errors.modalities && (
                  <p className="mt-2 text-xs text-destructive">
                    {errors.modalities.message}
                  </p>
                )}
              </div>
            )}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Status</CardTitle>
          <CardDescription>
            Altere o status burocrático do membro.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Controller
            control={control}
            name="status"
            render={({ field }) => {
              const selected = STAFF_STATUSES.find(
                (s) => s.value === field.value,
              );
              return (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o status">
                      {selected?.label}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {STAFF_STATUSES.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              );
            }}
          />
          {errors.status && (
            <p className="mt-2 text-xs text-destructive">
              {errors.status.message}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}