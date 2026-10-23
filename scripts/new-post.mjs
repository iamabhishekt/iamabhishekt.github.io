// npm run new "My post title" [learn|build|devlog]
// Creates src/content/blog/<slug>.md as a draft with every building block in place.
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const [title, category = 'learn'] = process.argv.slice(2)
if (!title) {
  console.error('Usage: npm run new "My post title" [learn|build|devlog]')
  process.exit(1)
}
if (!['learn', 'build', 'devlog'].includes(category)) {
  console.error(`Unknown category "${category}". Use learn, build or devlog.`)
  process.exit(1)
}

const slug = title
  .toLowerCase()
  .normalize('NFKD')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '')
const dir = join('src', 'content', 'blog')
const file = join(dir, `${slug}.md`)
if (existsSync(file)) {
  console.error(`${file} already exists.`)
  process.exit(1)
}

const today = new Date().toISOString().slice(0, 10)
const body = `---
title: '${title.replace(/'/g, "''")}'
description: 'One sentence: what the reader learns from this post.'
date: ${today}
category: ${category}
tags: []
draft: true
---

Open with the problem in one or two sentences.

## What I was trying to do

Write normally. Wrap the line that matters in ==a highlighter==, and give a
tricky word a hover definition: {term: latency | how long one request takes}.

> [!NOTE]
> Callouts: NOTE, TIP, IMPORTANT, WARNING or CAUTION on the first line.

## How it works

\`\`\`mermaid
flowchart LR
  A[Input] --> B[Step]
  B --> C[Output]
\`\`\`

Code blocks get a copy button automatically:

\`\`\`rust
fn main() {
    println!("$ ");
}
\`\`\`

A demo: each control line drives a CSS variable of the same name.

\`\`\`demo
gap: 0..48px = 16px
direction: row | column
---html
<div class="row"><i>1</i><i>2</i><i>3</i></div>
---css
.row { display: flex; gap: var(--gap); flex-direction: var(--direction); }
i { padding: 16px 20px; background: #2f5fd0; color: #fff; font-style: normal; }
\`\`\`

A playground readers can edit (HTML first, then ---css and ---js if you need them):

\`\`\`playground
<button class="btn">Press me</button>
---css
.btn { padding: 12px 20px; border: 2px solid; background: gold; }
\`\`\`

> A plain quote stays a quote.

Images: put the file in public/blog/${slug}/ and link it like this:

![What the image shows](/blog/${slug}/screenshot.png)

## What I learned

---

End with the one thing you would tell someone starting this.
`

mkdirSync(dir, { recursive: true })
writeFileSync(file, body)
console.log(`Created ${file}`)
console.log('It is a draft: visible in `npm run dev`, hidden on the live site.')
console.log('Set `draft: false`, then git add, commit and push to publish.')
