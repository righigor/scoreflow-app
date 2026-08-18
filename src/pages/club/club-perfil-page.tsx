import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
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
import { PhoneInputs } from "@/components/phone-inputs";
import { SocialInputs } from "@/components/social-inputs";
import { ImageUpload } from "@/components/image-upload";
import { useGetMyClub } from "@/hooks/club/GET/use-get-my-club";
import { useUpdateClubProfile } from "@/hooks/club/PUT/use-update-club-profile";
import {
  updateClubProfileSchema,
  type UpdateClubProfileSchemaType,
} from "@/schemas/club/update-club-profile-schema";
import { AddressFormSection } from "@/components/address-form-section";
import { BoardMembersFormSection } from "@/components/board-members-form-section";

export default function ClubPerfilPage() {
  const { data: club, isLoading } = useGetMyClub();

  console.log(club);
  const { mutate: updateProfile, isPending: isUpdating } =
    useUpdateClubProfile();
  const { convert, isConverting } = useConvertToWebp();
  const [file, setFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<UpdateClubProfileSchemaType>({
    resolver: zodResolver(updateClubProfileSchema),
    values: club
      ? {
          name: club.name,
          short_name: club.short_name,
          sigla: club.sigla,
          email: club.email,
          contact_email: club.contact_email || "",
          cnpj: club.cnpj || "",
          foundation_date: club.foundation_date || "",
          bio: club.bio || "",
          instagram_url: club.instagram_url || "",
          primary_color: club.primary_color || "#000000",
          secondary_color: club.secondary_color || "#FFFFFF",
          street: club.addresses?.street || "",
          number: club.addresses?.number || "",
          complement: club.addresses?.complement || "",
          neighborhood: club.addresses?.neighborhood || "",
          city: club.addresses?.city || "",
          state: club.addresses?.state || "",
          zip_code: club.addresses?.zip_code || "",
          president_name: club.president_name || "",
          president_instagram: club.president_instagram || "",
          vice_president_name: club.vice_president_name || "",
          vice_president_instagram: club.vice_president_instagram || "",
          phones: club.phones || [],
          social_links: club.social_links || {},
        }
      : undefined,
  });

  const onSubmit = async (data: UpdateClubProfileSchemaType) => {
    try {
      let webpFile: File | undefined;
      if (file) webpFile = await convert(file);
      updateProfile({ data, file: webpFile });
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
          Gerencie as informações públicas do seu clube. Campos não obrigatórios
          podem ser preenchidos depois.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* SEÇÃO 1: IDENTIDADE */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Identidade do Clube</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center p-2">
              <ImageUpload
                currentImageUrl={club?.image_url}
                onFileSelect={setFile}
                previewClassName="size-36 rounded-md p-4" // Padronizado quadrado como Federação
                label="Escudo / Logo do Clube"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <Label htmlFor="short_name">
                  Nome Curto <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="short_name"
                  {...register("short_name")}
                  placeholder="Ex: Ginástica ABC"
                />
                {errors.short_name && (
                  <p className="text-xs text-destructive">
                    {errors.short_name.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="sigla">
                  Sigla <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="sigla"
                  {...register("sigla")}
                  placeholder="Ex: GABC"
                  maxLength={5}
                />
                {errors.sigla && (
                  <p className="text-xs text-destructive">
                    {errors.sigla.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email">
                  E-mail de Acesso <span className="text-destructive">*</span>
                </Label>
                <Input id="email" type="email" {...register("email")} />
                {errors.email && (
                  <p className="text-xs text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>E-mail de Contato (Público)</Label>
                <Input
                  {...register("contact_email")}
                  placeholder="contato@clube.com.br"
                />
                {errors.contact_email && (
                  <p className="text-xs text-destructive">
                    {errors.contact_email.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              {/* Campo extra: Instagram rápido + Cores */}
              <div className="flex flex-col gap-1.5">
                <Label>Instagram Principal</Label>
                <Input {...register("instagram_url")} placeholder="@seuclube" />
              </div>

              {/* COR PRIMÁRIA COM CONTROLLER */}
              <div className="flex flex-col gap-1.5">
                <Label>Cor Primária (Escudo)</Label>
                <Controller
                  control={control}
                  name="primary_color"
                  render={({ field }) => (
                    <div className="flex items-center gap-2">
                      <Input
                        type="color"
                        value={field.value || "#000000"}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="h-10 w-14 p-1 cursor-pointer"
                      />
                      <Input
                        value={field.value || "#000000"}
                        onChange={(e) => field.onChange(e.target.value)}
                        placeholder="#000000"
                        className="flex-1"
                      />
                    </div>
                  )}
                />
              </div>

              {/* COR SECUNDÁRIA COM CONTROLLER */}
              <div className="flex flex-col gap-1.5">
                <Label>Cor Secundária (Escudo)</Label>
                <Controller
                  control={control}
                  name="secondary_color"
                  render={({ field }) => (
                    <div className="flex items-center gap-2">
                      <Input
                        type="color"
                        value={field.value || "#FFFFFF"}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="h-10 w-14 p-1 cursor-pointer"
                      />
                      <Input
                        value={field.value || "#FFFFFF"}
                        onChange={(e) => field.onChange(e.target.value)}
                        placeholder="#FFFFFF"
                        className="flex-1"
                      />
                    </div>
                  )}
                />
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
              Dados complementares que enriquecem o perfil.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                placeholder="Um breve texto sobre o clube..."
              />
            </div>
          </CardContent>
        </Card>

        <Separator />

        <AddressFormSection<UpdateClubProfileSchemaType>
          register={register}
          setValue={setValue}
          watch={watch}
          errors={errors}
          title="Endereço da Sede"
          description="Local de treinamento ou sede do clube."
        />

        <Separator />

        <BoardMembersFormSection<UpdateClubProfileSchemaType>
          register={register}
        />

        <Separator />

        {/* SEÇÃO 5: TELEFONES */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Telefones de Contato</CardTitle>
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
