// Disk se file delete karta hai. Agar file pehle se nahi hai to koi error nahi aata
import fs from "fs/promises";

export async function deleteFile(filePath: string): Promise<void> {
  try {
    await fs.unlink(filePath);
  } catch {
    // File pehle hi delete ho chuki hai, ignore karo
  }
}
