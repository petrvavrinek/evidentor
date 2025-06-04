export const getMonthNames = (
  format: "long" | "short" | "narrow",
  lang = "en-us"
): string[] => {
  const monthNames: string[] = [];

  for (let i = 1; i < 13; i++) {
    const date = new Date(`1970-${i}-01`);

    monthNames.push(date.toLocaleString(lang, { month: format }));
  }
  return monthNames;
};

export const getDayNames = (
  format: "long" | "short" | "narrow",
  lang = "en-us"
): string[] => {
  const dayNames: string[] = [];
  for (let i = 1; i < 8; i++) {
    const date = new Date(`1970-01-0${i + 3}`);
    dayNames.push(date.toLocaleString(lang, { weekday: format }));
  }
  return dayNames;
};
