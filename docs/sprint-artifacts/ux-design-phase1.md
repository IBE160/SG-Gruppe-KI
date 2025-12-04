# Phase 1 UX Design Specification

This document details the User Experience (UX) design for all Phase 1 user flows, incorporating identified improvements and adhering to Phase 1 constraints (no wearables or Apple Health integrations).

---

## **Flow 1: Account Creation & Authentication (Google • Email)**

**Goal:** To provide a clear, secure, and streamlined entry point for both new and returning users, minimizing friction and leveraging preferred authentication methods.

### **Screen 1: Welcome / Authentication Gateway**

*   **Description:** This is the app's initial entry screen, featuring a compelling visual, main app title, and primary account actions. It sets an energetic and modern tone with its dark theme and vibrant green accent.
*   **Visual Elements:**
    *   **Background Image:** Full-screen background image (e.g., "A person in athletic gear using a rowing machine").
    *   **Dark Overlay/Gradient:** A subtle gradient over the image to ensure text readability.
    *   **App Icon/Logo:** A distinct icon (e.g., `neurology` Material Symbol) with a rounded background, followed by:
    *   **Main Heading:** "Your Personal AI Trainer" (Large, bold, white text).
    *   **Sub-heading:** "Smart, personalized workouts that adapt to you." (White/muted text).
    *   **Primary Action Buttons (Stacked):**
        *   `[ Create Account ]` (Prominent, large, full-width, vibrant green background, dark text).
        *   `[ Log In ]` (Secondary, large, full-width, dark background, white text).
    *   **"Or continue with" Separator:** "Or continue with" (muted white text).
    *   **Social Login Buttons (Horizontal):**
        *   `[ Google Icon ]` button (Rounded, dark background, white icon).
        *   `[ Apple Icon ]` button (Rounded, dark background, white icon).
    *   **Legal Text:** Small text: "By continuing, you agree to our Terms of Service and Privacy Policy." (Muted white text, with underlined links).
*   **Interactions:**
    *   **Tap `Create Account`:** Navigates to **Screen 2: Email Authentication** (for sign-up flow).
    *   **Tap `Log In`:** Navigates to **Screen 2: Email Authentication** (for sign-in flow).
    *   **Tap `Google Icon`:** Initiates Google OAuth flow (redirects externally, then returns).
    *   **Tap `Apple Icon`:** Initiates Apple OAuth flow (redirects externally, then returns - Phase 2).

### **Screen 2: Email Authentication (now split into 2A and 2B)**

*   **Description:** This section details the dedicated email sign-up and login screens. Users navigate to the appropriate screen based on their action from the Welcome screen, or by switching between sign-up and login.
*   **Interaction Logic:**
    *   **From Welcome Screen (Screen 1):**
        *   Tapping `[ Create Account ]` navigates directly to **Screen 2A: Email Sign-up**.
        *   Tapping `[ Log In ]` navigates directly to **Screen 2B: Email Login**.
    *   **Between Sign-up/Login Screens:**
        *   On **Screen 2A: Email Sign-up**, tapping "Already have an account? [Log in]" navigates to **Screen 2B: Email Login**.
        *   On **Screen 2B: Email Login**, tapping "Don't have an account? [Sign up]" navigates to **Screen 2A: Email Sign-up**.

#### **Screen 2A: Email Sign-up (Inspired by `email_signup/code.html`)**

*   **Description:** The screen for new users to create an account with email and password. It maintains the dark theme with vibrant green accents.
*   **Visual Elements:**
    *   **Header:** `[ Back Button ]` (Material Symbols Outlined: `arrow_back_ios_new`, rounded, white/10 background).
    *   **Main Heading:** "Create your account" (Large, bold, `text-[32px]`).
    *   **Sub-heading:** "Join us to unlock your potential." (text-zinc-400).
    *   **Email Input Field:** Label "Email address", `[ mail ]` icon inside, `placeholder="you@example.com"`. Dark background (`bg-white/10`), rounded, focus ring in primary green.
    *   **Password Input Field:** Label "Password", `[ lock ]` icon inside, `placeholder="Enter your password"`. Visibility toggle button (`visibility_off` icon). **Password Strength Indicator:** Below password, "Password strength" label, "Strong" text in primary green, visual bar.
    *   **Confirm Password Input Field:** Label "Confirm Password", `[ lock ]` icon inside, `placeholder="Confirm your password"`. Checkmark icon (`check_circle`) in primary green.
    *   **Primary Action Button:** `[ Create Account ]` (Large, full-width, vibrant green background, dark text).
    *   **Secondary Link:** "Already have an account? [Log in]" (text-zinc-400, "Log in" in primary green).
*   **Interactions:**
    *   **Tap `Back Button`:** Returns to **Screen 1: Welcome / Authentication Gateway**.
    *   **Tap `Create Account`:** Submits form. On success, moves to **Screen 4**. On failure, displays inline error.
    *   **Tap `Log in` link:** Navigates to **Screen 2B: Email Login**.

#### **Screen 2B: Email Login (Inspired by `email_authentication/code.html`)**

*   **Description:** The screen for existing users to log in with email and password. It maintains the dark theme with vibrant green accents.
*   **Visual Elements:**
    *   **Header:** `[ Back Button ]` (Material Symbols Outlined: `arrow_back_ios_new`, rounded, white/10 background).
    *   **Main Heading:** "Welcome back!" (Large, bold, `text-[32px]`).
    *   **Email Input Field:** Label "Email address", `[ mail ]` icon inside, `placeholder="Enter your email"`. Input field uses `bg-[#23482f]` (darker green-gray shade), rounded, focus ring in primary green.
    *   **Password Input Field:** Label "Password", `[ lock ]` icon inside, `placeholder="Enter your password"`. Visibility toggle (`visibility_off` icon). Input field uses `bg-[#23482f]`.
    *   **`[ Forgot Password? ]` Link:** (font-bold text-primary green, clearly visible below password field - **Improvement: Prominently Display a "Forgot Password" Option**).
    *   **Primary Action Button:** `[ Log In ]` (Large, full-width, vibrant green background, dark text).
    *   **Secondary Link:** "Don't have an account? [Sign up]" (text-zinc-400, "Sign up" in primary green).
*   **Interactions:**
    *   **Tap `Back Button`:** Returns to **Screen 1: Welcome / Authentication Gateway**.
    *   **Tap `Log In`:** Submits form. On success, moves to **Screen 4**. On failure, displays inline error.
    *   **Tap `Forgot Password?` link:** Initiates password reset flow.
    *   **Tap `Sign up` link:** Navigates to **Screen 2A: Email Sign-up**.

### **Screen 3: Google OAuth Flow (External)**

*   **Description:** External process managed by Google.
*   **Interactions:** User redirected to Google, grants/denies permission, redirected back to app.

### **Screen 4: Post-Authentication Redirection**

*   **Description:** Internal redirect logic.
*   **Interactions:** New user -> Onboarding (Flow 2); Returning user -> Dashboard.

---

## **Flow 2: Goal & Preference Setup (Conversational Onboarding)**

**Goal:** To engage new users in a conversational, low-friction setup process that gathers essential information for personalized AI workout plan generation, consistent with the app's new dark aesthetic and green primary accent.

**General Design Principles for this Flow (Revised):**

*   **Visual Theme:** Dark background (`background-dark`) with vibrant primary green (`primary`) accents. Lexend font.
*   **Conversational Interface:** AI companion (with avatar) and user responses presented as chat bubbles.
*   **Interactive Input:** Options are presented as rounded, tappable buttons (`bg-primary` for selected, `border-primary/50` for unselected, `text-white` or `text-zinc-900 dark:text-white`).
*   **Visual Progress Indicator:** Header displays progress using small, rounded circles (filled `bg-primary`, unfilled `bg-primary/30`).
*   **Sticky Composer / Navigation:** A fixed bottom area for input fields and the main "Continue/Next" button.
*   **Positive Reinforcement:** AI's responses are encouraging and confirm understanding within the chat bubbles.

### **Onboarding Screen Layout (Template):**

*   **Header:** Fixed at top, with `[ Progress Indicator ]` (small, rounded circles: e.g., `h-2 w-2 rounded-full bg-primary` and `bg-component-dark/50`). `[ Back Button ]` (if needed for previous step, not explicitly shown in code.html but implied by flow).
*   **Main Content:** Scrollable area containing the conversational chat bubbles and interactive input controls for the current step.
    *   **AI Chat Bubble:** `AI Trainer` (typically `text-text-muted-dark`), `[ AI Avatar ]`, `[ Speech Bubble (bg-component-dark text-text-dark) ]`. Specific shades like `bg-[#193322]` or `bg-[#23482f]` for AI speech bubbles are also used.
    *   **User Response Bubble:** `[ Speech Bubble (bg-primary text-background-dark) ]`.
*   **Sticky Footer (Composer / Navigation):** Fixed at bottom, includes input field (if "Custom" option is selected) and the main `[ Arrow Forward Button ]` (large, rounded, `bg-primary text-background-dark`). This acts as the "Continue/Next" action.

### **Step 1: Welcome & Goal Selection (Implemented by `docs/stich_design/Flow_2/onboarding_step_1_goal_selection/code.html`)**

*   **Description:** This screen introduces the AI trainer and prompts the user to select their primary fitness goal. The design is based on the provided `code.html` and adheres to the dark theme with primary green accents, Lexend font, and conversational UI principles.
*   **Visual Elements (Referencing `code.html`):**
    *   **Overall Layout:** `h-screen`, `w-full`, `flex-col`, `font-display` (Lexend). `bg-background-dark`.
    *   **Header:** Fixed top header (`fixed top-0`, `z-10`, `bg-background-dark/80 backdrop-blur-sm`).
        *   `[ Back Button ]`: `arrow_back_ios_new` Material Symbol (`text-white/80`).
        *   **Progress Indicator:** `flex w-full flex-row items-center justify-center gap-3`. Uses `h-2 w-2 rounded-full` with `bg-primary` for active step and `bg-white/20` for inactive steps.
    *   **Main Content (`<main>`):** Scrollable area (`overflow-y-auto`, `pb-32 pt-20`).
        *   **AI Chat Bubble:**
            *   Avatar: Circular `w-10` with `bg-cover bg-center` and specific image URL.
            *   "AI Trainer" label: `text-primary/80`.
            *   Speech Bubble: `max-w-[360px] rounded-xl rounded-bl-sm bg-[#1A3122] px-4 py-3 text-base font-normal leading-normal text-white`. Content: "Welcome! I'm your personal AI trainer. What's your main fitness goal?"
        *   **Goal Selection Buttons:** Vertically stacked (`flex-col gap-3`), centered within a `max-w-[480px]` container.
            *   Buttons (`h-14`, `rounded-full`, `px-5`, `text-base font-bold`):
                *   Selected Goal (e.g., "Lose Weight"): `bg-primary text-background-dark`.
                *   Unselected Goals (e.g., "Build Muscle"): `border border-primary/50 bg-transparent text-white`.
        *   **`[ Custom... ]` Button:** `h-14`, `max-w-[480px] flex-1`, `rounded-full`, `border-2 border-dashed border-primary/50 bg-transparent px-5 text-base font-bold leading-normal tracking-[0.015em] text-white/80`. This visually indicates an option for custom input.
    *   **Sticky Footer (`<footer>`):** Fixed bottom (`fixed bottom-0`, `z-10`, `bg-gradient-to-t from-background-dark to-transparent p-6`).
        *   **`[ Arrow Forward Button ]`:** Large, full-width `h-16 w-full rounded-full bg-primary text-background-dark`, containing `arrow_forward` Material Symbol (`text-4xl`). This serves as the "Continue/Next" action.
*   **Interactions:**
    *   **Tapping Goal Buttons:** Selects a primary fitness goal.
    *   **Tapping `Custom...` button:** (Implicitly) reveals a text input field in the Sticky Footer for custom goal entry (aligned with **Improvement: Enhance Flexibility in User Input for Goals**).
    *   **Tapping `Arrow Forward Button`:** Proceeds to the next step in the onboarding flow.


### **Step 2: Time & Frequency (Implemented by `docs/stich_design/Flow_2/onboarding_step_2_time_and_frequency/code.html`)**

*   **Description:** This screen captures the user's preferred training frequency and duration per session through interactive sliders, presented in a conversational AI context. The design is based on the provided `code.html`, maintaining the dark theme, Lexend font, and primary green accents.
*   **Visual Elements (Referencing `code.html`):**
    *   **Overall Layout:** `h-[100dvh]`, `w-full`, `flex-col`, `overflow-hidden`, `font-display` (Lexend). `bg-background-dark`.
    *   **Header:** Fixed top header (`fixed top-0`, `z-10`, `bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm`).
        *   **Progress Indicator:** `flex w-full flex-row items-center justify-center gap-3`. Shows current progress (e.g., two `bg-primary` for completed steps, three `bg-primary/20` for pending steps).
    *   **Main Content (`<main>`):** Scrollable area (`flex-1`, `flex-col`, `justify-end`, `pt-20 pb-28`).
        *   **AI Chat Bubble:**
            *   Avatar: Circular `w-10` with `bg-cover bg-center` and specific image URL.
            *   "AI Trainer" label: `text-[#92c9a4]`.
            *   Speech Bubble: `max-w-[360px] rounded-xl px-4 py-3 bg-[#23482f] text-white`. Content: "Great! How many days a week do you want to train, and for how long per session?"
        *   **Sliders (`flex flex-col gap-6`):**
            *   **Days per week Slider:**
                *   Label: "Days per week" (`text-white text-base font-medium`).
                *   Current Value: "4 days" (`text-white text-sm`).
                *   Slider Track: `flex h-1 flex-1 rounded-sm bg-primary/20`. Active portion `w-[50%] rounded-sm bg-primary`. Thumb: `size-4 rounded-full bg-primary`.
            *   **Minutes per session Slider:**
                *   Label: "Minutes per session" (`text-white text-base font-medium`).
                *   Current Value: "45 min" (`text-white text-sm`).
                *   Slider Track: `flex h-1 flex-1 rounded-sm bg-primary/20`. Active portion `w-[40%] rounded-sm bg-primary`. Thumb: `size-4 rounded-full bg-primary`.
    *   **Sticky Footer (`<footer>`):** Fixed bottom (`fixed bottom-0`, `z-10`, `bg-gradient-to-t from-background-dark to-transparent`).
        *   **`[ Arrow Forward Button ]`:** Large, full-width `h-14`, `rounded-full bg-primary text-background-dark`, containing `arrow_forward` Material Symbol (`!text-3xl`). This serves as the "Continue/Next" action.
*   **Interactions:**
    *   **Sliders:** Users adjust sliders to select their preferred "Days per week" and "Minutes per session".
    *   **Tapping `Arrow Forward Button`:** Proceeds to the next step in the onboarding flow.

### **Step 3: Equipment (Implemented by `docs/stich_design/Flow_2/onboarding_step_3_equipment/code.html`)**

*   **Description:** This screen allows the user to specify their available workout equipment through a set of predefined options and a custom input. The design is based on the provided `code.html`, maintaining the dark theme, Lexend font, and primary green accents within a conversational AI interface.
*   **Visual Elements (Referencing `code.html`):**
    *   **Overall Layout:** `main-container`, `flex-col`, `h-100vh`, `overflow: hidden`, `font-display`. `bg-background-dark`.
    *   **Header:** Fixed top header (`sticky top-0`, `z-10`, `bg-background-dark`).
        *   **Progress Indicator:** `flex w-full flex-row items-center justify-center gap-3 py-5`. Shows current progress (e.g., three `bg-primary` for completed steps, two `bg-primary/20` for pending steps).
    *   **Main Content (`<main>`):** Scrollable area (`content-area`, `p-4`, `flex-grow-1`, `overflow-y-auto`).
        *   **AI Chat Bubble:**
            *   Avatar: Circular `w-10` with `bg-cover bg-center` and specific image URL.
            *   "AI Trainer" label: `text-primary/70`.
            *   Speech Bubble: `max-w-[360px] rounded-xl px-4 py-3 bg-[#23482f] text-white`. Content: "Got it. What equipment do you have access to?"
        *   **Equipment Selection Buttons:** Vertically stacked (`flex-col gap-3`), centered within a `max-w-[480px]` container.
            *   Buttons (`h-12`, `rounded-full`, `px-5`, `text-base font-bold`, `w-full`):
                *   Selected Option (e.g., "No Equipment"): `bg-primary text-background-dark`.
                *   Unselected Options (e.g., "Basic (Dumbbells, Bands)", "Full Gym"): `border border-primary/50 bg-transparent text-white`.
                *   `[ Specify... ]` Button: `border border-primary/50 bg-transparent text-white`. This option signals a user's intent to provide custom input.
    *   **Sticky Footer (`<footer>`):** Fixed bottom (`sticky bottom-0`, `z-10`, `bg-background-dark`).
        *   **`[ Arrow Forward Button ]`:** Large, full-width `h-12`, `rounded-full bg-primary text-background-dark`, containing `arrow_forward` Material Symbol. This serves as the "Continue/Next" action.
*   **Interactions:**
    *   **Tapping Equipment Buttons:** Selects available equipment.
    *   **Tapping `Specify...` button:** (Implicitly) reveals a text input field in the Sticky Footer for custom equipment entry (aligned with **Improvement: Enhance Flexibility in User Input for Equipment**).
    *   **Tapping `Arrow Forward Button`:** Proceeds to the next step in the onboarding flow.

### **Step 4: Injuries & Limitations (Implemented by `docs/stich_design/Flow_2/onboarding_step_4_injuries_&_limitations/code.html`)**

