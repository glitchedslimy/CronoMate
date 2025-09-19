import { useEffect, useState } from "react";
import { WorkEntry } from "../../db/WorkerEntriesService";
import MonthButtons from "./MonthButtons";
import MonthChart from "./MonthChart";

interface GraphProps {
  entries: WorkEntry[];
  dbReady: boolean;
  fetchEntries: (month?: number) => Promise<void>;
}

export default function Graph({ entries, dbReady, fetchEntries }: GraphProps) {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);


  useEffect(() => {
    if (dbReady) fetchEntries(selectedMonth);
  }, [selectedMonth, dbReady]);

  return (
    <>
      <MonthChart entries={entries} selectedMonth={selectedMonth} />
      <MonthButtons entries={entries} selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} />
    </>
  );
}
