import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LoadingBtn } from "@/components/buttons/loading-btn";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { KeyRound } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { useUpdateProfileName } from "@/hooks/admin/PUT/use-update-profile-name";
import { useUpdatePassword } from "@/hooks/admin/PUT/use-update-password";
import { supabase } from "@/lib/supabase/client";

const profileSchema = z.object({
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
});

type ProfileSchemaType = z.infer<typeof profileSchema>;

const passwordSchema = z
  .object({
    newPassword: z
      .string()
      .min(6, "A nova senha deve ter no mínimo 6 caracteres"),
    confirm: z.string(),
  })
  .refine((data) => data.newPassword === data.confirm, {
    message: "As senhas não coincidem",
    path: ["confirm"],
  });

type PasswordSchemaType = z.infer<typeof passwordSchema>;

export default function AdminPerfilPage() {
  const [userEmail, setUserEmail] = useState<string>("");
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);

  const profile = useAuthStore((state) => state.profile);
  const { mutate: updateName, isPending: isPendingName } =
    useUpdateProfileName();
  const { mutate: updatePassword, isPending: isPendingPassword } =
    useUpdatePassword();

  const {
    register: registerName,
    handleSubmit: handleSubmitName,
    formState: { errors: errorsName },
  } = useForm<ProfileSchemaType>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: profile?.full_name ?? "" },
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPassword,
    formState: { errors: errorsPassword },
  } = useForm<PasswordSchemaType>({
    resolver: zodResolver(passwordSchema),
  });

  // Busca o e-mail real do Supabase Auth
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? "Não encontrado");
    });
  }, []);

  const onSubmitName = (data: ProfileSchemaType) => {
    updateName(data.name);
  };

  const onSubmitPassword = (data: PasswordSchemaType) => {
    updatePassword(data.newPassword, {
      onSuccess: () => {
        resetPassword();
        setIsPasswordDialogOpen(false);
      },
    });
  };

  return (
    <div className="space-y-6 p-8 ">
      <div>
        <h1 className="font-bold text-3xl">Meu Perfil</h1>
        <p className="text-muted-foreground">
          Gerencie as informações da sua conta de administrador.
        </p>
      </div>

      <Separator />

      {/* Card de Informações Pessoais */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                  ADM
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-xl">
                  {profile?.full_name ?? "Admin"}
                </CardTitle>
                <CardDescription>{userEmail}</CardDescription>
              </div>
            </div>
            <Badge variant="secondary" className="text-sm">
              SYSADMIN
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitName(onSubmitName)} className="space-y-4">
            <div className="grid w-full max-w-sm gap-1.5">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                {...registerName("name")}
                placeholder="Seu nome"
              />
              {errorsName.name && (
                <p className="text-sm text-destructive">
                  {errorsName.name.message}
                </p>
              )}
            </div>
            <div className="grid w-full max-w-sm gap-1.5">
              <Label>E-mail</Label>
              <Input value={userEmail} disabled className="bg-muted" />
              <p className="text-xs text-muted-foreground">
                O e-mail não pode ser alterado por aqui.
              </p>
            </div>
            <LoadingBtn
              type="submit"
              isLoading={isPendingName}
              className="w-fit cursor-pointer"
            >
              Salvar Nome
            </LoadingBtn>
          </form>
        </CardContent>
      </Card>

      {/* Card de Segurança */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Segurança</CardTitle>
          <CardDescription>
            Altere sua senha de acesso ao painel.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog
            open={isPasswordDialogOpen}
            onOpenChange={setIsPasswordDialogOpen}
          >
            <DialogTrigger>
              <Button variant="outline" className="cursor-pointer">
                <KeyRound className="mr-2 h-4 w-4" />
                Alterar Senha
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-106.25">
              <DialogHeader>
                <DialogTitle>Alterar Senha</DialogTitle>
                <DialogDescription>
                  Insira a sua nova senha abaixo. Mínimo de 6 caracteres.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmitPassword(onSubmitPassword)}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-1.5">
                    <Label htmlFor="newPassword">Nova Senha</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      {...registerPassword("newPassword")}
                    />
                    {errorsPassword.newPassword && (
                      <p className="text-sm text-destructive">
                        {errorsPassword.newPassword.message}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="confirm">Confirmar Nova Senha</Label>
                    <Input
                      id="confirm"
                      type="password"
                      {...registerPassword("confirm")}
                    />
                    {errorsPassword.confirm && (
                      <p className="text-sm text-destructive">
                        {errorsPassword.confirm.message}
                      </p>
                    )}
                  </div>
                </div>
                <DialogFooter>
                  <LoadingBtn
                    type="submit"
                    isLoading={isPendingPassword}
                    className="w-full cursor-pointer"
                  >
                    Atualizar Senha
                  </LoadingBtn>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}