*   **Description:** This screen allows the user to specify any physical injuries or limitations they may have, ensuring the AI can generate safe and effective workout plans. The design is based on the provided `code.html`, maintaining the dark theme, Lexend font, and primary green accents within a conversational AI interface.
*   **Visual Elements (Referencing `code.html`):**
    *   **Overall Layout:** `h-auto min-h-screen`, `w-full`, `flex-col`, `overflow-x-hidden`, `font-display`. `bg-background-dark`.
    *   **Header:** Fixed top header (`fixed top-0`, `z-10`, `bg-background-dark/80 backdrop-blur-sm`).
        *   **Progress Indicator:** `flex w-full flex-row items-center justify-center gap-3 py-5`. Shows current progress (e.g., four `bg-primary` for completed steps, two `bg-[#326744]` for pending steps).
    *   **Main Content (`<main>`):** Scrollable area (`flex-1`, `overflow-y-auto`, `px-4 pt-20 pb-28`).
        *   **AI Chat Bubble:**
            *   Avatar: Circular `w-10` with `bg-cover bg-center` and specific image URL.
            *   "AI Trainer" label: `text-[#92c9a4]`.
            *   Speech Bubble: `max-w-[360px] rounded-xl px-4 py-3 bg-[#193322] text-white`. Content: "Thanks. To keep you safe, do you have any injuries or limitations I should be aware of?"
        *   **Injury/Limitation Chips:** `flex gap-3 p-3 flex-wrap pl-16`.
            *   Chips (`h-10`, `rounded-full`, `px-5`, `text-sm font-medium`):
                *   Selected Chip (e.g., "Knees"): `border border-primary bg-primary/20 text-primary`.
                *   Unselected Chips (e.g., "Shoulders", "Back", "None"): `border border-[#326744] bg-transparent text-white`.
        *   **Text Input Field (`textarea`):** `max-w-[480px] flex-wrap items-end gap-4 px-3 py-3 pl-16`.
            *   Label (implicit via placeholder): "Specific details or other limitations..."
            *   Input Field: `form-input resize-none rounded-xl border border-[#326744] bg-[#193322] focus:border-primary placeholder:text-[#92c9a4] p-4 text-base font-normal leading-normal`.
            *   `[ info ]` icon: Material Symbol `info` (`absolute right-3 top-3.5 text-[#92c9a4] cursor-help`) for context.
    *   **Sticky Footer (`<footer>`):** Fixed bottom (`fixed bottom-0`, `z-10`, `w-full bg-background-dark/80 p-4 backdrop-blur-sm`).
        *   **`[ Arrow Forward Button ]`:** Large, full-width `h-14`, `rounded-full bg-primary text-background-dark`, containing `arrow_forward` Material Symbol (`text-3xl`). This serves as the "Continue/Next" action.
*   **Interactions:**
    *   **Tapping Chips:** Selects common injury/limitation areas.
    *   **Textarea Input:** Allows users to describe specific details or other limitations.
    *   **Tapping `Arrow Forward Button`:** Proceeds to the next step in the onboarding flow.

### **Step 5: Units (Implemented by `docs/stich_design/Flow_2/onboarding_step_5_units/code.html`)**

*   **Description:** This screen allows the user to select their preferred unit system (kilograms or pounds) for weight measurements. The design is based on the provided `code.html`, maintaining the dark theme, Lexend font, and primary green accents within a conversational AI interface.
*   **Visual Elements (Referencing `code.html`):**
    *   **Overall Layout:** `h-[100dvh]`, `w-full`, `flex-col`, `overflow-hidden`, `font-display`. `bg-background-dark`.
    *   **Header:** Fixed top header (`fixed top-0`, `z-10`, `w-full bg-background-dark`).
        *   **Progress Indicator:** `flex w-full flex-row items-center justify-center gap-2 py-5 px-4`. Shows current progress (e.g., five `bg-primary` for completed steps, one `bg-component-dark/50` for pending steps).
    *   **Main Content (`<main>`):** Scrollable area (`flex-1`, `overflow-y-auto`, `pt-20 pb-28 px-4`).
        *   **AI Chat Bubble:**
            *   Avatar: Circular `w-10 h-10` with `bg-cover bg-center` and specific image URL.
            *   "AI Trainer" label: `text-text-muted-dark`.
            *   Speech Bubble: `max-w-[360px] rounded-2xl rounded-bl-sm px-4 py-3 bg-component-dark text-text-dark`. Content: "Last question. Do you prefer to work with kilograms or pounds?"
        *   **Segmented Buttons (Unit Selection):** `flex py-3`.
            *   Container: `flex h-12 flex-1 items-center justify-center rounded-full bg-component-dark p-1.5`.
            *   Buttons (`label` with `input[type="radio"]`):
                *   Selected (e.g., "kg"): `has-[:checked]:bg-background-dark has-[:checked]:shadow-md has-[:checked]:text-text-dark`.
                *   Unselected (e.g., "lbs"): `text-text-muted-dark`.
                *   Text: `text-sm font-semibold`.
    *   **Sticky Footer (`<footer>`):** Fixed bottom (`fixed bottom-0`, `z-10`, `w-full bg-gradient-to-t from-background-dark to-transparent`).
        *   **`[ Arrow Forward Button ]`:** Large, full-width `h-14`, `rounded-full bg-primary text-background-dark`, containing `arrow_forward` Material Symbol. This serves as the "Continue/Next" action.
*   **Interactions:**
    *   **Tapping Segmented Buttons:** Toggles between "kg" and "lbs" for unit preference.
    *   **Tapping `Arrow Forward Button`:** Proceeds to the next step in the onboarding flow.

### **Step 6: Confirmation & Redirection (Implemented by `docs/stich_design/Flow_2/onboarding_step_6_confirmation/code.html`)**

*   **Description:** This final onboarding screen confirms that the AI has gathered all necessary information and is ready to create the user's first workout plan, followed by an automatic redirection. The design is based on the provided `code.html`, maintaining the dark theme, Lexend font, and primary green accents within a conversational AI interface.
*   **Visual Elements (Referencing `code.html`):**
    *   **Overall Layout:** `h-screen min-h-[600px]`, `w-full max-w-md`, `flex-col`, `overflow-hidden`, `font-display`. `bg-background-dark`.
    *   **Header:** Fixed top header (`fixed top-0`, `left-1/2`, `z-10`, `w-full max-w-md -translate-x-1/2 bg-background-dark/80 backdrop-blur-sm`).
        *   **Progress Indicator:** `flex w-full flex-row items-center justify-center gap-3 px-4`. Shows full progress (six `bg-primary` for completed steps).
    *   **Main Content (`<main>`):** Centered content area (`flex-1`, `flex-col`, `items-center justify-center px-4 pb-28 pt-20`).
        *   **AI Chat Bubble:**
            *   Avatar: Circular `w-10` with `bg-cover bg-center` and specific image URL.
            *   "AI Coach" label: `text-primary/70`.
            *   Speech Bubble: `max-w-[360px] rounded-2xl rounded-bl-sm px-4 py-3 bg-gray-800 text-gray-100`. Content: "Perfect! I have everything I need to create your first workout plan."
    *   **Sticky Footer (`<footer>`):** Fixed bottom (`fixed bottom-0`, `left-1/2`, `z-10`, `w-full max-w-md -translate-x-1/2 bg-background-dark/80 pb-6 pt-4 backdrop-blur-sm`).
        *   **`[ Arrow Forward Button ]`:** Large, full-width `h-14`, `rounded-full bg-primary text-background-dark`, containing `arrow_forward` Material Symbol (`text-3xl`). This serves as the "Continue/Next" action.
*   **Interactions:**
    *   **AI Prompt:** Communicates completion of the setup process.
    *   **Tapping `Arrow Forward Button`:** Triggers the automatic redirection to the **Dashboard**.
    *   **Automatic Redirection:** After a short pause or on tap of the `[ Arrow Forward Button ]`, the app transitions to the **Dashboard**.

---

## **Flow 3: Connect Spotify (Optional Music Integration)**

**Goal:** To enable users to connect their Spotify account seamlessly, clearly explaining the benefits and permissions upfront.

### **Trigger Points:**

1.  During Onboarding (Post-Flow 2).
2.  Settings Menu (`Music & Playback` section).

### **Screen 1: Spotify Connection Explainer (New Improvement - Implemented by `docs/stich_design/Flow_3/Screen 1/code.html`)**

*   **Description:** This interstitial screen appears *before* redirecting to Spotify OAuth, proactively informing the user about the value and required permissions. It features a compelling header image and a clear list of benefits and permissions, consistent with the app's dark theme and vibrant green accent, as laid out in the `code.html`.
*   **Visual Elements (Referencing `code.html`):**
    *   **Overall Layout:** `h-auto min-h-screen`, `w-full`, `flex-col`, `overflow-x-hidden`, `font-display`. `bg-background-light dark:bg-background-dark`.
    *   **Top App Bar:** `sticky top-0 z-10 flex items-center justify-between p-4 pb-2 bg-background-light dark:bg-background-dark`.
        *   `[ Close Button ]`: `material-symbols-outlined` (`close`, `text-gray-800 dark:text-white`).
        *   Heading: "Connect Spotify" (`text-lg font-bold text-gray-900 dark:text-white`).
    *   **Header Image:** `w-full bg-center bg-no-repeat bg-cover rounded-lg min-h-60`. Background image dynamically loaded.
    *   **Headline:** "Power Your Workouts with Music" (`text-gray-900 dark:text-white tracking-tight text-[32px] font-bold leading-tight text-center pb-3 pt-8`).
    *   **Body Text:** "Connect Spotify to get AI-curated playlists that match your intensity, motivate you, and help you hit your goals." (`text-gray-600 dark:text-gray-300 text-base font-normal leading-normal pb-3 pt-1 text-center`).
    *   **Benefit List (3 items):** `flex flex-col gap-2 pt-6 pb-6 px-4`. Each item (`min-h-[72px]`) is a flex container:
        *   `[ Icon ]`: `material-symbols-outlined` (`psychology`, `analytics`, `music_note`), `text-primary`, within `rounded-full bg-primary/20 shrink-0 size-12`.
        *   `[ Title ]`: (e.g., "AI-Powered Playlists", `text-gray-900 dark:text-white text-base font-medium`).
        *   `[ Description ]`: (e.g., "Music dynamically selected...", `text-gray-500 dark:text-gray-400 text-sm font-normal`).
    *   **Permissions Section (Boxed):** `flex flex-col gap-4 bg-gray-100 dark:bg-white/10 p-4 mx-4 rounded-lg`.
        *   Heading: "To do this, we'll need permission to:" (`text-base font-bold text-gray-900 dark:text-white`).
        *   Permission Items (2 items):
            *   `[ check_circle Icon ]`: `material-symbols-outlined text-primary`.
            *   Description: `text-sm font-normal text-gray-600 dark:text-gray-300`, with `span` for bold title (`font-medium text-gray-800 dark:text-gray-100`).
    *   **Sticky Footer (CTA):** `sticky bottom-0 mt-auto flex flex-col gap-4 bg-background-light dark:bg-background-dark pt-6 pb-8 px-4`.
        *   **Primary Button:** `[ Connect with Spotify ]` (`flex w-full items-center justify-center gap-2.5 rounded-full bg-primary py-4 text-center font-bold text-background-dark`), includes Spotify SVG icon.
        *   **Disclaimer:** "We will never post anything without your permission. `[Read our Privacy Policy]`" (`text-center text-xs text-gray-500 dark:text-gray-400`, with `underline` link).
*   **Interactions:**
    *   **Tap `[ Close Button ]`:** Returns to the previous screen (e.g., Settings or Onboarding).
    *   **Tap `[ Connect with Spotify ]`:** Initiates the external Spotify OAuth flow.
    *   **Tap `Read our Privacy Policy` link:** Navigates to the privacy policy document.

### **Screen 2: Spotify OAuth (External Process)**

*   **Description:** User is redirected to Spotify's secure consent page.
*   **Interactions:** User logs in, reviews permissions. On approval, redirects back to app; on denial, redirects back with cancellation.

### **Screen 3: Spotify Connection Status & Confirmation (Implemented by `docs/stich_design/Flow_3/Screen 3/code.html`)**

*   **Description:** This screen appears immediately upon return from Spotify OAuth, providing visual feedback on the connection status (success or failure) and guiding the user to the next steps. The design is based on the provided `code.html`, maintaining the dark theme and Lexend font.
*   **Visual Elements (Referencing `code.html`):**
    *   **Overall Layout:** `h-auto min-h-screen`, `w-full`, `flex-col`, `items-center justify-center`. `bg-background-dark`.
    *   **Common Structure:** Both success and failure states share a central `max-w-sm flex-col items-center` container.
    *   **If Successful State:**
        *   **Icon:** Large `material-symbols-outlined check_circle` (`text-6xl text-primary`) within a `h-24 w-24 rounded-full bg-primary/20` circle.
        *   **Header:** "Spotify Connected!" (`text-white tracking-light text-3xl font-bold leading-tight px-4 text-center pb-3`).
        *   **Message:** "Your Spotify account is now linked and ready to sync with your workouts." (`text-white/70 text-base font-normal leading-normal pb-8 pt-1 px-4 text-center`).
        *   **Action Buttons:** Stacked `flex-col items-stretch gap-3`.
            *   `[ Continue ]` (Primary): `bg-primary text-background-dark`.
            *   `[ Explore Music Settings ]` (Secondary): `bg-transparent text-primary`.
    *   **If Failed State:**
        *   **Icon:** Large `material-symbols-outlined cancel` (`text-6xl text-red-500`) within a `h-24 w-24 rounded-full bg-red-500/20` circle.
        *   **Header:** "Connection Unsuccessful" (`text-white tracking-light text-3xl font-bold leading-tight px-4 text-center pb-3`).
        *   **Message:** "We couldn't link your Spotify account because the connection was cancelled." (`text-white/70 text-base font-normal leading-normal pb-8 pt-1 px-4 text-center`).
        *   **Action Buttons:** Stacked `flex-col items-stretch gap-3`.
            *   `[ Try Again ]` (Primary): `bg-primary text-background-dark`.
            *   `[ Maybe Later ]` (Secondary): `bg-transparent text-primary`.
*   **Interactions:**
    *   **Successful Connection:** User can `[ Continue ]` (e.g., to Dashboard) or `[ Explore Music Settings ]`.
    *   **Failed Connection:** User can `[ Try Again ]` or choose `[ Maybe Later ]`.

### **Screen 4: Post-Connection Features (Settings -> Music & Playback) (Implemented by `docs/stich_design/Flow_3/Screen 4/code.html`)**

*   **Description:** This screen in the settings provides comprehensive controls for managing Spotify connection and personalizing music preferences for AI-generated mixes. The design is based on the provided `code.html`, featuring a dark theme, Lexend font, and primary green accents.
*   **Visual Elements (Referencing `code.html`):**
    *   **Overall Layout:** `h-auto min-h-screen`, `w-full`, `flex-col`, `overflow-x-hidden`, `font-display`. `bg-background-light dark:bg-background-dark`.
    *   **Top App Bar:** `flex items-center p-4 pb-2`.
        *   `[ Back Button ]`: `arrow_back_ios_new` Material Symbol (`text-zinc-400`).
        *   Heading: "Music & Playback" (`text-zinc-900 dark:text-white text-lg font-bold`).
    *   **Spotify Connection Status:** Card-like section (`rounded-lg bg-white/5 p-4`).
        *   Spotify Icon (`svg`), Status "Connected" (`text-primary text-base font-medium`).
        *   `[ Disconnect ]` Button (`text-primary text-base font-medium`).
    *   **Playback Options Section:**
        *   Section Header: "Playback Options" (`text-zinc-500 dark:text-zinc-400 text-xs font-bold uppercase`).
        *   **`Use Session Mix` Toggle:** List item (`min-h-[72px]`), includes icon (`spark` Material Symbol), title, description, and a `toggle switch` (`has-[:checked]:bg-primary`).
        *   **`BPM Matching by Workout Phase` Toggle:** Similar list item with `music_note` Material Symbol and toggle switch.
    *   **Music Preferences for AI Mixes Section:**
        *   Section Header: "Music Preferences for AI Mixes" (`text-zinc-500 dark:text-zinc-400 text-xs font-bold uppercase`).
        *   **`Preferred Genres` Link:** Button (`min-h-[56px]`), with `chevron_right` Material Symbol.
        *   **`Favorite Workout Artists` Link:** Similar button.
    *   **Energy Level Slider:**
        *   Label: "Overall Energy Level" (`text-zinc-900 dark:text-white`).
        *   Slider: `input type="range"` (`w-full h-2 bg-zinc-700 rounded-lg accent-primary`).
        *   Labels for range: "Low", "Medium", "High" (`text-xs text-zinc-500 dark:text-zinc-400`).
    *   **Exclude Artists/Genres Input:**
        *   Label: "Exclude Artists/Genres" (`text-zinc-900 dark:text-white`).
        *   Display of excluded items: (e.g., "Country" chip `rounded-full bg-primary/20 px-3 py-1.5 text-sm text-primary` with a close button).
        *   Input field: `input type="text"` (`w-full bg-transparent border-b border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus:border-primary`).
*   **Interactions:**
    *   **Tap `[ Back Button ]`:** Returns to the main settings screen.
    *   **Tap `Disconnect`:** Disconnects Spotify account.
    *   **Toggles:** Enable/disable "Use Session Mix" and "BPM Matching".
    *   **Links (`Preferred Genres`, `Favorite Workout Artists`):** Navigate to sub-screens for detailed preference editing.
    *   **Slider:** Adjusts "Overall Energy Level."
    *   **Exclude Input:** Allows adding/removing artists or genres to exclude from AI mixes.

---

## **Flow 6: Generate AI Daily Plan**

**Goal:** To allow users to quickly provide their current context, receive a transparently adapted AI-generated workout plan, and maintain control over the final plan before committing.

