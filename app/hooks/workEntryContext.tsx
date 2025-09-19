import { createContext, useContext, useEffect, useState } from "react";
import {
  addWorkEntries,
  deleteEntry as deleteEntryFromDB,
  getEntriesByMonth,
  WorkEntry,
} from "../db/WorkerEntriesService";

interface WorkEntryContextType {
  entries: WorkEntry[];
  selectedMonth: number;
  setSelectedMonth: (month: number) => void;
  addEntry: (entry: WorkEntry) => Promise<void>;
  deleteEntry: (id: number) => Promise<void>; // ✅ new
}

const WorkEntryContext = createContext<WorkEntryContextType | undefined>(undefined);

export const WorkEntryProvider = ({ children }: { children: React.ReactNode }) => {
  const [entries, setEntries] = useState<WorkEntry[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  const fetchEntries = async (month: number) => {
    const data = await getEntriesByMonth(new Date().getFullYear(), month);
    setEntries(data);
    setSelectedMonth(month);
  };

  const addEntry = async (entry: WorkEntry) => {
    await addWorkEntries([entry]);
    await fetchEntries(selectedMonth);
  };

  const deleteEntry = async (id: number) => {
    await deleteEntryFromDB(id);
    await fetchEntries(selectedMonth);
  };

  useEffect(() => {
    fetchEntries(selectedMonth);
  }, []);

  return (
    <WorkEntryContext.Provider value={{ entries, selectedMonth, setSelectedMonth, addEntry, deleteEntry }}>
      {children}
    </WorkEntryContext.Provider>
  );
};

export const useWorkEntries = () => {
  const context = useContext(WorkEntryContext);
  if (!context) throw new Error("useWorkEntries must be used inside WorkEntryProvider");
  return context;
};
