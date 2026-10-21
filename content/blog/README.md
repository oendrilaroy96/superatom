# Adding a blog post

Each post is one Markdown file in this folder. The file name becomes the web
address: `my-first-post.md` is published at `/blog/my-first-post`.

Use lowercase letters, numbers and dashes in file names, with no spaces.
This README is not published because it has no front matter.

## Template

Copy this into a new file such as `why-stockouts-start-early.md`:

```
---
title: Why Stockouts Start Long Before the Shelf Is Empty
date: 2026-10-12
category: Inventory intelligence
excerpt: One or two sentences shown on the blog card. Optional.
cover: /blog/why-stockouts.jpg
featured: false
---

Your first paragraph goes here.

## A section heading

More text, with **bold**, *italic*, `code` and [links](https://example.com).

- Bullet one
- Bullet two

1. Numbered one
2. Numbered two

> A quote.

![Description of the image](/blog/chart.png)
```

## Front matter fields (the part between the `---` lines)

| Field | Required | Notes |
|---|---|---|
| `title` | yes | A post without a title is skipped. |
| `date` | recommended | Written as `YYYY-MM-DD`. A **future date hides the post until that day**. |
| `category` | no | Posts with the same category are grouped under one filter button. |
| `excerpt` | no | Card summary. If empty, the first paragraph is used. |
| `cover` | no | Image path, for example `/blog/cover.jpg`. If empty, a placeholder is shown. |
| `featured` | no | `true` shows this post big at the top. Without one, the newest post is featured. |
| `draft` | no | `draft: true` hides the post while you work on it. |

## Images

Put image files in `public/blog/` and refer to them as `/blog/file-name.jpg`.
Use `cover:` for the top image, and `![description](/blog/file-name.jpg)` inside the text.

## Supported formatting

Headings (`##`, `###`, `####`), paragraphs, bullet and numbered lists, quotes,
code blocks (three backticks), images, dividers (`---`), and inline bold,
italic, code and links. Tables, embeds and nested lists are not supported.

## Publishing

Commit and push the new file (plus any images) to `main`, then deploy as usual.
