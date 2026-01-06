# Improvement Plan for angFin3

## 1. Architectural Improvements

### 1.1 Root Component Optimization
**Current State**: The root `App` component uses default change detection.
**Improvement**: Switch to `ChangeDetectionStrategy.OnPush` to match the rest of the application and ensure consistent performance behavior.

### 1.2 Layout refinements for responsive ui

### 1.3 Path Aliases
**Current State**: Aliases (`@features`, `@entities`) are only defined in `tsconfig.app.json`.
**Improvement**: Move paths to the root `tsconfig.json`.
- **Benefit**: Ensures better compatibility with IDE tooling, test runners, and other build tools that read the root config.

---

## 2. UI/UX Modernization

### 2.1 Semaphore Styling (Theming)
**Current State**: Components use hardcoded Tailwind utility classes like `text-slate-400`, `bg-white`, `border-slate-200`.
**Improvement**: Refactor all components to use the **Semantic CSS Variables** defined in `styles.css`.
- Replace `text-slate-900` → `text-text-main`
- Replace `text-slate-500` → `text-text-muted`
- Replace `bg-white` → `bg-surface`
- Replace `border-slate-200` → `border-border-default`
- **Benefit**: Enables instant "Dark Mode" support and makes future re-branding trivial.

### 2.2 Home Page Redesign
---

## 3. Testing Expansion

### 3.1 Component Integration Tests
**Current State**: Excellent unit tests for logic (`investment.utils.spec.ts`), but no component tests.
**Improvement**: Add Component Tests for `CalculatorFormComponent`.
- **Goal**: Verify that typing in an input correctly updates the `data` signal and emits the `valid` event.
- **Tool**: Use `OnePush` testing patterns with `@testing-library/angular` or native `ComponentFixture`.

### 3.2 Accessibility (a11y) Tests
**Improvement**: Add `vitest-axe` to the testing pipeline.
- **Goal**: Automatically catch accessibility violations (contrast, missing labels) during the build.

---

## 4. Code Quality & Linting

### 4.1 Strictness
**Current State**: Good standard Angular config.
**Improvement**: Enable `noImplicitAny` and `strictNullChecks` explicitly in `tsconfig.json` if not inherited (it usually is in strict mode, but verify).
**Action**: Add `plugin:prettier/recommended` to `eslint.config.js` to prevent formatting wars.

---

## 5. Recommended Next Step
**Execute Item 2.1 (Theming)** immediately. It yields the highest visual impact and cleans up the codebase significantly.
