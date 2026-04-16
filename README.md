<img width="700" height="460" alt="rerender_comparison" src="https://github.com/user-attachments/assets/e462d88f-c49c-48cf-8fa1-ef3be602d04a" />


# State Management Comparison

### Redux · Context/Provider · Zustand

_Expo React Native Demo App — Technical Specification_

---

## 1. Purpose

This app is a hands-on learning tool that places Redux, React Context/Provider, and Zustand side-by-side in identical UI screens. The goal is to make the invisible visible: specifically, which components re-render, when they re-render, and how much boilerplate each solution requires.

Each of the three tabs is wired with a different state management approach but renders the exact same UI — a name + counter with a render log — so comparisons are apples-to-apples.

---

## 2. Core Teaching Goals Per Tab

### Redux — Verbose but Precise

- Requires explicit setup: store, actions, reducers, dispatch, and a Provider wrapper
- Components only re-render if they call `useSelector()` and the selected slice changes
- The `Logger` component (which has no `useSelector`) stays completely static
- DevTools integration gives full time-travel debugging
- **Teaching moment:** Redux's verbosity is intentional — every state change is traceable

### Context / Provider — Simple but Expensive

- Minimal setup: `createContext()`, a Provider wrapper, and `useContext()` in consumers
- Critical behavior: **ALL** components inside the Provider re-render on **ANY** state change
- The `Logger` component re-renders even though it does not consume the counter value
- This is the most common React performance pitfall — this tab makes it unmissable
- **Teaching moment:** Context was not designed for high-frequency state updates

### Zustand — Minimal and Precise

- No Provider wrapper needed at all — the store is module-level
- Selector-based like Redux: only components calling `useStore(state => state.x)` re-render
- The `Logger` stays static, same behavior as Redux, with a fraction of the code
- **Teaching moment:** Zustand achieves Redux-level precision with Context-level simplicity

---

## 3. State Shape

Each tab manages identical state to ensure fair comparison:

```ts
type AppState = {
  name: string; // editable text field — default: "Ada"
  count: number; // increment / decrement counter — default: 0
};
```

This two-field shape is intentional. It allows demonstrating selective subscriptions — a component subscribed only to `count` does not re-render when `name` changes, and vice versa. This is observable in Redux and Zustand but not in Context.

---

## 4. Screen Layout — Each Tab

All three tabs render the same component hierarchy with different wiring:

```
<TabScreen>
  <NameInput />        ← subscribes to name, dispatches setName
  <CounterControls />  ← subscribes to count, dispatches increment/decrement
  <RenderFlash />      ← pulses on every re-render of its parent
  <Logger />           ← intentionally NOT subscribed to state
  <RenderLog />        ← scrollable list of render timestamps
  <ResetButton />      ← clears render log and resets state to defaults
</TabScreen>
```

### RenderFlash behavior

Uses `react-native-reanimated` to animate a colored border on every render cycle. The animation is triggered imperatively inside a `useEffect` with no dependency array so it fires on every render of the parent. The flash color is unique per tab to reinforce identity.

### Logger component

The `Logger` renders a static label and its own render timestamp. It has **no state subscription and receives no props from state**. Its render log entry is the key demonstration — in the Context tab it appears on every counter update; in Redux and Zustand tabs it stays silent.

### RenderLog

A `FlatList` of timestamped entries. Each entry includes the component name and `HH:MM:SS.mmm` timestamp. The log is cleared automatically when the user switches away from the tab and can also be manually cleared via the Reset button.

---

## 5. Re-render Visualization

`react-native-reanimated` is used for all visual feedback. This avoids `setState`-triggered re-renders that would pollute the render count being measured.

### Flash implementation pattern

```ts
const flashAnim = useSharedValue(0);

// Runs on every render — intentionally no dependency array
useEffect(() => {
  flashAnim.value = withSequence(
    withTiming(1, { duration: 80 }),
    withTiming(0, { duration: 320 }),
  );
});

const animatedStyle = useAnimatedStyle(() => ({
  borderColor: interpolateColor(
    flashAnim.value,
    [0, 1],
    ["transparent", tabColor],
  ),
  borderWidth: 2,
  borderRadius: 8,
}));
```

Each component that should show re-render feedback wraps its content in an `Animated.View` with this style applied. The flash is subtle (80ms in, 320ms fade) so it does not distract from interaction but is clearly visible on repeated updates.

