// Stripe card payment ki business logic.
// Customer Stripe ke apne (hosted) checkout page par card dalta hai, card ki details hamare server par kabhi nahi aatin.
// Booking "paid" sirf Stripe ke webhook se hoti hai, frontend ke kehne par kabhi nahi.
import Stripe from "stripe";
import { env } from "../../config/env.js";
import { stripe } from "../../config/stripe.js";
import { AppError } from "../../utils/AppError.js";
import { recordCardPayment } from "../booking/booking.service.js";
import { CheckoutBookingInfo } from "./payment.types.js";

// Stripe ek payment me kam az kam itne pence leta hai (GBP me 30p)
const MIN_AMOUNT_IN_PENCE = 30;

// true ho to card payment chal sakti hai (dono Stripe keys .env me hain)
export function isCardPaymentReady(): boolean {
  return stripe !== null && env.stripeWebhookSecret !== "";
}

// Customer ka thank-you page jahan booking dikhti hai
function buildBookingPageUrl(accessToken: string): string {
  return `${env.websiteUrl}/booking/confirmation?ref=${accessToken}`;
}

// Stripe checkout page banata hai aur us ka link wapas karta hai (customer ko wahan bhejna hai)
export async function createCheckoutSession(info: CheckoutBookingInfo): Promise<string> {
  if (!stripe) {
    throw new AppError("Card payment is not available right now. Please call us to book.", 400);
  }

  const amountInPence = Math.round(info.amount * 100);
  if (amountInPence < MIN_AMOUNT_IN_PENCE) {
    throw new AppError("This amount is too small to pay by card.", 400);
  }

  const bookingPageUrl = buildBookingPageUrl(info.accessToken);

  let session: Stripe.Checkout.Session;
  try {
    session = await stripe.checkout.sessions.create({
      // Kaun se payment methods dikhen (card, Apple Pay...) yeh Stripe dashboard ki settings se hota hai
      mode: "payment",
      customer_email: info.customerEmail,
      client_reference_id: info.bookingNumber,
      // Webhook isi bookingId se booking dhoondta hai
      metadata: { bookingId: info.bookingId },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: env.stripeCurrency,
            unit_amount: amountInPence,
            product_data: { name: `Chauffeur booking ${info.bookingNumber}` },
          },
        },
      ],
      success_url: bookingPageUrl + "&payment=done",
      cancel_url: bookingPageUrl + "&payment=cancelled",
    });
  } catch (error) {
    // Stripe ka asli error (e.g. galat key) sirf server log me, customer ko simple message
    console.log("Stripe checkout error for booking " + info.bookingNumber, error);
    throw new AppError("Card payment could not be started. Please try again or call us.", 502);
  }

  if (!session.url) {
    throw new AppError("Card payment could not be started. Please try again.", 502);
  }
  return session.url;
}

// Stripe ka bheja hua event parhta hai. Signature galat ho (kisi aur ne bheja) to error
function readStripeEvent(rawBody: Buffer, signature: string): Stripe.Event {
  if (!stripe || env.stripeWebhookSecret === "") {
    throw new AppError("Card payment is not set up", 400);
  }
  try {
    return stripe.webhooks.constructEvent(rawBody, signature, env.stripeWebhookSecret);
  } catch {
    throw new AppError("Invalid Stripe signature", 400);
  }
}

// POST /api/payments/stripe/webhook: Stripe batata hai ke payment ho gayi
export async function handleStripeWebhook(rawBody: Buffer, signature: string): Promise<void> {
  const event = readStripeEvent(rawBody, signature);

  // Sirf "checkout poora hua" wale events chahiye, baaki ignore.
  // "async_payment_succeeded" un methods ke liye hai jin ki payment der se pakki hoti hai (e.g. bank debit)
  if (event.type !== "checkout.session.completed" && event.type !== "checkout.session.async_payment_succeeded") {
    return;
  }

  const session = event.data.object;
  if (session.payment_status !== "paid") {
    return;
  }

  let bookingId = "";
  if (session.metadata && session.metadata.bookingId) {
    bookingId = session.metadata.bookingId;
  }
  if (bookingId === "") {
    // Yeh payment hamari kisi booking ki nahi (e.g. Stripe dashboard se bani)
    return;
  }

  const amountPaid = (session.amount_total || 0) / 100;
  await recordCardPayment(bookingId, amountPaid, session.id);
}
