import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    category: z.enum(['learn', 'build', 'devlog']),
    tags: z.array(z.string()).default([]),
    // A live page this post is about, shown in a window at the top. The editor
    // saves an emptied field as '' or null, which means "no live page".
    output: z.preprocess(
      (value) => (value === '' || value === null ? undefined : value),
      z.string().url().or(z.string().startsWith('/')).optional(),
    ),
    draft: z.boolean().default(false),
  }),
})

export const collections = { blog }
