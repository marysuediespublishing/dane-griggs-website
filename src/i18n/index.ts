import type { LandingLang } from '../lib/landing';
import type { LandingStrings } from './landing';
import { en } from './landing.en';
import { de } from './landing.de';
import { fr } from './landing.fr';

export const LANDING_STRINGS: Readonly<Record<LandingLang, LandingStrings>> = { en, de, fr };