Apply `RenderFlash` to: `NameInput`, `CounterControls`, `Logger`, and the screen root.

---

## 6. Side-by-Side Comparison

| Dimension            | Redux                                         | Context / Provider                    | Zustand                                      |
| -------------------- | --------------------------------------------- | ------------------------------------- | -------------------------------------------- |
| Boilerplate          | High — actions, reducers, selectors, dispatch | Low — createContext + useContext      | Minimal — create store with hook             |
| Provider required?   | Yes — `<Provider store={store}>`              | Yes — `<MyContext.Provider>`          | **No**                                       |
| Re-render behavior   | Only `useSelector` subscribers re-render      | ALL consumers re-render on any change | Only hook subscribers with matching selector |
| Selector granularity | Fine-grained via `useSelector()`              | None — all or nothing per context     | Fine-grained via `useStore(s => s.x)`        |
| DevTools support     | Excellent — Redux DevTools Extension          | None built-in                         | Good — Zustand DevTools middleware           |
| Best use case        | Large apps, complex state, teams              | Simple/medium apps, theme, auth       | Most apps — best balance of DX and perf      |
| Learning curve       | Steep                                         | Low                                   | Very low                                     |

---

## 7. Project Structure

```
state-management-demo/
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx         ← Tab navigator: Redux | Context | Zustand
│   │   ├── redux.tsx
│   │   ├── context.tsx
│   │   └── zustand.tsx
│   └── _layout.tsx             ← Root layout, wrap with Redux <Provider>
├── store/
│   ├── reduxStore.ts           ← configureStore + counterSlice (name + count)
│   ├── contextStore.tsx        ← createContext + Provider + useCounterContext hook
│   └── zustandStore.ts         ← zustand create() store (name + count)
├── components/
│   ├── NameInput.tsx
│   ├── CounterControls.tsx
│   ├── RenderFlash.tsx
│   ├── Logger.tsx
│   ├── RenderLog.tsx
│   └── ResetButton.tsx
└── constants/
    └── colors.ts               ← TAB_COLORS per tab identity
```

---

## 8. Dependencies

| Package                   | Version           | Purpose                            |
| ------------------------- | ----------------- | ---------------------------------- |
| `expo`                    | latest            | App framework                      |
| `react-native`            | latest (via Expo) | Core RN runtime                    |
| `expo-router`             | latest            | File-based tab navigation          |
| `@reduxjs/toolkit`        | latest            | Redux store + slice helpers        |
| `react-redux`             | latest            | `useSelector`, `useDispatch` hooks |
| `zustand`                 | latest            | Zustand store                      |
| `react-native-reanimated` | latest            | Re-render flash animation          |

---

## 9. Behavior Rules

### Tab switching

- Render log is cleared when the user navigates away from a tab
- State (`name` + `count`) persists across tab switches — only the log resets
- This allows users to set a value on one tab and switch to observe the difference

### Reset button

- Appears fixed at the bottom of each tab screen
- Resets both state (`name` and `count` back to defaults) and clears the render log
- Styled with the tab's accent color

### Render log entries

- Format: `[ComponentName]  HH:MM:SS.mmm`
- Most recent entry at the top
- Maximum 50 entries (older entries drop off)
- The `Logger` component appends to the same log so its (in)activity is clearly visible

---

## 10. Tab Identity Colors

Each tab has a consistent accent color used for the flash animation, reset button, and active tab indicator:

```ts
// constants/colors.ts
export const TAB_COLORS = {
  redux: "#7C3AED", // purple
  context: "#059669", // teal / emerald
  zustand: "#DC2626", // coral / red
} as const;
```

---

## 11. Key Acceptance Criteria

1. All three tabs render without errors
2. Tapping +/- in the **Context tab** causes `Logger`'s row to appear in the render log — it does **not** appear in Redux or Zustand tabs
3. `RenderFlash` border visibly pulses on component update — reanimated only, no `setState`
4. Switching tabs clears the render log automatically
5. Reset button restores state to defaults and clears the log
6. `NameInput` changes only trigger re-renders of name-subscribed components in Redux and Zustand tabs
7. No TypeScript errors (`npx tsc --noEmit` passes)

---

_State Management Demo — React Native / Expo_
