// MACHINE-DRAFTED, NATIVE CHECK PENDING. French fixed copy for the /fr/ box-set landing page
// (Press suite_006 §2.3): a French reader checks it before the first FR ad (a step of the
// first run's approve card). Kindle Unlimited keeps its name in the French store.
import type { LandingStrings } from './landing';

const WORDS = ['zéro', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix'];
const word = (n: number) => WORDS[n] ?? String(n);
const Word = (n: number) => word(n).replace(/^./, (c) => c.toUpperCase());
// French puts a no-break space before ? : ! and inside « ».
const NBSP = ' ';

export const fr: LandingStrings = {
  lang: 'fr',
  locale: 'fr-FR',
  readFree: 'Lire gratuitement avec Kindle Unlimited',
  freeFor: 'Gratuit pour les abonnés Kindle Unlimited',
  buyBoxSet: (price) => (price ? `Acheter l’intégrale Kindle – ${price}` : 'Acheter l’intégrale Kindle'),
  valueLine: (n, price, separate) => `${n} tomes pour ${price} – ${separate} à l’unité`,
  preferPaper: `Vous préférez le papier${NBSP}? Le tome 1 en broché →`,
  completeSeries: (series, n) => `${series}, l’intégrale · ${n} tomes`,
  completeSet: (n) => `La série complète · ${n} tomes`,
  booksInside: (n) => `Les ${word(n)} tomes réunis`,
  book: (n) => `Tome ${n}`,
  coverOf: (title) => `Couverture${NBSP}: ${title}`,
  boxSetAlt: (title, n) => `${title}, tomes 1 à ${n}, de Dane Griggs`,
  seriesAverage: (rating) => `${rating} étoiles en moyenne`,
  ratingsAcross: (count) => `${count} évaluations sur Amazon.fr`,
  ratingsAcrossShort: (count) => `${count} évaluations sur Amazon.fr`,
  readersSay: 'Ce qu’en disent les lecteurs',
  quote: (text) => `«${NBSP}${text}${NBSP}»`,
  reviewCite: (reviewer) => `${reviewer}, avis sur Amazon.fr`,
  closing: (n) => `${Word(n)} mariées. ${Word(n)} héros extraterrestres. Les ${word(n)} tomes, en un clic.`,
  availableAtAmazon: 'Disponible sur Amazon',
  pageTitle: (title, n) => `${title}${NBSP}: les ${word(n)} tomes | Dane Griggs`,
  pageDescription: (title, n, ku) =>
    `${title}${NBSP}: les ${word(n)} tomes réunis en une intégrale.${ku ? ' Gratuit pour les abonnés Kindle Unlimited.' : ''}`,
  consent: {
    text: 'Nous utilisons un pixel Meta pour mesurer nos publicités.',
    cookiePolicy: 'Politique relative aux cookies',
    allow: 'Accepter',
    deny: 'Non merci',
  },
  chrome: { skip: 'Aller au contenu', privacy: 'Confidentialité', cookies: 'Politique relative aux cookies' },
};
