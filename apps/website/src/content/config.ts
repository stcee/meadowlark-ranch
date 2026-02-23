import { defineCollection, z } from 'astro:content';

const pagesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    heroLabel: z.string().optional(),
    heroImage: z.string().optional(),
    category: z.enum(['about', 'events', 'services', 'equine', 'local']),
    ctaTitle: z.string().optional(),
    ctaText: z.string().optional(),
    ctaButtonText: z.string().optional(),
    ctaButtonLink: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const faqCollection = defineCollection({
  type: 'content',
  schema: z.object({
    question: z.string(),
    sortOrder: z.number().default(0),
    page: z.string(),
  }),
});

export const collections = {
  pages: pagesCollection,
  faq: faqCollection,
};
