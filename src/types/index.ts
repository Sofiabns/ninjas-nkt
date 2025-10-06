export interface Investigator {
  id: string;
  name: string;
  attachments: Attachment[];
}

export interface Person {
  id: string;
  fullName: string;
  gang: string;
  hierarchy: "Lider" | "Sub-Lider" | "Membro";
  phone: string;
  attachments: Attachment[];
  vehicleIds: string[];
  deep?: string;
  createdAt: string;
}

export interface Vehicle {
  id: string;
  plate: string;
  model: string;
  attachments: Attachment[];
  ownerId?: string;
  gangId?: string;
  createdAt: string;
}

export interface Gang {
  id: string;
  name: string;
  description: string;
  color?: string;
  alliedGangIds?: string[];
  createdAt: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  file?: File;
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
  gangId?: string;
  attachments: Attachment[];
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

export interface Meeting {
  id: string;
  title: string;
  description: string;
  personIds: string[];
  vehicleIds: string[];
  gangIds: string[];
  attachments: Attachment[];
  meetingDate: string;
  createdAt: string;
}

export interface Deep {
  id: string;
  title: string;
  description: string;
  personIds: string[];
  gangId?: string;
  attachments: Attachment[];
  createdAt: string;
}

export interface AuctionEntry {
  gangId: string;
  item: string;
  amount: number;
}

export interface Auction {
  id: string;
  title: string;
  entries: AuctionEntry[];
  attachments: Attachment[];
  createdAt: string;
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
  meetings: Meeting[];
  deeps: Deep[];
  auctions: Auction[];
  activityLogs: ActivityLog[];
  currentInvestigator?: string;
}
