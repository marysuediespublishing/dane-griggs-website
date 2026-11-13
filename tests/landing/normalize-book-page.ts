// What "the English book page is unchanged" compares (book-page-unchanged.unit.spec.ts): the
// built HTML with only what differs between two builds of the same commit taken out.
//   - astro-island uids, a per-build id;
//   - what is in the related-book cards (BookCard islands; their number stays). The book page picks them from the books
//     collection in the order the content layer loads it, which varies build to build: two
//     builds of main show different related books. Everything else — the CSS bundle's name
//     and content hash included — must match byte for byte.
export const normalizeBookPage = (html: string): string =>
  html
    .replace(/<astro-island[^>]*component-url="[^"]*\/BookCard\.[^"]*"[^>]*>.*?<\/astro-island>/gs, '<BookCard/>')
    .replace(/ uid="[^"]*"/g, ' uid=""');
