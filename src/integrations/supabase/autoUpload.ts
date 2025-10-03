import { supabase } from "./client";
import { uploadImageToSupabase } from "./uploadImage";
import fs from "fs";
import path from "path";

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

// Exemplo: migrar fotos de pessoas
async function migrarFotosPessoas() {
  // 1. Busque todas as pessoas
  const { data: pessoas } = await supabase.from("people").select("id, photo_url");
  for (const pessoa of pessoas) {
    // 2. Pegue o arquivo local (ajuste o caminho conforme necessário)
    const filePath = `./fotos_antigas/${pessoa.id}.jpg`;
    if (!fs.existsSync(filePath)) continue;
    const file = fs.readFileSync(filePath);
    // 3. Faça upload para o bucket
    const url = await uploadImageToSupabase(new File([file], `${pessoa.id}.jpg`), `people/${pessoa.id}.jpg`);
    // 4. Atualize o registro no banco
    await supabase.from("people").update({ photo_url: url }).eq("id", pessoa.id);
  }
}

// MIGRAÇÃO DE ANEXOS DE INVESTIGAÇÕES
// Ajuste este diretório para onde estão os arquivos antigos das investigações
const DIR_ANTIGOS = "./attachments_investigacoes";

export async function migrarAttachmentsInvestigacoes() {
  // 1. Buscar todas as investigações
  const { data: investigacoes, error } = await supabase
    .from("investigations")
    .select("id, attachments");

  if (error) {
    console.error("Erro ao buscar investigações:", error.message);
    return;
  }

  for (const investigacao of investigacoes) {
    const attachmentsNovos: string[] = [];

    // Supondo que os arquivos antigos estão em uma pasta com nome igual ao id da investigação
    const pastaInvestigacao = path.join(DIR_ANTIGOS, investigacao.id);
    if (!fs.existsSync(pastaInvestigacao)) continue;

    const arquivos = fs.readdirSync(pastaInvestigacao);
    for (const nomeArquivo of arquivos) {
      const filePath = path.join(pastaInvestigacao, nomeArquivo);
      const fileBuffer = fs.readFileSync(filePath);
      const file = new File([fileBuffer], nomeArquivo);

      // Upload para o bucket
      const url = await uploadImageToSupabase(file, `investigations/${investigacao.id}_${nomeArquivo}`);
      if (url) attachmentsNovos.push(url);
    }

    // Atualiza o campo attachments (mantendo os antigos, se quiser)
    const todosAttachments = [
      ...(investigacao.attachments || []),
      ...attachmentsNovos,
    ];

    await supabase
      .from("investigations")
      .update({ attachments: todosAttachments })
      .eq("id", investigacao.id);

    console.log(`Investigação ${investigacao.id} migrada com ${attachmentsNovos.length} arquivos.`);
  }
}

// Adapte para outros campos/tabelas conforme necessário!