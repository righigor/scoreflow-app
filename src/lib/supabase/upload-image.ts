import { supabase } from "./client";

// Adicionamos o parâmetro opcional 'customFileName'
export async function uploadImage(
  file: File, 
  folderPath: string, 
  customFileName?: string
): Promise<string> {
  // 1. Define o nome base: Usa o custom se foi enviado, senão usa o original (sem extensão)
  const rawName = customFileName || file.name.replace(/\.[^/.]+$/, "");

  // 2. SANITIZAÇÃO (Remove acentos e substitui espaços/caracteres especiais por traço)
  const sanitizedName = rawName
    .normalize("NFD")                   // Separa acentos (ó vira o + ´)
    .replace(/[\u0300-\u036f]/g, "")   // Remove os acentos
    .replace(/[^a-zA-Z0-9.-]/g, "-")  // Tudo que não for letra/número vira traço
    .replace(/-+/g, "-")               // Remove traços repetidos
    .replace(/^-|-$/g, "");            // Remove traços das pontas

  // 3. Gera o caminho final limpo
  const fileName = `${folderPath}/${Date.now()}-${sanitizedName}.webp`;
  
  const { error: uploadError } = await supabase.storage
    .from("images")
    .upload(fileName, file, { 
      contentType: "image/webp", 
      upsert: false 
    });

  if (uploadError) throw new Error("Falha ao fazer upload da imagem.");
  
  const { data: urlData } = supabase.storage.from("images").getPublicUrl(fileName);

  return urlData.publicUrl;
}