import { supabase } from "../supabase/client";

export async function uploadFile(file: File, path: string, contentType: string): Promise<string> {
  const { error } = await supabase.storage
    .from("documents")
    .upload(path, file, { 
      contentType, 
      upsert: true 
    });
    
  if (error) throw new Error(error.message);

  return path; 
}