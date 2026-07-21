export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Acesso Negado</h1>
      <p className="text-muted-foreground mb-6">Você não tem permissão para acessar esta página.</p>
      <a href="/" className="text-primary hover:underline">
        Voltar para a página inicial
      </a>
    </div>
  );
}