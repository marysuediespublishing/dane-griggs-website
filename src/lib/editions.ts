/**
 * A product's edition in a landing page's language: the `editions.<lang>` block of a series
 * or book (src/content.config.ts), or none, in which case no /<lang>/ page is built for it.
 *
 * LANDING_EDITIONS_FIXTURE (a JSON file path) is for the test build only: it adds editions
 * and Attribution tags the content does not carry, so the DE/FR page is tested before Books
 * has the real editions (tests/fixtures/landing-editions.json). The content always wins over
 * the fixture; a production build never sets it.
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
  return entry.data.editions?.[lang] ?? loadFixture().series?.[entry.id]?.[lang];
}

/** A book's edition in `lang`, or undefined. */
export function bookEdition(
  entry: { id: string; data: { editions?: Editions<BookEdition> } },
  lang: LandingLang,
): BookEdition | undefined {
  if (lang === 'en') return undefined;
  return entry.data.editions?.[lang] ?? loadFixture().books?.[entry.id]?.[lang];
}

/** Site-config's Attribution tags, with the fixture's for any market × product it lacks. */
export function withFixtureTags(tags?: AttributionTags): AttributionTags | undefined {
  const extra = loadFixture().attributionTags;
  if (!extra) return tags;
  const merged: AttributionTags = { ...(tags ?? {}) };
  for (const [market, products] of Object.entries(extra)) merged[market] = { ...products, ...(merged[market] ?? {}) };
  return merged;
}
