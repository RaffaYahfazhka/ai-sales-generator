# AI Sales Generator - Project Documentation

This document outlines the approach, tools, architecture, and logic used in building the AI Sales Generator application.

## 1. Project Overview & Approach

**Goal:** Build a robust, production-ready SaaS application that generates high-converting sales landing pages using AI, persists the data, and allows users to export the final result as a standalone HTML file.

**Approach:**
- **Iterative Development:** Started with a "dummy mode" to bypass complex authentication flows and validate the core AI generation loop quickly.
- **Progressive Enhancement:** Once the core functionality (AI Generation -> Preview -> Export) was stable, we re-introduced production-grade requirements like Supabase Auth and Row Level Security (RLS).
- **Premium UX/UI:** Prioritized a "Glassmorphism" design system with smooth animations (using Framer Motion) to give the application an enterprise/premium feel.

## 2. Tech Stack & Tools

*   **Framework:** **Next.js 14+ (App Router)** - Used for both frontend UI and backend API routes.
*   **Styling:** **Tailwind CSS** - For utility-first styling, enabling rapid UI development.
*   **Animations:** **Framer Motion** - For fluid page transitions, hover effects, and entrance animations.
*   **Icons:** **Lucide React** - Clean, modern SVG icons.
*   **Authentication & Database:** **Supabase**
    *   `@supabase/ssr` for secure server-side rendering auth.
    *   PostgreSQL for storing user-generated sales pages.
    *   **Service Role Key** utilized in the API route to ensure data persists securely even if complex client-side RLS policies temporarily block inserts.
*   **AI Integration:** **NVIDIA API (moonshotai/kimi-k2.5)**
    *   Accessed via the standard `openai` Node SDK by overriding the `baseURL`. This allowed us to leverage advanced reasoning models effortlessly.

## 3. Core Logic & Workflow

### A. Authentication Flow
1.  Users log in or sign up via `src/app/login/actions.ts` using Supabase Auth.
2.  Sessions are managed via cookies.
3.  Protected routes (like `/dashboard`) verify the `user` object server-side before rendering.

### B. AI Generation Logic (`/api/generate`)
1.  **Input:** The user submits product details (Name, Price, Description, Features, Target Market) via the `/generate` form.
2.  **Prompt Engineering:** The API route constructs a strict prompt demanding *only* JSON output from the AI.
3.  **Parsing:** The response is stripped of any markdown formatting (e.g., ` ```json `) to ensure `JSON.parse()` doesn't fail.
4.  **Database Persistence:** Once parsed, the data is saved to the `sales_pages` table in Supabase using the `adminClient` to bypass any restrictive RLS policies during the creation phase.
5.  **Redirection:** The API returns the new record's ID, and the client redirects to the Preview page.

### C. Preview & Export (`/preview/[id]`)
1.  **Data Fetching:** The page attempts to fetch the generated data from Supabase. If the database fetch fails (e.g., network issue), it gracefully falls back to `localStorage`.
2.  **Rendering:** The data is injected into a beautifully styled, responsive React component template.
3.  **HTML Export:** The `handleExportHtml` function constructs a raw HTML string. It injects the dynamic AI data into a standalone HTML template that includes Tailwind CSS via CDN and Google Fonts. It then creates a `Blob` and triggers a browser download, providing the user with a ready-to-deploy `.html` file.

## 4. UI/UX Considerations
*   **Hydration Safety:** Implemented `mounted` state checks on dynamic components (like date rendering or alternating text) to prevent Next.js hydration mismatch errors.
*   **Interactive Feedback:** Added loading spinners (`Loader2`), focus rings on inputs, and hover translations (`-translate-y-1`) on cards to make the app feel responsive and "alive".
*   **Error Handling:** Both the API and client forms have structured error catching to display user-friendly messages rather than failing silently.
