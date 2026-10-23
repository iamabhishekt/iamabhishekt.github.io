import rss from '@astrojs/rss'
import type { APIContext } from 'astro'
import { getPosts } from '../blog/posts'

export async function GET(context: APIContext) {
  const posts = await getPosts()
  return rss({
    title: 'Abhishek Thakur: devlog',
    description: 'What each project teaches me, written as I learn it.',
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      categories: [post.data.category, ...post.data.tags],
      link: `/blog/${post.id}/`,
    })),
  })
}
