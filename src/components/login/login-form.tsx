import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { LoadingBtn } from "../buttons/loading-btn";
import { loginSchema, type LoginValues } from "@/zod/login/login-schema";
import { useLogin } from "@/hooks/auth/use-login";


export default function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"form">) {
  const { mutate, isPending, error } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginValues) => mutate(data);

  return (
    <form 
      onSubmit={handleSubmit(onSubmit)} 
      className={`flex flex-col gap-6 ${className || ""}`} 
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">
          Acesse sua conta
        </h1>
        <p className="text-sm text-slate-500">
          Painel de controle para federações e árbitros
        </p>
      </div>

      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">E-mail institucional</Label>
          <Input
            id="email"
            type="email"
            placeholder="nome@email.com.br"
            {...register("email")}
            className={errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
          />
          {errors.email && (
            <p className="text-xs font-medium text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Senha</Label>
            <button type="button" className="text-xs text-blue-600 hover:underline font-medium">
              Esqueceu a senha?
            </button>
          </div>
          <Input 
            id="password" 
            type="password" 
            {...register("password")}
            className={errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}
          />
          {errors.password && (
            <p className="text-xs font-medium text-red-500">{errors.password.message}</p>
          )}
        </div>

        {error instanceof Error && (
          <div className="p-3 rounded-lg border border-red-100">
            <p className="text-sm text-red-600 text-center font-medium">
              {error.message}
            </p>
          </div>
        )}

        <LoadingBtn 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11 transition-all cursor-pointer" 
          isLoading={isPending}
        >
          Entrar
        </LoadingBtn>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-slate-500 rounded-2xl">Suporte Técnico</span>
        </div>
      </div>

      <p className="text-center text-sm text-slate-600">
        Dificuldades no acesso?{" "}
        <a href="#" className="font-semibold text-blue-600 hover:underline">
          Falar com o Suporte
        </a>
      </p>
    </form>
  );
}