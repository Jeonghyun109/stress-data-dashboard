export const normalizePid = (pid: unknown): string => {
  if (pid === undefined || pid === null) return "";
  return String(pid).trim();
};

export const filterRowsByPid = <T extends Record<string, any>>(
  rows: T[],
  pid?: string | number
): T[] => {
  const pidKey = normalizePid(pid);
  if (!pidKey) return rows;
  return rows.filter((row) => normalizePid(row.pid ?? row.participant_id ?? row.user_id) === pidKey);
};
