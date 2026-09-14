export function listLearningDays() {
  const days = [];
  let utc = Date.UTC(2026, 8, 14);
  const end = Date.UTC(2027, 8, 9);
  while (utc <= end) {
    const d = new Date(utc);
    const weekday = d.getUTCDay();
    if (weekday >= 1 && weekday <= 4) {
      const y = d.getUTCFullYear();
      const m = String(d.getUTCMonth() + 1).padStart(2, '0');
      const day = String(d.getUTCDate()).padStart(2, '0');
      days.push(`${y}-${m}-${day}`);
    }
    utc += 86400000;
  }
  return days;
}