### **Trigger Points:**

1.  Dashboard CTA (`[ Generate Today's Plan ]`).
2.  Auto-generated (Morning) if enabled.

### **Screen 1: Context Window (Implemented by `docs/stich_design/Flow_6/screen_1/code.html` - Top Section)**

*   **Description:** This screen serves as a modal or overlay allowing the user to quickly input their current mood and energy level, influencing the AI's daily plan generation. The design is based on the top section of the provided `code.html`, featuring a dark theme with Lexend font.
*   **Visual Elements (Referencing `code.html`):**
    *   **Top App Bar:** `flex items-center bg-[#102216] p-4 pb-2 justify-between sticky top-0 z-10`.
        *   `[ Back Button ]`: `arrow_back_ios_new` Material Symbol (`text-white text-3xl`).
        *   Heading: "Your Daily Plan" (`text-white text-lg font-bold`).
    *   **Smart Context Window Section:** `p-4 @container`.
        *   Container: `flex flex-col items-stretch justify-start rounded-xl bg-[#193322] p-4`.
        *   Main Heading: "How are you feeling today?" (`text-white text-lg font-bold`).
        *   Sub-heading: "Select your mood and energy level to generate a plan." (`text-[#92c9a4] text-base`).
        *   **Mood Selection:** `text-white text-lg font-bold pt-6 pb-2`.
            *   Segmented Button Group: `flex h-12 flex-1 items-center justify-center rounded-full bg-[#23482f] p-1`.
            *   Options (e.g., "Stressed 😫", "Neutral 😐", "Motivated 🤩"): `label` with `input[type="radio"]`. Selected `has-[:checked]:bg-[#102216] has-[:checked]:text-white`, unselected `text-[#92c9a4]`. Icons are emojis.
        *   **Energy Level Selection:** `text-white text-lg font-bold pt-6 pb-2`.
            *   Segmented Button Group: `flex h-12 flex-1 items-center justify-center rounded-full bg-[#23482f] p-1`.
            *   Options (e.g., "Low ⚡️", "Medium ⚡️⚡️", "High ⚡️⚡️⚡️"): `label` with `input[type="radio"]`. Selected `has-[:checked]:bg-[#102216] has-[:checked]:text-white`, unselected `text-[#92c9a4]`. Icons are Material Symbols (`battery_low`, `battery_horiz_050`, `battery_full`) with `text-yellow-400` or `text-primary`.
        *   **Action Button:** `[ Generate Today's Plan ]` (`mt-8 flex h-14 w-full items-center justify-center rounded-full bg-primary text-background-dark text-lg font-bold`).
*   **Interactions:**
    *   **Mood/Energy Selection:** User taps on mood and energy options.
    *   **Tap `[ Back Button ]`:** Returns to the previous screen (e.g., Dashboard).
    *   **Tap `[ Generate Today's Plan ]`:** Submits mood/energy context and initiates plan generation.
```

### **Screen 2: AI Plan Generation (Loading State) (Implemented by `docs/stich_design/Flow_6/screen_2/code.html`)**

*   **Description:** This interstitial screen provides a visual indication that the AI is actively generating the daily workout plan, enhancing user experience during a brief waiting period. The design is based on the provided `code.html`, featuring a dark, motivating aesthetic.
*   **Visual Elements (Referencing `code.html`):**
    *   **Overall Layout:** `h-screen w-full flex-col overflow-hidden`, `font-display`. `bg-background-dark`.
    *   **Background:** Full-screen image of a gym (`bg-center bg-no-repeat bg-cover`) with a `bg-background-dark/80 backdrop-blur-sm` overlay.
    *   **Main Content:** `flex flex-col h-full p-4`. Vertically centered elements.
        *   **Loading Indicator:**
            *   Outer Circle: `h-20 w-20 rounded-full bg-primary/20`.
            *   Inner Circle: `h-16 w-16 rounded-full bg-primary`.
            *   Icon: `fitness_center` Material Symbol (`text-background-dark text-4xl animate-pulse`).
        *   **Headline:** "Preparing your workout..." (`text-white tracking-tight text-4xl font-bold leading-tight px-4 pb-3`).
        *   **Message:** "Your personalized session is moments away." (`text-white/80 text-lg font-normal leading-normal px-4`).
    *   **Progress Bar:** `flex flex-col gap-3 p-4`.
        *   Label: "Analyzing your goals" (`text-white text-base font-medium`).
        *   Bar: `h-2 rounded bg-primary` within `rounded bg-white/10 overflow-hidden` (e.g., `width: 75%`).
    *   **Footer Tip:** "Tip: Remember to breathe during your reps." (`text-white/60 text-base font-normal leading-normal`).
*   **Interactions:** Automatically transitions to **Screen 3: Review Proposed Plan** on completion of the plan generation. Displays fallback message on timeout/failure.

### **Screen 3: Review Proposed Plan (Implemented by `docs/stich_design/Flow_6/screen_3/code.html`)**

*   **Description:** This screen allows the user to review the AI-generated workout plan, including contextual adjustments, and provides options to confirm or edit the plan before starting the workout. The design is based on the provided `code.html`, featuring a dark theme with Lexend font.
*   **Visual Elements (Referencing `code.html`):**
    *   **Overall Layout:** `h-auto min-h-screen`, `w-full`, `flex-col`, `overflow-x-hidden`, `font-display`. `bg-background-dark`.
    *   **Top App Bar:** `sticky top-0 z-10 flex items-center bg-background-dark/80 p-4 pb-2 justify-between backdrop-blur-md`.
        *   `[ Back Button ]`: `arrow_back_ios_new` Material Symbol (`text-white text-3xl`).
        *   Heading: "Your Daily Plan" (`text-white text-lg font-bold`).
        *   `[ More Options ]` Button: `more_vert` Material Symbol (`text-white text-3xl`).
    *   **Headline Text:** "Review & Adjust" (`text-white tracking-tight text-[32px] font-bold leading-tight text-left pb-3 pt-6`).
    *   **AI Context Card (`mb-6 @container`):**
        *   Container: `flex flex-col items-stretch justify-start rounded-xl bg-white/5 p-4`.
        *   Message: "Heard you were feeling a bit low on energy. I've reduced your volume by 10% and lowered the intensity to focus on active recovery while still making progress. Let's get it!" (`text-white text-lg font-bold`, `text-gray-300 text-base font-normal`).
    *   **Workout Section (`space-y-2`):**
        *   Each Exercise Item: `flex gap-4 bg-white/5 rounded-lg px-4 py-3 justify-between items-center`.
            *   Thumbnail Image: `size-[70px] bg-center bg-no-repeat bg-cover rounded-lg`.
            *   Exercise Details:
                *   Name: `text-white text-base font-medium`.
                *   RPE: `flex items-center gap-2`. Small dot (`h-1.5 w-1.5 rounded-full bg-primary`), text (`text-gray-300 text-sm font-normal`).
                *   Sets/Reps: `text-gray-300 text-sm font-normal`.
            *   `[ Info ]` Icon: `material-symbols-outlined info` (`text-primary`) for modified exercises.
    *   **Action Buttons & Bottom Nav (Fixed Bottom):** `fixed bottom-0 left-0 right-0 w-full bg-background-dark`.
        *   **Action Buttons:** `flex flex-col gap-3 p-4`.
            *   `[ Confirm Plan ]`: Primary button (`bg-primary text-background-dark text-lg font-bold`).
            *   `[ Edit Plan ]`: Secondary button (`border border-white/20 bg-transparent text-white text-lg font-bold`).
        *   **Bottom Navigation Bar:** `flex w-full justify-around border-t border-white/10 bg-background-dark/80 px-2 pb-6 pt-2 backdrop-blur-md`.
            *   Icons for "Dashboard", "Workout" (selected `text-primary`, `FILL:1`), "History", "Settings".
*   **Interactions:**
    *   **Tap `[ Back Button ]`:** Returns to the previous screen.
    *   **Tap `[ More Options ]`:** Reveals additional options (e.g., save, share).
    *   **Tap `[ Confirm Plan ]`:** Accepts the plan and proceeds.
    *   **Tap `[ Edit Plan ]`:** Navigates to a plan editing interface.
    *   **Bottom Navigation:** Allows quick navigation between main app sections.
```

### **Screen 4: Plan Confirmed/Saved (Implemented by `docs/stich_design/Flow_6/screen_4/code.html`)**

*   **Description:** This brief confirmation screen appears after a workout plan has been successfully generated and confirmed, providing visual feedback to the user before automatically redirecting to the dashboard. The design is based on the provided `code.html`, featuring a dark theme with Lexend font.
*   **Visual Elements (Referencing `code.html`):**
    *   **Overall Layout:** `h-screen w-full flex-col items-center justify-center p-4`, `font-display`. `bg-background-dark`.
    *   **Content:** Centered `flex flex-col items-center justify-center gap-6 text-center`.
    *   **Confirmation Icon:**
        *   Outer Circle: `relative flex h-24 w-24 items-center justify-center rounded-full bg-primary/20`.
        *   Inner Circle: `flex h-20 w-20 items-center justify-center rounded-full bg-primary/30`.
        *   Icon: `check_circle` Material Symbol (`text-primary text-6xl`).
    *   **Headline:** "Plan Confirmed!" (`text-gray-900 dark:text-white tracking-tight text-3xl font-bold leading-tight`).
    *   **Message:** "Redirecting to your Dashboard..." (`text-gray-600 dark:text-gray-400 text-base font-normal leading-normal`).
*   **Interactions:** Automatically redirects to the **Dashboard** after a short delay (not explicitly shown in HTML but implied by the message).

---

## **Flow 7: Start Workout (Using AI Plan or Synced Plan)**

**Goal:** To provide a smooth, clear, and prepared transition into the active workout session, starting with a distinct warm-up phase.

### **Trigger:**

*   User taps `[ Start Workout ]` from the Dashboard or a specific plan card.

### **Screen 1: Workout Loading State (Implemented by `docs/stich_design/Flow_7/screen_1/code.html`)**

*   **Description:** This brief interstitial screen signals to the user that the workout plan is being prepared, providing a moment of anticipation before the session begins. The design is based on the provided `code.html`, featuring a dark theme with a prominent AI icon and a progress bar.
*   **Visual Elements (Referencing `code.html`):**
    *   **Overall Layout:** `h-screen min-h-screen w-full flex-col items-center justify-center p-4`, `font-display`. `bg-background-dark`.
    *   **Content:** Centered `flex flex-col items-center justify-center space-y-8 text-center`.
    *   **App Logo or AI Icon:**
        *   Outer Circle: `relative w-24 h-24`. `rounded-full bg-primary/20`.
        *   Icon: `neurology` Material Symbol (`text-primary !text-5xl`).
    *   **Message:** "Loading your personalized plan..." (`text-slate-300 dark:text-slate-300 text-lg font-normal leading-normal`).
    *   **Progress Bar:** `flex flex-col gap-3 w-full max-w-xs`.
        *   Track: `rounded-full bg-primary/20`.
        *   Fill: `h-2 rounded-full bg-primary` (e.g., `width: 60%`).
*   **Interactions:** Automatically transitions to **Screen 2: Pre-Workout Preparation** upon completion of loading.

### **Screen 2: Pre-Workout Preparation / Warm-up Introduction (Implemented by `docs/stich_design/Flow_7/screen_2/code.html`)**

*   **Description:** This screen acts as a transition and preparation hub before the main workout, providing a summary of the upcoming session and an introduction to the warm-up routine. The design is based on the provided `code.html`, featuring a dark theme with Lexend font.
*   **Visual Elements (Referencing `code.html`):**
    *   **Overall Layout:** `h-auto min-h-screen w-full max-w-md flex-col overflow-x-hidden`, `font-display`. `bg-background-dark`.
    *   **Headline:** "Ready for your workout?" (`text-white tracking-light text-[32px] font-bold leading-tight px-4 text-left pb-3 pt-6`).
    *   **Workout Summary Card:** (`p-4 @container`).
        *   Container: `flex flex-col items-stretch justify-start rounded-xl bg-[#182d20]`.
        *   Image: `w-full bg-center bg-no-repeat aspect-video bg-cover rounded-t-xl`.
        *   Details: `flex w-full min-w-72 grow flex-col items-stretch justify-center gap-1 p-4`.
            *   Title: "Full Body Strength" (`text-white text-lg font-bold`).
            *   Sub-details: "45 Mins · Strength", "Equipment: Dumbbells, Bench" (`text-[#92c9a4] text-base font-normal`).
    *   **AI Coach Message:** `flex items-end gap-3 p-4`.
        *   Avatar: `w-10 shrink-0 rounded-full bg-cover`.
        *   AI Coach Label: `text-[#92c9a4] text-[13px]`.
        *   Speech Bubble: `max-w-[360px] rounded-xl px-4 py-3 bg-[#23482f] text-white`. Content: "Let's get you warmed up first!"
    *   **"Today's Warm-up:" Section:**
        *   Header: `text-white text-lg font-bold px-4 pb-2 pt-4`.
        *   Warm-up Exercise List (`flex items-center gap-4 px-4 min-h-14`):
            *   Icon: Material Symbol (e.g., `directions_run`, `rotate_right`, `swipe_right`), `text-white`, within `rounded-lg bg-[#23482f] size-10`.
            *   Exercise Name: `text-white text-base font-normal`.
    *   **Action Buttons:** `flex flex-col gap-4 px-4 mt-4`.
        *   `[ Start Warm-up ]`: Primary button (`bg-primary text-background-dark text-lg font-bold rounded-full`).
        *   `[ Review Plan ]`: Secondary button (`border-2 border-primary/50 text-primary text-lg font-bold rounded-full`).
        *   `[ Connect Heart Rate ]`: Secondary button (`border-2 border-primary/50 text-primary text-lg font-bold rounded-full`).
    *   **Bottom Navigation:** Fixed bottom bar (`fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-background-dark/80 backdrop-blur-lg border-t border-white/10`).
        *   Icons for "Dashboard", "Workout" (selected `text-primary`, `FILL:1`), "History", "Settings".
*   **Interactions:**
    *   **Tap `[ Start Warm-up ]`:** Initiates the warm-up phase of the workout.
    *   **Tap `[ Review Plan ]`:** Navigates to a detailed view of the workout plan.
    *   **Tap `[ Connect Heart Rate ]`:** Initiates heart rate monitor connection.
    *   **Bottom Navigation:** Allows quick navigation between main app sections.

### **Screen 3: Active Workout Player (Warm-up Phase) (Implemented by `docs/stich_design/Flow_7/screen_3/code.html`)**

*   **Description:** This screen provides an active environment for users to perform their warm-up exercises, featuring clear exercise instructions, a countdown timer, and navigation controls. The design is based on the provided `code.html`, with a dark theme and prominent visual elements.
*   **Visual Elements (Referencing `code.html`):**
    *   **Overall Layout:** `min-h-screen w-full flex-col`. `bg-background-dark`.
    *   **Top App Bar:** `flex items-center pb-2`.
        *   Heading: "WARM-UP" (`text-lg font-bold`).
        *   `[ More Options ]` Button: `more_horiz` Material Symbol (`text-black/90 dark:text-white/90`).
    *   **Media Player:** `py-4`.
        *   Container: `relative flex items-center justify-center overflow-hidden rounded-lg bg-cover bg-center aspect-video`. Dynamically loaded background image/animation for the exercise.
        *   Overlay: `absolute inset-0 bg-black/30`.
        *   `[ Play/Pause ]` Button: `relative flex shrink-0 items-center justify-center rounded-full size-16 bg-black/40 text-white`, with `play_arrow` Material Symbol (`!text-4xl FILL:1`).
    *   **Exercise Details:**
        *   Headline: "Jumping Jacks" (`text-center text-[32px] font-bold`).
        *   Instructions: "Stand with your feet together..." (`text-center text-base font-normal`).
    *   **Timer:** `flex gap-4 py-6`.
        *   Hour, Minute, Second Displays: Each in a `flex-col items-stretch gap-2` container. Value in `h-14 rounded-lg bg-black/5 dark:bg-white/10 px-3`, label below.
        *   Active Timer (Seconds): `h-14 rounded-lg bg-primary/20 dark:bg-primary/30 px-3 ring-2 ring-primary`. Value in `text-primary text-xl font-bold`.
    *   **Sticky Footer Area:** `fixed bottom-0 left-0 right-0 bg-background-dark/80 backdrop-blur-lg`.
        *   **Action Buttons:** `space-y-3`.
            *   `[ Next Exercise ]`: Primary button (`bg-primary text-background-dark text-base font-bold`).
            *   `[ Finish Warm-up ]`: Secondary button (`border border-primary text-primary text-base font-bold`).
        *   **Bottom Navigation Bar:** `flex items-center justify-around border-t border-black/10 dark:border-white/10 pt-3 mt-4`. Icons for Dashboard, Workout (selected `text-primary FILL:1`), History, Settings.
*   **Interactions:**
    *   **Tap `[ Play/Pause ]`:** Controls the media playback for exercise demonstration.
    *   **Tap `[ Next Exercise ]`:** Advances to the next warm-up exercise.
    *   **Tap `[ Finish Warm-up ]`:** Ends the warm-up phase and proceeds to the main workout.
    *   **Bottom Navigation:** Allows quick navigation between main app sections.

### **Screen 4: Active Workout Player (Main Workout Ready) (Implemented by `docs/stich_design/Flow_7/screen_4/code.html` - UPDATED)**

