export interface ViaCepAddress {
  logradouro: string;
  complemento: string;
  unidade: string;
  bairro: string;
  localidade: string;
  uf: string;
  estado: string;
  regiao: string;
  erro: boolean;
}

export async function fetchViacep(cep: string): Promise<ViaCepAddress | null> {
  // Limpa a string para ficar apenas números
  const cleanCep = cep.replace(/\D/g, "");

  // Se não tiver 8 dígitos, nem busca
  if (cleanCep.length !== 8) return null;

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
    if (!response.ok) return null;
    
    const data = await response.json();
    
    // Se a API retornar erro (CEP inválido)
    if (data.erro) return null;

    return {
      logradouro: data.logradouro || "",
      complemento: data.complemento || "",
      unidade: data.unidade || "",
      bairro: data.bairro || "",
      localidade: data.localidade || "",
      uf: data.uf || "",
      estado: data.estado || "",
      regiao: data.regiao || "",
      erro: false,
    };
  } catch (error) {
    console.error("Erro ao buscar CEP:", error);
    return null;
  }
}