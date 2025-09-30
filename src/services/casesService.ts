import { db } from "@/services/firebase";
import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
} from "firebase/firestore";

const casesCollection = collection(db, "cases");

// Buscar todos os casos
export const fetchCases = async () => {
  const querySnapshot = await getDocs(casesCollection);
  return querySnapshot.docs.map((docSnap) => {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      personIds: data.personIds || [],
      vehicleIds: data.vehicleIds || [],
      gangIds: data.gangIds || [],
      attachments: data.attachments || [],
    };
  });
};

// Alias para compatibilidade
export const getCases = fetchCases;

// Buscar caso por ID
export const getCaseById = async (id: string) => {
  try {
    const ref = doc(db, "cases", id);
    const snap = await getDoc(ref);

    if (!snap.exists()) return null;

    const data = snap.data();
    return {
      id: snap.id,
      title: data.title || "",
      description: data.description || "",
      personIds: data.personIds || [],
      vehicleIds: data.vehicleIds || [],
      gangIds: data.gangIds || [],
      attachments: data.attachments || [],
      status: data.status || "open",
      createdAt: data.createdAt || null,
      updatedAt: data.updatedAt || null,
      closedAt: data.closedAt || null,
      closedReason: data.closedReason || "",
    };
  } catch (error) {
    console.error("Erro ao buscar caso no Firebase:", error);
    throw error;
  }
};

// Criar novo caso
export const createCase = async (caseData: any) => {
  const newCase = {
    ...caseData,
    status: "open",
    createdAt: Timestamp.now(),
    personIds: caseData.personIds || [],
    vehicleIds: caseData.vehicleIds || [],
    gangIds: caseData.gangIds || [],
    attachments: caseData.attachments || [],
  };
  const docRef = await addDoc(casesCollection, newCase);
  return { id: docRef.id, ...newCase };
};

// Atualizar caso
export const updateCase = async (id: string, data: any) => {
  const ref = doc(db, "cases", id);
  await updateDoc(ref, {
    ...data,
    updatedAt: Timestamp.now(),
  });
};

// Fechar caso
export const closeCaseFB = async (id: string, reason: string) => {
  const ref = doc(db, "cases", id);
  await updateDoc(ref, {
    status: "closed",
    closedReason: reason,
    closedAt: Timestamp.now(),
  });
};

// Deletar caso
export const deleteCaseFB = async (id: string) => {
  const ref = doc(db, "cases", id);
  await deleteDoc(ref);
};

// Alias para compatibilidade
export const deleteCase = deleteCaseFB;
