// src/pages/arbitro/arbitro-perfil-page.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useConvertToWebp } from "@/hooks/use-convert-to-webp";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoadingBtn } from "@/components/buttons/loading-btn";
import {
  updateJudgeProfileSchema,
  type UpdateJudgeProfileSchemaType,
} from "@/schemas/arbitro/update-judge-profile-schema";
import { Brevet } from "@/schemas/arbitro/create-arbitro-schema";
import { ImageUpload } from "@/components/image-upload";
import { Info } from "lucide-react";
import { useGetJudgeProfile } from "@/hooks/arbitros/GET/use-get-judge-profile";
import { useUpdateJudgeProfile } from "@/hooks/arbitros/UPDATE/use-update-judge-profile";

export default function ArbitroPerfilPage() {
  const { data, isLoading } = useGetJudgeProfile();
  const { mutate: updateProfile, isPending: isUpdating } =
    useUpdateJudgeProfile();
  const { convert, isConverting } = useConvertToWebp();
  const [file, setFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    
    formState: { errors },
  } = useForm<UpdateJudgeProfileSchemaType>({
    resolver: zodResolver(updateJudgeProfileSchema),
    values: data
      ? {
          name: data.judge.name,
          email: data.judge.email,
          brevet: data.judge.brevet,
          cpf: data.profile.cpf || "",
          pis: data.profile.pis || "",
          phone: data.profile.phone || "",
          bank: data.profile.bank || "",
          bank_branch: data.profile.bank_branch || "",
          bank_account: data.profile.bank_account || "",
          pix_key: data.profile.pix_key || "",
        }
      : undefined,
  });

  const onSubmit = async (formData: UpdateJudgeProfileSchemaType) => {
    try {
      let webpFile: File | undefined;
      if (file) webpFile = await convert(file);
      updateProfile({ data: formData, file: webpFile });
    } catch (error) {
      toast.error("Erro na imagem", {
        description: error instanceof Error ? error.message : "",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 text-muted-foreground">Carregando perfil...</div>
    );
  }

  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="font-bold text-3xl">Meu Perfil</h1>
        <p className="text-muted-foreground">
          Gerencie suas informações pessoais, foto e dados financeiros.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* IDENTIDADE + FOTO */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Identidade</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <ImageUpload
                currentImageUrl={data?.judge.image_url}
                onFileSelect={setFile}
                previewClassName="h-32 w-32 rounded-full"
                label="Foto de Perfil"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="name">
                  Nome Completo <span className="text-destructive">*</span>
                </Label>
                <Input id="name" {...register("name")} />
                {errors.name && (
                  <p className="text-xs text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email">
                  E-mail <span className="text-destructive">*</span>
                </Label>
                <Input id="email" type="email" {...register("email")} />
                {errors.email && (
                  <p className="text-xs text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* BREVET (SÓ LEITURA) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Brevet</CardTitle>
            <CardDescription className="text-muted-foreground text-sm">
              Definido pela federação. Para alterar, entre em contato.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select
              value={data?.judge.brevet || ""}
              disabled
            >
              <SelectTrigger id="brevet" className="opacity-60 cursor-not-allowed">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {Brevet.map((b) => (
                  <SelectItem key={b} value={b}>
                    {b}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Separator />

        {/* DADOS FINANCEIROS */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Dados Financeiros</CardTitle>
            <CardDescription className="text-muted-foreground text-sm">
              Usados para gerar recibos de pagamento. Preencha os campos
              necessários para receber suas arbitragens.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="cpf">CPF</Label>
                <Input id="cpf" {...register("cpf")} placeholder="000.000.000-00" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="pis">PIS</Label>
                <Input id="pis" {...register("pis")} placeholder="000.00000.00-0" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  {...register("phone")}
                  placeholder="(00) 00000-0000"
                />
              </div>
            </div>

            <Separator />

            <p className="text-sm font-medium flex items-center gap-2">
              <Info className="h-4 w-4 text-muted-foreground" />
              Dados bancários
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="bank">Banco</Label>
                <Input id="bank" {...register("bank")} placeholder="Ex: Banco do Brasil" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="bank_branch">Agência</Label>
                <Input id="bank_branch" {...register("bank_branch")} placeholder="0001" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="bank_account">Conta</Label>
                <Input
                  id="bank_account"
                  {...register("bank_account")}
                  placeholder="00000-0"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="pix_key">Chave PIX</Label>
                <Input
                  id="pix_key"
                  {...register("pix_key")}
                  placeholder="CPF, telefone, e-mail ou chave aleatória"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* BOTÃO SALVAR */}
        <div className="flex justify-end">
          <LoadingBtn
            type="submit"
            isLoading={isUpdating || isConverting}
            className="w-full md:w-auto md:min-w-50 cursor-pointer"
          >
            {isConverting ? "Convertendo Foto..." : "Salvar Alterações"}
          </LoadingBtn>
        </div>
      </form>
    </div>
  );
}