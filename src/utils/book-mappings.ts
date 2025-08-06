// Book and series mappings for auto-linking in blog posts
export const BOOK_MAPPINGS: Record<string, string> = {
  // Saving Ceraste Series
  "The Bride Program": "the-bride-program-book",
  "Bride Program": "the-bride-program-book", 
  "Honeymoon": "bride-program-honeymoon-book",
  "Bride Program Honeymoon": "bride-program-honeymoon-book",
  "Threesome Guide": "threesomes-guide-galaxy-book",
  "Threesome's Guide to the Galaxy": "threesomes-guide-galaxy-book",
  "Threesomes Guide to the Galaxy": "threesomes-guide-galaxy-book",
  "Bedside Manners": "bedside-manners-aliens-book",
  "Chancellor's Pilot": "chancellors-pilot-book",
  "Gossip Queen": "aliens-gossip-queen-book",
  "Aliens Gossip Queen": "aliens-gossip-queen-book",
  "Marshmallow": "marshmallow-book",
  "War Brides": "war-brides-book",
  "Insatiable Curiosity": "insatiable-curiosity-book",
  "Rescued by Kraken": "rescued-by-kraken-book",
  "Lily Saves Alien": "lily-saves-alien-book",
  "Rosie Christmas": "rosie-christmas-book",
};

export const SERIES_MAPPINGS: Record<string, string> = {
  "Saving Ceraste": "saving-ceraste",
  "Saving Ceraste series": "saving-ceraste",
};

// Combine all mappings
export const ALL_MAPPINGS = {
  ...Object.entries(BOOK_MAPPINGS).reduce((acc, [title, slug]) => {
    acc[title] = `/books/${slug}`;
    acc[`*${title}*`] = `/books/${slug}`;
    acc[`**${title}**`] = `/books/${slug}`;
    acc[`"${title}"`] = `/books/${slug}`;
    acc[`'${title}'`] = `/books/${slug}`;
    return acc;
  }, {} as Record<string, string>),
  
  ...Object.entries(SERIES_MAPPINGS).reduce((acc, [title, slug]) => {
    acc[title] = `/series#${slug}`;
    acc[`*${title}*`] = `/series#${slug}`;
    acc[`**${title}**`] = `/series#${slug}`;
    acc[`"${title}"`] = `/series#${slug}`;
    acc[`'${title}'`] = `/series#${slug}`;
    return acc;
  }, {} as Record<string, string>)
};