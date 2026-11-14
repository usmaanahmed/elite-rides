// .env file ki values yahan se milti hain
import dotenv from "dotenv";
import path from "path";

dotenv.config();

// CLIENT_URL me comma laga kar kai frontend URLs likh sakte hain
// e.g. CLIENT_URL=http://localhost:5173,https://admin.mysite.com
const clientUrlText = process.env.CLIENT_URL || "http://localhost:5173";
const clientUrls = clientUrlText.split(",").map((url) => url.trim());

// Login token bina secret key ke sign/verify nahi ho sakta
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET .env file me set karna zaroori hai");
}

export const env = {
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/elite-rides",
  clientUrls: clientUrls,
  // Upload ki hui images (car photos) is folder me save hoti hain
  uploadsFolder: path.resolve(process.cwd(), "uploads"),
  // Login token sign/verify karne ke liye secret key
  jwtSecret: process.env.JWT_SECRET,
  // Distance (miles) nikalne ke liye Google key. Khaali ho to quote nahi ban sakta (server phir bhi chalta hai)
  googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || "",
  // Customer website ka address. Stripe payment ke baad customer yahan wapas aata hai
  websiteUrl: process.env.WEBSITE_URL || "http://localhost:5174",
  // Stripe keys. Khaali hon to card payment band rehti hai (server phir bhi chalta hai)
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || "",
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",
  // Stripe ko currency ka code chahiye (e.g. "gbp"), symbol "£" nahi
  stripeCurrency: process.env.STRIPE_CURRENCY || "gbp",
};
