// The box-set landing pages' cover copies, made here from the box-set image at the start of
// every `astro dev` / `astro build` (job #5152, as gwen-demarco-website does since #5147), so
// a new or bigger box-set image reaches the page and its share card with nothing else to
// remember. The copies go to public/images/landing/, which is not in git; a copy newer than
// its source (and than this file) is left alone.
//
//   series boxSetCover        /images/<name>.<ext>  ->  landing/<name>-640.jpg   the page's hero
//                                                   ->  landing/<name>-og.jpg    1200x630 share image
//   series editions.<lang>.cover                    ->  the same, from the edition's own image
//
// Only series with a box-set page (src/pages/series/<slug>/box-set.astro) are made. The hero
// stays a JPEG on white: the page lays it on its background with mix-blend-multiply.
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import sharp from 'sharp';

const SELF = fileURLToPath(import.meta.url);
const OG = { width: 1200, height: 630 };
const HERO = 640;

/** "/images/foo.jpg" -> "foo"; anything else -> undefined. */
export const coverName = (src) => {
  const m = typeof src === 'string' && src.match(/^\/images\/([^/]+)\.(jpe?g|png|webp)$/i);
  return m ? m[1] : undefined;
};

/** The landing copies of a box-set image: { hero, og } as site paths, or undefined. */
export const landingCovers = (src) => {
  const name = coverName(src);
  return name ? { hero: `/images/landing/${name}-640.jpg`, og: `/images/landing/${name}-og.jpg` } : undefined;
};

const frontmatter = (dir) =>
  existsSync(dir)
    ? readdirSync(dir)
        .filter((f) => /\.mdx?$/.test(f))
        .map((f) => ({ slug: f.replace(/\.mdx?$/, ''), data: matter(readFileSync(join(dir, f), 'utf8')).data }))
    : [];

/** Every copy the box-set pages can ask for: [{ out, src, kind }], out relative to public/. */
export const plan = (root) => {
  const jobs = new Map();
  for (const { slug, data } of frontmatter(join(root, 'src/content/series'))) {
    if (!existsSync(join(root, 'src/pages/series', slug, 'box-set.astro'))) continue;
    const sources = [data.boxSetCover, ...Object.values(data.editions ?? {}).map((e) => e?.cover)];
    for (const src of sources) {
      const copies = landingCovers(src);
      if (!copies || !existsSync(join(root, 'public', src))) continue;
      jobs.set(copies.hero, { out: copies.hero, src, kind: 'hero' });
      jobs.set(copies.og, { out: copies.og, src, kind: 'og' });
    }
  }
  return [...jobs.values()];
};

// A transparent image (a 3D box set cut out) loses its empty margins and lands on white.
const flat = async (file) => {
  const { hasAlpha } = await sharp(file).metadata();
  return hasAlpha ? sharp(file).trim().flatten({ background: '#ffffff' }).png().toBuffer() : readFileSync(file);
};

const hero = async (file, out) => {
  await sharp(await flat(file))
    .resize({ width: HERO, withoutEnlargement: true })
    .jpeg({ quality: 85, mozjpeg: true, progressive: true })
    .toFile(out);
};

// The box set, its white margin trimmed, centred on white at most of the card's height, as the
// hand-made share image was.
const og = async (file, out) => {
  const trimmed = await sharp(await flat(file)).trim({ background: '#ffffff', threshold: 12 }).toBuffer();
  const front = await sharp(trimmed)
    .resize({ width: OG.width - 100, height: OG.height - 140, fit: 'inside' })
    .png()
    .toBuffer();
  await sharp({ create: { ...OG, channels: 3, background: '#ffffff' } })
    .composite([{ input: front, gravity: 'centre' }])
    .jpeg({ quality: 85, mozjpeg: true, progressive: true })
    .toFile(out);
};

/** Makes the copies that are missing or older than their source; returns { made, fresh }. */
export const makeLandingCovers = async (root) => {
  mkdirSync(join(root, 'public/images/landing'), { recursive: true });
  const self = statSync(SELF).mtimeMs;
  const made = [];
  let fresh = 0;
  for (const job of plan(root)) {
    const src = join(root, 'public', job.src);
    const out = join(root, 'public', job.out);
    if (existsSync(out) && statSync(out).mtimeMs > Math.max(statSync(src).mtimeMs, self)) {
      fresh++;
      continue;
    }
    await (job.kind === 'og' ? og(src, out) : hero(src, out));
    made.push(job.out);
  }
  return { made, fresh };
};

export default function landingCoversIntegration() {
  return {
    name: 'landing-covers',
    hooks: {
      'astro:config:setup': async ({ config, logger }) => {
        const { made, fresh } = await makeLandingCovers(fileURLToPath(config.root));
        logger.info(`${made.length} made${made.length ? ` (${made.join(', ')})` : ''}, ${fresh} up to date`);
      },
    },
  };
}
