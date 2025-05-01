export function combineDateWithTimes(
  dateStr: string,
  startTime: string,
  endTime: string,
): { start: Date; end: Date } {
  const [year, month, day] = dateStr.split('-').map(Number);

  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);

  const start = new Date(year, month - 1, day, startHour, startMinute, 0, 0);
  const end = new Date(year, month - 1, day, endHour, endMinute, 0, 0);

  return { start, end };
}
