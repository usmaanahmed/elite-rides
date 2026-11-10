# Elite Rides – Project Plan

Source: [TaxiBase CRM Admin Documentation](https://booker.taxibasesoftware.com/elitelondonrides/admin/documentation) (v1.0, 2025)
Plan banaya: 2026-11-07

Yeh project TaxiBase CRM jaisa system hai, lekin **hamara apna MERN stack** par (koi PHP / WordPress plugin nahi) aur **sirf ek company** ke liye (multi-vendor nahi).

---

## 1. Overall Progress

> **Progress rule:** har phase ki progress = (ticked tasks ÷ total tasks) × 100.
> Overall progress = saare phases ke ticked tasks ÷ saare tasks.
> Jab kisi phase ke saare tasks tick ho jayen tab hi us ko **100% / ✅ Done** likho.

**Overall: 94 / 127 tasks = 74%**

| # | Phase / Module | Status | Tasks | Progress |
|---|----------------|--------|-------|----------|
| 0 | Foundation (server + admin setup) | ✅ Done | 5 / 5 | 100% |
| 1 | Admin Auth (login) | ✅ Done | 6 / 6 | 100% |
| 2 | Settings | ✅ Done | 7 / 7 | 100% |
| 3 | Vehicles & Rates | ✅ Done | 11 / 11 | 100% |
| 4 | Addresses (Drop Down, Ban, Congestion) | ✅ Done | 10 / 10 | 100% |
| 5 | Fixed Price Routes | ✅ Done | 6 / 6 | 100% |
| 6 | Surcharges (Address, Date, Night) | ✅ Done | 9 / 9 | 100% |
| 7 | Coupons | ✅ Done | 6 / 6 | 100% |
| 8 | Fare Engine (Quote calculation) | 🟡 In progress | 13 / 14 | 93% |
| 9 | Bookings (admin side) | ✅ Done | 12 / 12 | 100% |
| 10 | Emails + Terms & Conditions | ⬜ Not started | 0 / 6 | 0% |
| 11 | Customer Booking App (public) | 🟡 In progress | 8 / 10 | 80% |
| 12 | Customer Accounts & Portal | ⬜ Not started | 0 / 8 | 0% |
| 13 | Online Payments (Stripe) | ⬜ Not started | 0 / 6 | 0% |
| 14 | Dashboard, Users, Theme | 🟡 UI only | 1 / 6 | 17% |
| 15 | Launch (security, deploy, final test) | ⬜ Not started | 0 / 5 | 0% |

Status meaning: ✅ Done · 🟡 In progress · 🟡 UI only (admin page bana hai lekin fake API / sample data par) · ⬜ Not started

---

## 2. Project Kaise Chalana Hai (Working Rules)

1. **CLAUDE.md pehle** – har task se pehle `CLAUDE.md` parho. Layers, coding style, TypeScript rules wahan hain.
2. **Ek waqt me ek phase** – upar table ki sequence follow karo. Agla phase tab shuru karo jab pichla 100% ho (ya user khud bole).
3. **Module shuru karne se pehle** – us phase ke "Open Questions" (section 6) user se clear karo.
4. **Backend pehle, phir frontend wire** – pehle API banao (model → validation → repository → service → controller → routes), phir admin page ko real API se jodo.
5. **Fake API replace karna** – kai admin pages (addresses, pricing, surcharges, bookings) abhi fake `setTimeout` / sample data use karte hain. Backend ready hone par unhe **vehicles module ke pattern** (`api/` file + `hooks/useXxx.ts` with React Query) par shift karo.
6. **Packages** – koi bhi naya package install karne se pehle permission. Har phase me likha hai ke kaunsa package chahiye ho sakta hai (section 7).
7. **Secrets `.env` me** – Google API key, Stripe keys, SMTP password, JWT secret `server/.env` me rahenge, database/settings page me nahi (single company hai, is liye yeh simple aur safe hai).
8. **Paisa (money)** – amounts pounds me `number` (e.g. `59.5` = £59.50). Har calculation step ke baad ek hi helper `roundMoney()` se 2 decimals par round karo.
9. **Server hi price calculate karega** – frontend se aayi hui price par kabhi trust nahi; booking save karte waqt server dobara quote nikalta hai.
10. **Kaam ke baad** – (a) plan.md me checkbox tick karo, (b) phase ki progress + overall progress update karo, (c) batao kaunsi files bani/badli, (d) user bole to commit.

### Definition of Done (module 100% kab hoga)
1. Backend ki saari layers bani hui (model, validation, repository, service, controller, routes, types)
2. Routes `app.ts` me register + admin auth middleware laga hua (Phase 1 ke baad)
3. Admin page real API se connected (React Query), loading + error states ke saath
4. Is plan me likhe us module ke business rules implement
5. Manually test: sahi data, galat data (validation errors), edit, delete
6. plan.md me tick + progress update

---

## 3. Scope

### In scope (hum banayenge)
- Admin dashboard: addresses, vehicles & rates, fixed price, surcharges, settings, coupons, bookings, customers, users, theme
- Fare engine (docs ka pura fare formula)
- Customer booking app (React) – docs ka "booking widget" hamara apna React app hoga
- Customer portal: register, email verify, login, my account, my bookings, cancel
- Emails (SMTP), Booking Terms & Conditions
- Stripe payments + Pay in car

### Out of scope (nahi banana)
| Docs ka hissa | Kyun skip |
|---|---|
| 11.3 WordPress plugin, shortcodes | PHP / plugin nahi banana |
| 11.4 PHP snippets (`booking.php`, `customer-config.php` etc.), iframe session-bridge | PHP nahi; hamara booking app khud React me hoga |
| 8.10 Multiple Operator Settings (multiple operators, cheapest company price, supplier bidding, supplier deduction %) | Multi-vendor nahi |
| URL me company slug (`/elitelondonrides/...`) | Single company |
| TBMS integration (TBMS keys, TBMS Price URL, "Mileage Calc: TBMS") | TaxiBase ka apna API hai; hum Google se distance nikalenge |
| SendGrid username/password | Sirf SMTP |
| PayPal, Corporate Login, Per Day Rate | Abhi nahi – baad me decide (Open Questions) |

---

## 4. Phases (sequence + tasks + rules)

Sequence ki wajah: docs ka "Recommended Setup Order" (Settings → Vehicles → Rates → Calculation Format → Addresses → Surcharges → Fixed Price → Coupons) + dependencies. Fare Engine tab banega jab us ke saare inputs (vehicles, addresses, surcharges, coupons, settings) ready hon. Bookings fare engine par depend karti hain, aur customer app bookings par.

---

### Phase 0 – Foundation ✅ (5/5 – 100%)
- [x] Server setup: Express, MongoDB connection, env config, CORS
- [x] Middlewares: error handler, Zod validate, Multer upload
- [x] Admin layout: sidebar, topbar, mobile nav, shared components (buttons, inputs, modal, table, cards)
- [x] Router + routes constants + 404 page
- [x] Health check API + API test page

---

### Phase 1 – Admin Auth ✅ (6/6 – 100%)
Admin panel aur admin APIs ko login ke peeche lagana. Pehle is liye ke baqi saare modules shuru se protected banen.

Backend (`modules/admin`, `modules/auth`):
- [x] Admin model (name, email, passwordHash) + pehla admin banane ka seed script
- [x] `POST /api/auth/login`, `GET /api/auth/me`
- [x] `requireAdmin` middleware – saare admin routes par (vehicles bhi)

Frontend:
- [x] Login page (React Hook Form + Zod)
- [x] Token save, protected routes (login nahi to login page), logout button
- [x] Har API request me token header

Rules:
- Email lowercase me save + compare
- Password kabhi plain text me save/return nahi
- Login fail par generic message ("Invalid email or password")

Packages (permission chahiye): `bcryptjs` (password hash), `jsonwebtoken` (login token)

---

### Phase 2 – Settings ✅ (7/7 – 100%)
Docs section 8. Settings ek hi document hai (single company), baqi modules `getSettings()` se parhte hain.

- [x] Setting model (single document) + default values
- [x] `GET /api/settings`, `PUT /api/settings` + Zod validation
- [x] `settingService.getSettings()` (doosre modules ke liye; document na ho to defaults bana de)
- [x] Settings page: **Office** (company name, app name, currency £, company email, from email, site URL) + **Pricing Config**
- [x] Settings page: **Extras / More Option**
- [x] Settings page: **General** + **Discount**
- [x] "Save All Settings" button + success message, real API se connected

Fields (docs ke mutabiq):
- **Pricing Config:** mileage by slabs (on/off), round off (on/off), set price (`per_vehicle` / `single_price`), show card, show pay in car
- **Extras (£):** baby seat per seat, booster seat per seat, meet & greet, luggage per extra item, special luggage per item, wheelchair, return extra price, price per 5 waiting minutes
- **General:** guest login, hourly rate status, is quotation, grace time (minutes), max passengers (default 20), booking number prefix (e.g. `ELR`), block date range, block time range (e.g. 02:00–04:00), booking success redirect URL
- **Discount:** global discount (£ ya %, blank = none), pretend discount (sirf display ke liye crossed-out price – asal fare kam **nahi** hota)

Rules:
- No auto-save; sirf "Save All Settings" par save
- Secret keys yahan nahi (rule 7)
- Website Display settings (8.9) Phase 11 me add honge, Mail ka SMTP Phase 10 me

---

### Phase 3 – Vehicles & Rates ✅ (11/11 – 100%)
Docs sections 3, 4, 5.

Backend:
- [x] Vehicle model + list / create / delete (image upload ke saath)
- [x] Missing fields add: `displayOrder`, `fixedPrice` (base fare), `hourlyRate`; list `displayOrder` ke hisaab se sorted
- [x] Edit vehicle API (`PUT /api/vehicles/:id`, nayi image optional)
- [x] Rates API: mileage bands + slab bands (`PUT /api/vehicles/:id/rates`)
- [x] Calculation Format API: har vehicle ka premium type (`percent` / `fixed`) + value, ek saath save

Frontend:
- [x] Vehicles table + Add modal + Delete (real API)
- [x] Edit vehicle modal
- [x] "£ Rates" modal: Mileage / Slabs choose, fixed price, hourly rate, bands (+ Add Item), "Save Rates"
- [x] "Add Calculation Format" modal: har vehicle ke liye value + Price/% radio
- [x] Hourly Rate page ko `vehicle.hourlyRate` se jodna (ya page hata dena – Open Question #2) — page hata di gayi, hourly rate ab "£ Rates" modal ke andar hai
- [x] `VEHICLE_TYPES` constant hata kar pricing forms me vehicles API (`useVehicles`) use karna

Rules:
- Display Order: kam number pehle dikhta hai
- Seats/luggage: positive whole numbers
- Hourly rate £0.00 = hourly hire us vehicle ke liye band
- **Mileage bands:** pehla band 1 mile se shuru; bands continuous (har band ka `from` = pichle band ka `to`), koi gap nahi; rate > 0
- **Band match:** bands ko `fromMiles` se sort karo, pehla band jis me `miles <= toMiles` ho woh use karo (is tarah 20 mile 1–20 wale band me aayega, 1 mile se kam wala trip pehle band me)
- **Slab rates:** har range ki flat price, per-mile nahi
- **Calculation Format:** `percent` = base fare (miles × rate + fixed price) ka % ; `fixed` = flat £ ; base vehicle (Saloon) = 0
  - Note: docs ka text "% of base mileage fare" kehta hai, lekin docs ki saari examples % ko (mileage + fixed price) par lagati hain – hum examples follow karenge
- Delete se pehle: active/pending bookings check (Phase 9 me lagega) aur us vehicle ke fixed price routes bhi delete/check

---

### Phase 4 – Addresses ✅ (10/10 – 100%)
Docs section 2.

Drop Down Addresses (airports, stations):
- [x] Backend CRUD (address, comparableValue, pickupCharge, dropoffCharge, type)
- [x] Admin page + Add modal
- [x] Page ko real API se jodna + Edit / Delete
- [x] CSV Import + Export — Export CSV button, Import CSV button (`papaparse` se parse, `POST /api/dropdown-addresses/import`), galat rows ka report modal (`ImportResultModal`)

Ban Addresses:
- [x] Backend CRUD
- [x] Admin page + Add modal
- [x] Real API se jodna + Delete

Congestion Addresses:
- [x] Backend CRUD (postcode, price)
- [x] Admin page + Add/Edit modal + sidebar item
- [x] Real API se jodna

Rules:
- `comparableValue` **unique** (lowercase me save) – e.g. `tw6`, `gatwick`
- Address match: customer ke address (lowercase) me `comparableValue` ho to match
- Pickup aur dropoff charge alag; khaali na chhodo, none ho to £0.00
- Ban address match → booking/quote reject, customer ko error message
- Congestion: postcode prefix (e.g. `EC1`, `WC2`, `SW1`) – pickup, via ya dropoff postcode match ho to charge (Open Question #6)
- Changes foran live (koi cache nahi)

Packages (permission chahiye): `papaparse` – CSV import (addresses me commas hote hain, hand-written split se toot jayega). Export hum khud likh sakte hain.

---

### Phase 5 – Fixed Price Routes ✅ (6/6 – 100%)
Docs section 6.

- [x] Backend model: ek row = (pickup, dropCode, vehicle, fare) – CSV format se match karta hai
- [x] CRUD API + "Delete All"
- [x] Admin page + Add modal (ek route par har vehicle ki price, real API)
- [x] Real API se jodna + Edit / Delete / Delete All (confirm dialog ke saath)
- [x] CSV Import / Export / Download Template / Format Guide
- [x] `findFixedPrice(pickup, dropoff, vehicleId)` service function (fare engine ke liye)

Rules:
- **Priority:** fixed price match ho to mileage calculation skip; surcharges aur extras phir bhi lagenge
- Fixed price par Calculation Format premium **nahi** lagega (fare pehle se per vehicle hai)
- Match: pickup postcode (spaces hata kar, uppercase) / drop code keyword (case-insensitive) customer ke address me ho
- CSV columns: `pickup,drop_code,fare,vehicle` (vehicle = vehicle name)
- CSV import me galat rows skip + report (kaunsi row kyun fail hui)

---

### Phase 6 – Surcharges ✅ (9/9 – 100%)
Docs section 7. Teeno types **stack** hoti hain (ek booking par teeno lag sakti hain).

Surcharge Addresses:
- [x] Backend CRUD (address, fromTime, toTime, price, status)
- [x] Admin page + Add modal (fake API)
- [x] Form me price + status add, real API se jodna, edit/delete

Surcharge On Date:
- [x] Backend CRUD (date, amountType, amount, optional time window, status)
- [x] Admin page + Add modal (fake API)
- [x] Real API se jodna + type decide (Open Question #3: £/% dono, time window optional)

Surcharge Night (global):
- [x] Backend: single document (startTime, endTime, type £/%, amount, status)
- [x] Admin page + sidebar item

Shared:
- [x] Helper `isTimeInWindow(time, from, to)` – raat wali window (22:00–06:00) support

Rules:
- Time window midnight cross kar sakti hai (from > to)
- Status Inactive = surcharge apply nahi (delete ke bajaye inactive karna better)
- Night surcharge saari vehicles aur routes par
- Date surcharge pickup date par check hoga

---

### Phase 7 – Coupons ✅ (6/6 – 100%)
Docs section 9.

- [x] Coupon model (code, discountType, discountValue, expiryDate, usageLimit, usedCount, status)
- [x] CRUD API + stats API (total coupons, active, total usage, total discount given)
- [x] `validateCoupon(code, pickupDate)` service
- [x] All Coupons page: 4 stat cards + TanStack table + empty state ("Create Your First Coupon")
- [x] Create / Edit coupon form
- [x] Sidebar me "Coupons" section

Rules:
- Code: sirf uppercase letters + numbers (`SAVE10`, `WELCOME20`), unique
- Type: `percent` ya `fixed` (£)
- Usage limit blank ya 0 = unlimited
- Valid tab: status Active + expiry nahi guzri + usedCount < usageLimit
- `usedCount` booking confirm hone par +1 (Phase 9)
- Disable = Inactive (delete nahi), dobara enable ho sakta hai

---

### Phase 8 – Fare Engine 🟡 (13/14 – 93%)
Docs section 10. **Project ka dil** – saari pricing yahan calculate hogi. Naya module `modules/quote` jo doosre modules ki **services** use karega (repository/model nahi).

- [ ] Distance service: Google Directions/Distance Matrix API (built-in `fetch`, koi package nahi) – pickup → via → dropoff, miles me — **code ready, real Google key se live test baqi (server/.env me GOOGLE_MAPS_API_KEY)**
- [x] Checks: ban address, block date/time range, passengers ≤ vehicle seats aur ≤ max passengers
- [x] Fixed price route match
- [x] Base fare: mileage band (ya slab) × miles + vehicle fixed price
- [x] Hourly hire: hours × vehicle hourly rate (sirf jab Hourly Rate Status on)
- [x] Calculation Format premium
- [x] Location charges: drop down pickup/dropoff charge + congestion
- [x] Surcharges: night + date + address
- [x] Extras: baby seat, booster, meet & greet, luggage, special luggage, wheelchair
- [x] Return journey: dono legs alag calculate + Return Extra Price
- [x] Global discount + coupon + round off
- [x] `POST /api/quotes` – saari vehicles ki price + breakdown (har line alag)
- [x] Tests: docs ki examples (neeche) – Node ka built-in `node:test` (koi package nahi)
- [x] Admin "Price Checker" page – admin quote try kar sake

**Calculation order:**
```
1. Checks         → ban address / blocked date-time / passengers  (fail = error)
2. Distance       → miles (Google)
3. Base fare      → fixed price route mila?  → woh fare (premium nahi)
                    warna hourly?            → hours × hourlyRate
                    warna                    → miles × bandRate (ya slab price) + vehicle fixedPrice
                                               + Calculation Format premium
4. Location       → + drop down pickup charge + dropoff charge + congestion
5. Surcharges     → + night + date + address
6. Extras         → + baby × seats + booster × seats + meet&greet + luggage × items
                    + special luggage × items + wheelchair
7. Return leg     → same steps return date/time ke saath + Return Extra Price
8. Discounts      → − global discount − coupon
9. Round off      → (setting on ho to) nearest whole pound
```

**Acceptance tests (docs se – yeh sab pass hone chahiye):**

| Example | Calculation | Total |
|---|---|---|
| Saloon 10 mi, din | £25.00 + £2.00 + 0% | **£27.00** |
| Executive 25 mi → Heathrow T2, din | £57.50 + £2.00 + £29.75 (50%) + £7.00 dropoff | **£96.25** |
| People Carrier 15 mi, raat, 1 baby seat, meet & greet | £37.50 + £2.00 + £7.90 (20%) + £5 night + £5 baby + £5 M&G | **£62.40** |
| 8 Seater Mini Bus 30 mi, Stansted pickup, Christmas | £69.00 + £2.00 + £28.40 (40%) + £10 pickup + £20 date | **£129.40** |
| Coupon SAVE10 on £89.25 | − £8.93 | **£80.32** |
| Coupon FIRST5 on £27.00 | − £5.00 | **£22.00** |
| Saloon 10 mi, raat (£5 night) | £25.00 + £2.00 + £5.00 | **£32.00** |

Test bands: 1–20 £2.50 · 20–50 £2.30 · 50–100 £2.00 · 100–500 £1.80

---

### Phase 9 – Bookings (admin side) ✅ (12/12 – 100%)

- [x] Bookings table + details UI (sample data)
- [x] Booking model (neeche fields)
- [x] Booking number generator (prefix + counter, e.g. `ELR001664`) – counter collection
- [x] Create booking API – server dobara quote nikalta hai (rule 9)
- [x] List API (search, filters: date/status/payment, pagination) + details API
- [x] Status update + cancel API
- [x] Quotation mode: "Is Quotation" on ho to booking = quote request, admin approve kare
- [x] Coupon `usedCount` +1 jab booking confirm ho
- [x] Waiting time charge add karna (per 5 min) – job ke baad admin add kare
- [x] Bookings page real API se jodna
- [x] Admin "New Booking" form (Price Checker / quote use kare)
- [x] Vehicle delete guard (active bookings wali vehicle delete na ho)

Booking fields: bookingNumber, customer (name, email, phone, customerId optional), tripType (`one_way` / `return` / `hourly`), pickup, via[], dropoff, pickupDate, pickupTime, passengers, luggage, vehicle, extras, flightNo, arrivalFrom, return details, hourlyDuration, price breakdown (snapshot), coupon, paymentMethod, paymentStatus (`pending` / `partially_paid` / `paid`), amountPaid, status (`quote_requested` / `pending` / `confirmed` / `completed` / `cancelled`), notes

Rules:
- Price breakdown booking ke andar **snapshot** save – baad me rates badlen to purani booking ki price na badle
- Booking number unique aur sequential

---

### Phase 10 – Emails + Terms & Conditions (0/6 – 0%)
Docs sections 8.2, 8.12.

- [ ] Mail service (SMTP details `.env` se)
- [ ] Email templates: booking confirmation (customer), new booking notification (company), cancellation (customer + company)
- [ ] Terms & Conditions module: save / get + public GET API
- [ ] Admin T&C editor page + Preview button
- [ ] T&C emails me lagana (default "Important Information" text ki jagah; T&C save nahi to default hi rahe)
- [ ] Settings me "Send test email" button

Rules:
- TLS / port 587 default
- Email fail ho to booking fail **nahi** honi chahiye (log karo, booking save rahe)
- Public T&C page par Print / Save as PDF (browser print se)

Packages (permission chahiye): `nodemailer` (emails); rich text editor ke liye ek package **ya** simple textarea (Open Question #13)

---

### Phase 11 – Customer Booking App 🟡 (8/10 – 80%)
Docs section 11 ka booking widget – lekin PHP/iframe ke bajaye hamara React app. Website `client/` folder me hai (widget home page ke hero me), same stack aur same rules (CLAUDE.md). Website port 5174 par chalti hai (server ke `CLIENT_URL` me shamil).

- [x] App setup (Vite + React + TS + Tailwind + React Query) – admin wale hi packages
- [x] Public APIs (`/api/public/...`, login nahi): vehicles (public fields), drop down addresses, quote, create booking, public settings
- [x] Journey form: trip type (one way / return / hourly), pickup/dropoff autocomplete (Google Places – script tag, koi npm package nahi), via points, date/time, passengers, luggage
- [x] Vehicle list prices ke saath (quote)
- [x] Extras + passenger details + flight no / arriving from
- [x] Coupon apply
- [x] Checkout: Pay in car + booking create
- [x] Thank-you page (booking summary) + "Booking Success Redirect URL" option with params
- [ ] Website Display settings (8.9) + public T&C page — **Phase 10 (T&C module) ke baad**
- [ ] Main website par lagane ka tareeqa (link / iframe snippet) — widget hamari apni website (`client/`) me laga hua hai; kisi doosri site par lagana ho tab snippet banega

Rules:
- Drop down addresses (airports) booking form me alag group me
- Guest booking sirf tab jab "Guest Login" setting on
- Redirect URL params: `booking_number` (hamesha), customer_name, trip_type, pickup, dropoff, via (`|` se alag), pickup_date (YYYY-MM-DD), pickup_time (HH:MM), passengers, vehicle, distance / hourly_duration, flight_no, arrival_from, return_* fields, payment_method, payment_status, currency, total_amount, amount_paid, balance_due
  - Khaali values nahi bhejni; **email aur phone kabhi URL me nahi**; pehle se mojood query string rakhni
- Pretend discount sirf display (crossed-out price)

---

### Phase 12 – Customer Accounts & Portal (0/8 – 0%)
Docs section 11.2.

- [ ] Customer model (name, email, phone, passwordHash, isVerified, isActive)
- [ ] Register + verification email (time-limited secure link) + resend activation
- [ ] Login / logout / me (sirf verified **aur** active customer)
- [ ] Forgot / reset password (link 60 minute valid)
- [ ] My Account (name, email, phone, password edit)
- [ ] My Bookings list + Cancel + cancellation emails
- [ ] Logged-in customer ki details checkout par prefill
- [ ] Admin → Customers page: list, bookings dekhna, activate/deactivate, mark verified, reset password

Rules:
- Email unique, case-insensitive check
- Verify hone se pehle login nahi; verified + Active dono zaroori (do alag switches)
- **Cancel sirf pickup se 3 ghante pehle tak**; us ke baad Cancel button nahi dikhega (customer operator se contact kare)
- Cancelled / completed booking par Cancel button nahi

---

### Phase 13 – Online Payments (0/6 – 0%)
Docs sections 8.4, 8.5.

- [ ] Stripe setup (keys `.env` me; test keys development me)
- [ ] Booking par Stripe payment (Checkout session / payment intent)
- [ ] Webhook (signature verify) → payment status update
- [ ] Booking app me Card option ("Show Card" setting)
- [ ] Admin booking details me payment info
- [ ] Cancel par refund ka rule (Open Question #12)

_Optional (count nahi): PayPal – Open Question #11_

Rules:
- Payment status sirf webhook se "paid" ho, frontend ke kehne par nahi
- Stripe private key kabhi frontend par nahi

Packages (permission chahiye): `stripe` (server)

---

### Phase 14 – Dashboard, Users, Theme 🟡 (1/6 – 17%)
Docs me in ka detail nahi – sirf menu me naam hain.

- [x] Dashboard UI (sample data)
- [ ] Dashboard APIs (revenue, bookings, payment methods, peak hours, top routes, vehicle mix) + wire
- [ ] Admin users management (admin add / remove)
- [ ] Drivers – basic (Open Question #10)
- [ ] Theme: booking app ke colors + logo
- [ ] Help & Support page

---

### Phase 15 – Launch (0/5 – 0%)

- [ ] Security: production CORS, login rate limit, saari routes par validation check
- [ ] Docs ka Final Checklist (10.3) chalana: company info, Stripe live keys, Google key, saari vehicles with rates, premiums, airports, night surcharge, bank holidays, extras, SMTP test
- [ ] Production build + deploy (server, admin, booking app), MongoDB Atlas, uploads storage
- [ ] Database backup plan
- [ ] End-to-end live test booking

---

## 5. Docs ki Coverage Gaps
Docs in cheezon ka sirf naam leti hain, detail nahi: Dashboards, Theme, Users (admin / driver accounts), drivers ka dispatch. Inke liye hum khud simple version design karenge (Phase 14).

---

## 6. Open Questions (module shuru karne se pehle decide karna)

| # | Phase | Sawal | Recommendation |
|---|---|---|---|
| 1 | 3 | Vehicle model docs se alag hai: hamare paas `description`, `handLuggageCapacity`, `discountRate`, `returnDiscountRate`, `tbmsId` hain; docs me `displayOrder`, `fixedPrice`, `hourlyRate` hain | Mojooda fields rakho, docs wale add karo. `tbmsId` ko simple reference number samjho |
| 2 | 3 | Alag "Hourly Rate" page rakhna hai ya docs ki tarah hourly rate "£ Rates" modal me? | Docs follow karo (vehicle ke andar), page hata do |
| 3 | 6 | Surcharge On Date: docs me fixed £ (time nahi); hamari UI me % + time window | Type £/% dono support, time window optional |
| 4 | 6 | Surcharge Address pickup par lage, dropoff par, ya dono? | Dono me se koi bhi match ho |
| 5 | 5 | Fixed price A→B, B→A (ulta) par bhi lage? | Nahi, sirf usi direction me (zaroorat ho to alag row) |
| 6 | 4 | Congestion: docs "route passes through" kehti hain (mushkil); simple version pickup/via/dropoff postcode match | Simple version |
| 7 | 8 | Global discount aur coupon ka order; coupon extras samet total par? | Pehle global discount, phir coupon, dono pure total par |
| 8 | 8 | Miles aakhri band se zyada hon (e.g. 600 mi) to? | Aakhri band ka rate |
| 9 | 8 | "Set Price: Addition to single price" mode kis vehicle ka rate table use kare? | Pehle sirf "Per Vehicle" banao |
| 10 | 14 | Drivers: sirf accounts + booking par driver assign, ya driver app/dispatch bhi? | Basic: driver list + assign |
| 11 | 13 | PayPal chahiye? | Abhi nahi |
| 12 | 13 | Cancel par refund automatic ya admin manually? | Admin manually (Stripe dashboard) |
| 13 | 10 | T&C ke liye rich text editor package ya simple textarea? | Shuru me textarea |
| 14 | 11 | Customer booking app isi repo me naya folder (`booking/`)? | ✅ Tay: mojooda `client/` website hi booking app hai |
| 15 | 3/8 | Return journey: `returnDiscountRate` (vehicle) vs "Return Extra Price" (settings) – dono chahiye? | Dono rakho: return leg par pehle discount, phir extra |
| 16 | – | `admin/rules.md` me Axios aur Redux Toolkit likha hai, `CLAUDE.md` me nahi, aur dono installed nahi | CLAUDE.md follow karo: `fetch` + React Query, Redux nahi |
| 17 | – | Corporate Login aur Per Day Rate (daily hire) chahiye? | Abhi nahi |

---

## 7. Packages Jo Aage Chahiye Honge (permission pending – abhi kuch install nahi)

| Phase | Package | Kyun | Bina package ke? |
|---|---|---|---|
| 1 | `bcryptjs` ✅ Phase 1 me use ho raha hai | Password hash | Node `crypto.scrypt` se ho sakta hai, lekin bcrypt zyada seedha |
| 1 | `jsonwebtoken` ✅ Phase 1 me use ho raha hai | Login token | DB me random session token bhi ho sakta hai |
| 4, 5 | `papaparse` ✅ Phase 4 me install ho gaya (admin) | CSV import (quoted commas) | Hand-written parser addresses par toot jayega |
| 10 | `nodemailer` | SMTP emails | Nahi |
| 10 | Rich text editor (optional) | T&C editor | Textarea se kaam chal sakta hai |
| 13 | `stripe` | Payments | Nahi |
| 8 | – | Google distance | Built-in `fetch` – package nahi |
| 8 | – | Tests | Built-in `node:test` – package nahi |
