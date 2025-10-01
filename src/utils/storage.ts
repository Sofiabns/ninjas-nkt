import { AppData, Investigator } from "@/types";

const STORAGE_KEY = "ninjas_nkt_data";

const defaultInvestigators: Investigator[] = [
  { id: "INV-01", name: "Hinata" },
  { id: "INV-02", name: "Luciano" },
  { id: "INV-03", name: "Miranda" },
  { id: "INV-04", name: "Lua" },
  { id: "INV-05", name: "Hiro" },
  { id: "INV-06", name: "Eloa" },
  { id: "INV-07", name: "Lara" },
];

export const getDefaultData = (): AppData => ({
  investigators: defaultInvestigators,
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

export const loadData = (): AppData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Ensure investigators are always present
      if (!parsed.investigators || parsed.investigators.length === 0) {
        parsed.investigators = defaultInvestigators;
      }
      // Ensure activityLogs exist (backward compatibility)
      if (!parsed.activityLogs) {
        parsed.activityLogs = [];
      }
      // Ensure meetings, deeps, auctions exist (backward compatibility)
      if (!parsed.meetings) {
        parsed.meetings = [];
      }
      if (!parsed.deeps) {
        parsed.deeps = [];
      }
      if (!parsed.auctions) {
        parsed.auctions = [];
      }
      return parsed;
    }
  } catch (error) {
    console.error("Error loading data:", error);
  }
  return getDefaultData();
};

export const saveData = (data: AppData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving data:", error);
  }
};

export const exportData = (): string => {
  const data = loadData();
  return JSON.stringify(data, null, 2);
};

export const importData = (jsonString: string): boolean => {
  try {
    const data = JSON.parse(jsonString);
    saveData(data);
    return true;
  } catch (error) {
    console.error("Error importing data:", error);
    return false;
  }
};
