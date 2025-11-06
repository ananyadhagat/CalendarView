export const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
export const isSameDay = (a: Date, b: Date) => startOfDay(a).getTime() === startOfDay(b).getTime();

export const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
export const addHours = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours() + n, d.getMinutes());
export const addMinutes = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes() + n);
export const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));

/** 42-cell month grid (Mon–Sun) */
export function getCalendarGrid(anchor: Date): Date[] {
  const y = anchor.getFullYear();
  const m = anchor.getMonth();
  const firstOfMonth = new Date(y, m, 1);
  // make Monday = 0
  const startWeekday = (firstOfMonth.getDay() + 6) % 7;
  const gridStart = new Date(y, m, 1 - startWeekday);
  const cells: Date[] = [];
  for (let i = 0; i < 42; i++) {
    cells.push(new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i));
  }
  return cells;
}

export function formatMonthYear(d: Date) {
  return d.toLocaleString(undefined, { month: 'long', year: 'numeric' });
}

export function hoursInDay(stepMinutes = 60) {
  const out: Date[] = [];
  const base = startOfDay(new Date());
  for (let m = 0; m < 24 * 60; m += stepMinutes) out.push(addMinutes(base, m));
  return out;
}
