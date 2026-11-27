// Shared class strings for the landing page, so every card, button and heading
// uses the same radius, border and type scale.

const focus =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

const button = `inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition-colors ${focus}`;

// The primary action is near-black, so it stands out without adding another colour.
export const btnPrimary = `${button} px-4 py-2 bg-ink text-white hover:bg-ink/85`;
export const btnPrimaryLg = `${button} px-6 py-3 bg-ink text-white hover:bg-ink/85`;
export const btnSecondary = `${button} px-4 py-2 border border-line bg-surface text-ink hover:bg-canvas`;

export const focusRing = focus;

export const card = "rounded-2xl border border-line bg-surface";

export const sectionTitle = "text-3xl font-semibold tracking-tight sm:text-4xl";
