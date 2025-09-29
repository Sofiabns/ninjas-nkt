import { AppData, Investigator } from "@/types";

const STORAGE_KEY = "ninjas_nkt_data";

const defaultInvestigators: Investigator[] = [
  { id: "INV-01", name: "Hinata" },
  { id: "INV-02", name: "Luciano" },
  { id: "INV-03", name: "Miranda" },
  { id: "INV-04", name: "Lara" },
  { id: "INV-05", name: "Hiro" },
  { id: "INV-06", name: "Naira" },
  { id: "INV-07", name: "Miguel" },
  { id: "INV-08", name: "Eloa" },
  { id: "INV-09", name: "Noah" },
  { id: "INV-10", name: "Lua" },
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
