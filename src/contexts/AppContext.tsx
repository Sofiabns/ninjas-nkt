import React, { createContext, useContext, useState, useEffect } from "react";
import { AppData, Person, Vehicle, Gang, Case, Investigation, Charge, Base, Investigator, ActivityLog, Meeting, Deep, Auction, Attachment } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { generateId } from "@/utils/idGenerator";
import { toast } from "sonner";

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
  
  // Meetings
  addMeeting: (meeting: Omit<Meeting, "id" | "createdAt">) => void;
  updateMeeting: (id: string, meeting: Partial<Meeting>) => void;
  deleteMeeting: (id: string) => void;
  
  // Deeps
  addDeep: (deep: Omit<Deep, "id" | "createdAt">) => void;
  updateDeep: (id: string, deep: Partial<Deep>) => void;
  deleteDeep: (id: string) => void;
  
  // Auctions
  addAuction: (auction: Omit<Auction, "id" | "createdAt">) => void;
  updateAuction: (id: string, auction: Partial<Auction>) => void;
  deleteAuction: (id: string) => void;
  
  // Investigators
  updateInvestigators: (investigators: Investigator[]) => void;
  
  // Export/Import
  exportData: () => string;
  importData: (jsonString: string) => boolean;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<AppData>({
    investigators: [
      { id: "N-00", name: "Kitsune" },
      { id: "N-01", name: "Hinata" },
      { id: "N-02", name: "Luciano" },
      { id: "N-03", name: "Miranda" },
      { id: "N-04", name: "Eloa" },
      { id: "N-05", name: "Lua" },
      { id: "N-06", name: "Hiro" },
      { id: "N-07", name: "Lara" },
    ],
    people: [],
    vehicles: [],
    gangs: [],
    cases: [],
    investigations: [],
    charges: [],
    bases: [],
    meetings: [],
    deeps: [],
    auctions: [],
    activityLogs: [],
  });
  const [currentInvestigator, setCurrentInvestigatorState] = useState<Investigator | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [charges, setCharges] = useState<Charge[]>([]);
  const [bases, setBases] = useState<Base[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [deeps, setDeeps] = useState<Deep[]>([]);
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);

  // Load all data from Supabase on mount
  useEffect(() => {
    const loadAllData = async () => {
      try {
        const [
          investigatorsRes,
          peopleRes,
          vehiclesRes,
          gangsRes,
          casesRes,
          investigationsRes,
          chargesRes,
          basesRes,
          meetingsRes,
          deepsRes,
          auctionsRes,
          logsRes
        ] = await Promise.all([
          supabase.from('investigators').select('*'),
          supabase.from('people').select('*'),
          supabase.from('vehicles').select('*'),
          supabase.from('gangs').select('*'),
          supabase.from('cases').select('*'),
          supabase.from('investigations').select('*'),
          supabase.from('charges').select('*'),
          supabase.from('bases').select('*'),
          supabase.from('meetings').select('*'),
          supabase.from('deeps').select('*'),
          supabase.from('auctions').select('*'),
          supabase.from('activity_logs').select('*').order('timestamp', { ascending: false }).limit(100)
        ]);

        // Só atualiza se conseguiu conectar (tabelas existem)
        const hasData = investigatorsRes.data || peopleRes.data || vehiclesRes.data;
        
        if (hasData) {
          setData({
            investigators: investigatorsRes.data?.map(inv => ({
              id: inv.id,
              name: inv.name,
              photoUrl: inv.photo_url
            })) || data.investigators,
            people: peopleRes.data?.map(p => ({
              id: p.id,
              fullName: p.full_name,
              gang: p.gang,
              hierarchy: p.hierarchy as "Líder" | "Sub-Líder" | "Membro",
              phone: p.phone,
              photoUrl: p.photo_url,
              vehicleIds: p.vehicle_ids || [],
              createdAt: p.created_at
            })) || [],
            vehicles: vehiclesRes.data?.map(v => ({
              id: v.id,
              plate: v.plate,
              model: v.model,
              photoUrl: v.photo_url,
              ownerId: v.owner_id,
              createdAt: v.created_at
            })) || [],
            gangs: gangsRes.data?.map(g => ({
              id: g.id,
              name: g.name,
              description: g.description,
              color: g.color,
              alliedGangIds: g.allied_gang_ids || [],
              createdAt: g.created_at
            })) || [],
            cases: casesRes.data?.map(c => ({
              id: c.id,
              title: c.title,
              description: c.description,
              personIds: c.person_ids || [],
              vehicleIds: c.vehicle_ids || [],
              gangIds: c.gang_ids || [],
              attachments: c.attachments || [],
              status: c.status as "open" | "closed",
              closedReason: c.closed_reason,
              closedAt: c.closed_at,
              createdAt: c.created_at
            })) || [],
            investigations: investigationsRes.data?.map(i => ({
              id: i.id,
              title: i.title,
              sections: i.sections || [],
              personIds: i.person_ids || [],
              attachments: i.attachments || [],
              createdAt: i.created_at
            })) || [],
            charges: chargesRes.data?.map(ch => ({
              id: ch.id,
              personIds: ch.person_ids || [],
              vehicleIds: ch.vehicle_ids || [],
              gangId: ch.gang_id,
              reason: ch.reason,
              status: ch.status as "pendente" | "resolvido",
              createdAt: ch.created_at
            })) || [],
            bases: basesRes.data?.map(b => ({
              id: b.id,
              name: b.name,
              description: b.description,
              images: b.images || [],
              metadata: b.metadata || {},
              createdAt: b.created_at
            })) || [],
            meetings: meetingsRes.data?.map(m => ({
              id: m.id,
              title: m.title,
              description: m.description,
              personIds: m.person_ids || [],
              vehicleIds: m.vehicle_ids || [],
              gangIds: m.gang_ids || [],
              attachments: m.attachments || [],
              meetingDate: m.meeting_date,
              createdAt: m.created_at
            })) || [],
            deeps: deepsRes.data?.map(d => ({
              id: d.id,
              title: d.title,
              description: d.description,
              images: d.images || [],
              createdAt: d.created_at
            })) || [],
            auctions: auctionsRes.data?.map(a => ({
              id: a.id,
              title: a.title,
              entries: a.entries || [],
              createdAt: a.created_at
            })) || [],
            activityLogs: logsRes.data?.map(log => ({
              id: log.id,
              investigatorId: log.investigator_id,
              investigatorName: log.investigator_name,
              action: log.action,
              entityType: log.entity_type,
              entityId: log.entity_id,
              timestamp: log.timestamp
            })) || []
          });
        } else {
          console.warn('Tabelas Supabase não encontradas. Execute o SQL em SUPABASE_SETUP.sql');
        }
      } catch (error) {
        console.error('Erro ao carregar dados do Supabase:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAllData();
  }, []);

  useEffect(() => {
    // Tabelas que você quer atualizar em tempo real
    const tables = [
      "people",
      "investigators",
      "vehicles",
      "gangs",
      "cases",
      "investigations",
      "charges",
      "bases",
      "meetings",
      "deeps",
      "auctions",
      "activityLogs",
    ];

    // Função para atualizar estado de cada tabela
    const setters = {
      people: setPeople,
      investigators: getInvestigation,
      vehicles: setVehicles,
      gangs: getGang,
      cases: getCase,
      investigations: getInvestigation,
      charges: setCharges,
      bases: setBases,
      meetings: setMeetings,
      deeps: setDeeps,
      auctions: setAuctions,
      activityLogs: setActivityLogs,
    };

    // Carregar dados iniciais de todas as tabelas
    tables.forEach((table) => {
      supabase.from(table).select("*").then(({ data }) => {
        if (setters[table] && data) setters[table](data);
      });
    });

    // Criar canais realtime para todas as tabelas
    const channels = tables.map((table) =>
      supabase
        .channel(`${table}-channel`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table },
          (payload) => {
            const setState = setters[table];
            if (!setState) return;

            setState((prev) => {
              if (payload.eventType === "INSERT") {
                return [...prev, payload.new];
              } else if (payload.eventType === "UPDATE") {
                return prev.map((item) =>
                  item.id === payload.new.id ? payload.new : item
                );
              } else if (payload.eventType === "DELETE") {
                return prev.filter((item) => item.id !== payload.old.id);
              }
              return prev;
            });
          }
        )
        .subscribe()
    );

    return () => {
      channels.forEach((channel) => supabase.removeChannel(channel));
    };
  }, []);

  const setCurrentInvestigator = (investigator: Investigator) => {
    setCurrentInvestigatorState(investigator);
    setData((prev) => ({ ...prev, currentInvestigator: investigator.id }));
  };

  const logout = () => {
    setCurrentInvestigatorState(null);
    setData((prev) => ({ ...prev, currentInvestigator: undefined }));
  };

  // Activity Log helper
  const addActivityLog = async (action: string, entityType: string, entityId: string) => {
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
    
    await supabase.from('activity_logs').insert({
      id: log.id,
      investigator_id: log.investigatorId,
      investigator_name: log.investigatorName,
      action: log.action,
      entity_type: log.entityType,
      entity_id: log.entityId,
      timestamp: log.timestamp
    });
    
    setData((prev) => ({ 
      ...prev, 
      activityLogs: [log, ...prev.activityLogs].slice(0, 100)
    }));
  };

  // People methods
  const addPerson = async (person: Omit<Person, "id" | "createdAt">) => {
    const id = generateId("P", data.people.map((p) => p.id));
    const newPerson: Person = { ...person, id, createdAt: new Date().toISOString() };
    
    const { error } = await supabase.from('people').insert({
      id: newPerson.id,
      full_name: newPerson.fullName,
      gang: newPerson.gang,
      hierarchy: newPerson.hierarchy,
      phone: newPerson.phone,
      photo_url: newPerson.photoUrl,
      vehicle_ids: newPerson.vehicleIds,
      created_at: newPerson.createdAt
    });
    
    if (error) {
      toast.error('Erro ao adicionar pessoa');
      return;
    }
    
    setData((prev) => ({ ...prev, people: [...prev.people, newPerson] }));
    addActivityLog("Adicionou pessoa", "Person", id);
  };

  const updatePerson = async (id: string, person: Partial<Person>) => {
    const updateData: any = {};
    if (person.fullName) updateData.full_name = person.fullName;
    if (person.gang) updateData.gang = person.gang;
    if (person.hierarchy) updateData.hierarchy = person.hierarchy;
    if (person.phone) updateData.phone = person.phone;
    if (person.photoUrl !== undefined) updateData.photo_url = person.photoUrl;
    if (person.vehicleIds) updateData.vehicle_ids = person.vehicleIds;
    
    const { error } = await supabase.from('people').update(updateData).eq('id', id);
    
    if (error) {
      toast.error('Erro ao atualizar pessoa');
      return;
    }
    
    setData((prev) => ({
      ...prev,
      people: prev.people.map((p) => (p.id === id ? { ...p, ...person } : p)),
    }));
    addActivityLog("Atualizou pessoa", "Person", id);
  };

  const deletePerson = async (id: string) => {
    const { error } = await supabase.from('people').delete().eq('id', id);
    
    if (error) {
      toast.error('Erro ao deletar pessoa');
      return;
    }
    
    setData((prev) => ({ ...prev, people: prev.people.filter((p) => p.id !== id) }));
    addActivityLog("Deletou pessoa", "Person", id);
  };

  const getPerson = (id: string) => data.people.find((p) => p.id === id);

  // Vehicles methods
  const addVehicle = async (vehicle: Omit<Vehicle, "id" | "createdAt">) => {
    const id = generateId("V", data.vehicles.map((v) => v.id));
    const newVehicle: Vehicle = { ...vehicle, id, createdAt: new Date().toISOString() };
    
    const { error } = await supabase.from('vehicles').insert({
      id: newVehicle.id,
      plate: newVehicle.plate,
      model: newVehicle.model,
      photo_url: newVehicle.photoUrl,
      owner_id: newVehicle.ownerId,
      created_at: newVehicle.createdAt
    });
    
    if (error) {
      toast.error('Erro ao adicionar veículo');
      return;
    }
    
    setData((prev) => ({ ...prev, vehicles: [...prev.vehicles, newVehicle] }));
    addActivityLog("Adicionou veículo", "Vehicle", id);
  };

  const updateVehicle = async (id: string, vehicle: Partial<Vehicle>) => {
    const updateData: any = {};
    if (vehicle.plate) updateData.plate = vehicle.plate;
    if (vehicle.model) updateData.model = vehicle.model;
    if (vehicle.photoUrl !== undefined) updateData.photo_url = vehicle.photoUrl;
    if (vehicle.ownerId !== undefined) updateData.owner_id = vehicle.ownerId;
    
    const { error } = await supabase.from('vehicles').update(updateData).eq('id', id);
    
    if (error) {
      toast.error('Erro ao atualizar veículo');
      return;
    }
    
    setData((prev) => ({
      ...prev,
      vehicles: prev.vehicles.map((v) => (v.id === id ? { ...v, ...vehicle } : v)),
    }));
    addActivityLog("Atualizou veículo", "Vehicle", id);
  };

  const deleteVehicle = async (id: string) => {
    const { error } = await supabase.from('vehicles').delete().eq('id', id);
    
    if (error) {
      toast.error('Erro ao deletar veículo');
      return;
    }
    
    setData((prev) => ({ ...prev, vehicles: prev.vehicles.filter((v) => v.id !== id) }));
    addActivityLog("Deletou veículo", "Vehicle", id);
  };

  const getVehicle = (id: string) => data.vehicles.find((v) => v.id === id);

  // Gangs methods
  const addGang = async (gang: Omit<Gang, "id" | "createdAt">) => {
    const id = generateId("G", data.gangs.map((g) => g.id));
    const newGang: Gang = { ...gang, id, createdAt: new Date().toISOString() };
    
    const { error } = await supabase.from('gangs').insert({
      id: newGang.id,
      name: newGang.name,
      description: newGang.description,
      color: newGang.color,
      allied_gang_ids: newGang.alliedGangIds || [],
      created_at: newGang.createdAt
    });
    
    if (error) {
      toast.error('Erro ao adicionar facção');
      return;
    }
    
    setData((prev) => ({ ...prev, gangs: [...prev.gangs, newGang] }));
    addActivityLog("Adicionou facção", "Gang", id);
  };

  const updateGang = async (id: string, gang: Partial<Gang>) => {
    const updateData: any = {};
    if (gang.name) updateData.name = gang.name;
    if (gang.description) updateData.description = gang.description;
    if (gang.color !== undefined) updateData.color = gang.color;
    if (gang.alliedGangIds) updateData.allied_gang_ids = gang.alliedGangIds;
    
    const { error } = await supabase.from('gangs').update(updateData).eq('id', id);
    
    if (error) {
      toast.error('Erro ao atualizar facção');
      return;
    }
    
    setData((prev) => ({
      ...prev,
      gangs: prev.gangs.map((g) => (g.id === id ? { ...g, ...gang } : g)),
    }));
    addActivityLog("Atualizou facção", "Gang", id);
  };

  const deleteGang = async (id: string) => {
    const { error } = await supabase.from('gangs').delete().eq('id', id);
    
    if (error) {
      toast.error('Erro ao deletar facção');
      return;
    }
    
    setData((prev) => ({ ...prev, gangs: prev.gangs.filter((g) => g.id !== id) }));
    addActivityLog("Deletou facção", "Gang", id);
  };

  const getGang = (id: string) => data.gangs.find((g) => g.id === id);

  // Cases methods
  const addCase = async (caseData: Omit<Case, "id" | "createdAt" | "status">) => {
    const id = generateId("C", data.cases.map((c) => c.id));
    const newCase: Case = { ...caseData, id, status: "open", createdAt: new Date().toISOString() };
    
    const { error } = await supabase.from('cases').insert({
      id: newCase.id,
      title: newCase.title,
      description: newCase.description,
      person_ids: newCase.personIds,
      vehicle_ids: newCase.vehicleIds,
      gang_ids: newCase.gangIds,
      attachments: newCase.attachments,
      status: newCase.status,
      created_at: newCase.createdAt
    });
    
    if (error) {
      toast.error('Erro ao criar caso');
      return;
    }
    
    setData((prev) => ({ ...prev, cases: [...prev.cases, newCase] }));
    addActivityLog("Criou caso", "Case", id);
  };

  const updateCase = async (id: string, caseData: Partial<Case>) => {
    const updateData: any = {};
    if (caseData.title) updateData.title = caseData.title;
    if (caseData.description) updateData.description = caseData.description;
    if (caseData.personIds) updateData.person_ids = caseData.personIds;
    if (caseData.vehicleIds) updateData.vehicle_ids = caseData.vehicleIds;
    if (caseData.gangIds) updateData.gang_ids = caseData.gangIds;
    if (caseData.attachments) updateData.attachments = caseData.attachments;
    if (caseData.status) updateData.status = caseData.status;
    
    const { error } = await supabase.from('cases').update(updateData).eq('id', id);
    
    if (error) {
      toast.error('Erro ao atualizar caso');
      return;
    }
    
    setData((prev) => ({
      ...prev,
      cases: prev.cases.map((c) => (c.id === id ? { ...c, ...caseData } : c)),
    }));
    addActivityLog("Atualizou caso", "Case", id);
  };

  const closeCase = async (id: string, reason: string) => {
    const closedAt = new Date().toISOString();
    const { error } = await supabase.from('cases').update({
      status: 'closed',
      closed_reason: reason,
      closed_at: closedAt
    }).eq('id', id);
    
    if (error) {
      toast.error('Erro ao fechar caso');
      return;
    }
    
    setData((prev) => ({
      ...prev,
      cases: prev.cases.map((c) =>
        c.id === id ? { ...c, status: "closed" as const, closedReason: reason, closedAt } : c
      ),
    }));
    addActivityLog("Fechou caso", "Case", id);
  };

  const deleteCase = async (id: string) => {
    const { error } = await supabase.from('cases').delete().eq('id', id);
    
    if (error) {
      toast.error('Erro ao deletar caso');
      return;
    }
    
    setData((prev) => ({ ...prev, cases: prev.cases.filter((c) => c.id !== id) }));
  };

  const getCase = (id: string) => data.cases.find((c) => c.id === id);

  // Investigations methods
  const addInvestigation = async (investigation: Omit<Investigation, "id" | "createdAt">) => {
    const id = generateId("I", data.investigations.map((i) => i.id));
    const newInvestigation: Investigation = { ...investigation, id, createdAt: new Date().toISOString() };
    
    const { error } = await supabase.from('investigations').insert({
      id: newInvestigation.id,
      title: newInvestigation.title,
      sections: newInvestigation.sections,
      person_ids: newInvestigation.personIds,
      attachments: newInvestigation.attachments,
      created_at: newInvestigation.createdAt
    });
    
    if (error) {
      toast.error('Erro ao criar investigação');
      return;
    }
    
    setData((prev) => ({ ...prev, investigations: [...prev.investigations, newInvestigation] }));
    addActivityLog("Criou investigação", "Investigation", id);
  };

  const updateInvestigation = async (id: string, investigation: Partial<Investigation>) => {
    const updateData: any = {};
    if (investigation.title) updateData.title = investigation.title;
    if (investigation.sections) updateData.sections = investigation.sections;
    if (investigation.personIds) updateData.person_ids = investigation.personIds;
    if (investigation.attachments) updateData.attachments = investigation.attachments;
    
    const { error } = await supabase.from('investigations').update(updateData).eq('id', id);
    
    if (error) {
      toast.error('Erro ao atualizar investigação');
      return;
    }
    
    setData((prev) => ({
      ...prev,
      investigations: prev.investigations.map((i) => (i.id === id ? { ...i, ...investigation } : i)),
    }));
    addActivityLog("Atualizou investigação", "Investigation", id);
  };

  const deleteInvestigation = async (id: string) => {
    const { error } = await supabase.from('investigations').delete().eq('id', id);
    
    if (error) {
      toast.error('Erro ao deletar investigação');
      return;
    }
    
    setData((prev) => ({ ...prev, investigations: prev.investigations.filter((i) => i.id !== id) }));
    addActivityLog("Deletou investigação", "Investigation", id);
  };

  const getInvestigation = (id: string) => data.investigations.find((i) => i.id === id);

  // Charges methods
  const addCharge = async (charge: Omit<Charge, "id" | "createdAt">) => {
    const id = generateId("CH", data.charges.map((c) => c.id));
    const newCharge: Charge = { ...charge, id, createdAt: new Date().toISOString() };
    
    const { error } = await supabase.from('charges').insert({
      id: newCharge.id,
      person_ids: newCharge.personIds,
      vehicle_ids: newCharge.vehicleIds,
      gang_id: newCharge.gangId,
      reason: newCharge.reason,
      status: newCharge.status,
      created_at: newCharge.createdAt
    });
    
    if (error) {
      toast.error('Erro ao adicionar cobrança');
      return;
    }
    
    setData((prev) => ({ ...prev, charges: [...prev.charges, newCharge] }));
    addActivityLog("Adicionou cobrança", "Charge", id);
  };

  const updateCharge = async (id: string, charge: Partial<Charge>) => {
    const updateData: any = {};
    if (charge.personIds) updateData.person_ids = charge.personIds;
    if (charge.vehicleIds) updateData.vehicle_ids = charge.vehicleIds;
    if (charge.gangId !== undefined) updateData.gang_id = charge.gangId;
    if (charge.reason) updateData.reason = charge.reason;
    if (charge.status) updateData.status = charge.status;
    
    const { error } = await supabase.from('charges').update(updateData).eq('id', id);
    
    if (error) {
      toast.error('Erro ao atualizar cobrança');
      return;
    }
    
    setData((prev) => ({
      ...prev,
      charges: prev.charges.map((c) => (c.id === id ? { ...c, ...charge } : c)),
    }));
    addActivityLog("Atualizou cobrança", "Charge", id);
  };

  const deleteCharge = async (id: string) => {
    const { error } = await supabase.from('charges').delete().eq('id', id);
    
    if (error) {
      toast.error('Erro ao deletar cobrança');
      return;
    }
    
    setData((prev) => ({ ...prev, charges: prev.charges.filter((c) => c.id !== id) }));
    addActivityLog("Deletou cobrança", "Charge", id);
  };

  // Bases methods
  const addBase = async (base: Omit<Base, "id" | "createdAt">) => {
    const id = generateId("B", data.bases.map((b) => b.id));
    const newBase: Base = { ...base, id, createdAt: new Date().toISOString() };
    
    const { error } = await supabase.from('bases').insert({
      id: newBase.id,
      name: newBase.name,
      description: newBase.description,
      images: newBase.images,
      metadata: newBase.metadata,
      created_at: newBase.createdAt
    });
    
    if (error) {
      toast.error('Erro ao adicionar base');
      return;
    }
    
    setData((prev) => ({ ...prev, bases: [...prev.bases, newBase] }));
    addActivityLog("Adicionou base", "Base", id);
  };

  const updateBase = async (id: string, base: Partial<Base>) => {
    const updateData: any = {};
    if (base.name) updateData.name = base.name;
    if (base.description) updateData.description = base.description;
    if (base.images) updateData.images = base.images;
    if (base.metadata) updateData.metadata = base.metadata;
    
    const { error } = await supabase.from('bases').update(updateData).eq('id', id);
    
    if (error) {
      toast.error('Erro ao atualizar base');
      return;
    }
    
    setData((prev) => ({
      ...prev,
      bases: prev.bases.map((b) => (b.id === id ? { ...b, ...base } : b)),
    }));
    addActivityLog("Atualizou base", "Base", id);
  };

  const deleteBase = async (id: string) => {
    const { error } = await supabase.from('bases').delete().eq('id', id);
    
    if (error) {
      toast.error('Erro ao deletar base');
      return;
    }
    
    setData((prev) => ({ ...prev, bases: prev.bases.filter((b) => b.id !== id) }));
    addActivityLog("Deletou base", "Base", id);
  };

  // Meetings methods
  const addMeeting = async (meeting: Omit<Meeting, "id" | "createdAt">) => {
    const id = generateId("M", data.meetings.map((m) => m.id));
    const newMeeting: Meeting = { ...meeting, id, createdAt: new Date().toISOString() };
    
    const { error } = await supabase.from('meetings').insert({
      id: newMeeting.id,
      title: newMeeting.title,
      description: newMeeting.description,
      person_ids: newMeeting.personIds,
      vehicle_ids: newMeeting.vehicleIds,
      gang_ids: newMeeting.gangIds,
      attachments: newMeeting.attachments,
      meeting_date: newMeeting.meetingDate,
      created_at: newMeeting.createdAt
    });
    
    if (error) {
      toast.error('Erro ao criar reunião');
      return;
    }
    
    setData((prev) => ({ ...prev, meetings: [...prev.meetings, newMeeting] }));
    addActivityLog("Criou reunião", "Meeting", id);
  };

  const updateMeeting = async (id: string, meeting: Partial<Meeting>) => {
    const updateData: any = {};
    if (meeting.title) updateData.title = meeting.title;
    if (meeting.description) updateData.description = meeting.description;
    if (meeting.personIds) updateData.person_ids = meeting.personIds;
    if (meeting.vehicleIds) updateData.vehicle_ids = meeting.vehicleIds;
    if (meeting.gangIds) updateData.gang_ids = meeting.gangIds;
    if (meeting.attachments) updateData.attachments = meeting.attachments;
    if (meeting.meetingDate) updateData.meeting_date = meeting.meetingDate;
    
    const { error } = await supabase.from('meetings').update(updateData).eq('id', id);
    
    if (error) {
      toast.error('Erro ao atualizar reunião');
      return;
    }
    
    setData((prev) => ({
      ...prev,
      meetings: prev.meetings.map((m) => (m.id === id ? { ...m, ...meeting } : m)),
    }));
    addActivityLog("Atualizou reunião", "Meeting", id);
  };

  const deleteMeeting = async (id: string) => {
    const { error } = await supabase.from('meetings').delete().eq('id', id);
    
    if (error) {
      toast.error('Erro ao deletar reunião');
      return;
    }
    
    setData((prev) => ({ ...prev, meetings: prev.meetings.filter((m) => m.id !== id) }));
    addActivityLog("Deletou reunião", "Meeting", id);
  };

  // Deeps methods
  const addDeep = async (deep: Omit<Deep, "id" | "createdAt">) => {
    const id = generateId("D", data.deeps.map((d) => d.id));
    const newDeep: Deep = { ...deep, id, createdAt: new Date().toISOString() };
    
    const { error } = await supabase.from('deeps').insert({
      id: newDeep.id,
      title: newDeep.title,
      description: newDeep.description,
      images: newDeep.images,
      created_at: newDeep.createdAt
    });
    
    if (error) {
      toast.error('Erro ao criar deep');
      return;
    }
    
    setData((prev) => ({ ...prev, deeps: [...prev.deeps, newDeep] }));
    addActivityLog("Criou deep", "Deep", id);
  };

  const updateDeep = async (id: string, deep: Partial<Deep>) => {
    const updateData: any = {};
    if (deep.title) updateData.title = deep.title;
    if (deep.description) updateData.description = deep.description;
    if (deep.images) updateData.images = deep.images;
    
    const { error } = await supabase.from('deeps').update(updateData).eq('id', id);
    
    if (error) {
      toast.error('Erro ao atualizar deep');
      return;
    }
    
    setData((prev) => ({
      ...prev,
      deeps: prev.deeps.map((d) => (d.id === id ? { ...d, ...deep } : d)),
    }));
    addActivityLog("Atualizou deep", "Deep", id);
  };

  const deleteDeep = async (id: string) => {
    const { error } = await supabase.from('deeps').delete().eq('id', id);
    
    if (error) {
      toast.error('Erro ao deletar deep');
      return;
    }
    
    setData((prev) => ({ ...prev, deeps: prev.deeps.filter((d) => d.id !== id) }));
    addActivityLog("Deletou deep", "Deep", id);
  };

  // Auctions methods
  const addAuction = async (auction: Omit<Auction, "id" | "createdAt">) => {
    const id = generateId("A", data.auctions.map((a) => a.id));
    const newAuction: Auction = { ...auction, id, createdAt: new Date().toISOString() };
    
    const { error } = await supabase.from('auctions').insert({
      id: newAuction.id,
      title: newAuction.title,
      entries: newAuction.entries,
      created_at: newAuction.createdAt
    });
    
    if (error) {
      toast.error('Erro ao criar leilão');
      return;
    }
    
    setData((prev) => ({ ...prev, auctions: [...prev.auctions, newAuction] }));
    addActivityLog("Criou leilão", "Auction", id);
  };

  const updateAuction = async (id: string, auction: Partial<Auction>) => {
    const updateData: any = {};
    if (auction.title) updateData.title = auction.title;
    if (auction.entries) updateData.entries = auction.entries;
    
    const { error } = await supabase.from('auctions').update(updateData).eq('id', id);
    
    if (error) {
      toast.error('Erro ao atualizar leilão');
      return;
    }
    
    setData((prev) => ({
      ...prev,
      auctions: prev.auctions.map((a) => (a.id === id ? { ...a, ...auction } : a)),
    }));
    addActivityLog("Atualizou leilão", "Auction", id);
  };

  const deleteAuction = async (id: string) => {
    const { error } = await supabase.from('auctions').delete().eq('id', id);
    
    if (error) {
      toast.error('Erro ao deletar leilão');
      return;
    }
    
    setData((prev) => ({ ...prev, auctions: prev.auctions.filter((a) => a.id !== id) }));
    addActivityLog("Deletou leilão", "Auction", id);
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
    addMeeting,
    updateMeeting,
    deleteMeeting,
    addDeep,
    updateDeep,
    deleteDeep,
    addAuction,
    updateAuction,
    deleteAuction,
    updateInvestigators,
    exportData: exportDataMethod,
    importData: importDataMethod,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};
