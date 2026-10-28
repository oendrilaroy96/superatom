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
| `series` | no | A label shown above the title. Written as `Series name - Part 2 of 3`, it also labels the card ("Part 2 of 3") and links all parts of that series together at the bottom of each article. A series without the "Part N of M" ending is just shown as a label. |
| `subtitle` | no | A standfirst shown under the title. Also used as the card summary when there's no `excerpt`. |
| `excerpt` | no | Card summary. If empty, the subtitle, then the first paragraph, is used. |
| `cover` | no | Thumbnail for the blog cards, for example `/blog/cover.jpg`. If empty, a placeholder is shown. It is not shown on the post page itself. |
| `stat1`, `stat2`, `stat3` | no | Up to three headline numbers shown as cards under the title, see "Headline numbers" below. |
| `featured` | no | `true` shows this post big at the top of the blog page. Leave it out and the newest post is featured automatically. |
| `draft` | no | `draft: true` hides the post while you work on it. |

## Headline numbers

Each of `stat1`, `stat2`, `stat3` is the big number, then a vertical bar (`|`), then a short caption:

```
stat1: $1.7T | lost each year to stockouts and overstock worldwide
stat2: 6.2% | of global retail sales
```

Leave them out and the post simply has a plain dark header with no cards.

## Contents sidebar

On wide screens, posts with three or more `##` headings get a contents list that stays beside the
text and highlights the section being read. It is built automatically from the headings.

## Images

Put image files in `src/assets/blog/` and refer to them as `/blog/file-name.jpg` (the site swaps that path for the built,
fingerprinted file, so keep the `/blog/` prefix in the post).
Use `cover:` for the thumbnail on the blog cards, and `![description](/blog/file-name.jpg)` inside the text.
The text in the square brackets is the image's description for screen readers. To also show a visible
caption under the image, add it in quotes: `![description](/blog/file-name.jpg "Caption text")`.

## Supported formatting

Headings (`##`, `###`, `####`), paragraphs, bullet and numbered lists, quotes,
code blocks (three backticks), images, dividers (`---`), and inline bold,
italic, code and links. Tables, embeds and nested lists are not supported.

## Publishing

Commit and push the new file (plus any images) to `main`, then deploy as usual.
