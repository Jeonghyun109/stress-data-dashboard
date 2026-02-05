const pad2 = (n: number) => String(n).padStart(2, '0');

export const formatTime = (ms: number) => {
  if (Number.isNaN(ms)) return '';
  const d = new Date(ms - 9 * 60 * 60 * 1000);
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
};

export const parseTime = (v: unknown): number => {
  if (typeof v === 'number') return v < 1e12 ? v * 1000 : v;
  if (typeof v === 'string') {
    const n = Number(v);
    if (!Number.isNaN(n)) return n < 1e12 ? n * 1000 : n;
    const p = Date.parse(v);
    return Number.isNaN(p) ? NaN : p;
  }
  return NaN;
};

export const monthLabel = (monthIndex1: number) => {
  if (monthIndex1 === 7) return 'July';
  if (monthIndex1 === 8) return 'August';
  return '';
};

export const addDays = (date: Date, days: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

export const getIsoDateKey = (date: Date, options?: { addDays?: number; addHours?: number }) => {
  const { addDays: days = 0, addHours = 0 } = options ?? {};
  const next = addDays(date, days);
  return new Date(next.getTime() + addHours * 60 * 60 * 1000).toISOString().slice(0, 10);
};
