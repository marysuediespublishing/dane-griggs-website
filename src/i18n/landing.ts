// The box-set landing page's fixed copy, one table per language (landing.en.ts, landing.de.ts,
// landing.fr.ts). The product's own words (title, hook, blurb, price, reviews) come from the
// content: English from the page and the series, German and French from the series'
// `editions.<lang>` block. Pure, so the unit tests can import it without Astro.
import type { LandingLang } from '../lib/landing';

export interface LandingStrings {
  lang: LandingLang;
  /** Intl locale for numbers on the page */
  locale: string;
  /** The KU button and the note under it */
  readFree: string;
  freeFor: string;
  /** The Buy button: with the storefront's price when there is one */
  buyBoxSet: (price?: string) => string;
  /** Under the Buy button, when both prices are known */
  valueLine: (books: number, price: string, separate: string) => string;
  /** The quiet print link (Book 1 in paperback) */
  preferPaper: string;
  /** The eyebrow over the title */
  completeSeries: (series: string, books: number) => string;
  /** The eyebrow when the edition names no series */
  completeSet: (books: number) => string;
  /** The heading over the list of books */
  booksInside: (books: number) => string;
  book: (order: number) => string;
  /** A book cover's alt text */
  coverOf: (title: string) => string;
  /** The box-set image's alt text */
  boxSetAlt: (title: string, books: number) => string;
  /** Rating lines (the hero, then the sidebar) */
  seriesAverage: (rating: string) => string;
  ratingsAcross: (count: string, series: string) => string;
  ratingsAcrossShort: (count: string) => string;
  readersSay: string;
  /** A review's title in the language's quotation marks */
  quote: (text: string) => string;
  reviewCite: (reviewer: string) => string;
  /** The closing line before the phone's last buttons */
  closing: (books: number) => string;
  availableAtAmazon: string;
  /** <title> and meta description */
  pageTitle: (title: string, books: number) => string;
  pageDescription: (title: string, books: number, ku: boolean) => string;
  consent: { text: string; cookiePolicy: string; allow: string; deny: string };
  chrome: { skip: string; privacy: string; cookies: string };
}

/** A rating as the language writes it: 4.5, 4,5. */
export const formatRating = (s: LandingStrings, rating: number): string =>
  rating.toLocaleString(s.locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 });

/** A count as the language writes it: 7,344, 7.344, 7 344. */
export const formatCount = (s: LandingStrings, count: number): string => count.toLocaleString(s.locale);
