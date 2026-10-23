import type { APIRoute } from 'astro'
import { getPosts, type Post } from '../../blog/posts'

export async function getStaticPaths() {
  const posts = await getPosts()
  return posts.map((post) => ({ params: { slug: post.id }, props: { post } }))
}

// The "Agent" view: the post as plain Markdown at /blog/<slug>.md.
export const GET: APIRoute = ({ props }) => {
  const { post } = props as { post: Post }
  const { title, description, date } = post.data
  const head = `# ${title}\n\n> ${description}\n\nPublished ${date.toISOString().slice(0, 10)} · https://iamabhishekt.github.io/blog/${post.id}/\n\n`
  return new Response(head + (post.body ?? ''), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  })
}
