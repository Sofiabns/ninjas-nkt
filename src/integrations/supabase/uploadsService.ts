import { supabase } from "./supabase";

// Função para enviar arquivo para o bucket
export async function uploadFile(file: File, options: {
  investigationId?: string;
  caseId?: string;
  personId?: string;
  meetingId?: string;
  auctionId?: string;
}) {
  const filePath = `uploads/${Date.now()}_${file.name}`;

  // 1. Enviar arquivo para o bucket
  const { error: uploadError } = await supabase.storage
    .from("uploads")
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  // 2. Pegar a URL pública
  const { data } = supabase.storage.from("uploads").getPublicUrl(filePath);
  const publicUrl = data.publicUrl;

  // 3. Registrar na tabela uploads
  const { error: dbError } = await supabase.from("uploads").insert({
    url: publicUrl,
    filename: file.name,
    mimetype: file.type,
    size: file.size,
    investigation_id: options.investigationId || null,
    case_id: options.caseId || null,
    person_id: options.personId || null,
    meeting_id: options.meetingId || null,
    auction_id: options.auctionId || null,
  });

  if (dbError) throw dbError;

  return publicUrl;
}

// Buscar uploads vinculados a uma investigação
export async function getUploadsByInvestigation(id: string) {
  const { data, error } = await supabase
    .from("uploads")
    .select("*")
    .eq("investigation_id", id);

  if (error) throw error;
  return data;
}
