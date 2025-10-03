import { supabase } from "./client";

/**
 * Faz upload de um arquivo para o bucket 'uploads' no Supabase Storage.
 * @param file O arquivo (File) a ser enviado.
 * @param path Caminho/nome do arquivo no bucket (ex: 'images/nome.jpg').
 * @returns URL pública ou null em caso de erro.
 */
export async function uploadImageToSupabase(file: File, path: string): Promise<string | null> {
  const bucketName = "uploads";
  const { data, error } = await supabase.storage.from(bucketName).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) {
    console.error("Erro ao enviar imagem:", error.message);
    return null;
  }

  // Gerar URL pública
  const publicUrl = supabase.storage.from(bucketName).getPublicUrl(path).data.publicUrl;
  return publicUrl;
}