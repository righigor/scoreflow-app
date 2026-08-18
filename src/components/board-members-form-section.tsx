import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type BoardMembersFormFields = {
  president_name: string;
  president_instagram: string;
  vice_president_name: string;
  vice_president_instagram: string;
};

type RegisterReturn = {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
  ref: (instance: HTMLInputElement | null) => void;
  name: string;
};

interface BoardMembersFormSectionProps<T extends BoardMembersFormFields> {
  register: (name: keyof T) => RegisterReturn;
}

export function BoardMembersFormSection<T extends BoardMembersFormFields>({
  register,
}: BoardMembersFormSectionProps<T>) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Diretoria</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label>Nome do Presidente</Label>
          <Input {...register("president_name")} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Instagram do Presidente</Label>
          <Input {...register("president_instagram")} placeholder="@presidente" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Nome do Vice-Presidente</Label>
          <Input {...register("vice_president_name")} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Instagram do Vice-Presidente</Label>
          <Input {...register("vice_president_instagram")} placeholder="@vice" />
        </div>
      </CardContent>
    </Card>
  );
}