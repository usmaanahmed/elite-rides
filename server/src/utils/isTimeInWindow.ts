// Check karta hai ke time ek daily window ke andar hai ya nahi. Time "HH:mm" format me hota hai.
// Window raat ko midnight cross kar sakti hai, e.g. 22:00 se 06:00.
// from shamil hai, to shamil nahi (22:00 se 06:00: 22:00 andar hai, 06:00 bahar)
export function isTimeInWindow(time: string, fromTime: string, toTime: string): boolean {
  // "HH:mm" strings alphabet order me bhi time ke order me hi hoti hain, isliye seedha compare ho sakti hain
  if (fromTime < toTime) {
    // Normal din ki window, e.g. 09:00 se 17:00
    return time >= fromTime && time < toTime;
  }

  if (fromTime > toTime) {
    // Midnight cross karne wali window, e.g. 22:00 se 06:00
    return time >= fromTime || time < toTime;
  }

  // from aur to barabar hon to window khaali hai
  return false;
}