*   **Description:** This screen prepares the user for the main workout, displaying the first exercise with its targets and an option to start the set. This is the "ready" state before logging begins. The design is based on the updated `code.html`, maintaining a dark theme and clear, functional elements.
*   **Visual Elements (Referencing the UPDATED `code.html`):**
    *   **Overall Layout:** `h-auto min-h-screen w-full flex-col`, `font-display`. `bg-background-dark`.
    *   **Main Content (`<main>`):** `flex-grow flex flex-col px-4 pt-4 pb-28`.
    *   **Header:** `flex flex-col items-center justify-center pt-8 pb-4`.
        *   Headline: "MAIN WORKOUT" (`text-text-primary-dark tracking-light text-[32px] font-bold`).
    *   **Overall Progress Bar:** `flex flex-col gap-2 mb-6`.
        *   Label: "Exercises" (`text-text-secondary-dark text-sm font-medium`).
        *   Progress: "1/5" (`text-text-primary-dark text-sm`).
        *   Bar: `rounded-full bg-surface-dark h-2`. Fill: `h-2 rounded-full bg-primary` (e.g., `width: 20%`).
    *   **Exercise Card:** `flex flex-col gap-4 bg-surface-dark p-4 rounded-lg`.
        *   Exercise Name: "Barbell Squat" (`text-text-primary-dark text-2xl font-bold`).
        *   **Action Buttons:** `flex gap-3`. `[ Swap Exercise ]` (`swap_horiz`) and `[ Info ]` (`info`) Material Symbols (`text-text-secondary-dark`).
        *   **Media Player:** `relative flex items-center justify-center bg-cover bg-center aspect-video rounded-lg`. Background image/video for exercise demonstration.
            *   `[ Play/Pause ]` Button: `size-14 bg-black/50 text-white backdrop-blur-sm`, with `play_arrow` Material Symbol (`fill text-4xl`).
        *   **Target Metrics:** `grid grid-cols-3 gap-2 text-center`. Each metric (`SETS`, `REPS`, `RPE`) displayed in `bg-background-dark py-3 rounded`.
            *   Label: `text-text-secondary-dark text-xs font-medium uppercase`.
            *   Value: `text-text-primary-dark text-lg font-bold`.
    *   **CTA Button:** `[ START SET 1 ]` (`w-full bg-primary text-background-dark h-14 rounded-full flex items-center justify-center text-lg font-bold`).
    *   **Bottom Navigation Bar:** `fixed bottom-0 left-0 right-0 bg-surface-dark/80 backdrop-blur-lg border-t border-white/10`.
        *   Icons for Dashboard, Workout (selected `text-primary fill`), History, Settings.
*   **Interactions:**
    *   **Tap `[ Swap Exercise ]`:** Allows changing the current exercise.
    *   **Tap `[ Info ]`:** Displays more information about the exercise.
    *   **Media Player Buttons:** Control exercise video.
    *   **Tap `[ START SET 1 ]`:** Initiates the first set of the exercise, likely transitioning to a logging interface.
    *   **Bottom Navigation:** Allows quick navigation between main app sections.

---

## **Flow 9: Perform & Log Workout**

**Goal:** To provide an intuitive, efficient, and adaptable interface for users to execute and accurately log their workout sets.

### **Screen: Active Workout Player (Main Workout View) (Implemented by `docs/stich_design/Flow_9/code.html`)**

*   **Description:** This is the primary screen for performing and logging the main workout, providing a comprehensive interface for tracking exercise progress, logging sets, and managing the workout flow. The design is based on the provided `code.html`, maintaining a dark theme with clear, functional elements.
*   **Visual Elements (Referencing `code.html`):**
    *   **Overall Layout:** `min-h-screen w-full flex-col`. `bg-background-dark`.
    *   **Top App Bar:** `sticky top-0 z-10 flex flex-col bg-background-dark/80 backdrop-blur-sm`.
        *   `[ Back Button ]`: `arrow_back_ios_new` Material Symbol (`text-white`).
        *   Workout Title: "Current Workout" (`text-white text-lg font-bold`).
        *   `[ More Options ]` Button: `more_horiz` Material Symbol (`text-white`).
    *   **Overall Workout Progress Bar:** `flex flex-col gap-2 px-4 pb-3`.
        *   Label: "Workout Progress" (`text-white text-sm font-medium`).
        *   Bar: `h-2 rounded-full bg-primary` within `rounded-full bg-white/10`.
        *   Text Progress: "3 of 8 exercises complete" (`text-primary/70 text-xs`).
    *   **Main Exercise Card (`flex flex-col gap-4`):**
        *   Section Header: "1/8 Barbell Squat" (`text-white text-[22px] font-bold pt-5`).
        *   **Media Player:** `relative flex items-center justify-center bg-cover bg-center aspect-video rounded-xl`. Background image/video for exercise demonstration.
            *   `[ Play/Pause ]` Button: `size-16 bg-black/40 text-white backdrop-blur-sm`, with `play_arrow` Material Symbol (`text-4xl`).
        *   **Set Progress Indicators (Dots):** `flex w-full flex-row items-center justify-start gap-3 py-2`. Filled dots `h-2 w-2 rounded-full bg-primary`, unfilled dots `bg-primary/30`.
    *   **Set Logging Area:** `mt-6 flex flex-col gap-3`.
        *   Header: "Log Your Sets" (`text-white/80 font-semibold`).
        *   **Completed Sets:** `flex flex-col gap-2`. Each completed set displayed in `bg-white/5 p-4 rounded-lg`.
            *   Details: "Set 1: 10 reps @ 100 kg" (`text-white/90`).
            *   RPE: "RPE 7" (`text-white/60 text-sm`).
            *   Confirmation: `check_circle` Material Symbol (`text-primary text-xl`).
        *   **Active Input Row:** `bg-primary/20 p-4 rounded-lg border border-primary/50 flex flex-col gap-4 mt-2`.
            *   **Weight, Reps, RPE Input:** Grid (`grid grid-cols-3 gap-3 text-center`) for "WEIGHT (KG)", "REPS", "RPE". Each has `[ - ]` and `[ + ]` buttons (`size-8 rounded-full bg-white/10 text-white`) and a central value display (`text-xl font-bold text-white`).
            *   **`[ Log Set ]` Button:** `w-full bg-primary text-background-dark font-bold py-4 rounded-lg`.
    *   **Persistent Footer Action Bar (`fixed bottom-0`):** `bg-background-dark/80 backdrop-blur-sm border-t border-white/10`.
        *   `[ Swap ]`: `swap_horiz` Material Symbol (`text-white/70`).
        *   `[ Notes ]`: `edit_note` Material Symbol (`text-white/70`).
        *   `[ History ]`: `history` Material Symbol (`text-white/70`).
*   **Interactions:**
    *   **Tap `[ Back Button ]`:** Returns to the previous screen.
    *   **Tap `[ More Options ]`:** Accesses workout settings/modifications.
    *   **Media Player Buttons:** Control exercise video.
    *   **`[ - ]` / `[ + ]` Buttons:** Adjust weight, reps, and RPE for the active set.
    *   **Tap `[ Log Set ]`:** Logs the current set and updates completed sets.
    *   **Footer Action Buttons:** Allows swapping exercises, adding notes, or viewing exercise history.

---

## **Flow 10: Finish Workout & AI Feedback**

**Goal:** To provide a rewarding and insightful conclusion to the workout, summarizing achievements and delivering actionable AI guidance.

### **Trigger:**

*   User taps `[ Finish Workout ]` from the Active Workout Player (Flow 9).

### **Screen 1: Post-Workout Summary & Feedback Input (Implemented by `docs/stich_design/Flow_10/screen_1/code.html`)**

*   **Description:** This screen provides a concise summary of the completed workout and prompts the user for subjective feedback on their RPE and perceived fatigue, serving as an input for AI feedback generation. The design is based on the provided `code.html`, featuring a dark theme with Lexend font.
*   **Visual Elements (Referencing `code.html`):
    *   **Overall Layout:** `h-auto min-h-screen w-full flex-col`, `font-display`. `bg-background-dark`.
    *   **Top App Bar:** `flex items-center p-4 pb-2 justify-between sticky top-0 bg-background-dark z-10`.
        *   `[ Close Button ]`: `close` Material Symbol (`text-white text-2xl`).
        *   Headline: "Workout Complete!" (`text-white text-lg font-bold`).
        *   `[ Trophy Icon ]`: `trophy` Material Symbol (`text-white text-2xl`).
    *   **Stats Section:** `flex flex-wrap gap-4 pt-4`.
        *   Cards (e.g., Duration, Total Volume, Sets/Reps): Each is `min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 bg-[#1A2D20]`.
            *   Label: `text-gray-300 text-base font-medium`.
            *   Value: `text-white tracking-light text-2xl font-bold`.
    *   **Feedback Section Header:** "How did that feel?" (`text-white text-[22px] font-bold pt-8 pb-3`).
    *   **RPE Slider (`@container bg-[#1A2D20] rounded-xl mb-4`):**
        *   Label: "Rate of Perceived Exertion" (`text-white text-base font-medium`).
        *   Current Value: "7" (`text-white text-lg font-bold`).
        *   Slider: `flex h-1.5 flex-1 rounded-full bg-[#2F4738]`. Fill: `w-[70%] rounded-full bg-primary`. Thumb: `size-5 rounded-full bg-white border-2 border-primary`.
        *   Labels: "Easy", "Moderate", "Hard", "Max" (`text-gray-400 text-xs`).
    *   **Fatigue Segmented Buttons (`flex flex-col gap-2 bg-[#1A2D20] rounded-xl p-4`):**
        *   Label: "Perceived Fatigue" (`text-white text-base font-medium`).
        *   Buttons: `flex h-10 flex-1 items-center justify-center rounded-full bg-[#102216] p-1`. Options (e.g., "Low", "Medium", "High", "Max"). Selected `has-[:checked]:bg-[#1A2D20] has-[:checked]:text-white`, unselected `text-gray-300`.
    *   **Quick Notes Text Area:** `textarea` (`w-full rounded-xl border-none bg-[#1A2D20] p-4 text-white placeholder-gray-400 focus:ring-2 focus:ring-primary`). Placeholder: "Add Quick Notes (optional)".
    *   **Primary Action Button:** `[ Get AI Feedback ]` (`flex h-14 w-full items-center justify-center rounded-xl bg-primary px-6 text-background-dark text-lg font-bold`).
    *   **Bottom Navigation Bar:** Fixed at bottom (`fixed bottom-0`). Icons for Dashboard, Workout (selected `text-primary FILL:1`), History, Settings.
*   **Interactions:**
    *   **Tap `[ Close Button ]`:** Exits the post-workout flow.
    *   **RPE Slider:** Allows user to select their RPE.
    *   **Fatigue Segmented Buttons:** Allows user to select perceived fatigue level.
    *   **Quick Notes:** Allows optional text input.
    *   **Tap `[ Get AI Feedback ]`:** Submits feedback and proceeds to the AI feedback screen.
    *   **Bottom Navigation:** Allows quick navigation between main app sections.
### **Screen 2: AI Feedback & Achievements Display (Implemented by `docs/stich_design/Flow_10/screen_2/code.html`)**

*   **Description:** This screen provides a motivating and insightful conclusion to the workout, highlighting achievements, offering personalized AI feedback, and presenting detailed performance metrics. The design is based on the provided `code.html`, featuring a dark theme with Lexend font.
*   **Visual Elements (Referencing `code.html`):**
    *   **Overall Layout:** `h-auto min-h-screen w-full flex-col`, `font-display`. `bg-background-dark`.
    *   **Top App Bar:** `sticky top-0 z-10 flex flex-col bg-background-dark p-4 pb-2`.
        *   Headline: "Your Session Insights" (`text-white tracking-light text-[28px] font-bold`).
        *   `[ Done ]` Button: `text-primary text-base font-bold`.
    *   **"Celebrate Wins" Section:** `px-4 pb-3 pt-5`.
        *   Horizontal Scrollable Cards: `flex overflow-y-auto pl-4 pr-1`.
        *   Each Win Card: `flex h-full flex-1 flex-col gap-3 rounded-lg min-w-44`.
            *   Icon: `material-symbols-outlined text-primary text-6xl` (e.g., `trophy`, `local_fire_department`, `flag`, `trending_up`) within `bg-card-dark`.
            *   Title: (e.g., "New PR!", "5-Day Streak!") (`text-white text-base font-medium`).
            *   Subtitle: (e.g., "Bench Press: 135 lbs") (`text-[#9db9a6] text-sm font-normal`).
    *   **"Key Takeaways" Section:** `px-4 pb-3 pt-8`.
        *   AI Coach Summary Card: `flex flex-col items-stretch justify-start rounded-lg bg-card-dark p-4`.
            *   AI Avatar/Icon: `smart_toy` Material Symbol (`text-primary text-2xl`) within `bg-primary/20`.
            *   Headline: "AI Coach Summary" (`text-white text-lg font-bold`).
            *   Summary Text: (`text-[#9db9a6] text-base font-normal`).
            *   Actionable Recommendation: `text-[#9db9a6] text-base font-normal`.
            *   `[ Adjust Next Plan ]` Button: `w-full rounded-full h-10 px-4 bg-white/10 text-primary text-sm font-bold`.
    *   **"Detailed Metrics" Section:** `px-4 mt-8 pb-3`.
        *   Each Metric Item: `flex items-center justify-between rounded-lg bg-card-dark p-4 h-16`.
            *   Icon: `material-symbols-outlined` (e.g., `timer`, `fitness_center`, `favorite`) (`text-[#9db9a6]`).
            *   Label: (e.g., "Duration", "Total Volume", "Avg. Heart Rate") (`text-base font-medium text-white`).
            *   Value: (e.g., "45:12 min", "12,450 lbs", "134 bpm") (`text-base font-medium text-white`).
    *   **Action Buttons:** `flex flex-col gap-3 px-4 pt-12 pb-4`.
        *   `[ Go to Dashboard ]`: Primary button (`w-full rounded-full h-12 px-6 bg-primary text-background-dark text-base font-bold`).
        *   `[ Share Workout ]`: Secondary button (`flex-1 rounded-full h-12 px-6 bg-card-dark text-white text-base font-bold`).
        *   `[ Edit Workout Log ]`: Secondary button (`flex-1 rounded-full h-12 px-6 bg-card-dark text-white text-base font-bold`).
    *   **Bottom Navigation Bar:** Sticky at bottom (`sticky bottom-0`). Icons for Dashboard, Workout, History (selected `text-primary FILL:1`), Settings.
*   **Interactions:**
    *   **Tap `[ Done ]`:** Navigates to the Dashboard.
    *   **Scroll "Celebrate Wins" section:** Allows viewing multiple achievements.
    *   **Tap `[ Adjust Next Plan ]`:** Potentially navigates to a plan editing interface to incorporate AI recommendations.
    *   **Tap `[ Go to Dashboard ]`:** Returns to the main dashboard.
    *   **Tap `[ Share Workout ]`:** Initiates a sharing flow for workout results.
    *   **Tap `[ Edit Workout Log ]`:** Navigates to an interface for modifying the logged workout details.
    *   **Bottom Navigation:** Allows quick navigation between main app sections.

---

## **Flow 11: Generate Session Mix (Optional AI-Based Playlist)**

**Goal:** To provide personalized, AI-generated music playlists tailored to workout phases, with review options and real-time feedback.

### **Trigger Points:**

1.  Pre-Workout Screen.
2.  Post-Workout Screen.
3.  Settings -> Music & Playback.

### **Settings Screen (Music & Playback Section): For Preference Input (Shared UI with Flow 3, Screen 4)**

*   **Description:** This screen allows users to manage their Spotify connection and personalize music preferences for AI-generated mixes. The UI is identical to "Flow 3: Connect Spotify, Screen 4: Post-Connection Features (Settings -> Music & Playback)". Please refer to that section for a detailed description of its visual elements and interactions. This screen provides controls for:
    *   Spotify Connection Status and Disconnect option.
    *   Toggles for "Use Session Mix" and "BPM Matching by Workout Phase".
    *   Section for "Music Preferences for AI Mixes" including Preferred Genres, Favorite Workout Artists, Overall Energy Level slider, and Exclude Artists/Genres input.
*   **Visual Elements:** Refer to the detailed description under "Flow 3: Connect Spotify, Screen 4: Post-Connection Features (Settings -> Music & Playback)".
*   **Interactions:** Refer to the detailed description under "Flow 3: Connect Spotify, Screen 4: Post-Connection Features (Settings -> Music & Playback)".
### **Screen 1: Generate Session Mix Options (Modal/Overlay) (Implemented by `docs/stich_design/Flow_11/screen_1/code.html`)**

*   **Description:** This screen presents a modal overlay allowing the user to select the type of AI-generated session mix they desire (e.g., warm-up, full session, cooldown). The design is based on the provided `code.html`, featuring a dark theme with Lexend font.
*   **Visual Elements (Referencing `code.html`):**
    *   **Overall Layout:** Modal (`m-auto flex flex-col justify-end w-full max-w-md h-full`) positioned over a dimmed background (`absolute inset-0 bg-black/50 backdrop-blur-sm`).
    *   **Modal Content:** `flex flex-col items-stretch bg-background-dark rounded-t-xl`.
        *   Drag Handle: `h-1 w-9 rounded-full bg-[#326744]` at the top.
        *   Headline: "Generate Session Mix" (`text-white tracking-light text-[32px] font-bold`).
        *   Prompt: "What part of your workout is this for?" (`text-white/70 text-base`).
        *   **Playlist Type Selection:** `flex px-4 py-3`. Segmented buttons within `h-10 flex-1 items-center justify-center rounded-full bg-[#23482f] p-1`.
            *   Options: "Warm-up only", "Full Session", "Cooldown" (`label` with `input[type="radio"]`). Selected `has-[:checked]:bg-[#13ec5b] has-[:checked]:text-[#102216] has-[:checked]:font-bold`, unselected `text-white/80`.
        *   **Action Buttons:** `flex w-full flex-1 gap-3 max-w-[480px] flex-col items-stretch px-4 py-3 pb-8`.
            *   `[ Create Mix ]`: Primary button (`h-12 bg-primary text-background-dark text-base font-bold rounded-full`).
            *   `[ Cancel ]`: Secondary button (`h-12 bg-transparent text-white text-base font-medium rounded-full border hover:bg-white/10`).
