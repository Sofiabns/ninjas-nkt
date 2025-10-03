import { supabase } from "./client";
import { uploadImageToSupabase } from "./uploadImage";

// Investigador: foto
export async function uploadInvestigatorPhoto(file: File, investigatorId: string) {
  const path = `investigators/${investigatorId}_${file.name}`;
  const url = await uploadImageToSupabase(file, path);
  if (!url) throw new Error("Falha no upload");
  await supabase.from("investigators").update({ photo_url: url }).eq("id", investigatorId);
  return url;
}

// Pessoa: foto
export async function uploadPersonPhoto(file: File, personId: string) {
  const path = `people/${personId}_${file.name}`;
  const url = await uploadImageToSupabase(file, path);
  if (!url) throw new Error("Falha no upload");
  await supabase.from("people").update({ photo_url: url }).eq("id", personId);
  return url;
}

// Veículo: foto
export async function uploadVehiclePhoto(file: File, vehicleId: string) {
  const path = `vehicles/${vehicleId}_${file.name}`;
  const url = await uploadImageToSupabase(file, path);
  if (!url) throw new Error("Falha no upload");
  await supabase.from("vehicles").update({ photo_url: url }).eq("id", vehicleId);
  return url;
}

// Bases: várias imagens
export async function uploadBaseImages(files: File[], baseId: string) {
  const urls: string[] = [];
  for (const file of files) {
    const path = `bases/${baseId}_${file.name}`;
    const url = await uploadImageToSupabase(file, path);
    if (url) urls.push(url);
  }
  await supabase.from("bases").update({ images: urls }).eq("id", baseId);
  return urls;
}

// Deeps: várias imagens
export async function uploadDeepImages(files: File[], deepId: string) {
  const urls: string[] = [];
  for (const file of files) {
    const path = `deeps/${deepId}_${file.name}`;
    const url = await uploadImageToSupabase(file, path);
    if (url) urls.push(url);
  }
  await supabase.from("deeps").update({ images: urls }).eq("id", deepId);
  return urls;
}

// Casos: anexos (array JSON)
export async function uploadCaseAttachment(file: File, caseId: string) {
  const path = `cases/${caseId}_${file.name}`;
  const url = await uploadImageToSupabase(file, path);
  if (!url) throw new Error("Falha no upload");
  // Busca anexos atuais
  const { data } = await supabase.from("cases").select("attachments").eq("id", caseId).single();
  const attachments = data?.attachments || [];
  attachments.push(url);
  await supabase.from("cases").update({ attachments }).eq("id", caseId);
  return attachments;
}

// Reuniões: anexos (array JSON)
export async function uploadMeetingAttachment(file: File, meetingId: string) {
  const path = `meetings/${meetingId}_${file.name}`;
  const url = await uploadImageToSupabase(file, path);
  if (!url) throw new Error("Falha no upload");
  const { data } = await supabase.from("meetings").select("attachments").eq("id", meetingId).single();
  const attachments = data?.attachments || [];
  attachments.push(url);
  await supabase.from("meetings").update({ attachments }).eq("id", meetingId);
  return attachments;
}

// Adapte para outros campos/tabelas conforme necessário!