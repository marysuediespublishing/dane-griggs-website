// Kindle Unlimited became Kindle+ on 2026-10-22, in the US and on amazon.de and amazon.fr
// alike. Reader-facing copy says "Kindle+". The German and French box-set pages add
// "ehemals Kindle Unlimited" / "anciennement Kindle Unlimited" under each Kindle+ button (and
// in the meta description) until site-config `kindlePlusFormerlyUntil` (a date, inclusive);
// after it the line drops on the next build. The English pages carry no such line: they said
// plain "Kindle+" before the window was added, and they do not change.
// Code keeps "ku": the cta kind, LandingClickKU, the attribution tag door, kuEnrolled.
// Pure, so the tests can import it without Astro. Gwen DeMarco's site's src/utils/kindle-plus.ts.

export const KINDLE_PLUS = 'Kindle+';

/** True through the whole of `until` (YYYY-MM-DD, UTC); false with no date or a bad one. */
export const showFormerlyKU = (until?: string | Date, now: Date = new Date()): boolean => {
  if (!until) return false;
  const day = until instanceof Date ? until.toISOString().slice(0, 10) : until.trim().slice(0, 10);
  const end = Date.parse(`${day}T23:59:59.999Z`);
  return Number.isFinite(end) && now.getTime() <= end;
};
