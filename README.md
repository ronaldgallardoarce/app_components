# App Components

Design-system playground for an Expo app: [React Native Reusables](https://reactnativereusables.com) components styled with [Uniwind](https://docs.uniwind.dev), plus a dev catalog that renders every component.

## Stack

- Expo SDK 57, React Native 0.86, React 19 (React Compiler enabled)
- Expo Router (file-based routes in `src/app/`, root `Stack`)
- Uniwind 1.12 **Free** + Tailwind CSS 4
- React Native Reusables components on top of `@rn-primitives/*`, icons from `lucide-react-native`
- pnpm

## Run in Expo Go

```bash
pnpm install
npx expo start
```

Scan the QR code with Expo Go (Android) or the Camera app (iOS). Every dependency ships in Expo Go; no development build is needed.

Checks before pushing:

```bash
npx tsc --noEmit
npx expo lint
npx expo-doctor
```

## Where things live

| Path | Contents |
| --- | --- |
| `src/global.css` | Design tokens (colors, radius) for light and dark. Single source of truth. |
| `src/design-system/components/` | One file per component (`button.tsx`, `dialog.tsx`, ...). |
| `src/design-system/lib/` | `cn`, `usePressed`, navigation theme derived from the tokens. |
| `src/design-system/preference/` | Light / dark / system preference, persisted with `expo-sqlite`. |
| `src/app/catalog.tsx` | Dev catalog: every component, variant, size and state. |

## Conventions

- **Uniwind Free only.** Never use Pro-only features. `group-*` classes are allowed only inside `Platform.select({ web })`; on native, pressed styles come from the Pressable `pressed` state (`Button` render function or `usePressed`).
- **Tokens only.** Components use token classes (`bg-primary`, `text-danger-text`); no hardcoded hex values. JS that needs a color reads it from the CSS variables (`colorClassName`, `useCSSVariable`).
- **No barrel files.** Import each component from its own file with the `@/` alias, e.g. `@/design-system/components/button`.
- Add RNR components with the CLI, then adapt them (`destructive` is called `danger`):

  ```bash
  npx @react-native-reusables/cli@latest add <names...> --styling-library uniwind -p src/design-system/components
  ```

- Install packages with `npx expo install <package>` so versions match the SDK.
