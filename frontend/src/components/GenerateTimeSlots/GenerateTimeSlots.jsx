export const generateTimeSlots = () => {
  const slots = [];
  let hour = 9;
  let minute = 0;

  while (hour < 23 || (hour === 23 && minute <= 40)) {
    slots.push(
      `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`
    );

    minute += 40;
    if (minute >= 60) {
      hour += Math.floor(minute / 60);
      minute %= 60;
    }
  }
  return slots;
};
