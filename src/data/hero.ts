export const heroTitles = [
  'Full Stack Software Developer',
  'Frontend Web Developer',
  'Backend Web Developer',
  'Jack of All Trades',
] as const;

export type HeroTitle = (typeof heroTitles)[number];
