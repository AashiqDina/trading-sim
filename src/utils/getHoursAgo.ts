export function getHoursAgo(date?: string | Date | null): string {
  if (!date) return "N/A";

  const parsedDate = typeof date === "string" ? new Date(date) : date;

  const msDiff = Date.now() - parsedDate.getTime();
  const minutesDiff = Math.floor(msDiff / (1000 * 60));
  const hoursDiff = Math.floor(msDiff / (1000 * 60 * 60));

  if (minutesDiff < 1) return "Just updated";
  if (hoursDiff < 1) return `Updated ${minutesDiff}m ago`;
  if (hoursDiff === 1) return "Updated 1h ago";

  return `Updated ${hoursDiff}h ago`;
}