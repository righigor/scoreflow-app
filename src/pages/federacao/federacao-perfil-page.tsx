import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useConvertToWebp } from "@/hooks/use-convert-to-webp";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LoadingBtn } from "@/components/buttons/loading-btn";
import { Controller } from "react-hook-form";
import { useGetFederationProfile } from "@/hooks/federacao/GET/use-get-federation-profile";
import { useUpdateFederationProfile } from "@/hooks/federacao/PUT/use-update-federation-profile";
import {
  updateFederationProfileSchema,
  type UpdateFederationProfileSchemaType,
} from "@/schemas/federation/update-federation-schema";
import { PhoneInputs } from "@/components/phone-inputs";
import { SocialInputs } from "@/components/social-inputs";
import { ImageUpload } from "@/components/image-upload";
import { fetchViacep } from "@/lib/viacep";

export default function FederacaoPerfilPage() {
  const { data: profile, isLoading } = useGetFederationProfile();
  const { mutate: updateProfile, isPending: isUpdating } =
    useUpdateFederationProfile();
  const { convert, isConverting } = useConvertToWebp();
  const [file, setFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<UpdateFederationProfileSchemaType>({
    resolver: zodResolver(updateFederationProfileSchema),
    values: profile
      ? {
          name: profile.name,
          sigla: profile.sigla,
          contact_email: profile.contact_email || "",
          cnpj: profile.cnpj || "",
          foundation_date: profile.foundation_date || "",
          bio: profile.bio || "",
          street: profile.addresses?.street || "",
          number: profile.addresses?.number || "",
          complement: profile.addresses?.complement || "",
          neighborhood: profile.addresses?.neighborhood || "",
          city: profile.addresses?.city || "",
          state: profile.addresses?.state || "",
          zip_code: profile.addresses?.zip_code || "",
          president_name: profile.president_name || "",
          president_instagram: profile.president_instagram || "",
          vice_president_name: profile.vice_president_name || "",
          vice_president_instagram: profile.vice_president_instagram || "",
          phones: profile.phones,
          social_links: profile.social_links,
        }
      : undefined,
  });

  const onSubmit = async (data: UpdateFederationProfileSchemaType) => {
    try {
      let webpFile: File | undefined;
      if (file) webpFile = await convert(file);
      updateProfile({data, file: webpFile});
    } catch (error) {
      toast.error("Erro na imagem", {
        description: error instanceof Error ? error.message : "",
      });
    }
  };
  const watchedZip = watch("zip_code");

  useEffect(() => {
    const cleanCep = watchedZip?.replace(/\D/g, "");
    if (cleanCep?.length === 8) {
      fetchViacep(watchedZip).then((address) => {
        if (address) {
          setValue("street", address.logradouro);
          setValue("number", address.complemento);
          setValue("neighborhood", address.bairro);
          setValue("city", address.localidade);
          setValue("state", address.uf);
        }
      });
    }
  }, [watchedZip, setValue]);

  if (isLoading)
    return (
      <div className="p-8 text-muted-foreground">Carregando perfil...</div>
    );

  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="font-bold text-3xl">Meu Perfil</h1>
        <p className="text-muted-foreground">
          Gerencie as informações públicas da sua federação. Campos não
          obrigatórios podem ser preenchidos depois.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* SEÇÃO 1: IDENTIDADE (Obrigatório + Logo) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Identidade da Federação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center p-2">
              <ImageUpload
                currentImageUrl={profile?.image_url}
                onFileSelect={setFile}
                previewClassName="size-36 rounded-md p-4"
                label="Logo da Federação"
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
                <Label htmlFor="sigla">
                  Sigla <span className="text-destructive">*</span>
                </Label>
                <Input id="sigla" {...register("sigla")} placeholder="FMG" />
                {errors.sigla && (
                  <p className="text-xs text-destructive">
                    {errors.sigla.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* SEÇÃO 2: INFORMAÇÕES ADICIONAIS */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informações Adicionais</CardTitle>
            <CardDescription className="text-muted-foreground text-sm">
              Dados complementares que enriquecem o perfil da federação no
              portal público.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label>E-mail de Contato (Público)</Label>
                <Input
                  type="email"
                  {...register("contact_email")}
                  placeholder="contato@fmg.com.br"
                />
                {errors.contact_email && (
                  <p className="text-xs text-destructive">
                    {errors.contact_email.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>CNPJ</Label>
                <Input {...register("cnpj")} placeholder="00.000.000/0001-00" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Data de Fundação</Label>
                <Input type="date" {...register("foundation_date")} />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Bio / Descrição</Label>
              <Textarea
                {...register("bio")}
                rows={4}
                placeholder="Um breve texto sobre a federação que aparecerá no portal público..."
              />
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* SEÇÃO 3: ENDEREÇO */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Endereço da Sede</CardTitle>
            <CardDescription className="text-muted-foreground text-sm">
              Endereço que aparecerá no portal público e nos documentos gerados.
            </CardDescription>
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

        <Separator />

        {/* SEÇÃO 4: DIRETORIA */}
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
              <Input
                {...register("president_instagram")}
                placeholder="@presidente"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Nome do Vice-Presidente</Label>
              <Input {...register("vice_president_name")} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Instagram do Vice-Presidente</Label>
              <Input
                {...register("vice_president_instagram")}
                placeholder="@vice"
              />
            </div>
          </CardContent>
        </Card>

        <Separator />

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Telefones de Contato</CardTitle>
            <CardDescription className="text-muted-foreground text-sm">
              Números de telefone visíveis para atletas e comissão técnica
              entrarem em contato.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Controller
              control={control}
              name="phones"
              render={({ field }) => (
                <PhoneInputs
                  value={field.value || []}
                  onChange={field.onChange}
                />
              )}
            />
          </CardContent>
        </Card>

        <Separator />

        {/* SEÇÃO 6: REDES SOCIAIS */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Redes Sociais</CardTitle>
            <CardDescription className="text-muted-foreground text-sm">
              Links que aparecerão no rodapé do portal público, permitindo fácil
              conexão com atletas e torcedores.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Controller
              control={control}
              name="social_links"
              render={({ field }) => (
                <SocialInputs
                  value={field.value || {}}
                  onChange={field.onChange}
                />
              )}
            />
          </CardContent>
        </Card>

        {/* BOTÃO SALVAR */}
        <div className="flex justify-end">
          <LoadingBtn
            type="submit"
            isLoading={isUpdating || isConverting}
            className="w-full md:w-auto md:min-w-50 cursor-pointer"
          >
            {isConverting ? "Convertendo Logo..." : "Salvar Alterações"}
          </LoadingBtn>
        </div>
      </form>
    </div>
  );
}
