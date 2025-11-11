import { supabase } from "./supabase";

// Função para enviar arquivo para o bucket
export async function uploadFile(file: File, options: {
  investigationId?: string;
  caseId?: string;
  personId?: string;
  meetingId?: string;
  auctionId?: string;
  vehicleId?: string;
  deepId?: string;
  baseId?: string;
  facadeId?: string;
}) {
  // Determinar a pasta com base na entidade
  let folder = 'outros';
  if (options.investigationId) folder = 'investigations';
  else if (options.caseId) folder = 'cases';
  else if (options.personId) folder = 'people';
  else if (options.meetingId) folder = 'meetings';
  else if (options.auctionId) folder = 'auctions';
  else if (options.vehicleId) folder = 'vehicles';
  else if (options.deepId) folder = 'deeps';
  else if (options.baseId) folder = 'bases';
  else if (options.facadeId) folder = 'facades';

  const filePath = `${folder}/${Date.now()}_${file.name}`;

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
    vehicle_id: options.vehicleId || null,
    deep_id: options.deepId || null,
    base_id: options.baseId || null,
    facade_id: options.facadeId || null,
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
    vehicle: 'vehicle_id',
    deep: 'deep_id',
    base: 'base_id',
    facade: 'facade_id',
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

// Buscar uploads vinculados a um veículo
export async function getUploadsByVehicle(id: string) {
  return getUploadsByEntity('vehicle', id);
}

// Buscar uploads vinculados a um deep
export async function getUploadsByDeep(id: string) {
  return getUploadsByEntity('deep', id);
}

// Buscar uploads vinculados a uma base
export async function getUploadsByBase(id: string) {
  return getUploadsByEntity('base', id);
}

// Buscar uploads vinculados a uma fachada
export async function getUploadsByFacade(id: string) {
  return getUploadsByEntity('facade', id);
}