*   **Interactions:**
    *   **Tap Playlist Type Options:** Selects the desired mix type.
    *   **Tap `[ Create Mix ]`:** Initiates the generation of the session mix based on the selected type.
    *   **Tap `[ Cancel ]`:** Closes the modal without generating a mix.
### **Screen 2: Session Mix Preview & Customization (New Improvement 1 - Implemented by `docs/stich_design/Flow_11/screen_2/code.html`)**

*   **Description:** This screen allows users to preview the AI-generated session mix, select a playlist mode (AI Smart Mix, Endurance, Power Bursts), seed the mix with artists/genres, and review/customize the individual tracks before starting the session. The design is based on the provided `code.html`, featuring a dark theme and Spline Sans font.
*   **Visual Elements (Referencing `code.html`):**
    *   **Overall Layout:** `h-auto min-h-screen w-full flex-col`, `font-display`. `bg-background-dark`.
    *   **Top App Bar:** `sticky top-0 z-10 flex items-center bg-background-dark p-4 pb-2 justify-between`.
        *   `[ Close Button ]`: `close` Material Symbol (`text-white`).
        *   Headline: "Generate Session Mix" (`text-white text-lg font-bold`).
    *   **Playlist Mode Selection:**
        *   Header: "Select a Mode" (`text-white text-lg font-bold pt-4 pb-2`).
        *   Segmented Buttons: `flex h-10 flex-1 items-center justify-center rounded-full bg-white/5 p-1`. Options: "AI Smart Mix", "Endurance", "Power Bursts". Selected `has-[:checked]:bg-primary has-[:checked]:text-black has-[:checked]:font-bold`.
    *   **"Seed Your Mix" Section:**
        *   Header: "Seed Your Mix" (`text-white text-lg font-bold pt-4 pb-2`).
        *   Search Input: `search` Material Symbol (`text-gray-400`) next to an input field (`placeholder="Add artists or genres..."`).
        *   Added Tags: (e.g., "Daft Punk", "House" tags) `flex items-center gap-2 rounded-full bg-primary/20 px-3 py-1.5`, with `close` button.
    *   **"Your Session Preview" Section:**
        *   Header: "Your Session Preview" (`text-white text-lg font-bold pt-6 pb-2`).
        *   Sub-text: "Remove or replace tracks to perfect your mix." (`text-xs text-gray-400`).
        *   Summary Card: `flex items-center gap-6 rounded-lg bg-white/5 p-4 my-2`. Displays "Total Duration" and "Track Count".
        *   **Tracklist Display:** `flex flex-col gap-2 py-4`. Each Track Item: `flex items-center gap-4 rounded-lg p-2 hover:bg-white/5`.
            *   Album Art: `h-14 w-14 rounded object-cover`.
            *   Song Title: `font-semibold text-white`.
            *   Artist: `text-sm text-gray-400`.
            *   Phase Indicator: Icon (e.g., `local_fire_department` for Warm-up, `trending_up` for Peak, `battery_horiz_075` for Cool-down) and text (e.g., "Warm-up", "Peak", "Cool-down").
            *   `[ More Vert ]` Button: `more_vert` Material Symbol (`text-gray-400`).
    *   **CTA Button:** `[ Start Session ]` (`sticky bottom-0 bg-gradient-to-t from-background-dark text-black text-lg font-bold rounded-full h-14 w-full`).
*   **Interactions:**
    *   **Tap `[ Close Button ]`:** Closes the session mix generation.
    *   **Tap Playlist Mode Options:** Selects the desired AI mix mode.
    *   **Input in "Seed Your Mix" field:** Allows adding artists or genres to influence the mix.
    *   **Remove Tags:** Removes seeded artists/genres.
    *   **Tap `[ More Vert ]` on track:** Opens options for the individual track (e.g., remove, replace, info).
    *   **Tap `[ Start Session ]`:** Begins playback of the generated session mix.
### **Screen 3: Active Music Playback (within Workout Player - Flow 9) (Implemented by `docs/stich_design/Flow_11/screen_3/code.html` which is identical to `Flow_9/code.html`)**

