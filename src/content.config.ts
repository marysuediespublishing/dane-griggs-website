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
			goodreadsUrl: z.string().url().optional(),
			price: z.string().optional(),
			wordCount: z.number().optional(),
			pageCount: z.number().optional(),
			status: z.enum(['published', 'pre-order', 'upcoming', 'draft']).default('published'),
			featured: z.boolean().default(false),
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
	}),
});

// Species collection
const species = defineCollection({
	loader: glob({ base: './src/content/species', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			name: z.string(),
			slug: z.string(),
			description: z.string().optional(),
			image: image().optional(),
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

export const collections = { 
	blog, 
	books, 
	series, 
	testimonials, 
	settings,
	species,
	locations,
	pages
};
