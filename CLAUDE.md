# Elite Rides – Project Rules

Har naya task shuru karne se pehle yeh file poori parho aur in rules ko follow karo.

## Project Structure
- `admin/` – frontend (React admin dashboard)
- `client/` – public website + customer booking widget (React, port 5174, `/api/public/...` use karta hai)
- `server/` – backend (Node + Express + MongoDB)

## Tech Stack (MERN)
- MongoDB, Express, React, Node.js
- TypeScript (pure project me, **bilkul basic**)
- React Query (server data fetching/caching)
- TanStack Table (tables)
- Zod (validation)
- Tailwind CSS (styling)
- Multer (file upload)
- React Hook Form (forms)

## IMPORTANT: Packages
- **Koi bhi new package install karne se pehle user se permission lena MUST hai.**
- Pehle batao: kaunsa package, kyun chahiye, aur kya existing stack se kaam ho sakta hai.
- Permission ke baghair `npm install` / `npm i` kabhi mat chalao.

## Coding Style (Beginner Friendly)
Code aisa likho ke koi beginner bhi baad me samajh kar modify kar sake. AI-generated/"clever" code nahi, simple code.

- Simple aur seedha code likho, chhote functions, ek function = ek kaam.
- Clear naam rakho (`getAllCars`, `createBooking`), short forms/abbreviations avoid karo.
- Advanced tricks avoid karo: nested ternaries, heavy chaining, `reduce` tricks, complex one-liners.
- Simple `if / else`, `for` / `map`, `async / await` use karo.
- Har file/function ke upar chhota simple comment likho ke yeh kya karta hai.
- Duplicate code kam rakho lekin over-engineering mat karo (no unnecessary abstractions).

## TypeScript Rules (Basic Only)
- Sirf basic TS: `type`, `interface`, basic types (`string`, `number`, `boolean`, arrays), optional `?`.
- Avoid: generics (jab tak bilkul zaroori na ho), conditional types, mapped types, utility-type gymnastics, decorators, enums, `any` (use `unknown` ya proper type).
- Types ko simple rakho, aur `types` file/folder me alag rakho.
- Function parameters aur return types likho.

## Backend Architecture: Layered + Module Based
Har feature ek **module** hai (e.g. `car`, `booking`, `user`). Har module ke andar layers:

```
server/
  src/
    modules/
      car/
        car.model.ts        # Mongoose schema/model (database structure)
        car.validation.ts   # Zod schemas (input validation)
        car.repository.ts   # Database queries only (find, create, update, delete)
        car.service.ts      # Business logic (rules, calculations)
        car.controller.ts   # req/res handle karna, service call karna
        car.routes.ts       # Express routes
        car.types.ts        # TypeScript types
      booking/
        ...
    middlewares/            # auth, error handler, validate, multer upload
    config/                 # env, db connection
    utils/                  # chhote helper functions
    app.ts                  # express app setup
    server.ts               # server start
```

Layer rules (flow: routes -> controller -> service -> repository -> model):
- **Routes**: sirf URL ko controller se jodta hai (+ middlewares like validate/auth).
- **Controller**: request lo, service call karo, response bhejo. Isme business logic nahi.
- **Service**: saari business logic. Direct `req`/`res` use nahi.
- **Repository**: sirf database queries. Business logic nahi.
- **Model**: sirf schema.
- Ek module doosre module ki service use kar sakta hai, lekin doosre module ka repository/model directly nahi.
- Validation Zod se, route par middleware ke zariye.
- Errors ek central error handler middleware me handle karo.
- File upload Multer se, `middlewares/` me config.

## Frontend (admin/)
- Folder structure bhi feature/module wise rakho (e.g. `features/cars/`: components, hooks, api, types).
- API calls ek alag `api` file me; React Query hooks (`useQuery`, `useMutation`) un par bana kar use karo.
- Forms: React Hook Form + Zod.
- Tables: TanStack Table.
- Styling: Tailwind CSS classes (alag CSS files avoid karo).
- Components chhote rakho, ek component = ek kaam.

## Task Workflow
1. Yeh file parho.
2. Task samjho; agar kuch unclear ho to code likhne se pehle poocho.
3. Existing code/structure dekho aur usi style me kaam karo.
4. Naya package chahiye? Pehle permission lo.
5. Simple, beginner-friendly code likho.
6. Kaam ke baad batao ke kaunsi files banayi/badli gayi.
