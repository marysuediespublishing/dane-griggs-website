import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Blog collection
const blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: image().optional(),
			bookSlug: z.string().optional(),
			tags: z.array(z.string()).default([]),
			category: z.enum(['alien-cultures', 'world-building', 'writing-process', 'behind-scenes', 'book-launches', 'series', 'about']).default('writing-process'),
			readingTime: z.string().optional(),
		}),
});

// A product's edition in another language (Press suite_006 §2): the market's ASINs and the
// edition's own words, as Amazon shows them. A /<lang>/ landing page is built only for a
// product with an edition in that language. Written from Press's Books.
const editionReview = z.object({ title: z.string().optional(), body: z.string(), reviewer: z.string() });
const seriesEdition = z.object({
	// The edition's Kindle ASIN in the language's storefront (amazon.de, amazon.fr)
	asin: z.string(),
	// The print link: Book 1 in paperback in that storefront (ASIN or ISBN-10); none, no print link
	paperbackAsin: z.string().optional(),
	// The box set's title as Amazon shows it, e.g. "Das Bräute-Programm"
	title: z.string(),
	blurb: z.string(),
	// In Kindle Unlimited in that marketplace: false shows two buttons, not three
	kuEnrolled: z.boolean(),
	// The edition's own box-set image (/images/…), when it is not the English one
	cover: z.string().optional(),
	// The series' name in the language, for the line over the title; none, a plain "the complete series"
	seriesName: z.string().optional(),
	// The hero's one line, and the short line under it; none, not shown
	hook: z.string().optional(),
	tagline: z.string().optional(),
	// As the storefront shows it, e.g. "9,99 €"
	price: z.string().optional(),
	separatePrice: z.string().optional(),
	// The edition's own ratings and reviews; a translated English review is not one
	rating: z.number().min(0).max(5).optional(),
	ratingCount: z.number().optional(),
	reviews: z.array(editionReview).default([]),
});
// Book landing pages (/books/<slug>/landing/): a testimonial picked by id (`excerpt`
// replaces a long body, with "…" wherever text is cut), and a door's copy. As
// gwen-demarco-website's.
const landingReview = z.object({ id: z.string(), excerpt: z.string().optional() });
const landingDoor = z.object({
	title: z.string().optional(),
	line: z.string().optional(),
	review: landingReview.optional(),
});
const bookEdition = z.object({
	asin: z.string().optional(),
	title: z.string(),
	// One line under the cover on a box-set page
	hook: z.string().optional(),
});

// Books collection
const books = defineCollection({
	loader: glob({ base: './src/content/books', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			author: z.string().default('Dane Griggs'),
			description: z.string(),
			cover: image(),
			series: z.string().optional(),
			seriesOrder: z.number().optional(),
			pubDate: z.coerce.date(),
			rating: z.number().min(0).max(5).default(0),
			ratingCount: z.number().default(0),
			alienSpecies: z.array(z.string()).default([]).optional(),
			species: z.array(z.string()).default([]).optional(),
			heatLevel: z.enum(['mild', 'medium', 'spicy', 'high', 'medium-high']).default('medium'),
			setting: z.array(z.string()).default([]),
			genres: z.array(z.string()).default([]),
			isKU: z.boolean().default(true),
			amazonUrl: z.string().url().optional(),
			// The Kindle edition's ASIN on amazon.com (a landing page's KU and Kindle buttons)
			asin: z.string().optional(),
			// The book's product slug in Press's Books (its Attribution tags' key, site-config
			// attributionTags.<market>.<productSlug>); default the book's own slug less "-book"
			productSlug: z.string().optional(),
			// The paperback on amazon.com, ASIN or ISBN-10 (Book 1's is the box-set page's print link)
			paperbackAsin: z.string().optional(),
			goodreadsUrl: z.string().url().optional(),
			price: z.string().optional(),
			wordCount: z.number().optional(),
			pageCount: z.number().optional(),
			status: z.enum(['published', 'pre-order', 'upcoming', 'draft']).default('published'),
			featured: z.boolean().default(false),
			// The book in other languages (its title on a /<lang>/ box-set page)
			editions: z.object({ de: bookEdition.optional(), fr: bookEdition.optional() }).optional(),
			// Ad landing page at /books/<slug>/landing/, built for every book with this block
			// (src/components/landing/BookLandingPage.astro). Up to three doors, each with
			// Kindle+ / Kindle / Print: this book, the start of its series, and another series in
			// the same world.
			landing: z
				.object({
					hook: z.string(),
					pullQuote: landingReview.optional(),
					reviews: z.array(landingReview).default([]),
					book: landingDoor.optional(),
					seriesStart: landingDoor.optional(),
					sameWorld: landingDoor
						.extend({
							series: z.string(),
							// The `target` parameter on this door's click events
							target: z.string(),
						})
						.optional(),
				})
				.optional(),
		}),
});

