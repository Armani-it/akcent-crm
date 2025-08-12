export const formatPhoneNumber = (phoneStr) => {
  if (!phoneStr) return "";
  let cleaned = ("" + phoneStr).replace(/\D/g, "");
  if (cleaned.length === 11 && cleaned.startsWith("8"))
    cleaned = "7" + cleaned.slice(1);
  if (cleaned.length === 10 && !cleaned.startsWith("7"))
    cleaned = "7" + cleaned;
  const match = cleaned.match(/^7(\d{3})(\d{3})(\d{2})(\d{2})$/);
  return match
    ? `+7 (${match[1]}) ${match[2]}-${match[3]}-${match[4]}`
    : phoneStr;
};
