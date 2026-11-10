// Express ke Request type me "admin" field add karta hai (requireAdmin middleware isay bharta hai)
import { AuthenticatedAdmin } from "../modules/auth/auth.types.js";

declare global {
  namespace Express {
    interface Request {
      admin?: AuthenticatedAdmin;
    }
  }
}