*   **Description:** This screen represents the core Active Workout Player (as detailed in Flow 9), with the *conceptual integration* of music controls and visual BPM feedback. The provided `code.html` for this screen is identical to the main Flow 9 Workout Player, and as such, **does not explicitly show dedicated music playback controls or BPM feedback elements within this HTML snippet.** The music integration elements described below are to be understood as overlays or contextual additions to the Flow 9 UI.
*   **Visual Elements (Integrated into Flow 9's Workout Player - Referencing `Flow_9/code.html`):**
    *   (Please refer to the detailed Visual Elements description for "Flow 9: Perform & Log Workout, Screen: Active Workout Player (Main Workout View)" for the core UI elements.)
    *   **Music Control Widget (Conceptual Integration):** When active, this widget would appear within the Workout Player, potentially in the top bar or as a persistent overlay. It would display Album Art, Song/Artist, and Play/Pause controls.
    *   **New Improvement (3. Visual Feedback on BPM Matching - Conceptual Integration):** A BPM Indicator (e.g., a gauge or bar) showing the current song's BPM vs. the target phase BPM, likely color-coded for quick interpretation, along with textual feedback (e.g., "BPM: 135 (Good Match)"). This would also integrate into the Flow 9 UI, possibly near the music controls.
*   **Interactions:**
    *   (Please refer to the detailed Interactions description for "Flow 9: Perform & Log Workout, Screen: Active Workout Player (Main Workout View)" for core workout logging interactions.)
    *   **Music Control Interactions (Conceptual):** Play/pause music, skip tracks, adjust volume.
    *   **BPM Matching Feedback:** Visual cues would dynamically update as BPM changes or phases shift.
---

## **Flow 13: Edit Synced or Completed Workout**

**Goal:** To provide a flexible and robust way to correct or refine workout logs post-completion.

### **Trigger:**

*   User taps `[ Edit ]` on a completed workout from history.

### **Screen 1: Workout Details & Edit Mode Entry (Implemented by `docs/stich_design/Flow_13/screen_1/code.html`)**

*   **Description:** This screen provides a detailed, read-only view of a completed workout, including its summary statistics and a list of exercises performed, with an option to enter edit mode. The design is based on the provided `code.html`, featuring a dark theme with Lexend font.
*   **Visual Elements (Referencing `code.html`):**
    *   **Overall Layout:** `h-auto min-h-screen w-full flex-col`. `bg-background-dark`.
    *   **Top App Bar:** `sticky top-0 z-10 flex items-center p-4 pb-2 justify-between bg-background-dark`.
        *   `[ Back Button ]`: `arrow_back_ios_new` Material Symbol (`text-white`).
        *   Heading: "Workout Details" (`text-white text-lg font-bold`).
    *   **Workout Title & Date:**
        *   Title: "Full Body Strength A" (`text-white text-[22px] font-bold px-4 pt-5`).
        *   Date: "Monday, October 26" (`text-stone-400 dark:text-[#92c9a4] text-sm px-4`).
    *   **Stats Grid:** `flex flex-wrap gap-4 p-4`.
        *   Cards (e.g., Total Duration, Total Volume, Calories Burned): Each `min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 bg-zinc-900 border dark:border-[#326744]`.
            *   Label: `text-gray-300 dark:text-white text-base font-medium`.
            *   Value: `text-white tracking-light text-2xl font-bold`.
    *   **Edit Button with Badge:** `flex items-center gap-3 px-4 py-3`.
        *   `[ Edit Workout ]` Button: `flex-1 rounded-full h-12 bg-primary text-background-dark text-base font-bold`.
        *   "Edited" Badge: `rounded-full bg-primary/20 px-3 py-1` with `text-xs font-bold text-primary`.
    *   **Exercises List Header:** "Exercises" (`text-lg font-bold text-white px-4 pt-6 pb-2`).
    *   **Exercise List:** `flex flex-col gap-3 px-4`.
        *   Each Exercise Item: `flex flex-col rounded-xl bg-zinc-900 border dark:border-[#326744] overflow-hidden`.
            *   Collapsed View: `flex items-center gap-4 p-4 cursor-pointer`.
                *   Icon: `fitness_center` Material Symbol (`text-primary`) within `size-14 rounded-lg bg-zinc-800`.
                *   Name: `font-semibold text-white`.
                *   Summary: `text-sm text-gray-400` (e.g., "3 sets x 8 reps x 150 lbs").
                *   Expand/Collapse Icon: `expand_more` Material Symbol (`text-gray-400`).
            *   Expanded Details (for one exercise shown): `flex flex-col gap-3 border-t border-zinc-800 dark:border-primary/20 bg-background-dark p-4`.
                *   Set details: (e.g., "Set 1: 10 reps x 85 lbs").
    *   **Bottom Navigation Bar:** `fixed bottom-0 left-0 right-0 z-10 border-t border-zinc-800 bg-zinc-900/80 backdrop-blur-lg`. Icons for Dashboard, Workout, History (selected `text-primary fill`), Settings.
*   **Interactions:**
    *   **Tap `[ Back Button ]`:** Returns to the previous screen (e.g., Workout History).
    *   **Tap `[ Edit Workout ]` Button:** Transitions to the workout editing interface.
    *   **Tap Exercise Item:** Toggles expansion/collapse to show/hide set-level details.
    *   **Bottom Navigation:** Allows quick navigation between main app sections.
### **Screen 2: Granular Editing Interface (Implemented by `docs/stich_design/Flow_13/screen_2/code.html`)**

*   **Description:** This screen provides a detailed interface for granular editing of a completed workout, allowing users to modify workout-level details, and individual exercise sets. It features an undo option and links to version history. The design is based on the provided `code.html`, with a dark theme and Lexend font.
*   **Visual Elements (Referencing `code.html`):**
    *   **Overall Layout:** `min-h-screen w-full flex-col`. `bg-background-dark`.
    *   **Top App Bar:** `sticky top-0 z-10 bg-background-dark/80 backdrop-blur-lg`.
        *   Heading: "Edit Workout" (`text-primary-text-dark text-lg font-bold`).
    *   **Save/Cancel Bar:** `flex items-center gap-4 px-4 pb-4`.
        *   `[ Cancel ]` Button: `flex-1 rounded-full h-12 bg-surface-dark text-primary-text-dark text-base font-bold`.
        *   `[ Save Changes ]` Button: `flex-1 rounded-full h-12 bg-primary text-background-dark text-base font-bold`.
    *   **Workout Details Card (`px-4 py-3`):** `rounded-lg bg-surface-dark p-4`.
        *   **Workout Name Input:** `input` field (`value="Push Day A"`) with label.
        *   **Date & Duration Inputs:** Two `input` fields for "Date" and "Duration" with labels.
        *   `[ Version History ]` Link: `text-primary underline text-sm`.
    *   **Exercises List (`flex flex-col gap-3 p-4`):**
        *   **Collapsible Exercise Card:** `details` tag (`group flex flex-col overflow-hidden rounded-lg bg-surface-dark`).
            *   Summary Header: `flex cursor-pointer items-center justify-between gap-6 p-4`.
                *   Exercise Name (e.g., "Bench Press"): `text-primary-text-dark`.
                *   Set Count (e.g., "3 sets"): `text-secondary-text-dark`.
                *   Expand/Collapse Icon: `expand_more` Material Symbol (`transition-transform group-open:rotate-180`).
            *   Expanded Set Details: `flex flex-col gap-2 border-t border-background-dark/50 p-4`.
                *   Each Set Row: `flex items-center gap-2`.
                    *   Set Number (e.g., "Set 1"): `text-sm text-secondary-text-dark`.
                    *   Input fields for Reps, Weight (lbs), RPE: `flex flex-1 items-center gap-1 rounded-md bg-background-dark p-2`. Inputs `text-primary-text-dark`.
    *   **Floating Action Button:** `fixed bottom-28 left-4 z-20`.
        *   `[ Undo ]` Button: `h-14 w-14 rounded-full bg-primary shadow-lg`, with `undo` Material Symbol (`text-background-dark !text-3xl`).
    *   **Bottom Navigation Bar:** `fixed bottom-0 left-0 right-0 z-20 border-t border-surface-dark/50 bg-background-dark/80 backdrop-blur-lg`. Icons for Dashboard, Workout, History (selected `text-primary FILL:1`), Settings.
*   **Interactions:**
    *   **Tap `[ Cancel ]`:** Discards changes and returns to previous screen.
    *   **Tap `[ Save Changes ]`:** Saves modifications and returns to previous screen.
    *   **Tap Workout Detail Input Fields:** Allows editing workout name, date, duration.
    *   **Tap `[ Version History ]` Link:** Navigates to a version history screen (Flow 13, Screen 3).
    *   **Tap Exercise Card Summary:** Toggles expansion/collapse of set details.
    *   **Edit Set Input Fields:** Allows granular modification of reps, weight, and RPE for each set.
    *   **Tap `[ Undo ]` Button:** Reverses the last granular change made during the current editing session.
    *   **Bottom Navigation:** Allows quick navigation between main app sections.

### **Screen 3: Version History & Visual Diff (Accessed via `[ Version History ]`) (Implemented by `docs/stich_design/Flow_13/screen_3/code.html`)**

*   **Description:** This screen provides a clear view of past workout versions and a visual diff for comparing changes, allowing users to understand the evolution of their logs and restore previous states. The design is based on the provided `code.html`, featuring a dark theme with Lexend font.
*   **Visual Elements (Referencing `code.html`):**
    *   **Overall Layout:** `h-auto min-h-screen w-full flex-col`. `bg-background-dark`.
    *   **Top App Bar:** `sticky top-0 z-10 flex items-center bg-background-dark p-4 pb-2 justify-between`.
        *   `[ Back Button ]`: `arrow_back_ios_new` Material Symbol (`text-white`).
        *   Heading: "Workout Version History" (`text-white text-lg font-bold`).
    *   **Version List (Radio Buttons):** `flex flex-col gap-3 py-4`. Each version is a `label` with `input type="radio"` within a `rounded-lg border border-solid border-[#326744] p-4 flex-row-reverse`.
        *   Selected: `has-[:checked]:border-primary has-[:checked]:bg-primary/20`.
        *   Version Info: Timestamp (`text-white text-sm font-medium`), and a description (e.g., "Current Version", "Edited Sets", "Original Import") (`text-primary` or `text-gray-400`).
    *   **Comparison Section:**
        *   Header: "Comparison" (`text-white text-xl font-bold pt-6 pb-2`).
        *   Description: "Comparing 'Jan 15, 10:30 AM' with 'Current Version'" (`text-gray-400 text-sm pb-4`).
        *   **Comparison Details Card:** `rounded-lg bg-[#1a3824]/50 p-4`. Displays exercise names (`font-semibold text-lg`), and set details (`text-white text-base font-normal`).
            *   Added/Modified: Highlighted in `accent-green` (e.g., `(+10 lbs)`, `Overhead Press` and its sets).
            *   Removed: Strikethrough text with `accent-red` (e.g., `Deadlift` and its sets).
    *   **Action Buttons (Sticky Bottom):** `sticky bottom-0 z-10 mt-auto bg-gradient-to-t from-background-dark to-transparent pt-8`.
        *   `[ Restore this Version ]`: Primary button (`h-12 bg-primary text-background-dark text-base font-bold rounded-full`).
        *   `[ Compare with Current ]`: Secondary button (`h-12 bg-transparent border-2 border-[#23482f] text-white text-base font-bold rounded-full`).
    *   **Bottom Navigation:** `flex justify-around items-center bg-black/50 backdrop-blur-sm border-t border-gray-800 p-2`. Icons for Dashboard, Workout, History (selected `text-primary FILL:1`), Settings.
*   **Interactions:**
    *   **Tap `[ Back Button ]`:** Returns to the previous screen (e.g., granular editing interface).
    *   **Select Version (Radio Buttons):** Changes the displayed comparison.
    *   **Tap `[ Restore this Version ]`:** Reverts the workout log to the selected historical version.
    *   **Tap `[ Compare with Current ]`:** Updates the comparison view to show differences with the currently active workout log.
    *   **Bottom Navigation:** Allows quick navigation between main app sections.
---

## **Flow 14: View Dashboard & Weekly Review**

**Goal:** To provide a personalized, motivating, and interactive overview of training progress, adherence, and readiness.

### **Screen 1: Main Dashboard View (Implemented by `docs/stich_design/Flow_14/screen_1/code.html`)**

*   **Description:** This is the user's primary landing page, providing a dynamic and customizable overview of their training progress, achievements, and key metrics. The design is based on the provided `code.html`, featuring a dark theme with Lexend font.
*   **Visual Elements (Referencing `code.html`):**
    *   **Overall Layout:** `h-auto min-h-screen w-full flex-col`. `bg-background-dark`.
    *   **Top App Bar:** `sticky top-0 z-10 flex items-center bg-background-dark p-4 pb-2 justify-between`.
        *   Profile Picture: `size-10 rounded-full bg-cover` (left).
        *   Heading: "Dashboard" (`text-white text-lg font-bold`).
        *   `[ Generate Plan ]` Button: `bg-primary text-background-dark text-sm font-bold px-4 py-2 rounded-full` (right).
    *   **"Celebrate Your Wins" Section:** `px-4 pb-3 pt-5`.
        *   Horizontal Scrollable Cards: `flex overflow-x-auto pl-4 pr-1`.
        *   Each Win Card: `flex h-full flex-1 flex-col gap-3 rounded-lg min-w-60 bg-card-dark p-4`.
            *   Image: `w-full aspect-[1.5/1] bg-cover rounded-lg` (e.g., barbell, flame, medal).
            *   Title: (e.g., "New PR: Squat!") (`text-white text-base font-medium`).
            *   Subtitle: (e.g., "You lifted 120kg!") (`text-primary text-sm`).
    *   **"Your Widgets" Section:** `flex items-center justify-between px-4 pb-3 pt-8`.
        *   Header: "Your Widgets" (`text-white text-[22px] font-bold`).
        *   `[ Edit ]` Icon: `edit` Material Symbol (`text-white/70`).
    *   **Widget Grid (`grid grid-cols-2 gap-4 p-4`):**
        *   **Goal Progress Widget (Col-span-2):** `flex flex-col gap-3 p-4 rounded-lg bg-card-dark`.
            *   Label: "Goal: Bench Press" (`text-white text-base font-medium`).
            *   Progress: "85kg / 100kg" (`text-white/70 text-sm`).
            *   Bar: `h-2 rounded-full bg-primary` within `rounded-full bg-primary/20`.
        *   **Workout Streak Widget:** `flex flex-col gap-2 p-4 rounded-lg bg-card-dark items-center justify-center aspect-square`.
            *   Icon: `local_fire_department` Material Symbol (`text-primary text-4xl`).
            *   Value: "5 Days" (`text-white text-2xl font-bold`).
            *   Label: "Workout Streak" (`text-white/70 text-sm`).
        *   **Weekly Volume Widget:** `flex flex-col gap-2 p-4 rounded-lg bg-card-dark justify-between aspect-square`.
            *   Title: "Weekly Volume" (`text-white text-base font-medium`).
            *   Chart Image: `img` (`w-full h-auto object-contain`).
        *   **Today's Context Widget (Col-span-2):** `flex flex-col gap-3 p-4 rounded-lg bg-card-dark`.
            *   Icon: `auto_awesome` Material Symbol (`text-primary`).
            *   Headline: "Today's Context" (`text-white font-medium`).
            *   Message: "You seem rested. Today's a good day for a high-intensity session. Let's aim for a new PR!" (`text-white/70 text-sm`).
        *   **Recent Workouts Widget (Col-span-2):** `flex flex-col gap-3 p-4 rounded-lg bg-card-dark`.
            *   Title: "Recent Workouts" (`text-white text-base font-medium`).
            *   List of Workouts: (e.g., "Push Day - Upper Body" / "Yesterday") (`text-white`, `text-white/50 text-sm`).
    *   **Bottom Navigation Bar:** `fixed bottom-0 left-0 right-0 bg-black/50 backdrop-blur-lg border-t border-white/10`.
        *   Icons for Dashboard (selected `text-primary fill`), Workout, History, Settings.
*   **Interactions:**
    *   **Tap Profile Picture/Menu:** Accesses user profile/settings.
    *   **Tap `[ Generate Plan ]`:** Initiates the AI daily plan generation (Flow 6).
    *   **Scroll "Celebrate Your Wins" section:** Allows viewing multiple achievements.
    *   **Tap `[ Edit ]` icon on "Your Widgets":** Enters dashboard customization mode (Flow 14, Screen 3).
    *   **Tap any Widget:** (Implicitly) links to a more detailed view (e.g., Goal Progress widget could link to Flow 14, Screen 2: Weekly Review).
    *   **Bottom Navigation:** Allows quick navigation between main app sections.
### **Screen 2: Weekly Review / Detailed Insights (Implemented by `docs/stich_design/Flow_14/screen_2/code.html`)**

*   **Description:** This screen provides a deeper dive into the user's weekly performance trends and offers AI-generated insights and recommendations. The design is based on the provided `code.html`, featuring a dark theme with Lexend font, and interactive chart visualizations.
*   **Visual Elements (Referencing `code.html`):**
    *   **Overall Layout:** `h-auto min-h-screen w-full flex-col`. `bg-background-dark`.
    *   **Top App Bar:** `sticky top-0 z-10 flex flex-col bg-background-dark p-4 pb-2`.
        *   `[ Back Button ]`: `arrow_back_ios_new` Material Symbol (`text-white`).
        *   `[ More Options ]` Button: `more_horiz` Material Symbol (`text-white`).
        *   Headline: "Weekly Review" (`text-white tracking-light text-[28px] font-bold px-2`).
    *   **Timeframe Selector (Segmented Buttons):** `flex px-4 py-3`. Options: "Week", "Month" (`h-10 rounded-full bg-[#23482f] p-1`). Selected `has-[:checked]:bg-primary has-[:checked]:shadow-[0_0_10px_rgba(19,236,91,0.4)] has-[:checked]:text-background-dark`.
    *   **Charts (`flex flex-col gap-4 px-4 py-6`):**
        *   **Volume Chart:** `flex flex-col gap-2 rounded-xl border border-[#326744] bg-[#1a3323]/50 p-6`.
            *   Title: "Volume" (`text-white text-base font-medium`).
            *   Value: "5,450 lbs" (`text-white tracking-light text-[32px] font-bold`).
            *   Trend: `arrow_drop_up` (green `text-primary`) or `arrow_drop_down` (red `text-[#fa5538]`) icon and percentage change.
            *   Interactive Chart: SVG line graph with gradient fill (`min-h-[180px]`). Day labels ("Mon", "Tue", etc.) below.
        *   **Intensity Chart:** Similar structure, showing "85% 1RM" for intensity.
        *   **Consistency Chart:** Similar structure, showing "4/5 Days" for consistency. Bar chart visualization for days of the week.
    *   **Coach's Corner (`flex flex-col px-4 pb-2 pt-4`):**
        *   Header: `smart_toy` Material Symbol (`text-primary`) and "Coach's Corner" (`text-white text-lg font-bold`).
        *   Recommendation Text: (`text-[#e0e0e0] text-base font-normal`).
        *   `[ Implement Suggestion ]` Button: `h-12 bg-primary text-background-dark font-bold text-base rounded-full`.
    *   **Bottom Navigation Bar:** `fixed bottom-0 left-0 right-0 h-24 bg-background-dark/80 backdrop-blur-lg border-t border-[#326744]`. Icons for Dashboard, Workout, History (selected `text-primary fill:1`), Settings.
*   **Interactions:**
    *   **Tap `[ Back Button ]`:** Returns to the Dashboard.
    *   **Tap `[ More Options ]`:** Accesses additional options.
    *   **Tap "Week" / "Month" Segmented Buttons:** Changes the timeframe for the displayed data.
    *   **Interact with Charts:** (Implicitly) tapping data points might reveal more details or drill down.
    *   **Tap `[ Implement Suggestion ]`:** Applies the AI's plan adjustment suggestion.
    *   **Bottom Navigation:** Allows quick navigation between main app sections.
### **Screen 3: Customize Dashboard (Settings) (Implemented by `docs/stich_design/Flow_14/screen_3/code.html`)**

*   **Description:** This screen provides an interface for users to personalize their dashboard layout by adding, removing, and reordering widgets. The design is based on the provided `code.html`, featuring a dark theme with Lexend font.
*   **Visual Elements (Referencing `code.html`):**
    *   **Overall Layout:** `min-h-screen w-full flex-col`. `bg-background-dark`.
    *   **Top App Bar:** `sticky top-0 z-10 flex items-center justify-between bg-background-light/80 p-4 pb-3 dark:bg-background-dark/80 backdrop-blur-sm`.
        *   `[ Back Button ]`: `arrow_back_ios_new` Material Symbol (`text-white/90`).
        *   Heading: "Customize Dashboard" (`text-white text-lg font-bold`).
    *   **"Available Widgets" Section:** `mt-4`.
        *   Header: "Available Widgets" (`text-lg font-bold text-white/90`).
        *   List Items: `flex min-h-14 items-center justify-between gap-4 rounded-lg bg-white/5 p-3`.
            *   Icon: Material Symbol (e.g., `bar_chart`, `local_fire_department`, `bolt`, `water_drop`) (`text-primary`) within `size-10 rounded-lg bg-primary/20`.
            *   Widget Name: (e.g., "Weekly Activity", "Calorie Tracker") (`text-white text-base`).
            *   Action Button: `[ + Add ]` (`rounded-full bg-primary/20 px-4 py-1.5 text-sm font-medium text-primary`) or "Added" status (`check_circle` icon with "Added" text).
    *   **"Your Dashboard Layout" Section:** `mt-8`.
        *   Header: "Your Dashboard Layout" (`text-lg font-bold text-white/90`).
        *   Draggable Area: `flex flex-col gap-3 rounded-lg border border-dashed border-white/20 bg-white/5 p-4`.
        *   Draggable Items: `flex min-h-14 cursor-grab items-center justify-between gap-4 rounded-lg bg-white/10 p-3`.
            *   `[ Drag Handle ]`: `drag_indicator` Material Symbol (`text-white/50`).
            *   Widget Name: (`text-white text-base`).
            *   `[ Remove ]` Button: `remove_circle` Material Symbol (`text-white/50`).
    *   **Fixed Footer Actions & Nav:** `pointer-events-none fixed inset-x-0 bottom-0 z-10`.
        *   Action Buttons: `flex flex-col gap-4 bg-gradient-to-t from-background-dark via-background-dark to-transparent px-6 pb-6 pt-4`.
            *   `[ Save Layout ]`: Primary button (`h-14 w-full rounded-full bg-primary text-background-dark text-base font-bold`).
            *   `[ Reset to Default ]`: Secondary button (`text-base font-medium text-white/60`).
        *   **Bottom Navigation Bar:** `pointer-events-auto flex w-full items-center justify-around rounded-full bg-white/10 p-2 backdrop-blur-lg`. Icons for Dashboard (selected `text-primary`), Workout, History, Settings.
*   **Interactions:**
    *   **Tap `[ Back Button ]`:** Returns to the previous screen (e.g., Dashboard).
    *   **Tap `[ + Add ]`:** Adds an available widget to "Your Dashboard Layout".
    *   **Drag Widgets:** Reorders widgets within "Your Dashboard Layout" using the `[ Drag Handle ]`.
    *   **Tap `[ Remove ]`:** Removes a widget from "Your Dashboard Layout".
    *   **Tap `[ Save Layout ]`:** Saves the current customized dashboard layout.
    *   **Tap `[ Reset to Default ]`:** Reverts the dashboard layout to its default state.
    *   **Bottom Navigation:** Allows quick navigation between main app sections.
---

## **Flow 15: Export Data (GDPR Compliance)**

**Goal:** To provide a clear, transparent, and secure process to request and receive an export of personal data.

### **Trigger:**

*   User navigates to `Settings -> Privacy & Account -> Export Data`.

### **Screen 1: Export Data Information & Request (Implemented by `docs/stich_design/Flow_15/screen_1/code.html`)**

*   **Description:** This screen provides users with clear information regarding data export for GDPR compliance, detailing what data is included and the process involved, before allowing them to initiate a request. The design is based on the provided `code.html`, featuring a dark theme with Lexend font.
*   **Visual Elements (Referencing `code.html`):**
    *   **Overall Layout:** `h-auto min-h-screen w-full flex-col`. `bg-background-dark`.
    *   **Top App Bar:** `sticky top-0 z-10 flex items-center bg-background-dark p-4 pb-2 justify-between`.
        *   `[ Back Button ]`: `arrow_back_ios_new` Material Symbol (`text-white`).
        *   Heading: "Export Your Data" (`text-white text-lg font-bold`).
    *   **Body Content (`px-4`):**
        *   **Intro Text:** "You have the right to request a copy of your personal data..." (`text-gray-700 dark:text-gray-300 text-base`).
        *   **"What's Included" Section:**
            *   Header: "What's Included:" (`text-white text-lg font-bold pt-4 pb-2`).
            *   Bullet List of Data Types: `flex flex-col gap-2`. Each item (`min-h-14`) has an icon (e.g., `person`, `history`, `monitoring`, `flag` Material Symbols, `text-black` within `rounded-lg bg-primary/30 size-10`) and text (e.g., "Profile Information", "Workout History") (`text-white text-base`).
            *   Note: "Note: Wearable data is not included in this export." (`text-gray-500 dark:text-gray-400 text-sm mt-2`).
        *   **"The Process" Section:**
            *   Header: "The Process" (`text-white text-lg font-bold pt-8 pb-2`).
            *   Explanation Text: "Once requested, we'll compile your data..." (`text-gray-700 dark:text-gray-300 text-base`).
    *   **Floating Action Button:** `fixed bottom-0 left-0 right-0 bg-background-dark`.
        *   `[ Request Data Export ]` Button: `flex w-full items-center justify-center rounded-full bg-primary py-4 px-6 text-base font-bold text-black`.
    *   **Bottom Navigation Bar:** `flex h-20 w-full items-center justify-around border-t border-black/10 dark:border-white/10 bg-background-light dark:bg-background-dark/80 backdrop-blur-sm`. Icons for Dashboard, Workout, History, Settings (selected `text-primary fill`).
*   **Interactions:**
    *   **Tap `[ Back Button ]`:** Returns to the previous screen (e.g., Settings).
    *   **Tap `[ Request Data Export ]` Button:** Initiates the data export process.
    *   **Bottom Navigation:** Allows quick navigation between main app sections.
### **Screen 2: Export Initiated Confirmation (Implemented by `docs/stich_design/Flow_15/screen_2/code.html`)**

*   **Description:** This screen confirms that a data export request has been successfully initiated, provides an estimated timeline for generation, and details the delivery method, guiding the user on next steps. The design is based on the provided `code.html`, featuring a dark theme with Lexend font.
*   **Visual Elements (Referencing `code.html`):**
    *   **Overall Layout:** `h-full min-h-screen w-full max-w-md flex-col`. `bg-background-dark`.
    *   **Top App Bar:** `flex items-center justify-between pb-2`.
        *   Heading: "Export Initiated" (`text-zinc-900 dark:text-white text-lg font-bold`).
    *   **Confirmation Icon:** `flex h-24 w-24 items-center justify-center rounded-full bg-primary/20`. Icon: `task_alt` Material Symbol (`text-5xl text-primary`).
    *   **Headline:** "Export Request Received!" (`text-center text-[32px] font-bold pb-3 pt-6`).
    *   **Body Text:** "Your data export is now being compiled." (`text-center text-base font-normal text-zinc-600 dark:text-zinc-300`).
    *   **Description List (`grid grid-cols-1 gap-x-6 py-6`):**
        *   **Estimated Time:** "Your export may take up to 5-10 minutes to compile." (`text-zinc-900 dark:text-white pt-1`).
        *   **Delivery Method:** "Secure download link sent to your email and via in-app notification." (`text-zinc-900 dark:text-white pt-1`).
    *   **Button Group (`flex flex-col items-stretch gap-3 py-3`):**
        *   `[ Go to Settings ]`: Primary button (`h-12 bg-primary px-5 text-background-dark text-base font-bold`).
        *   `[ Go to Dashboard ]`: Secondary button (`h-12 bg-primary/20 px-5 text-primary text-base font-bold`).
    *   **Bottom Navigation Bar:** `fixed bottom-0 left-0 right-0 mx-auto h-24 w-full max-w-md border-t border-zinc-200 bg-background-light/80 backdrop-blur-lg dark:border-zinc-800 dark:bg-background-dark/80`. Icons for Dashboard, Workout, History, Settings (selected `text-primary FILL:1`).
*   **Interactions:**
    *   **Tap `[ Go to Settings ]`:** Navigates to the settings screen.
    *   **Tap `[ Go to Dashboard ]`:** Navigates to the user's dashboard.
    *   **Bottom Navigation:** Allows quick navigation between main app sections.
---

## **Flow 16: Delete Account (Full GDPR Removal)**

**Goal:** To provide a secure, transparent, and irreversible process for users to permanently delete their account.

### **Trigger:**

*   User navigates to `Settings -> Privacy & Account -> Delete Account`.

### **Screen 1: Delete Account Warning & Export Reminder (Implemented by `docs/stich_design/Flow_16/screen_1/code.html`)**

*   **Description:** This screen serves as a critical warning and a reminder for data export before proceeding with permanent account deletion, emphasizing the irreversible nature of the action. The design is based on the provided `code.html`, featuring a dark theme with Lexend font and prominent destructive color accents.
*   **Visual Elements (Referencing `code.html`):**
    *   **Overall Layout:** `h-screen w-full flex-col`. `bg-background-dark`.
    *   **Main Content (`<main>`):** `flex flex-1 flex-col justify-center px-4 sm:px-6`.
        *   **Warning Icon:** `flex size-16 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-6`, with `warning` Material Symbol (`!text-4xl`).
        *   **Headline:** "Permanently Delete Your Account?" (`text-destructive text-[32px] font-bold`).
        *   **Sub-headline:** "This action cannot be undone." (`text-[#F5F5F5] text-[22px] font-bold pt-5`).
        *   **Body Text (Impact Statement):** "You will permanently lose all of your data, including:" (`text-[#F5F5F5] text-base`). Followed by a `list-disc` of items (e.g., Profile Information, Workout History).
        *   **GDPR Note:** "This action complies with your right to be forgotten under GDPR." (`text-[#8A8A8E] text-sm`).
        *   **Export Data CTA:** "Want to keep a copy of your progress? `[ Export your data ]` before you go." (Link `text-primary hover:underline`).
    *   **Action Buttons (`w-full px-4 sm:px-6 pb-6 pt-4 space-y-3`):**
        *   `[ Continue to Delete ]`: Primary destructive button (`h-14 w-full rounded-full bg-destructive text-white text-base font-bold`).
        *   `[ Cancel / Go Back ]`: Secondary button (`h-14 w-full rounded-full bg-transparent text-[#F5F5F5] ring-1 ring-inset ring-white/20`).
    *   **Bottom Navigation Bar:** `sticky bottom-0 left-0 right-0 border-t border-white/10 bg-background-dark/80 backdrop-blur-lg`. Icons for Dashboard, Workout, History, Settings (selected `text-primary font-bold`).
*   **Interactions:**
    *   **Tap `[ Export your data ]` link:** Navigates to the data export screen (Flow 15).
    *   **Tap `[ Continue to Delete ]`:** Proceeds to the final account deletion confirmation screen.
    *   **Tap `[ Cancel / Go Back ]`:** Returns to the previous screen (e.g., Settings).
    *   **Bottom Navigation:** Allows quick navigation between main app sections.
### **Screen 2: Final Confirmation with User Input (New Improvement 1 - Implemented by `docs/stich_design/Flow_16/screen_2/code.html`)**

*   **Description:** This screen acts as a strong final barrier against accidental account deletion, requiring explicit user input for confirmation. The design is based on the provided `code.html`, featuring a dark theme with Lexend font and prominent warnings.
*   **Visual Elements (Referencing `code.html`):**
    *   **Overall Layout:** `h-screen w-full flex-col overflow-hidden`. `bg-background-dark`.
    *   **Top App Bar:** `flex items-center pt-4 pb-2`.
        *   `[ Back Button ]`: `arrow_back_ios_new` Material Symbol (`text-white`).
        *   Heading: "Confirm Account Deletion" (`text-destructive text-lg font-bold`).
    *   **Headline:** "This action is irreversible." (`text-white tracking-light text-[32px] font-bold pb-3 pt-8`).
    *   **Body Text:** "All your workout data, history, and personal progress will be permanently lost." (`text-gray-300 text-base`). Followed by "To confirm, please type 'DELETE' in the box below." (`text-gray-300 text-base pt-4`).
    *   **Input Fields (`flex flex-col justify-start pt-8 gap-6`):**
        *   **Confirmation Input Field:** `input` field (`placeholder="DELETE"`) with label "Type 'DELETE' to confirm" (`text-white text-base font-medium`). Input styling `rounded-xl border border-primary/30 bg-white/5 h-14`.
        *   **Re-enter Password Field:** `input type="password"` field (`placeholder="Re-enter your password for security"`) with label "Re-enter your password" (`text-white text-base font-medium`). Includes `visibility` Material Symbol button.
    *   **Action Button:** `[ Permanently Delete My Account ]` (`h-14 bg-destructive/50 text-white text-base font-bold rounded-xl cursor-not-allowed`) - Disabled until correct input.
    *   **Bottom Navigation Bar:** `flex h-[84px] w-full items-center justify-around border-t border-white/10 bg-background-dark/80 backdrop-blur-lg`. Icons for Dashboard, Workout, History, Settings (selected `text-primary filled`).
*   **Interactions:**
    *   **Tap `[ Back Button ]`:** Returns to the previous screen (Delete Account Warning).
    *   **Type "DELETE":** Enables the `[ Permanently Delete My Account ]` button.
    *   **Enter Password:** Provides an additional security step.
    *   **Tap `[ Permanently Delete My Account ]` (when enabled):** Initiates the account deletion process.
    *   **Bottom Navigation:** Allows quick navigation between main app sections.
### **Screen 3: Deletion Initiated Confirmation & Logout (New Improvement 2 - Implemented by `docs/stich_design/Flow_16/screen_3/code.html`)**

*   **Description:** This screen confirms that the account deletion process has been initiated, provides crucial information about the timeline, and prompts the user to log out. The design is based on the provided `code.html`, featuring a dark theme with Lexend font.
*   **Visual Elements (Referencing `code.html`):**
    *   **Overall Layout:** `h-screen min-h-screen w-full flex-col`. `bg-background-dark`.
    *   **Top App Bar:** `flex items-center p-4 pb-2`.
        *   Heading: "Account Deletion Initiated" (`text-gray-900 dark:text-white text-lg font-bold`).
    *   **Main Content Area (`flex flex-1 flex-col justify-between p-4`):**
        *   **Confirmation Icon:** `task_alt` Material Symbol (`text-primary !text-96px`) (the example in code is `font-size: 96px`).
        *   **Headline:** "Deletion Process Has Begun" (`text-gray-900 dark:text-white tracking-light text-[32px] font-bold`).
        *   **Body Text:** "Your account deletion process has begun." (`text-gray-600 dark:text-gray-300`).
        *   **Deletion Timeline Card:** `mt-8 w-full max-w-md rounded-lg bg-background-light dark:bg-white/5 p-6 text-left`.
            *   Header: "Deletion Timeline" (`text-gray-900 dark:text-white text-md font-bold`).
            *   Details: "All your personal data will be permanently removed within 30 days. You will receive an email confirmation once the process is complete." (`text-gray-600 dark:text-gray-300 text-sm`).
    *   **Action Button:** `[ Okay, Log Me Out ]` (`flex-1 w-full rounded-full h-12 bg-primary text-background-dark text-base font-bold`).
*   **Interactions:**
    *   **Tap `[ Okay, Log Me Out ]`:** Logs the user out of the application and presumably redirects to the **Screen 4: Completion Screen** or a login screen.
### **Screen 4: Completion Screen (Logged Out State) (Implemented by `docs/stich_design/Flow_16/screen4/code.html`)**

*   **Description:** This static screen is displayed after a user has logged out, confirming that the account deletion process is underway and providing an option to return to the login screen. The design is based on the provided `code.html`, featuring a dark theme with Lexend font.
*   **Visual Elements (Referencing `code.html`):**
    *   **Overall Layout:** `h-full min-h-screen w-full flex-col items-center justify-between p-6`. `bg-background-dark`.
    *   **Content:** Centered `flex w-full flex-col items-center justify-center text-center`.
        *   **App Logo:** `w-20 h-20 bg-center bg-no-repeat bg-contain mb-8 mt-16`. Background image URL for "AI Personal Trainer App Logo".
        *   **Confirmation Icon:** `flex h-20 w-20 items-center justify-center rounded-full bg-primary/20 mb-6`. Icon: `task_alt` Material Symbol (`text-5xl text-primary`).
        *   **Headline:** "Deletion Initiated" (`text-white tracking-light text-[32px] font-bold pb-3 pt-6`).
        *   **Message:** "Your account deletion process is underway. Your data will be permanently erased within 30 days." (`text-white/80 text-base font-normal max-w-sm`).
    *   **Action Button:** `[ Return to Login ]` (`flex-1 w-full rounded-full h-12 bg-primary text-background-dark text-base font-bold`).
*   **Interactions:**
    *   **Tap `[ Return to Login ]`:** Navigates the user back to the application's login screen.
---

## **Flow 17: Toggle Offline Mode & Resume Sync**

**Goal:** To provide a reliable and transparent offline experience, ensuring users can continue logging workouts without an internet connection.

### **Trigger Points:**

1.  User enables "Offline Mode" in `Settings -> Performance & Data`.
2.  App automatically detects lost/restored internet connection.

### **Settings Screen (Performance & Data Section): For Offline Mode Configuration (Implemented by `docs/stich_design/Flow_17/screen_1/code.html`)**

*   **Description:** This settings screen allows users to configure their offline and data synchronization preferences, enhancing control over app performance and data usage. The design is based on the provided `code.html`, featuring a dark theme with Lexend font.
*   **Visual Elements (Referencing `code.html`):**
    *   **Overall Layout:** `h-screen w-full flex-col`. `bg-background-dark`.
    *   **Top App Bar:** `flex items-center bg-background-dark p-4 pb-2 justify-between`.
        *   `[ Back Button ]`: `arrow_back_ios_new` Material Symbol (`text-white`).
        *   Heading: "Performance & Data" (`text-white text-lg font-bold`).
    *   **"Offline Access" Section:** `pt-4 pb-2`.
        *   Header: "Offline Access" (`text-white text-lg font-bold`).
        *   **`Offline Mode` Toggle:** List item (`flex items-center gap-4 bg-background-dark py-3.5 min-h-14 justify-between`).
            *   Icon: `cloud_off` Material Symbol (`text-white` within `rounded-lg bg-[#23482f] size-10`).
            *   Label: "Offline Mode" (`text-white text-base font-normal`).
            *   Info Icon (`material-symbols-outlined info text-white/70`) with a hidden tooltip (`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 rounded-lg bg-neutral-900 text-white text-sm`).
            *   Toggle Switch: `relative flex h-[31px] w-[51px] cursor-pointer items-center rounded-full border-none bg-[#23482f] p-0.5 has-[:checked]:justify-end has-[:checked]:bg-primary`.
        *   **`Auto-Sync Offline Data` Toggle (New Improvement 2):** List item (`flex items-center gap-4 bg-background-dark py-2 min-h-[72px] justify-between`).
            *   Icon: `sync` Material Symbol (`text-white` within `rounded-lg bg-[#23482f] size-12`).
            *   Label: "Auto-Sync Offline Data" (`text-white text-base font-medium`).
            *   Description: "Automatically syncs your completed offline workouts when you reconnect to the internet." (`text-[#92c9a4] text-sm`).
            *   Toggle Switch: Similar to Offline Mode.
    *   **"Data Management" Section:** `pt-8 pb-2`.
        *   Header: "Data Management" (`text-white text-lg font-bold`).
        *   **`Clear Local Cache` List Item (with Confirmation Modal - New Improvement 4):** (`group flex items-center gap-4 bg-background-dark py-3.5 min-h-14 justify-between cursor-pointer`).
            *   Icon: `delete` Material Symbol (`text-white` within `rounded-lg bg-[#23482f] size-10`).
            *   Label: "Clear Local Cache" (`text-white text-base font-normal`).
            *   Info Icon (`material-symbols-outlined info text-white/70`) with a hidden tooltip.
            *   `arrow_forward_ios` Material Symbol (`text-white/70`).
            *   **Confirmation Modal:** (Hidden by default, shown on group-focus-within). `fixed inset-0 bg-black/60 z-40 items-center justify-center hidden group-focus-within:flex`.
                *   Content: `bg-[#1e1e1e] rounded-xl w-11/12 max-w-sm p-6 text-center`. Headline: "Clear Local Cache?", Body: "This will remove temporary data...", Buttons: `[ Clear ]` (`bg-[#CF6679] text-white py-3 rounded-full`), `[ Cancel ]` (`bg-[#333] text-white/90 py-3 rounded-full`).
    *   **Bottom Navigation Bar:** `absolute bottom-0 left-0 right-0 bg-[#1A3824]/80 backdrop-blur-lg border-t border-white/10`. Icons for Dashboard, Workout, History, Settings (selected `text-primary FILL:1`).
*   **Interactions:**
    *   **Tap `[ Back Button ]`:** Returns to the main settings screen.
    *   **Toggle `Offline Mode`:** Enables/disables offline functionality.
    *   **Toggle `Auto-Sync Offline Data`:** Enables/disables automatic synchronization.
    *   **Tap `Clear Local Cache`:** Triggers a confirmation modal to clear local cache.
    *   **In Confirmation Modal:**
        *   Tap `[ Clear ]`: Executes cache clearing.
        *   Tap `[ Cancel ]`: Dismisses the modal.
    *   **Bottom Navigation:** Allows quick navigation between main app sections.
### **General App UI: Offline Status Indicator & Sync Now Button (Implemented by `docs/stich_design/Flow_17/screen_2/code.html`)**

*   **Description:** This section describes general UI elements that provide feedback on offline status and sync options, appearing contextually across the app. The design is based on the provided `code.html`, featuring a dashboard view with banners.
*   **Visual Elements (Referencing `code.html`):**
    *   **Overall Layout (Example context is Dashboard):** `h-auto min-h-screen w-full max-w-md flex-col overflow-x-hidden`. `bg-background-dark`.
    *   **Top App Bar (Example from Dashboard):** `flex items-center bg-background-dark p-4 pb-2 justify-between sticky top-0 z-10`. Includes `menu` icon, "Dashboard" title, `account_circle` icon.
    *   **Headline (Example from Dashboard):** "Good Morning, Alex!" (`text-white tracking-light text-[32px] font-bold px-4`).
    *   **Offline Status Banner (New Improvement 1):** `px-4`.
        *   Container: `flex flex-1 flex-col items-start justify-between gap-4 rounded-xl border border-caution/50 bg-caution/10 p-5`.
        *   Icon: `wifi_off` Material Symbol (`text-caution text-2xl`).
        *   Message: "You are currently offline" (`text-caution text-base font-bold`).
        *   Contextual Message: "Changes will sync when you reconnect." (`text-caution/80 text-sm font-normal`).
    *   **Internet Restored Banner & Sync (New Improvement 3):** `px-4`.
        *   Container: `flex flex-1 flex-col items-start justify-between gap-4 rounded-xl border border-accent/50 bg-accent/10 p-5`.
        *   Icon: `cloud_sync` Material Symbol (`text-accent text-2xl`).
        *   Message: "Connection restored" (`text-accent text-base font-bold`).
        *   Contextual Message: "You have unsynced data." (`text-accent/80 text-sm font-normal`).
        *   `[ Sync Now ]` Button: `flex h-10 shrink-0 items-center justify-center gap-2 rounded-full bg-accent px-4 text-sm font-bold text-black`.
*   **Interactions:**
    *   **Offline Status Banner:** Visually informs the user about their connection state.
    *   **Internet Restored Banner:** Notifies the user about regained connection and unsynced data.
    *   **Tap `[ Sync Now ]` Button:** Manually initiates synchronization of offline data.
### **Sync Prompt (on reconnection, if Auto-Sync is OFF) (Implemented by `docs/stich_design/Flow_17/screen_3/code.html`)**

*   **Description:** This modal dialog appears when the internet connection is restored and there is unsynced offline data, prompting the user to sync their data or review changes. The design is based on the provided `code.html`, featuring a dark theme with Lexend font.
*   **Visual Elements (Referencing `code.html`):**
    *   **Overall Layout:** A modal dialog centered on the screen, over a dimmed background (`absolute inset-0 bg-black/50`).
    *   **Modal Dialog (`flex w-full max-w-md flex-col items-center rounded-xl bg-[#1a3525] p-6 text-center shadow-2xl`):**
        *   Icon: `cloud_sync` Material Symbol (`text-primary text-4xl`) within `h-16 w-16 rounded-full bg-primary/20`.
        *   Headline: "Internet Restored!" (`font-display text-white text-2xl font-bold`).
        *   Body Text: "You have offline workout data waiting to be synced." (`font-display text-base font-normal leading-normal text-white/80`).
        *   **Button Group (`mt-8 flex w-full flex-col items-stretch gap-3`):**
            *   `[ Sync Now ]`: Primary button (`h-12 bg-primary px-5 text-background-dark text-base font-bold rounded-full`).
            *   `[ Review Changes First ]`: Secondary button (`h-12 bg-white/10 px-5 text-white text-base font-bold rounded-full`).
            *   `[ Not Now ]`: Tertiary button (`h-12 bg-transparent px-5 text-white/70 text-base font-bold rounded-full`).
*   **Interactions:**
    *   **Tap `[ Sync Now ]`:** Initiates immediate synchronization of offline data.
    *   **Tap `[ Review Changes First ]`:** Navigates to a screen where users can review and selectively sync their offline changes.
    *   **Tap `[ Not Now ]`:** Dismisses the prompt without syncing, allowing the user to continue working online.
### **Confirmation/Notification (Post-Sync) (Implemented by `docs/stich_design/Flow_17/screen_4/code.html`)**

*   **Description:** This section describes the discreet toast notifications that appear to confirm the success or failure of data synchronization after being offline. The design is based on the provided `code.html`, featuring a dark theme and Lexend font.
*   **Visual Elements (Referencing `code.html`):**
    *   **Success Toast Notification:** `absolute bottom-28 left-4 right-4 flex items-center justify-center p-3 bg-[#2C2C2E] rounded-full`.
        *   Icon: `check_circle` Material Icon (`text-[#34C759] mr-2`).
        *   Text: "Offline changes synced successfully!" (`text-[#34C759] text-sm font-medium`).
    *   **Failure Toast Notification (Conceptual - commented out in `code.html`):** Similar design, but with `cancel` Material Icon (`text-[#FF3B30]`) and text "Sync failed. Please check connection." (`text-[#FF3B30]`).
    *   **Background App UI (for context):** The HTML shows this toast appearing over a sample dashboard UI, which includes a user profile, today's workout, weekly progress stats, and a bottom navigation bar.
*   **Interactions:**
    *   These are transient notifications that appear for a short duration and then disappear automatically. They do not typically require direct user interaction beyond acknowledgment.
---

## **Flow 18: Change Settings (General, Health, Playback & Privacy)**

**Goal:** To provide a comprehensive, intuitive, and secure control panel for personalizing the app experience.

### **Trigger:**

*   User taps `[ Settings Icon/Menu Option ]`.

### **Screen 1: Main Settings Menu (Implemented by `docs/stich_design/Flow_18/general/code.html`)**

*   **Description:** This screen serves as the main entry point for all application settings, organized into logical categories. The design is based on the provided `code.html`, featuring a dark theme with Lexend font and clear navigation to various setting sub-screens.
*   **Visual Elements (Referencing `code.html`):**
    *   **Overall Layout:** `h-auto min-h-screen w-full max-w-md flex-col`. `bg-background-dark`.
    *   **Top App Bar:** `sticky top-0 z-10 flex flex-col gap-4 bg-background-dark px-4 pt-8 pb-4`.
        *   Headline: "Settings" (`text-3xl font-bold leading-tight tracking-tight text-white`).
    *   **Search Bar (New Improvement 2):** `px-4 py-2`.
        *   Input Field: `flex w-full flex-1 items-stretch rounded-lg h-11`. Includes `search` Material Symbol (`text-text-subtle-dark`) and `input` field (`placeholder="Search Settings..."`) with styling `bg-ui-dark text-text-dark`.
    *   **Settings List (`flex flex-col gap-px pt-6`):** Each category is a clickable list item (`flex cursor-pointer items-center gap-4 bg-background-dark px-4 min-h-[3.5rem] justify-between border-b border-ui-dark`).
        *   **Icon:** Material Symbol (e.g., `settings`, `brush`, `favorite`, `music_note`, `psychology`, `shield_person`) (`text-white` within `rounded-lg bg-[color] shrink-0 size-8`).
        *   **Category Name:** (e.g., "General", "Appearance") (`text-base font-normal leading-normal flex-1 truncate text-text-dark`).
        *   `[ Chevron Right ]` Icon: `chevron_right` Material Symbol (`text-text-subtle-dark`).
    *   **Bottom Navigation Bar:** `fixed bottom-0 left-0 right-0 mx-auto w-full max-w-md border-t border-ui-dark/50 bg-background-dark/80 backdrop-blur-lg`. Icons for Dashboard, Workout, History, Settings (selected `text-primary FILL:1`).
*   **Interactions:**
    *   **Search Bar:** Allows users to quickly find specific settings.
    *   **Tap Setting Category:** Navigates to the respective sub-screen for that category.
    *   **Bottom Navigation:** Allows quick navigation between main app sections.
### **Sub-Screens (Examples):**

##### **Sub-Screen: Appearance Settings (Implemented by `docs/stich_design/Flow_18/apperance/code.html`)**

*   **Description:** This sub-screen within the settings menu allows users to customize the visual appearance of the application, including theme mode, accent color, and font size. The design is based on the provided `code.html`, featuring a dark theme with Lexend font.
*   **Visual Elements (Referencing `code.html`):**
    *   **Overall Layout:** `h-auto min-h-screen w-full max-w-md flex-col`. `bg-background-dark`.
    *   **Top App Bar:** `flex flex-col gap-2 p-4 pb-2`.
        *   `[ Back Button ]`: `arrow_back_ios_new` Material Symbol (`text-white`).
        *   Headline: "Appearance" (`text-white tracking-light text-[28px] font-bold`).
    *   **"Theme" Section:** `pb-2 pt-4`.
        *   Header: "THEME" (`text-white/80 text-sm font-bold uppercase`).
        *   Segmented Buttons: `flex h-12 flex-1 items-center justify-center rounded-full bg-[#1c3c25] p-1.5`. Options: "Light", "Dark" (selected), "System" (`text-white text-sm font-medium`).
    *   **"Accent Color" Section:** `pb-2 pt-4`.
        *   Header: "ACCENT COLOR" (`text-white/80 text-sm font-bold uppercase`).
        *   Color Swatches: `flex flex-wrap gap-5 p-4`. Each swatch is a `label` with `input type="radio"`. Swatches are `size-12 rounded-full` with various `background-color` (e.g., `#13ec5b`, `#0a84ff`) and a `check` Material Symbol for selected.
    *   **Live Preview Section (New Improvement 3):** `px-4 pt-4`.
        *   Container: `rounded-lg bg-[#183120] p-4`.
        *   Text: "Welcome Back", "Here's a preview of your app." (`text-white`, `text-white/70`).
        *   Preview Area: `h-24 w-full rounded bg-[#102216]/50 flex items-center justify-center` with an SVG line graph using `text-primary`.
        *   `[ Start Workout ]` Button: `w-full rounded-full bg-primary py-3 text-center font-bold text-black`.
    *   **"Accessibility" Section:** `pb-2 pt-6`.
        *   Header: "ACCESSIBILITY" (`text-white/80 text-sm font-bold uppercase`).
        *   **Font Size Slider:** `rounded-lg bg-[#183120] p-4`.
            *   Label: "Font Size" (`text-white text-base font-medium`).
            *   Slider: `input type="range"` (`h-1.5 w-full cursor-pointer accent-primary`). Labels "Small", "Default", "Large" below.
    *   **Bottom Navigation Bar:** `fixed bottom-0 left-0 right-0 mx-auto w-full max-w-md border-t border-white/10 bg-background-dark/80 backdrop-blur-lg`. Icons for Dashboard, Workout, History, Settings (selected `text-primary FILL:1`).
*   **Interactions:**
    *   **Tap `[ Back Button ]`:** Returns to the main settings menu.
    *   **Select Theme Mode:** Changes the app's theme.
    *   **Select Accent Color:** Changes the app's primary accent color, reflected in the live preview.
    *   **Adjust Font Size Slider:** Changes the app's font size, reflected in the live preview.
    *   **Bottom Navigation:** Allows quick navigation between main app sections.

##### **Sub-Screen: General Settings (Implemented by `docs/stich_design/Flow_18/genreralsettings/code.html`)**

*   **Description:** This sub-screen within the settings menu allows users to configure general application preferences, including language and notification settings. The design is based on the provided `code.html`, featuring a dark theme with Lexend font.
*   **Visual Elements (Referencing `code.html`):**
    *   **Overall Layout:** `h-screen w-full max-w-md flex-col`. `bg-background-dark`.
    *   **Top App Bar:** `sticky top-0 z-10 flex flex-col bg-background-dark`.
        *   `[ Back Button ]`: `arrow_back_ios_new` Material Symbol (`text-white`).
        *   Headline: "General" (`text-white text-lg font-bold`).
    *   **"Language" Setting:** `flex cursor-pointer items-center gap-4 min-h-14 justify-between bg-background-dark py-2`.
        *   Icon: `language` Material Symbol (`text-white` within `rounded-lg bg-primary/20 size-10`).
        *   Label: "Language" (`text-white text-base font-normal`).
        *   Current Value: "English" (`text-gray-400 text-base font-medium`).
        *   `[ Chevron Right ]` Icon: `arrow_forward_ios` Material Symbol (`text-gray-400`).
    *   **"Notifications" Section:** `pt-6 pb-2`.
        *   Header: "NOTIFICATIONS" (`text-white text-lg font-bold`).
        *   **`Workout Reminders` Toggle:** `flex items-center gap-4 min-h-14 justify-between bg-background-dark py-2`.
            *   Icon: `notifications` Material Symbol (`text-white` within `rounded-lg bg-primary/20 size-10`).
            *   Label: "Workout Reminders" (`text-white text-base font-normal`).
            *   Toggle Switch: `relative flex h-[31px] w-[51px] cursor-pointer items-center rounded-full border-none bg-zinc-700 p-0.5 has-[:checked]:bg-primary`.
        *   **`Milestone Alerts` Toggle:** Similar structure with `star` Material Symbol.
        *   **`Weekly Summary` Toggle:** Similar structure with `calendar_view_week` Material Symbol.
    *   **Bottom Navigation Bar:** `sticky bottom-0 z-10 flex h-20 items-center justify-around border-t border-white/10 bg-background-dark/80 backdrop-blur-lg`. Icons for Dashboard, Workout, History, Settings (selected `text-primary FILL:1`).
*   **Interactions:**
    *   **Tap `[ Back Button ]`:** Returns to the main settings menu.
    *   **Tap `Language`:** Navigates to a language selection screen.
    *   **Toggle Notification Switches:** Enables/disables specific notification types.
    *   **Bottom Navigation:** Allows quick navigation between main app sections.
##### **Sub-Screen: Performance & Data Settings**

*   **Visual Elements:** Header "Performance & Data", Data Sync Frequency, Offline Mode, Clear Local Cache.
    *   **New Improvement (4. Confirmation for Destructive Actions):** Confirmation modal for `[ Clear Local Cache ]`.
    *   **New Improvement (1. Contextual Help & "Learn More"):** `[ (i) ]` icons next to complex settings with tooltips.

##### **Sub-Screen: AI & Personalization Settings (Implemented by `docs/stich_design/Flow_18/ai/code.html`)**

*   **Description:** This sub-screen within the settings menu provides transparent management of AI-learned preferences and constraints, allowing users to view, edit, or reset the AI's personalized learning. The design is based on the provided `code.html`, featuring a dark theme with Lexend font.
*   **Visual Elements (Referencing `code.html`):**
    *   **Overall Layout:** `h-screen min-h-screen w-full max-w-md flex-col overflow-hidden`. `bg-background-dark`.
    *   **Top App Bar:** `flex shrink-0 items-center justify-between p-4 pb-2`.
        *   `[ Back Button ]`: `arrow_back_ios_new` Material Symbol (`text-white`).
        *   Headline: "AI & Personalization" (`text-zinc-100 text-lg font-bold`).
    *   **"Learned Preferences" Section:** `py-4`.
        *   Header: "LEARNED PREFERENCES" (`text-zinc-100 text-lg font-bold uppercase`).
        *   Description: "The AI has learned you prefer these things." (`text-zinc-400 text-base`).
        *   List Items: `flex min-h-14 items-center justify-between gap-4 rounded-lg bg-zinc-900/50 p-4`.
            *   Icon: Material Symbol (e.g., `fitness_center`, `bolt`, `calendar_month`) (`text-primary`) within `size-10 rounded-lg bg-primary/20`.
            *   Preference Description (e.g., "Prefers dumbbell exercises") (`text-zinc-100 text-base`).
            *   `[ Edit ]` Button (`text-primary text-base font-medium`).
            *   `[ Delete ]` Button (`delete` Material Symbol `text-zinc-400`).
    *   **"Learned Constraints" Section:** `py-4`. Similar structure to "Learned Preferences".
        *   Header: "LEARNED CONSTRAINTS" (`text-zinc-100 text-lg font-bold uppercase`).
        *   Description: "The AI avoids these things based on your feedback." (`text-zinc-400 text-base`).
        *   List Items: (e.g., "Avoids high-impact knee exercises", "Cannot perform overhead presses") with `block` or `do_not_disturb_on` Material Symbols.
    *   **"Reset All AI Learning" Section:** `py-8`.
        *   `[ Reset All AI Learning ]` Button: `h-14 w-full rounded-lg bg-zinc-800 text-base font-bold text-red-500`.
    *   **Confirmation Modal Overlay (New Improvement 4):** `absolute inset-0 z-10 flex items-center justify-center bg-black/60 backdrop-blur-sm`.
        *   Modal Content: `mx-8 w-full max-w-sm rounded-xl bg-[#1E1E1E] p-6 text-center shadow-lg`.
        *   Headline: "Are You Sure?" (`text-zinc-100 text-lg font-bold`).
        *   Body: "This action is permanent..." (`text-zinc-400 text-sm`).
        *   Buttons: `[ Cancel ]` (`rounded-lg bg-zinc-700 py-3 text-zinc-100`), `[ Confirm ]` (`rounded-lg bg-red-600 py-3 text-white`).
    *   **Bottom Navigation Bar:** `sticky bottom-0 mt-auto flex h-24 shrink-0 items-center justify-around border-t border-zinc-800 bg-background-dark/80 backdrop-blur-lg`. Icons for Dashboard, Workout, History, Settings (selected `text-primary FILL:1`).
*   **Interactions:**
    *   **Tap `[ Back Button ]`:** Returns to the main settings menu.
    *   **Tap `[ Edit ]` on Preferences/Constraints:** Allows modifying specific learned items.
    *   **Tap `[ Delete ]` on Preferences/Constraints:** Removes specific learned items.
    *   **Tap `[ Reset All AI Learning ]`:** Triggers a confirmation modal for this destructive action.
    *   **In Confirmation Modal:**
        *   Tap `[ Cancel ]`: Dismisses the modal.
        *   Tap `[ Confirm ]`: Executes the reset of all AI learning.
    *   **Bottom Navigation:** Allows quick navigation between main app sections.
##### **Sub-Screen: Privacy & Account Settings (Implemented by `docs/stich_design/Flow_18/privacy/code.html`)**

*   **Description:** This sub-screen within the settings menu provides comprehensive controls for privacy-related configurations and account management actions, including data export, account deletion, and a logout option. The design is based on the provided `code.html`, featuring a dark theme with Lexend font.
*   **Visual Elements (Referencing `code.html`):**
    *   **Overall Layout:** `h-screen min-h-screen w-full max-w-md flex-col`. `bg-background-dark`.
    *   **Top App Bar:** `flex shrink-0 items-center justify-between px-4 py-3`.
        *   `[ Back Button ]`: `arrow_back_ios_new` Material Symbol (`text-zinc-100`).
        *   Headline: "Privacy & Account" (`text-white text-xl font-bold`).
    *   **"Privacy" Section:**
        *   Header: "Privacy" (`text-sm font-medium uppercase tracking-wider text-primary/60`).
        *   **`Consent Settings` List Item:** `min-h-[72px] rounded p-4 hover:bg-white/5`.
            *   Icon: `shield_person` Material Symbol (`text-primary`) within `size-12 rounded-lg bg-primary/20`.
            *   Title: "Consent Settings" (`text-white text-base font-medium`).
            *   Description: "Manage data collection and personalization" (`text-zinc-400 text-sm`).
            *   `[ Chevron Right ]` Icon: `chevron_right` Material Symbol (`text-zinc-500`).
        *   **`Revoke Integrations` List Item:** Similar structure with `link_off` Material Symbol.
    *   **"Account Management" Section:**
        *   Header: "Account Management" (`text-sm font-medium uppercase tracking-wider text-primary/60`).
        *   **`Export My Data` List Item:** `min-h-14 rounded p-4 hover:bg-white/5`.
            *   Icon: `download_for_offline` Material Symbol (`text-primary`) within `size-10 rounded-lg bg-primary/20`.
            *   Title: "Export My Data" (`text-white text-base font-normal`).
            *   `[ Chevron Right ]` Icon: `chevron_right` Material Symbol (`text-zinc-500`).
        *   **`Delete My Account` List Item:** `min-h-14 rounded p-4 hover:bg-red-500/10`.
            *   Icon: `delete_forever` Material Symbol (`text-red-500`) within `size-10 rounded-lg bg-red-500/20`.
            *   Title: "Delete My Account" (`text-red-500 text-base font-normal`).
            *   `[ Chevron Right ]` Icon: `chevron_right` Material Symbol (`text-zinc-500`).
    *   **`[ Logout ]` Button (New Improvement 6):** `mt-8 flex h-14 w-full items-center justify-center rounded-lg bg-primary text-center text-base font-bold text-black`.
    *   **Bottom Navigation Bar:** `absolute bottom-0 left-0 right-0 border-t border-white/10 bg-background-dark/80 backdrop-blur-lg`. Icons for Dashboard, Workout, History, Settings (selected `text-primary FILL:1`).
*   **Interactions:**
    *   **Tap `[ Back Button ]`:** Returns to the main settings menu.
    *   **Tap list items:** Navigate to respective sub-screens (e.g., Consent Settings, Revoke Integrations, Export My Data, Delete My Account).
    *   **Tap `[ Logout ]` Button:** Logs the user out of the application (potentially with a confirmation modal).
    *   **Bottom Navigation:** Allows quick navigation between main app sections.
---

## **Visual Design Concepts - Color Palette**

**Goal:** To establish a cohesive and accessible color system that supports the app's "Energetic & Motivating" mood, leveraging a dark base, a vibrant green primary accent, and carefully selected supporting colors.

### **Refined Conceptual Color Palette**

**1. Primary Brand Colors (Inspired by Welcome Screen `code.html`):**
*   **Concept:** A modern, dark-themed base with a high-energy green as the main accent, establishing a unique and dynamic brand identity.
*   **Usage:** Defines the app's core look and feel for backgrounds, primary CTAs, and key branding elements.
*   **Example Shades (Derived from `code.html` Tailwind config):**
    *   **Primary Green (Accent/CTA):** `primary: "#13ec5b"` (Vibrant, high-energy green, replacing the previous yellow accent for primary CTAs)
    *   **Dark Background:** `background-dark: "#102216"` (Deep, modern dark theme base)
    *   **Light Background:** `background-light: "#f6f8f6"` (Very light, almost white for light theme or contrast sections)

**2. Secondary & Neutral Colors:**
*   **Concept:** A range of grays, off-whites, and a vibrant blue to provide clean backgrounds, hierarchical text, and support the primary brand colors.
*   **Usage:** Backgrounds, secondary text, borders, dividers, card elements, and informational elements.
*   **Example Shades (Adapted/Re-contextualized from previous palette):**
    *   **Gray-900 (Primary Text/Dark Mode Text):** `#212529` (Near-black for high contrast text on light backgrounds)
    *   **Gray-600 (Secondary Text/Icons):** `#6C757D` (Medium gray for less prominent information)
    *   **Gray-300 (Borders/Dividers):** `#CED4DA` (Light gray for subtle UI separation)
    *   **Gray-100 (Subtle Backgrounds - Light Mode):** `#F8F9FA` (Very light gray for cards, sections in light theme)
    *   **White:** `#FFFFFF` (For clean backgrounds, modal overlays, key content areas on dark theme)
    *   **Vibrant Blue (Secondary Accent/Info):** `#007BFF` (Can be used for informational elements, links, or as a secondary accent if needed, maintaining "Energetic" feel. Previously a primary, now a strong secondary.)

**3. Semantic Colors (Functional):**
*   **Concept:** Standardized colors to communicate status clearly and consistently.
*   **Usage:** System messages for success, warnings, errors, and informational notes.
*   **Example Shades:**
    *   **Success (Green - *distinct from primary green*):** `#28A745` (A distinct, slightly muted green for system success messages to avoid confusion with primary accent)
    *   **Warning (Orange-Yellow):** `#FFC107`
    *   **Error (Red):** `#DC3545`
    *   **Info (Cyan/Light Blue - *distinct from Vibrant Blue*):** `#17A2B8`

### **Accessibility Considerations:**
*   All color combinations, especially text against backgrounds and primary green accent usage, will be rigorously tested to ensure they meet WCAG 2.1 AA (or higher) contrast ratio standards.