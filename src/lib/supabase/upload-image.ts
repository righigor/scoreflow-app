import { supabase } from "./client";

export async function uploadImage(file: File, folderPath: string): Promise<string> {
  // Gera um nome único baseado na pasta e no timestamp
  const fileName = `${folderPath}/${Date.now()}-${file.name.replace(/\.[^/.]+$/, ".webp")}`;
  
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