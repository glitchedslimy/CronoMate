import * as SQLite from 'expo-sqlite';

export interface WorkEntry {
  id?: number;
  date: string;
  moneyPerHour: number;
  hoursWorkedPerDay: number;
  extraHours: boolean;
  moneyPerHourExtra?: number | null;
  hoursWorkedPerDayExtra?: number | null;
}

let db: SQLite.SQLiteDatabase | null = null;

export const initDB = async () => {
  db = await SQLite.openDatabaseAsync('workHours.db');
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS WorkEntries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      moneyPerHour REAL NOT NULL,
      hoursWorkedPerDay REAL NOT NULL,
      extraHours INTEGER NOT NULL,
      moneyPerHourExtra REAL,
      hoursWorkedPerDayExtra REAL
    );
  `);
};


export const getDb = () => {
  if (!db) throw new Error("Database not initialized. Call initDB() first.");
  return db;
};


export const addWorkEntries = async (entries: WorkEntry[]) => {
  const database = getDb();
  const stmt = await database.prepareAsync(`
    INSERT INTO WorkEntries 
      (date, moneyPerHour, hoursWorkedPerDay, extraHours, moneyPerHourExtra, hoursWorkedPerDayExtra)
      VALUES ($date, $moneyPerHour, $hoursWorkedPerDay, $extraHours, $moneyPerHourExtra, $hoursWorkedPerDayExtra)
  `);

  try {
    for (const entry of entries) {
      if (!entry.date) throw new Error("WorkEntry.date is required");

      await stmt.executeAsync({
        $date: entry.date,
        $moneyPerHour: entry.moneyPerHour,
        $hoursWorkedPerDay: entry.hoursWorkedPerDay,
        $extraHours: entry.extraHours ? 1 : 0,
        $moneyPerHourExtra: entry.moneyPerHourExtra ?? null,
        $hoursWorkedPerDayExtra: entry.hoursWorkedPerDayExtra ?? null,
      });
    }
  } finally {
    await stmt.finalizeAsync();
  }
};


export const getEntriesByMonth = async (year: number, month: number) => {
  if (!year || !month || month < 1 || month > 12) {
    console.warn("Invalid year or month:", year, month);
    return [];
  }

  const database = getDb();


  const start = new Date(year, month - 1, 1, 0, 0, 0);

  const end = new Date(year, month - 1, new Date(year, month, 0).getDate(), 23, 59, 59);

  const stmt = await database.prepareAsync(`
    SELECT * FROM WorkEntries WHERE date BETWEEN $start AND $end ORDER BY date ASC
  `);

  try {
    const result = await stmt.executeAsync({
      $start: start.toISOString(),
      $end: end.toISOString(),
    });
    const rows = await result.getAllAsync();
    return rows.map((row: any) => ({
      id: row.id,
      date: row.date,
      moneyPerHour: row.moneyPerHour,
      hoursWorkedPerDay: row.hoursWorkedPerDay,
      extraHours: !!row.extraHours,
      moneyPerHourExtra: row.moneyPerHourExtra ?? null,
      hoursWorkedPerDayExtra: row.hoursWorkedPerDayExtra ?? null,
    })) as WorkEntry[];
  } finally {
    await stmt.finalizeAsync();
  }
};



export const updateEntry = async (id: number, entry: WorkEntry) => {
  const database = getDb();

  if (!entry.date) throw new Error("WorkEntry.date is required");

  const stmt = await database.prepareAsync(`
    UPDATE WorkEntries SET 
      date = $date,
      moneyPerHour = $moneyPerHour,
      hoursWorkedPerDay = $hoursWorkedPerDay,
      extraHours = $extraHours,
      moneyPerHourExtra = $moneyPerHourExtra,
      hoursWorkedPerDayExtra = $hoursWorkedPerDayExtra
    WHERE id = $id
  `);

  try {
    await stmt.executeAsync({
      $date: entry.date,
      $moneyPerHour: entry.moneyPerHour,
      $hoursWorkedPerDay: entry.hoursWorkedPerDay,
      $extraHours: entry.extraHours ? 1 : 0,
      $moneyPerHourExtra: entry.moneyPerHourExtra ?? null,
      $hoursWorkedPerDayExtra: entry.hoursWorkedPerDayExtra ?? null,
      $id: id,
    });
  } finally {
    await stmt.finalizeAsync();
  }
};


export const deleteEntry = async (id: number) => {
  const database = getDb();

  const stmt = await database.prepareAsync(`DELETE FROM WorkEntries WHERE id = $id`);
  try {
    await stmt.executeAsync({ $id: id });
  } finally {
    await stmt.finalizeAsync();
  }
};