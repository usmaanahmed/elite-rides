// Express app ka setup (middlewares aur routes yahan lagengay)
import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import authRoutes from "./modules/auth/auth.routes.js";
import healthRoutes from "./modules/health/health.routes.js";
import banAddressRoutes from "./modules/banAddress/banAddress.routes.js";
import congestionAddressRoutes from "./modules/congestionAddress/congestionAddress.routes.js";
import bookingRoutes from "./modules/booking/booking.routes.js";
import couponRoutes from "./modules/coupon/coupon.routes.js";
import dropdownAddressRoutes from "./modules/dropdownAddress/dropdownAddress.routes.js";
import fixedPriceRoutes from "./modules/fixedPrice/fixedPrice.routes.js";
import publicBookingRoutes from "./modules/publicBooking/publicBooking.routes.js";
import quoteRoutes from "./modules/quote/quote.routes.js";
import settingRoutes from "./modules/setting/setting.routes.js";
import surchargeAddressRoutes from "./modules/surchargeAddress/surchargeAddress.routes.js";
import surchargeDateRoutes from "./modules/surchargeDate/surchargeDate.routes.js";
import surchargeNightRoutes from "./modules/surchargeNight/surchargeNight.routes.js";
import vehicleRoutes from "./modules/vehicle/vehicle.routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { requireAdmin } from "./middlewares/requireAdmin.js";

const app = express();

// Sirf CLIENT_URL me likhay hue frontend URLs ko allow karo
app.use(cors({ origin: env.clientUrls }));
app.use(express.json({ limit: "20mb" }));

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Elite Rides API is running" });
});

// Upload ki hui images (car photos) browser me dikhane ke liye
app.use("/uploads", express.static(env.uploadsFolder));

// Module routes
app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);

// Website (customer booking) ke public routes, in par login nahi
app.use("/api/public", publicBookingRoutes);

// In se niche ke saare routes login ke peeche hain
app.use("/api/settings", requireAdmin, settingRoutes);
app.use("/api/vehicles", requireAdmin, vehicleRoutes);
app.use("/api/dropdown-addresses", requireAdmin, dropdownAddressRoutes);
app.use("/api/ban-addresses", requireAdmin, banAddressRoutes);
app.use("/api/congestion-addresses", requireAdmin, congestionAddressRoutes);
app.use("/api/fixed-prices", requireAdmin, fixedPriceRoutes);
app.use("/api/surcharge-addresses", requireAdmin, surchargeAddressRoutes);
app.use("/api/surcharge-dates", requireAdmin, surchargeDateRoutes);
app.use("/api/surcharge-night", requireAdmin, surchargeNightRoutes);
app.use("/api/coupons", requireAdmin, couponRoutes);
app.use("/api/quotes", requireAdmin, quoteRoutes);
app.use("/api/bookings", requireAdmin, bookingRoutes);

// Error handler hamesha sab se last me
app.use(errorHandler);

export default app;
