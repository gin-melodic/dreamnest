# DreamNest (宠梦坊) React Native

> This file is the authoritative rules document for any LLM agent working in this codebase.
> Read this entire file before generating any code. Do not skip sections.

---

## Project Overview

**Product:** DreamNest (宠梦坊) — AI-powered dream interpretation mobile app  
**Platform:** iOS-first, React Native 0.85.3, New Architecture enabled (Fabric + JSI)  
**Backend:** Go + GoFrame v2 (`dm-dream-service`), module name `dream-master`  
**Auth:** Supabase email auth (primary, for overseas users) + WeChat Mini Program auth (legacy, backend only)  
**Target:** MVP for TestFlight + Upwork portfolio — deliver a complete, demonstrable flow

---

## Absolute Rules (Never Violate)

1. **Never downgrade React Native below 0.85.3.** New Architecture is on by default — do not add `RCT_NEW_ARCH_ENABLED=0` without explicit instruction.
2. **Never use `AsyncStorage` directly for app data.** Use `react-native-mmkv` for all local storage except where Supabase SDK requires its own adapter.
3. **Never hardcode API URLs.** Use the `__DEV__` flag to switch between local and production base URLs.
4. **Never mix Supabase JWT with backend JWT.** Supabase token is only used to obtain the backend-issued JWT via the `/auth/supabase` exchange endpoint. After that, only the backend JWT is used in `Authorization: Bearer` headers.
5. **Never use `any` type in TypeScript** unless explicitly commented with a reason. Use `unknown` and narrow types properly.
6. **Never commit secrets.** `.env` is gitignored. All keys go in `.env.local` (development) and environment variables (CI/production).
7. **One coherent change per task.** A task may touch multiple files if they form a single logical unit (e.g., adding a new screen requires updating both the screen file and `AppNavigator.tsx`; localizing a screen requires updating the screen file alongside its locale resource files; fixing navigation behavior may require updating `AppNavigator.tsx` alongside the affected screen). What is prohibited: mixing unrelated concerns in the same response (e.g., fixing a UI bug and refactoring state management simultaneously).

   **Permitted multi-file changes (treat as one task):**
   - Adding a new screen: screen file + `AppNavigator.tsx`
   - Localizing a screen: screen file + locale resource files under `src/lib/locales/`
   - Changing navigation behavior or header config: `AppNavigator.tsx` + affected screen(s)
   - Adding a shared component used immediately: component file + the screen that introduces it

8. **Do not install UI component libraries** (NativeBase, UI Kitten, Tamagui, etc.) during MVP phase. Use `StyleSheet` + `react-native-reanimated` only.

---

## Tech Stack & Versions (as of 2026-05-21)

| Layer | Library | Version |
|---|---|---|
| Core | React Native | 0.85.3 |
| Language | TypeScript | 5.x (strict mode) |
| Navigation | @react-navigation/native + native-stack | latest |
| State | Zustand | latest |
| Local storage | react-native-mmkv | latest |
| Auth | @supabase/supabase-js | v2 (latest) |
| Animation | react-native-reanimated | 3.x |
| Gestures | react-native-gesture-handler | latest |
| HTTP | axios | latest |
| Node (toolchain) | 24 LTS | — |
| Xcode | 26.1 | — |
| iOS target | 17.0+ | — |

Do not suggest versions older than these. Do not add unlisted dependencies without asking.

---

## Project Structure

```
src/
├── api/              # One file per backend resource (auth.ts, user.ts, dream.ts, history.ts)
├── screens/          # Full-page screen components (one file per screen)
├── components/       # Shared reusable components
├── store/            # Zustand stores (authStore.ts, dreamStore.ts) — keep them separate
├── hooks/            # Custom React hooks (useDreamChat.ts, etc.)
├── navigation/       # AppNavigator.tsx only — no logic here
├── lib/              # Singletons: supabase.ts, http.ts, storage.ts, i18n.ts
│   └── locales/      # Locale resource files: en.ts, zh-Hant.ts, zh-Hans.ts
└── types/            # Shared TypeScript type definitions
```

**Rules:**
- Screens live in `src/screens/`. Never put screen logic in `src/components/`.
- `src/lib/` files are singletons — never instantiate them inside components.
- Keep `AppNavigator.tsx` free of business logic. Navigation configuration (`screenOptions`, header styles, animation presets) is permitted. Only `authStore.user` reads are allowed for conditional stack branching — no other store reads, no API calls.

---

## Backend API Contract

Backend base path: `/api`  
Auth middleware: reads `Authorization: Bearer <token>` for HTTP; reads `?token=<url-encoded-jwt>` for WebSocket (see `internal/middleware/auth.go`).

