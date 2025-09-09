export function timeSince(dateString) {
  const now = new Date();
  const created = new Date(dateString);
  const diffMs = now - created; // ต่างเป็น milliseconds
  const diffMinutes = Math.floor(diffMs / 1000 / 60);

  if (diffMinutes < 1) return "เมื่อสักครู่";
  if (diffMinutes < 60) return `${diffMinutes} นาทีที่แล้ว`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} ชั่วโมงที่แล้ว`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} วันที่แล้ว`;
}
