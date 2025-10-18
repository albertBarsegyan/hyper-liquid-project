# Project Rules and Configuration

> This file defines coding and architectural rules for the Continue VS Code extension.

---

## 🧠 General Context

You are working on a **React + TypeScript crypto application** that uses:
- **Vite** as the build tool
- **Tailwind CSS** for styling
- **React Query** for data fetching and state management
- A **feature-based modular structure** located under `src/modules/`

---

## 🏗️ Architecture Rules

1. The project uses a **feature-based structure**: src/
   modules/
   auth/
   dashboard/
   shared/
   Each module contains:
- `components/`
- `hooks/`
- `services/`
- `types/`

2. Use **strict TypeScript** typing everywhere.
3. Prefer **functional components** with React Hooks — no class components.
4. Reuse UI components from `src/components/ui/` whenever possible.
5. Follow **React best practices**:
- Keep components small and readable.
- Use `useCallback`, `useMemo`, and `React.memo` when needed.
- Avoid prop drilling; use context or React Query for shared state.
6. Keep imports clean using **path aliases**:
- `@/*`
- `@/modules/*`
- `@/types/*`
- `@/routes/*`
- `@/styles/*`
- `@/pages/*`

---

## 🧩 Included Files

The Continue extension should focus on: src/**/,
package.json,
tsconfig.json,
vite.config.ts,
eslint.config.js,
components.json,
README.md,
vercel.json

---

## 🚫 Excluded Files

Ignore these paths and patterns: node_modules//*,
dist//,
.git/**/,
.vscode//*,
.continue//,
**/.log,
**/.tmp,
**/.cache,
/coverage//,
/.next//,
/build//,
/out//,
/.turbo//,
**/pnpm-lock.yaml,
**/yarn.lock,
**/package-lock.json,
**/.env.local,
**/.env..local,
*/public/dliqd.png,
/src/assets/fonts//,
/src/assets/images//,
/src/assets/favicon//



---

## ⚙️ Continue Context Settings

- **Max tokens:** 200000
- **Max files:** 100
- **Respect ignore rules:** ✅
- **Respect `.gitignore`:** ✅

---

## 🧠 Model Settings

- **Model:** GPT-4
- **Provider:** OpenAI
- **Embeddings:** text-embedding-3-small

---

## ✨ Autocomplete Settings

- **Enabled:** ✅
- **Max tokens:** 100
- **Max lines:** 10

---

## 🔒 Telemetry

- Anonymous telemetry is **disabled**.

---

✅ **Purpose:**  
This rule file guides the Continue extension to understand project architecture, enforce consistent coding patterns, and ignore unnecessary files during context analysis.

---

## ⚙️ Continue Context Settings

- **Max tokens:** 200000  
- **Max files:** 100  
- **Respect ignore rules:** ✅  
- **Respect `.gitignore`:** ✅  

---

## 🧠 Model Settings

- **Model:** GPT-4  
- **Provider:** OpenAI  
- **Embeddings:** text-embedding-3-small  

---

## ✨ Autocomplete Settings

- **Enabled:** ✅  
- **Max tokens:** 100  
- **Max lines:** 10  

---

## 🔒 Telemetry

- Anonymous telemetry is **disabled**.

---

✅ **Purpose:**  
This rule file guides the Continue extension to understand project architecture, enforce consistent coding patterns, and ignore unnecessary files during context analysis.