### Endpoints (current)

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/wechat/auth` | No | WeChat Mini Program login |
| POST | `/auth/supabase` | No | Exchange Supabase token for backend JWT *(to be added)* |
| GET | `/v1/user/info` | Yes | Get current user info |
| PUT | `/v1/user/info` | Yes | Update user info |
| GET | `/chat/ws?token=` | WS | Dream chat WebSocket stream |

### Response shape (GoFrame default)

All HTTP responses follow `ghttp.DefaultHandlerResponse`:
```
{ "code": 0, "message": "", "data": { ... } }
```
A non-zero `code` means error. The axios interceptor must unwrap `res.data.data` for successful responses and throw on non-zero `code`.

### WebSocket message shape

Matches `api/dream/v1/dream.go` — `ChatMessage` struct:
```
{ "type": "message" | "error" | "done", "dreamContent": "", "content": "", "error": "" }
```
- Send: `type: "message"` with `dreamContent` populated
- Receive: stream of `type: "message"` chunks, then one `type: "done"`
- Error: `type: "error"` with `error` field

---

## Authentication Flow

```
[User enters email + password]
        ↓
[supabase.auth.signInWithPassword()]
        ↓
[Get session.access_token from Supabase]
        ↓
[POST /auth/supabase  { supabase_token }]
        ↓
[Backend validates Supabase JWKS, upserts user, returns { token, user_info }]
        ↓
[Store backend token in MMKV key: "auth_token"]
        ↓
[All subsequent API calls use Bearer <backend_token>]
```

On app restart: `supabase.auth.onAuthStateChange` fires with the persisted session, triggers re-exchange. The backend token stored in MMKV is the source of truth for axios interceptors — not the Supabase session.

---

## Design System

Source of truth: `dreamnest-rn-ui-spec.md` in the UXD repo.  
**Brand tone:** Immersive, mysterious, gentle — like a private star-journal.  
**Theme:** Dark-first. Deep space dark background with soft purple/orange accents.

### Color Tokens (must match UXD spec exactly)

```
Background:       #0D0B14
Surface:          #161323
Surface-2:        #1E1A2E
Primary Accent:   #7B6EF6  (nebula purple)
Secondary Accent: #F0A86E  (dawn orange)
Text Primary:     #EDE8FF
Text Muted:       #8B82B0
Text Faint:       #4A4468
Success:          #5BC4A0
Error:            #E06B8B
```

Define these as a `const COLORS` object in `src/types/theme.ts`. Never use raw hex values in StyleSheet — always reference `COLORS.background` etc.

### Typography

Use SF Pro (system default on iOS) — no custom fonts needed.  
Reference sizes from the UXD spec (28-36pt display, 22-24pt page titles, 16pt body, 13-14pt secondary, 11-12pt badges).  
Define a `TYPOGRAPHY` constants object alongside `COLORS`.

### Key Component Behaviors

- **PrimaryButton:** `#7B6EF6` background, 14pt radius, scale to 0.96 on press (Reanimated), 50pt min height
- **DreamCard:** `#161323` background, 16pt radius, 4pt left emotion color strip, shadow `0 4 20 rgba(0,0,0,0.4)`
- **EmotionChip:** Pill shape, emotion color at 15% opacity fill + 1pt border
- **AIStreamText:** 15pt, line-height 1.7, token-by-token fade-in (no jitter)
- **Tab Bar:** BlurView background, `#0D0B14` at 0.85 opacity, SafeAreaView compliant

---

## Navigation Architecture

Bottom Tab Navigator (3 tabs): **Home** → **Journal** → **Profile**

Stack screens pushed from tabs:
- `DreamInput` — full-screen immersive input
- `DreamResult` — SSE/WebSocket streaming result
- `DreamDetail` — single history entry
- `DeepAnalysis` — L3 paid analysis (P1)
- `CreditShop` — StoreKit 2 (P1)

**Rules:**
- The root navigator checks `authStore.user` — if null, show `AuthScreen`; otherwise show `BottomTabNavigator`
- Never use `navigation.navigate()` for auth redirects — change `authStore.user` and let the navigator re-render
- Tab 4 (Dream Graph) slot must be structurally reserved even if not implemented

### Header Convention

Index-level screens (Auth, MainTabs/BottomTabNavigator) are **headerless**.

All pushed stack screens must render a native header with:
- Background: `COLORS.background` (`#0D0B14`)
- Title color: `COLORS.textPrimary` (`#EDE8FF`)
- Back chevron tint: `COLORS.primaryAccent` (`#7B6EF6`)
- An explicit back/close button — do not rely solely on swipe gesture

Configure these as `screenOptions` in `AppNavigator.tsx`, not inside individual screen files.

### Navigation Transitions

| Route | Animation | Back destination |
|---|---|---|
| Tab switching | `fade` or instant — never stack-push | — |
| Journal → DreamDetail | `slide_from_right` (default push) | Journal tab |
| DreamInput → DreamResult | `slide_from_right` (default push) | DreamInput |
| Home → DreamInput | `slide_from_bottom` (modal sheet) | Home tab |
| Auth → MainTabs | State-driven root swap — no transition affordance | — |

### Navigation Behavior Rules

- `DreamResult`'s "Back to Home" action must use `navigation.popToTop()` or `navigation.dispatch(StackActions.popToTop())` — never `navigation.navigate('MainTabs')`, which would stack a duplicate root.
- `DreamDetail` must always have a visible back action via the unified header even when the dream record is missing (show an error state, not a blank screen).

