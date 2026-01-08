import { defineCollection, z } from 'astro:content';

const projectsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    image: z.string(),
    gallery: z.array(z.string()).optional(),
    technologies: z.array(z.string()),
    category: z.enum(['web', 'mobile', 'api', 'tool', 'other']),
    featured: z.boolean().default(false),
    liveUrl: z.string().url().optional(),
    githubUrl: z.string().url().optional(),
    publishedAt: z.date(),
    problem: z.string().optional(),
    solution: z.string().optional(),
    results: z.array(z.object({
      metric: z.string(),
      value: z.string(),
    })).optional(),
  }),
});

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.date(),
    updatedAt: z.date().optional(),
    image: z.string().optional(),
    tags: z.array(z.string()),
    draft: z.boolean().default(false),
    readingTime: z.number().optional(),
  }),
});

export const collections = {
  projects: projectsCollection,
  blog: blogCollection,
};
