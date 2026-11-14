/**
 * A product's edition in a landing page's language: the `editions.<lang>` block of a series
 * or book (src/content.config.ts), or none, in which case no /<lang>/ page is built for it.
 *
 * LANDING_EDITIONS_FIXTURE (a JSON file path) is for the test build only
 * (`npm run build:landing-test`, tests/fixtures/landing-editions.json). There, an edition the
 * fixture names wins over the content's for that series or book × language, and anything the
 * fixture does not name falls through to the content. The fixture wins so the page's branches
 * it was made to reach (DE in KU with a paperback and every tag; FR not in KU, no paperback,
 * a tag for another ASIN refused, a review of its own) stay testable once the real editions
 * are in the content, whatever those happen to be. Attribution tags are the other way round
 * (withFixtureTags): site-config's win and the fixture only fills gaps.
 *
 * A production build never sets it, and then the fixture is never read: content only
 * (checked against `npm run build` by scripts/check-prod-landing.mjs).
 */
import { readFileSync } from 'node:fs';
import type { AttributionTags, LandingLang } from './landing';

export interface EditionReview {
  title?: string;
  body: string;
  reviewer: string;
}

export interface SeriesEdition {
  asin: string;
  paperbackAsin?: string;
  title: string;
  blurb: string;
  kuEnrolled: boolean;
  cover?: string;
  seriesName?: string;
  hook?: string;
  tagline?: string;
  price?: string;
  separatePrice?: string;
  rating?: number;
  ratingCount?: number;
  reviews: EditionReview[];
}

export interface BookEdition {
  asin?: string;
  title: string;
  hook?: string;
}

type OtherLang = Exclude<LandingLang, 'en'>;
type Editions<E> = Partial<Record<OtherLang, E>>;

interface Fixture {
  series?: Record<string, Editions<SeriesEdition>>;
  books?: Record<string, Editions<BookEdition>>;
  attributionTags?: AttributionTags;
}

/** Whether this is the test build (LANDING_EDITIONS_FIXTURE set). */
const fixtureOn = (): boolean => !!process.env.LANDING_EDITIONS_FIXTURE;

let fixture: Fixture | undefined;
function loadFixture(): Fixture {
  if (fixture) return fixture;
  const path = process.env.LANDING_EDITIONS_FIXTURE;
  fixture = path ? (JSON.parse(readFileSync(path, 'utf8')) as Fixture) : {};
  for (const editions of Object.values(fixture.series ?? {})) {
    for (const e of Object.values(editions)) e.reviews ??= [];
  }
  return fixture;
}

/** A series' edition in `lang`, or undefined (English has none: it is the original). */
export function seriesEdition(
  entry: { id: string; data: { editions?: Editions<SeriesEdition> } },
  lang: LandingLang,
): SeriesEdition | undefined {
  if (lang === 'en') return undefined;
  return fixtureOn() ? (loadFixture().series?.[entry.id]?.[lang] ?? entry.data.editions?.[lang]) : entry.data.editions?.[lang];
}

/** A book's edition in `lang`, or undefined. */
export function bookEdition(
  entry: { id: string; data: { editions?: Editions<BookEdition> } },
  lang: LandingLang,
): BookEdition | undefined {
  if (lang === 'en') return undefined;
  return fixtureOn() ? (loadFixture().books?.[entry.id]?.[lang] ?? entry.data.editions?.[lang]) : entry.data.editions?.[lang];
}

/** Site-config's Attribution tags, with the fixture's for any market × product it lacks. */
export function withFixtureTags(tags?: AttributionTags): AttributionTags | undefined {
  const extra = loadFixture().attributionTags;
  if (!extra) return tags;
  const merged: AttributionTags = { ...(tags ?? {}) };
  for (const [market, products] of Object.entries(extra)) merged[market] = { ...products, ...(merged[market] ?? {}) };
  return merged;
}
