import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";
import { fetchViacep } from "@/lib/viacep";

// 1. Nosso contrato de campos
export type AddressFormFields = {
  zip_code: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
};

// 2. Tipamos EXATAMENTE o que o register retorna (sem usar o tipo nativo do RHF)
type RegisterReturn = {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
  ref: (instance: HTMLInputElement | null) => void;
  name: string;
};

// 3. Criamos as assinaturas simples e restritas
interface AddressFormSectionProps<
  T extends AddressFormFields = AddressFormFields,
> {
  register: (name: keyof T) => RegisterReturn;
  setValue: (name: keyof T, value: string) => void;
  watch: (name: keyof T) => string;
  errors: Partial<Record<keyof T, { message?: string }>>;
  title?: string;
  description?: string;
}

export function AddressFormSection<
  T extends AddressFormFields = AddressFormFields,
>({
  register,
  setValue,
  watch,
  errors,
  title = "Endereço",
  description = "Endereço que aparecerá em documentos e no portal público.",
}: AddressFormSectionProps<T>) {

  const watchedZip = watch("zip_code");
  const watchedStreet = watch("street");

  useEffect(() => {
    const cleanCep = watchedZip?.replace(/\D/g, "");
    if (cleanCep?.length === 8 && !watchedStreet) {
      fetchViacep(watchedZip).then((address) => {
        if (address) {
          setValue("street", address.logradouro);
          if (address.complemento) setValue("number", address.complemento);
          setValue("neighborhood", address.bairro);
          setValue("city", address.localidade);
          setValue("state", address.uf);
        }
      });
    }
  }, [watchedZip, watchedStreet, setValue]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        {description && (
          <CardDescription className="text-muted-foreground text-sm">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="zip_code">
              CEP{" "}
              <span className="text-xs text-muted-foreground">
                (Preenche automaticamente)
              </span>
            </Label>
            <Input
              id="zip_code"
              {...register("zip_code")}
              placeholder="00000-000"
            />
            {errors.zip_code && (
              <p className="text-xs text-destructive">
                {errors.zip_code.message}
              </p>
            )}
          </div>
          <div className="md:col-span-3 flex flex-col gap-1.5">
            <Label htmlFor="street">Rua / Avenida</Label>
            <Input id="street" {...register("street")} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="number">Número</Label>
            <Input id="number" {...register("number")} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="complement">Complemento</Label>
            <Input id="complement" {...register("complement")} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="neighborhood">Bairro</Label>
            <Input id="neighborhood" {...register("neighborhood")} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="city">Cidade</Label>
            <Input id="city" {...register("city")} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="state">Estado (UF)</Label>
            <Input
              id="state"
              {...register("state")}
              maxLength={2}
              placeholder="MG"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
