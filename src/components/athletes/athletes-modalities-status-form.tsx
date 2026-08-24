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

import type { UpdateAthleteSchemaType } from "@/schemas/athlete/update-athlete-schema";

interface ClubModalityType {
  modality_id: string;
  name: string;
}

interface AthleteModalitiesStatusFormProps {
  form: UseFormReturn<UpdateAthleteSchemaType>;
  clubModalities: ClubModalityType[] | undefined;
}

const ATHLETE_STATUSES = [
  {
    value: "ACTIVE",
    label: "Ativo",
  },
  {
    value: "INJURED",
    label: "Lesionado",
  },
  {
    value: "INACTIVE",
    label: "Inativo",
  },
  {
    value: "RETIRED",
    label: "Aposentado",
  },
  {
    value: "FREE_AGENT",
    label: "Free Agent",
  },
] as const;

export function AthleteModalitiesStatusForm({
  form,
  clubModalities,
}: AthleteModalitiesStatusFormProps) {
  const {
    control,
    formState: { errors },
  } = form;

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      {/* Modalidades */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Modalidades{" "}
            <span className="text-destructive">*</span>
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
                          const currentModalities = field.value ?? [];

                          if (checked) {
                            field.onChange([
                              ...currentModalities,
                              modality.modality_id,
                            ]);

                            return;
                          }

                          field.onChange(
                            currentModalities.filter(
                              (id) => id !== modality.modality_id,
                            ),
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

      {/* Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Status do Atleta
          </CardTitle>

          <CardDescription>
            Altere o status clínico ou burocrático.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Controller
            control={control}
            name="status"
            render={({ field }) => {
              const selectedStatus = ATHLETE_STATUSES.find(
                (status) => status.value === field.value,
              );

              return (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o status">
                      {selectedStatus?.label}
                    </SelectValue>
                  </SelectTrigger>

                  <SelectContent>
                    {ATHLETE_STATUSES.map((status) => (
                      <SelectItem
                        key={status.value}
                        value={status.value}
                      >
                        {status.label}
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