---

## i18n (Internationalization)

No third-party i18n library. Use the internal singleton at `src/lib/i18n.ts`.

### Structure

```
src/lib/
├── i18n.ts              # t(key) helper, language detection, preference persistence
└── locales/
    ├── en.ts            # English (default fallback)
    ├── zh-Hant.ts       # Traditional Chinese
    └── zh-Hans.ts       # Simplified Chinese
```

All three locale files must export an object typed against a shared `LocaleKeys` interface defined in `src/types/i18n.ts`. TypeScript will error if a locale is missing a key.

### Rules

- `t(key: keyof LocaleKeys): string` — the only public API for UI copy
- Language preference persisted in MMKV under key `"lang_pref"` (`"en"` | `"zh-Hant"` | `"zh-Hans"`)
- On first launch (no MMKV value), detect device locale via `NativeModules.I18nManager.localeIdentifier` and map to the nearest supported locale; fall back to `"en"`
- Backend/API field names are **never** localized — only UI copy
- Demo/seed dream records in the UI must also use `t()` keys, not hardcoded Chinese strings
- Add a language selector in the Profile screen (3 options, radio-style)

---

## State Management

### authStore

Holds: `user` (Supabase User | null), `backendToken` (string | null)  
Actions: `setUser`, `setBackendToken`, `clear`  
**Do not add dream state here.**

### dreamStore

Holds: `streamingContent` (string), `isStreaming` (boolean), `history` (DreamRecord[])  
Actions: `appendChunk`, `setStreaming`, `setHistory`, `clearStream`  
**Do not add auth state here.**

Keep stores small. If a piece of state is only used in one screen, use local `useState` — do not promote it to a store.

---

## Cost Control Constraints

LLM call costs are not amortized — every API call has direct cost impact. The frontend must enforce:

1. **Debounce dream submission** — user must explicitly tap "Analyze" after finishing input. No auto-submit.
2. **Close WebSocket immediately** after `type: "done"` is received. Never leave a WS connection idle.
3. **Only one active WS connection** at any time. Disconnect before creating a new one.
4. **Cache last 10 results in MMKV** keyed by a hash of the dream content. Check cache before opening WS.
5. **Show a word-count guide** in `DreamInput` — recommend 50-200 characters for best results (not a hard limit).

---

## Code Quality Rules

### TypeScript
- `strict: true` in tsconfig — no exceptions
- Explicit return types on all exported functions
- No implicit `any`. No `@ts-ignore` without a comment explaining why.
- API response types must mirror the backend struct fields exactly (snake_case from backend, map to camelCase in the API layer)

### React Native
- All `StyleSheet.create()` calls at the bottom of the file, not inline
- No anonymous arrow functions in JSX event handlers for performance-critical lists (`FlatList` renderItem must use `useCallback`)
- Always use `KeyboardAvoidingView` + `behavior="padding"` on iOS for forms
- Always wrap screens with `SafeAreaView` from `react-native-safe-area-context`

### File Conventions
- Screens: `PascalCase` filename, default export, suffix `Screen` (e.g., `AuthScreen.tsx`)
- Components: `PascalCase` filename, default export, no suffix (e.g., `DreamCard.tsx`)
- Hooks: `camelCase` filename, prefix `use` (e.g., `useDreamChat.ts`)
- Stores: `camelCase` filename, suffix `Store` (e.g., `authStore.ts`)
- API files: `camelCase` filename, no suffix (e.g., `dream.ts`)

### Comments
- Write comments in **English**
- Comment the *why*, not the *what*
- Required comments: any `// eslint-disable`, any `// @ts-ignore`, any non-obvious business logic

---

## Environment Variables

```
# .env.local
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_ANON_KEY=your-anon-key
API_BASE_URL_DEV=http://localhost:8000/api
API_BASE_URL_PROD=https://your-service.fly.dev/api
```

Access via `react-native-config` or inline `__DEV__` checks. Never access `process.env` directly in RN.

---

## What NOT to Generate

- Do not generate WeChat OAuth login UI — it is backend-only and not used in the mobile app
- Do not generate Android-specific code unless explicitly asked — iOS first
- Do not generate StoreKit / in-app purchase code — that is P1
- Do not generate `DeepAnalysis` screen — that is P1
- Do not suggest adding Redux, MobX, Jotai, or any state library other than Zustand
- Do not suggest `react-native-paper`, `NativeBase`, or any UI component library
- Do not suggest Expo — this is a bare React Native project

---

## Portfolio / README Notes

This project is also an Upwork portfolio piece. Code must:
- Be clean and readable without explanation
- Have meaningful, non-trivial TypeScript types visible at the API boundary
- Demonstrate understanding of streaming (WebSocket chunk assembly)
- Demonstrate understanding of auth token lifecycle (Supabase → backend JWT exchange)

These are the two technical highlight points. Keep them clean.

---

*Last updated: 2026-05-23 | DreamNest MVP v0.3.0*
