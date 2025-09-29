export interface Investigator {
  id: string;
  name: string;
  photoUrl?: string;
}

export interface Person {
  id: string;
  fullName: string;
  gang: string;
  hierarchy: "Líder" | "Sub-Líder" | "Membro";
  phone: string;
  photoUrl?: string;
  vehicleIds: string[];
  createdAt: string;
}

export interface Vehicle {
  id: string;
  plate: string;
  model: string;
  photoUrl?: string;
  ownerId?: string;
  createdAt: string;
}

export interface Gang {
  id: string;
  name: string;
  description: string;
  color?: string;
  createdAt: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
}

export interface Case {
  id: string;
  title: string;
  description: string;
  personIds: string[];
  vehicleIds: string[];
  gangIds: string[];
  attachments: Attachment[];
  status: "open" | "closed";
  closedReason?: string;
  closedAt?: string;
  createdAt: string;
}

export interface Investigation {
  id: string;
  title: string;
  sections: { label: string; content: string }[];
  personIds: string[];
  attachments: Attachment[];
  createdAt: string;
}

export interface Charge {
  id: string;
  personIds: string[];
  vehicleIds: string[];
  gangId?: string;
  reason: string;
  status: "pendente" | "resolvido";
  createdAt: string;
}

export interface Base {
  id: string;
  name: string;
  description: string;
  images: string[];
  metadata: Record<string, string>;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  investigatorId: string;
  investigatorName: string;
  action: string;
  entityType: string;
  entityId: string;
  timestamp: string;
}

export interface AppData {
  investigators: Investigator[];
  people: Person[];
  vehicles: Vehicle[];
  gangs: Gang[];
  cases: Case[];
  investigations: Investigation[];
  charges: Charge[];
  bases: Base[];
  activityLogs: ActivityLog[];
  currentInvestigator?: string;
}
