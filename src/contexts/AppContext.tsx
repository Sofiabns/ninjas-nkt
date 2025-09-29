import React, { createContext, useContext, useState, useEffect } from "react";
import { AppData, Person, Vehicle, Gang, Case, Investigation, Charge, Base, Investigator, ActivityLog } from "@/types";
import { loadData, saveData } from "@/utils/storage";
import { generateId } from "@/utils/idGenerator";

interface AppContextType {
  data: AppData;
  currentInvestigator: Investigator | null;
  setCurrentInvestigator: (investigator: Investigator) => void;
  logout: () => void;
  
  // People
  addPerson: (person: Omit<Person, "id" | "createdAt">) => void;
  updatePerson: (id: string, person: Partial<Person>) => void;
  deletePerson: (id: string) => void;
  getPerson: (id: string) => Person | undefined;
  
  // Vehicles
  addVehicle: (vehicle: Omit<Vehicle, "id" | "createdAt">) => void;
  updateVehicle: (id: string, vehicle: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;
  getVehicle: (id: string) => Vehicle | undefined;
  
  // Gangs
  addGang: (gang: Omit<Gang, "id" | "createdAt">) => void;
  updateGang: (id: string, gang: Partial<Gang>) => void;
  deleteGang: (id: string) => void;
  getGang: (id: string) => Gang | undefined;
  
  // Cases
  addCase: (caseData: Omit<Case, "id" | "createdAt" | "status">) => void;
  updateCase: (id: string, caseData: Partial<Case>) => void;
  closeCase: (id: string, reason: string) => void;
  deleteCase: (id: string) => void;
  getCase: (id: string) => Case | undefined;
  
  // Investigations
  addInvestigation: (investigation: Omit<Investigation, "id" | "createdAt">) => void;
  updateInvestigation: (id: string, investigation: Partial<Investigation>) => void;
  deleteInvestigation: (id: string) => void;
  getInvestigation: (id: string) => Investigation | undefined;
  
  // Charges
  addCharge: (charge: Omit<Charge, "id" | "createdAt">) => void;
  updateCharge: (id: string, charge: Partial<Charge>) => void;
  deleteCharge: (id: string) => void;
  
  // Bases
  addBase: (base: Omit<Base, "id" | "createdAt">) => void;
  updateBase: (id: string, base: Partial<Base>) => void;
  deleteBase: (id: string) => void;
  
  // Investigators
  updateInvestigators: (investigators: Investigator[]) => void;
  
  // Export/Import
  exportData: () => string;
  importData: (jsonString: string) => boolean;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<AppData>(loadData());
  const [currentInvestigator, setCurrentInvestigatorState] = useState<Investigator | null>(null);

  useEffect(() => {
    saveData(data);
  }, [data]);

  const setCurrentInvestigator = (investigator: Investigator) => {
    setCurrentInvestigatorState(investigator);
    setData((prev) => ({ ...prev, currentInvestigator: investigator.id }));
  };

  const logout = () => {
    setCurrentInvestigatorState(null);
    setData((prev) => ({ ...prev, currentInvestigator: undefined }));
  };

  // Activity Log helper
  const addActivityLog = (action: string, entityType: string, entityId: string) => {
    if (!currentInvestigator) return;
    
    const log: ActivityLog = {
      id: generateId("LOG", data.activityLogs.map((l) => l.id)),
      investigatorId: currentInvestigator.id,
      investigatorName: currentInvestigator.name,
      action,
      entityType,
      entityId,
      timestamp: new Date().toISOString(),
    };
    
    setData((prev) => ({ 
      ...prev, 
      activityLogs: [log, ...prev.activityLogs].slice(0, 100) // Keep only last 100 logs
    }));
  };

  // People methods
  const addPerson = (person: Omit<Person, "id" | "createdAt">) => {
    const id = generateId("P", data.people.map((p) => p.id));
    const newPerson: Person = { ...person, id, createdAt: new Date().toISOString() };
    setData((prev) => ({ ...prev, people: [...prev.people, newPerson] }));
    addActivityLog("Adicionou pessoa", "Person", id);
  };

  const updatePerson = (id: string, person: Partial<Person>) => {
    setData((prev) => ({
      ...prev,
      people: prev.people.map((p) => (p.id === id ? { ...p, ...person } : p)),
    }));
    addActivityLog("Atualizou pessoa", "Person", id);
  };

  const deletePerson = (id: string) => {
    setData((prev) => ({ ...prev, people: prev.people.filter((p) => p.id !== id) }));
    addActivityLog("Deletou pessoa", "Person", id);
  };

  const getPerson = (id: string) => data.people.find((p) => p.id === id);

  // Vehicles methods
  const addVehicle = (vehicle: Omit<Vehicle, "id" | "createdAt">) => {
    const id = generateId("V", data.vehicles.map((v) => v.id));
    const newVehicle: Vehicle = { ...vehicle, id, createdAt: new Date().toISOString() };
    setData((prev) => ({ ...prev, vehicles: [...prev.vehicles, newVehicle] }));
  };

  const updateVehicle = (id: string, vehicle: Partial<Vehicle>) => {
    setData((prev) => ({
      ...prev,
      vehicles: prev.vehicles.map((v) => (v.id === id ? { ...v, ...vehicle } : v)),
    }));
  };

  const deleteVehicle = (id: string) => {
    setData((prev) => ({ ...prev, vehicles: prev.vehicles.filter((v) => v.id !== id) }));
  };

  const getVehicle = (id: string) => data.vehicles.find((v) => v.id === id);

  // Gangs methods
  const addGang = (gang: Omit<Gang, "id" | "createdAt">) => {
    const id = generateId("G", data.gangs.map((g) => g.id));
    const newGang: Gang = { ...gang, id, createdAt: new Date().toISOString() };
    setData((prev) => ({ ...prev, gangs: [...prev.gangs, newGang] }));
  };

  const updateGang = (id: string, gang: Partial<Gang>) => {
    setData((prev) => ({
      ...prev,
      gangs: prev.gangs.map((g) => (g.id === id ? { ...g, ...gang } : g)),
    }));
  };

  const deleteGang = (id: string) => {
    setData((prev) => ({ ...prev, gangs: prev.gangs.filter((g) => g.id !== id) }));
  };

  const getGang = (id: string) => data.gangs.find((g) => g.id === id);

  // Cases methods
  const addCase = (caseData: Omit<Case, "id" | "createdAt" | "status">) => {
    const id = generateId("C", data.cases.map((c) => c.id));
    const newCase: Case = { ...caseData, id, status: "open", createdAt: new Date().toISOString() };
    setData((prev) => ({ ...prev, cases: [...prev.cases, newCase] }));
    addActivityLog("Criou caso", "Case", id);
  };

  const updateCase = (id: string, caseData: Partial<Case>) => {
    setData((prev) => ({
      ...prev,
      cases: prev.cases.map((c) => (c.id === id ? { ...c, ...caseData } : c)),
    }));
    addActivityLog("Atualizou caso", "Case", id);
  };

  const closeCase = (id: string, reason: string) => {
    setData((prev) => ({
      ...prev,
      cases: prev.cases.map((c) =>
        c.id === id ? { ...c, status: "closed" as const, closedReason: reason, closedAt: new Date().toISOString() } : c
      ),
    }));
    addActivityLog("Fechou caso", "Case", id);
  };

  const deleteCase = (id: string) => {
    setData((prev) => ({ ...prev, cases: prev.cases.filter((c) => c.id !== id) }));
  };

  const getCase = (id: string) => data.cases.find((c) => c.id === id);

  // Investigations methods
  const addInvestigation = (investigation: Omit<Investigation, "id" | "createdAt">) => {
    const id = generateId("I", data.investigations.map((i) => i.id));
    const newInvestigation: Investigation = { ...investigation, id, createdAt: new Date().toISOString() };
    setData((prev) => ({ ...prev, investigations: [...prev.investigations, newInvestigation] }));
  };

  const updateInvestigation = (id: string, investigation: Partial<Investigation>) => {
    setData((prev) => ({
      ...prev,
      investigations: prev.investigations.map((i) => (i.id === id ? { ...i, ...investigation } : i)),
    }));
  };

  const deleteInvestigation = (id: string) => {
    setData((prev) => ({ ...prev, investigations: prev.investigations.filter((i) => i.id !== id) }));
  };

  const getInvestigation = (id: string) => data.investigations.find((i) => i.id === id);

  // Charges methods
  const addCharge = (charge: Omit<Charge, "id" | "createdAt">) => {
    const id = generateId("CH", data.charges.map((c) => c.id));
    const newCharge: Charge = { ...charge, id, createdAt: new Date().toISOString() };
    setData((prev) => ({ ...prev, charges: [...prev.charges, newCharge] }));
  };

  const updateCharge = (id: string, charge: Partial<Charge>) => {
    setData((prev) => ({
      ...prev,
      charges: prev.charges.map((c) => (c.id === id ? { ...c, ...charge } : c)),
    }));
  };

  const deleteCharge = (id: string) => {
    setData((prev) => ({ ...prev, charges: prev.charges.filter((c) => c.id !== id) }));
  };

  // Bases methods
  const addBase = (base: Omit<Base, "id" | "createdAt">) => {
    const id = generateId("B", data.bases.map((b) => b.id));
    const newBase: Base = { ...base, id, createdAt: new Date().toISOString() };
    setData((prev) => ({ ...prev, bases: [...prev.bases, newBase] }));
  };

  const updateBase = (id: string, base: Partial<Base>) => {
    setData((prev) => ({
      ...prev,
      bases: prev.bases.map((b) => (b.id === id ? { ...b, ...base } : b)),
    }));
  };

  const deleteBase = (id: string) => {
    setData((prev) => ({ ...prev, bases: prev.bases.filter((b) => b.id !== id) }));
  };

  // Investigators methods
  const updateInvestigators = (investigators: Investigator[]) => {
    setData((prev) => ({ ...prev, investigators }));
  };

  // Export/Import methods
  const exportDataMethod = (): string => {
    return JSON.stringify(data, null, 2);
  };

  const importDataMethod = (jsonString: string): boolean => {
    try {
      const imported = JSON.parse(jsonString);
      setData(imported);
      return true;
    } catch {
      return false;
    }
  };

  const value: AppContextType = {
    data,
    currentInvestigator,
    setCurrentInvestigator,
    logout,
    addPerson,
    updatePerson,
    deletePerson,
    getPerson,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    getVehicle,
    addGang,
    updateGang,
    deleteGang,
    getGang,
    addCase,
    updateCase,
    closeCase,
    deleteCase,
    getCase,
    addInvestigation,
    updateInvestigation,
    deleteInvestigation,
    getInvestigation,
    addCharge,
    updateCharge,
    deleteCharge,
    addBase,
    updateBase,
    deleteBase,
    updateInvestigators,
    exportData: exportDataMethod,
    importData: importDataMethod,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};
