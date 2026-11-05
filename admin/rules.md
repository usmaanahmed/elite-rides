# Project Rules

## Tech Stack

- **React JS** – UI library
- **TypeScript** – type safety
- **React Query** – server state, data fetching and caching
- **Axios** – HTTP client for API calls
- **React Hook Form** – form handling
- **Zod** – form and data validation
- **Redux Toolkit** – global client state
- **TanStack Table (React Table)** – data tables
- **Tailwind CSS** – styling
- **Vanilla CSS** – only where Tailwind CSS is not a good fit

## Rules

### 1. Beginner-friendly code
Code must be easy for a beginner developer to read, understand and modify.
- Use clear, descriptive names for variables, functions and components.
- Keep functions and components small and focused on one job.
- Prefer simple, readable code over clever or short code.

### 2. No advanced TypeScript
Do not use advanced TypeScript features. Stick to the basics:
- Use `type` / `interface` for props, API responses and form values.
- Use simple unions (e.g. `'active' | 'inactive'`) and arrays.
- Avoid complex generics, conditional types, mapped types, `infer`, and deep utility-type chains.

### 3. Comment complex logic
Whenever logic is not obvious at first glance, add a comment explaining **what** it does and **why**.

### 4. Reusable components
Build reusable components and place them in the `shared` folder. Examples:
- Buttons
- Stats cards
- Forms
- Inputs (text, select, checkbox, etc.)
- Sidebar
- Topbar

Every component should be reusable and configurable through props.

### 5. Feature-based folder structure
Organize code by feature. Reusable components go in the `shared` folder.

```
src/
├── features/
│   ├── drivers/
│   │   ├── components/   # components used only by this feature
│   │   ├── api/          # axios calls + react query hooks
│   │   ├── types/        # feature types
│   │   └── pages/        # feature pages
│   └── rides/
│       └── ...
├── shared/
│   ├── components/       # buttons, inputs, cards, sidebar, topbar, table, etc.
│   ├── hooks/
│   └── utils/
├── store/                # redux toolkit store and slices
└── App.tsx
```

### 6. Ask before installing packages
Before installing any new plugin or package, always ask first.
