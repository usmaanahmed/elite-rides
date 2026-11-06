// .env file ki values yahan se milti hain
import dotenv from "dotenv";

dotenv.config();

// CLIENT_URL me comma laga kar kai frontend URLs likh sakte hain
// e.g. CLIENT_URL=http://localhost:5173,https://admin.mysite.com
const clientUrlText = process.env.CLIENT_URL || "http://localhost:5173";
const clientUrls = clientUrlText.split(",").map((url) => url.trim());

export const env = {
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/elite-rides",
  clientUrls: clientUrls,
};
