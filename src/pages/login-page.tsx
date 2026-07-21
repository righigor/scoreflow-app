import { Logo } from "@/assets/logo";
import LoginForm from "@/components/login/login-form";


export default function LoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center md:justify-start">
          <Logo />
        </div>
        
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <LoginForm />
          </div>
        </div>

        <div className="text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Todos os direitos reservados.
        </div>
      </div>

      <div className="relative hidden bg-slate-100 lg:block">
        <img
          src="/capa-login.png" 
          alt="Ginástica Rítmica"
          className="absolute inset-0 h-full w-full object-cover grayscale-20 brightness-[0.9]"
        />
        <div className="absolute inset-0 bg-linear-to-t from-blue-600/40 to-transparent mix-blend-multiply" />
        
        <div className="absolute bottom-10 left-10 right-10 text-white z-10">
          <blockquote className="space-y-2">
            <p className="text-lg font-medium italic">
              "A precisão da técnica encontra a harmonia do movimento."
            </p>
            <footer className="text-sm font-semibold uppercase tracking-wider">
              Scoreflow • Gestão de Arbitragem GR
            </footer>
          </blockquote>
        </div>
      </div>
    </div>
  );
}