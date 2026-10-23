# iamabhishekt.github.io

My portfolio (a Vox-style scroll explainer) and devlog. Astro + React, deployed to GitHub Pages by `.github/workflows/pages.yml` on every push to `main`.

## Write a post in the editor

Open https://app.pagescms.org, log in with GitHub and pick this repo. **Posts** lists every post. **Add an entry** gives a form for the header and a rich-text editor for the post: type `/` for headings, lists, quotes, tables and code blocks, and drag images straight in (they land in `public/blog/`).

- New posts start as **Draft**. Untick it and **Save** to publish; every save is a commit, live about a minute later.
- Diagram, demo or playground: insert a code block and set its language to `mermaid`, `demo` or `playground` (see the table below).
- Highlight, definitions and callouts: just type them, as in the table.
- The **Source** switch shows the Markdown if you ever want it.

The editor is configured by `.pages.yml`.

## Write a post locally

```bash
npm install            # once
npm run new "How a shell parses quotes" learn   # learn | build | devlog
npm run dev            # preview at http://localhost:4321/blog/ (drafts show here)
```

This creates `src/content/blog/how-a-shell-parses-quotes.md` as a **draft** with every building block in place. Edit it, then set `draft: false`.

Publish:

```bash
git add src/content/blog public/blog
git commit -m "post: how a shell parses quotes"
git push
```

The site rebuilds and is live about a minute later. No other deploy step.

You can also write straight on GitHub: open `src/content/blog/`, **Add file**, write Markdown, **Commit**. Same result.

## What a post can use

| You write | You get |
| --- | --- |
| ` ```mermaid ` block | A diagram (flowchart, sequence, state, class...), drawn on a taped sheet |
| ` ```rust ` or any language | Highlighted code with a **Copy** button |
| `==key line==` | A highlighter stroke |
| `{term: word \| meaning}` | A dotted word; hover or tap shows the meaning (not inside tables) |
| `> [!NOTE]` on a quote's first line | A callout card: `NOTE`, `TIP`, `IMPORTANT`, `WARNING`, `CAUTION` |
| `> text` | A quote |
| ` ```demo ` block | Live example with sliders and buttons. Control lines first (`gap: 0..48px = 16px`, `direction: row \| column`), then `---html` and `---css`; the CSS reads `var(--gap)` |
| ` ```playground ` block | Editable HTML/CSS/JS with a live result and **Reset code**. HTML first, then optional `---css` and `---js` |
| `---` | A torn-paper divider |
| `![alt](/blog/<slug>/image.png)` | An image; put the file in `public/blog/<slug>/` |
| Tables | Styled tables |
| `output: /some/page` in the header | A live window of that page at the top of the post |

A block with a mistake shows its source with the reason in red instead of breaking the page.

Every post also gets: light and night-paper themes (follows the system, toggle in the header), reading time, a numbered "On this page" list from its `##` headings, a **Human / Agent** switch (Agent shows the raw Markdown, also served at `/blog/<slug>.md`), "Keep reading", RSS at `/rss.xml` and a sitemap.

## Post header

```yaml
---
title: 'How a shell parses quotes'
description: 'One sentence: what the reader learns.'
date: 2026-10-22
category: learn          # learn | build | devlog
tags: [rust, shell]
output: /                # optional: a live page to embed
draft: true              # hidden on the live site until false
---
```

A wrong header (missing title, unknown category) fails the build with a message naming the field, so a broken post never goes live.

## Layout

- `src/content/blog/` posts
- `src/pages/blog/` blog index, post page, `.md` endpoint
- `src/blog/` blog styles and the post page script (copy, Mermaid, TOC)
- `src/vox/` the home page explainer and its data (`data/content.json`)
- `public/vox/` paper, ink and halftone assets
