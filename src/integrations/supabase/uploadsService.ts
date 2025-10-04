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

// Buscar uploads vinculados a uma entidade
export async function getUploadsByEntity(entityType: string, entityId: string) {
  const columnMap = {
    investigation: 'investigation_id',
    case: 'case_id',
    person: 'person_id',
    meeting: 'meeting_id',
    auction: 'auction_id',
  };

  const column = columnMap[entityType as keyof typeof columnMap];
  if (!column) throw new Error('Tipo de entidade inválido');

  const { data, error } = await supabase
    .from("uploads")
    .select("*")
    .eq(column, entityId);

  if (error) throw error;
  return data;
}

// Buscar uploads vinculados a uma pessoa
export async function getUploadsByPerson(id: string) {
  return getUploadsByEntity('person', id);
}

// Buscar uploads vinculados a um caso
export async function getUploadsByCase(id: string) {
  return getUploadsByEntity('case', id);
}

// Buscar uploads vinculados a uma reunião
export async function getUploadsByMeeting(id: string) {
  return getUploadsByEntity('meeting', id);
}

// Buscar uploads vinculados a um leilão
export async function getUploadsByAuction(id: string) {
  return getUploadsByEntity('auction', id);
}
