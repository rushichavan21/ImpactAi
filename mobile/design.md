# Design System & UI Guidelines (Mobile)

## Vision
To create a "world-class", professional, and visually stunning mobile interface that feels native, fluid, and premium. The design should utilize subtle gradients, smooth interactions, and a deep, dark aesthetic to wow the user.

## Core Principles
1.  **Dark Mode First**: The UI is strictly dark-themed. Use rich, deep blacks (`#09090b`) and dark zincs, avoiding pure black where possible to reduce eye strain on OLED screens.
2.  **Anti-Generic ("Not AI-Generated")**:
    - Avoid standard "Header-Hero-Features-Footer" layouts.
    - Use asymmetry, overlapping elements, and large creative typography.
    - Implement custom gestures and smooth transitions.
3.  **Visual Hierarchy**: Use size, color, and weight to guide the user's eye. Key actions must stand out (e.g., Floating Action Buttons or prominent cards).
4.  **Whitespace**: Generous use of padding and margin to create a clean, uncluttered look.
5.  **Motion**: Heavy (but performant) use of `react-native-reanimated`. Everything should feel responsive.
    - Screen transitions: Smooth slide and fade.
    - Press states that "feel" tactile (e.g., scale down).

## Color Palette
- **Background**: Deep Zinc (`#000000` to `#09090b`).
- **Foreground**: Off-white (`#fafafa`) for text to avoid eye strain.
- **Accents**: Use subtle gradients (e.g., Purple to Blue) for borders or active states, but keep it minimal.
- **Glassmorphism**: Use `expo-blur` with transparency (`bg-black/50`) and thin white borders (`border-white/10`) for overlays and modals.

## Components

### Buttons
- **Primary**: Solid background, slight shadow, scale down on press (98%).
- **Secondary**: Ghost or outline with press opacity change.
- **Radius**: `rounded-xl` or `rounded-full` consistently for touch targets.
- **Height**: Minimum 48px for touch accessibility.

### Cards
- **Style**: Clean border, subtle shadow (`shadow-sm`).
- **Glassmorphism**: Use `BlurView` or semi-transparent backgrounds for a layered effect.
- **Interaction**: Scale down slightly on press (`0.98`) if interactive.

### Inputs
- **State**: Focus rings must be clear (`border-primary` or `ring-2`).
- **Error**: clearly defined red border and text.
- **Keyboard**: Ensure inputs avoid keyboard obstruction (use `KeyboardAvoidingView`).

## Animation (Reanimated)
- **Screen Transitions**: Smooth fade-in and slide-up for new screens (using `expo-router` stack presets or custom Reanimated transitions).
- **Micro-interactions**:
    - Press: Scale down (`scale: 0.95`).
    - Success/Error: Shake or bounce effects.
- **Stagger**: List items should load sequentially (e.g., `Entering={FadeInDown.delay(index * 100)}`).

## Libraries & Tools
- **UI Framework**: React Native + NativeWind v4.
- **Icons**: `lucide-react-native` (or `@expo/vector-icons`).
- **Animations**: `react-native-reanimated`.
- **Navigation**: `expo-router`.
- **Haptics**: `expo-haptics` for tactile feedback on interactions.
- **Blur**: `expo-blur`.

## Implementation Rules
1.  **Mobile First**: Design for touch interactions (min 44x44pt targets).
2.  **SafeArea**: Always respect safe area insets (use `SafeAreaView` or `useSafeAreaInsets`).
3.  **Performance**: Avoid heavy computations on the JS thread; use Reanimated worklets.
4.  **Code Structure**: Keep components small and reusable in `components/`.
