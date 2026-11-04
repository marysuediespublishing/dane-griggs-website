// English fixed copy for the box-set landing page: the copy the English page has always
// carried, word for word (the English page must not change). See landing.ts.
import type { LandingStrings } from './landing';

const WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];

export const en: LandingStrings = {
  lang: 'en',
  locale: 'en-US',
  readFree: 'Read free with Kindle Unlimited',
  freeFor: 'Free for Kindle Unlimited members',
  buyBoxSet: (price) => (price ? `Buy the Kindle box set — ${price}` : 'Buy the Kindle box set'),
  valueLine: (n, price, separate) => `${n} books for ${price} — ${separate} bought separately`,
  preferPaper: 'Prefer paper? Book 1 in paperback →',
  completeSeries: (series, n) => `The complete ${series} · ${n} books`,
  completeSet: (n) => `The complete series · ${n} books`,
  // "nine" is the only number the page has ever spelled out.
  booksInside: (n) => `All ${n === 9 ? WORDS[n] : n} books inside`,
  book: (n) => `Book ${n}`,
  coverOf: (title) => `${title} cover`,
  boxSetAlt: (title, n) => `${title}, Books 1–${n} by Dane Griggs`,
  seriesAverage: (rating) => `${rating} average across the series`,
  ratingsAcross: (count, series) => `${count} ratings across the ${series} series`,
  ratingsAcrossShort: (count) => `${count} ratings across the series`,
  readersSay: 'What readers say on Goodreads',
  quote: (text) => `“${text}”`,
  reviewCite: (reviewer) => `${reviewer}, Goodreads review of the Bride Program Box Set`,
  closing: () => 'Nine brides. Nine alien heroes. No Mary Sues. All nine books, one click.',
  availableAtAmazon: 'Available at Amazon',
  pageTitle: () => 'The Bride Program Box Set: All Nine Books | Dane Griggs',
  pageDescription: () =>
    'All nine Bride Program alien romances in one box set. Sexy escapes with heart, humor, and no Mary Sues. Free for Kindle Unlimited members.',
  consent: { text: 'We use a Meta pixel to measure our ads.', cookiePolicy: 'Cookie policy', allow: 'Allow', deny: 'No thanks' },
  chrome: { skip: 'Skip to main content', privacy: 'Privacy policy', cookies: 'Cookie policy' },
};
