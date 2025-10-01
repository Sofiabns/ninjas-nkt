import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  deleteDoc,
  getDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "./firebase";

export interface Person {
  id: string;
  fullName: string;
  gang: string;
  hierarchy: "Líder" | "Sub-Líder" | "Membro";
  phone: string;
  photoUrl?: string;
  vehicleIds?: string[];
}

const peopleCollection = collection(db, "people");

export function subscribePeople(callback: (people: Person[]) => void) {
  const q = query(peopleCollection, orderBy("fullName"));
  return onSnapshot(q, (snapshot) => {
    const people = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Person));
    callback(people);
  });
}

export async function getPerson(id: string): Promise<Person | null> {
  const docRef = doc(peopleCollection, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Person;
  }
  return null;
}

export async function addOrUpdatePerson(person: Person) {
  const docRef = doc(peopleCollection, person.id);
  await setDoc(docRef, person);
}

export async function deletePerson(id: string) {
  await deleteDoc(doc(peopleCollection, id));
}

export async function uploadPersonPhoto(file: File, personId: string): Promise<string> {
  const storageRef = ref(storage, `people/${personId}/${file.name}`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
}