// Series collection
const series = defineCollection({
	loader: glob({ base: './src/content/series', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			cover: image().optional(),
			bookCount: z.number(),
			completionStatus: z.enum(['ongoing', 'complete']).default('ongoing'),
			startDate: z.coerce.date(),
			completionDate: z.coerce.date().optional(),
			alienSpecies: z.array(z.string()).default([]).optional(),
			species: z.array(z.string()).default([]).optional(),
			overallRating: z.number().min(0).max(5).default(0),
			totalRatings: z.number().default(0),
			worldBuilding: z.string().optional(),
			readingOrder: z.array(z.string()).default([]),
			featured: z.boolean().default(false),
			// Box-set landing page (/series/<slug>/box-set): all optional
			boxSetAsin: z.string().optional(),
			// The box set's product slug in Press's Books (its Attribution tags' key); default <series>-box-set
			boxSetSlug: z.string().optional(),
			boxSetBlurb: z.string().optional(),
			boxSetPrice: z.string().optional(),
			boxSetSeparatePrice: z.string().optional(),
			// The box-set image (/images/…): the build makes the page's 640 hero and 1200x630
			// share image from it (src/integrations/landing-covers.mjs)
			boxSetCover: z.string().optional(),
			// The box set's editions in other languages (/<lang>/series/<slug>/box-set)
			editions: z.object({ de: seriesEdition.optional(), fr: seriesEdition.optional() }).optional(),
		}),
});

// Testimonials collection
const testimonials = defineCollection({
	loader: glob({ base: './src/content/testimonials', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		reviewerName: z.string(),
		reviewerPlatform: z.enum(['amazon', 'goodreads', 'bookbub', 'facebook', 'email']).default('amazon'),
		rating: z.number().min(1).max(5),
		quote: z.string(),
		bookTitle: z.string().optional(),
		verified: z.boolean().default(false),
		date: z.coerce.date(),
		featured: z.boolean().default(false),
		category: z.enum(['character-development', 'world-building', 'romance', 'humor', 'overall']).default('overall'),
	}),
});

// Settings collection (for site configuration)
const settings = defineCollection({
	loader: glob({ base: './src/content/settings', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		siteTitle: z.string().optional(),
		siteDescription: z.string().optional(),
		authorName: z.string().optional(),
		authorBio: z.string().optional(),
		tagline: z.string().optional(),
		socialLinks: z.object({
			facebook: z.string().url().optional(),
			goodreads: z.string().url().optional(),
			twitter: z.string().url().optional(),
			instagram: z.string().url().optional(),
			email: z.string().email().optional(),
		}).optional(),
		stats: z.object({
			booksPublished: z.number().optional(),
			pagesRead: z.string().optional(),
			readerRatings: z.string().optional(),
			seriesComplete: z.number().optional(),
			averageRating: z.string().optional(),
			totalReviews: z.string().optional(),
		}).optional(),
		newsletter: z.object({
			leadMagnetTitle: z.string().optional(),
			leadMagnetDescription: z.string().optional(),
			benefits: z.array(z.string()).optional(),
		}).optional(),
		// Ad landing pages: Meta pixel, Amazon Attribution tags, Press CTR beacon
		metaPixelId: z.string().optional(),
		// The only hosts the pixel and the CTR beacon send from; elsewhere they log `[pixel] …` (src/lib/pixel-hosts.ts)
		pixelHosts: z.array(z.string()).optional(),
		// Amazon Attribution tags per product and door (Press ad_desk_007, written by Ad Desk's
		// Import tags): market → product slug → ku / kindle / print, each the Attribution URL.
		attributionTags: z.record(z.string(), z.record(z.string(), z.object({
			ku: z.string().optional(),
			kindle: z.string().optional(),
			print: z.string().optional(),
		}))).optional(),
		pressCtrEndpoint: z.string().optional(),
		amazonBadge: z.string().optional(),
	}),
});

// Species collection
const species = defineCollection({
	loader: glob({ base: './src/content/species', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		name: z.string(),
		slug: z.string(),
		description: z.string().optional(),
		series: z.array(z.string()).default([]),
		image: z.string().optional(), // CMS-style image path as string
		physicalTraits: z.string().optional(),
		cultureNotes: z.string().optional(),
		biologyNotes: z.string().optional(),
	}),
});

// Locations collection
const locations = defineCollection({
	loader: glob({ base: './src/content/locations', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			name: z.string(),
			slug: z.string(),
			description: z.string().optional(),
			image: image().optional(),
			environmentType: z.string().optional(),
		}),
});

// Pages collection
const pages = defineCollection({
	loader: glob({ base: './src/content/pages', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		title: z.string(),
		pageType: z.string(),
		hero: z.object({
			title: z.string().optional(),
			tagline: z.string().optional(),
		}).optional(),
		authorBio: z.object({
			mainBio: z.string().optional(),
			secondaryBio: z.string().optional(),
			tertiaryBio: z.string().optional(),
		}).optional(),
		philosophyCards: z.array(z.object({
			icon: z.string().optional(),
			title: z.string(),
			description: z.string(),
		})).optional(),
		connectSection: z.object({
			title: z.string().optional(),
			description: z.string().optional(),
		}).optional(),
	}),
});

// Characters collection
const characters = defineCollection({
	loader: glob({ base: './src/content/characters', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		name: z.string(),
		slug: z.string(),
		description: z.string().optional(),
		books: z.array(z.string()).default([]),
		cameos: z.array(z.string()).default([]),
		image: z.string().optional(), // CMS-style image path as string
		species: z.string().optional(),
	}),
});

export const collections = { 
	blog, 
	books, 
	series, 
	testimonials, 
	settings,
	species,
	characters,
	locations,
	pages
};
