export function convertToDateISO(dateString) {
  if (!dateString) return null;
  const [day, month, year] = dateString.split("/");
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}
