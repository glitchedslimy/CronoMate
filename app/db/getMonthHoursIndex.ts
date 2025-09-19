import { getEntriesByMonth, WorkEntry } from './WorkerEntriesService';

/**
 * Returns daily totals for a given month
 */
export const getMonthIndex = async (year: number, month: number) => {
  const daysInMonth = new Date(year, month, 0).getDate(); // month 1-12
  const dailyTotals: number[] = Array.from({ length: daysInMonth }, () => 0);

  const entries: WorkEntry[] = await getEntriesByMonth(year, month);

  entries.forEach((entry) => {
    if (!entry.date) return;

    const d = new Date(entry.date);
    const entryYear = d.getFullYear();
    const entryMonth = d.getMonth() + 1; // JS months are 0-based
    const day = d.getDate();

    if (entryYear === year && entryMonth === month) {
      dailyTotals[day - 1] += entry.hoursWorkedPerDay + (entry.hoursWorkedPerDayExtra ?? 0);
    }
  });

  return dailyTotals;
};

/**
 * Returns daily totals for the week containing currentDay
 * Monday → Sunday
 */
export const getWeekIndex = async (year: number, month: number, currentDay: number) => {
  const dailyTotals = await getMonthIndex(year, month);
  if (!dailyTotals.length) return Array(7).fill(0);

  const date = new Date(year, month - 1, currentDay);
  const dayOfWeek = date.getDay(); // Sunday=0, Monday=1
  const offset = (dayOfWeek + 6) % 7; // Monday as first day
  const startDay = currentDay - offset;
  const weekTotals: number[] = [];

  for (let i = startDay; i < startDay + 7; i++) {
    if (i < 1 || i > dailyTotals.length) {
      weekTotals.push(0);
    } else {
      weekTotals.push(dailyTotals[i - 1]);
    }
  }

  return weekTotals;
};

/**
 * Returns hours worked for a specific day
 */
export const getDayHours = async (date: Date) => {
  const dailyTotals = await getMonthIndex(date.getFullYear(), date.getMonth() + 1);
  const day = date.getDate();
  if (day < 1 || day > dailyTotals.length) return 0;
  return dailyTotals[day - 1] ?? 0;
};

/**
 * Returns total money earned in a month
 */
export const getMonthTotalMoney = async (year: number, month: number) => {
  const entries: WorkEntry[] = await getEntriesByMonth(year, month);
  let total = 0;

  entries.forEach((entry) => {
    if (!entry.date) return;
    const parts = entry.date.split('/');
    if (parts.length !== 3) return;

    const entryMonth = parseInt(parts[1], 10);
    const entryYear = parseInt(parts[2], 10);

    if (entryYear !== year || entryMonth !== month) return;


    if (entry.moneyEarned !== undefined) {
      total += entry.moneyEarned;
    } else {
      const normal = (entry.hoursWorkedPerDay ?? 0) * (entry.moneyPerHour ?? 0);
      const extra = (entry.hoursWorkedPerDayExtra ?? 0) * (entry.moneyPerHourExtra ?? 0);
      total += normal + extra;
    }
  });

  return total;
};
