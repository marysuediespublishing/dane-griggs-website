import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  // Fetch all collections
  const books = await getCollection('books');
  const series = await getCollection('series');
  const blog = await getCollection('blog');
  const species = await getCollection('species');
  const characters = await getCollection('characters');
  const pages = await getCollection('pages');
  const locations = await getCollection('locations');

  // Create search index with minimal data for fast loading
  const searchIndex = {
    books: books.map(book => ({
      id: book.id,
      title: book.data.title,
      description: book.data.description,
      author: book.data.author,
      series: book.data.series,
      species: book.data.species || [],
      alienSpecies: book.data.alienSpecies || [],
      genres: book.data.genres || [],
      setting: book.data.setting || [],
      cover: book.data.cover,
      type: 'book'
    })),
    
    series: series.map(s => ({
      id: s.id,
      title: s.data.title,
      description: s.data.description,
      bookCount: s.data.bookCount,
      completionStatus: s.data.completionStatus,
      species: s.data.species || [],
      alienSpecies: s.data.alienSpecies || [],
      worldBuilding: s.data.worldBuilding,
      type: 'series'
    })),
    
    blog: blog.map(post => ({
      id: post.id,
      title: post.data.title,
      description: post.data.description,
      category: post.data.category,
      tags: post.data.tags || [],
      pubDate: post.data.pubDate.toISOString(),
      type: 'blog'
    })),
    
    species: species.map(s => ({
      id: s.id,
      name: s.data.name,
      description: s.data.description,
      physicalTraits: s.data.physicalTraits,
      cultureNotes: s.data.cultureNotes,
      biologyNotes: s.data.biologyNotes,
      image: s.data.image,
      type: 'species'
    })),
    
    characters: characters.map(c => ({
      id: c.id,
      name: c.data.name,
      description: c.data.description,
      species: c.data.species,
      books: c.data.books || [],
      cameos: c.data.cameos || [],
      image: c.data.image,
      type: 'character'
    })),
    
    pages: pages.map(p => ({
      id: p.id,
      title: p.data.title,
      heroTitle: p.data.hero?.title,
      heroTagline: p.data.hero?.tagline,
      authorBio: p.data.authorBio?.mainBio,
      type: 'page'
    })),
    
    locations: locations.map(l => ({
      id: l.id,
      name: l.data.name,
      description: l.data.description,
      environmentType: l.data.environmentType,
      type: 'location'
    }))
  };

  return new Response(JSON.stringify(searchIndex), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600'
    }
  });
};