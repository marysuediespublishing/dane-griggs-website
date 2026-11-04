// MACHINE-DRAFTED, NATIVE CHECK PENDING. German fixed copy for the /de/ box-set landing page
// (Press suite_006 §2.3): a German reader checks it before the first DE ad (a step of the
// first run's approve card). Kindle Unlimited keeps its name in the German store.
import type { LandingStrings } from './landing';

const WORDS = ['null', 'ein', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun', 'zehn'];
const word = (n: number) => WORDS[n] ?? String(n);
const Word = (n: number) => word(n).replace(/^./, (c) => c.toUpperCase());

export const de: LandingStrings = {
  lang: 'de',
  locale: 'de-DE',
  readFree: 'Gratis lesen mit Kindle Unlimited',
  freeFor: 'Für Kindle-Unlimited-Abonnenten kostenlos',
  buyBoxSet: (price) => (price ? `Kindle-Sammelband kaufen – ${price}` : 'Kindle-Sammelband kaufen'),
  valueLine: (n, price, separate) => `${n} Bände für ${price} – einzeln ${separate}`,
  preferPaper: 'Lieber auf Papier? Band 1 als Taschenbuch →',
  completeSeries: (series, n) => `${series} komplett · ${n} Bände`,
  completeSet: (n) => `Die komplette Reihe · ${n} Bände`,
  booksInside: (n) => `Alle ${word(n)} Bände im Sammelband`,
  book: (n) => `Band ${n}`,
  coverOf: (title) => `Titelbild: ${title}`,
  boxSetAlt: (title, n) => `${title}, Bände 1–${n}, von Dane Griggs`,
  seriesAverage: (rating) => `Im Schnitt ${rating} Sterne`,
  ratingsAcross: (count) => `${count} Bewertungen auf Amazon.de`,
  ratingsAcrossShort: (count) => `${count} Bewertungen auf Amazon.de`,
  readersSay: 'Das sagen Leserinnen und Leser',
  quote: (text) => `„${text}“`,
  reviewCite: (reviewer) => `${reviewer}, Rezension auf Amazon.de`,
  closing: (n) => `${Word(n)} Bräute. ${Word(n)} außerirdische Helden. Alle ${word(n)} Bände mit einem Klick.`,
  availableAtAmazon: 'Erhältlich bei Amazon',
  pageTitle: (title, n) => `${title}: alle ${word(n)} Bände | Dane Griggs`,
  pageDescription: (title, n, ku) =>
    `${title}: alle ${word(n)} Bände in einem Sammelband.${ku ? ' Für Kindle-Unlimited-Abonnenten kostenlos.' : ''}`,
  consent: {
    text: 'Wir messen unsere Anzeigen mit einem Meta-Pixel.',
    cookiePolicy: 'Cookie-Richtlinie',
    allow: 'Zulassen',
    deny: 'Nein, danke',
  },
  chrome: { skip: 'Zum Inhalt springen', privacy: 'Datenschutz', cookies: 'Cookie-Richtlinie' },
};
