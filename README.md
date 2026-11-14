# Džemo baldai – website

Static one-page site (no build step, no dependencies). Lithuanian at `index.html`, English at `en/index.html`.

```
index.html            Lithuanian page
en/index.html         English page
assets/css/style.css  all styles (colours are variables at the top)
assets/js/main.js     menu, gallery filter, lightbox, quote form
assets/img/           placeholder illustrations (replace with photos)
assets/fonts/         Manrope, self-hosted (SIL Open Font License)
favicon.svg
```

To preview locally, run this in the folder and open http://localhost:8000:

```bash
python3 -m http.server 8000
```

To publish, upload the whole folder to any web hosting (or Netlify, Cloudflare Pages, GitHub Pages).

## Before going live – fill in the placeholders

Everything still to be filled in is highlighted in yellow on the page and marked `TODO` in the HTML. Each item must be changed in **both** `index.html` and `en/index.html`.

| What | Where |
| --- | --- |
| Customer reviews | Section `#atsiliepimai` currently links to Facebook. Real reviews can be added as `<li class="quote">` cards inside a `<ul class="quotes">` |
| Photos | See below |
| Quote form inbox | See below |
| Domain | In `<head>`, uncomment the `canonical` / `hreflang` / `og:` block and replace `JUSU-DOMENAS.lt` |

## Photos

All images are currently drawn illustrations. While an image file ends in `.svg`, the page shows a "Vieta nuotraukai" label on it; the label disappears on its own once a real photo is used.

1. Save photos as JPG or WebP, landscape 4:3, about 1200 px wide (hero about 1600 px), ideally under 250 KB each.
2. Put them in `assets/img/` (gallery photos in `assets/img/portfolio/`).
3. Change the `src` of the matching `<img>` and update its `alt` text.

Gallery items are the `<figure class="work" data-cat="…">` blocks in the `#darbai` section. Copy a block to add a project. `data-cat` decides which filter shows it: `virtuve`, `spinta`, `svetaine`, `darbo-kambarys`, `vaiko-kambarys`, `vonia`, `prieskambaris`. The current captions are samples. When real photos are in, delete the yellow `todo-note` paragraph above the gallery.

## Quote form

A static site cannot send email by itself, so the form needs a receiving address. It is currently connected to Formspree (`CONFIG.formEndpoint` in `assets/js/main.js`). If a file cannot be attached (Formspree free plan), the request is re-sent without it and the visitor is told so.

1. Create a form endpoint with a form service (for example Formspree, Web3Forms or Getform – check that the plan supports file uploads) or use a script on your own hosting.
2. Paste the address into `CONFIG.formEndpoint` at the top of `assets/js/main.js`.

The form posts `multipart/form-data` with these fields: `name`, `phone`, `email`, `furniture_type`, `dimensions`, `message`, `attachment` (files), `consent`. `website` is a hidden anti-spam field and must stay empty.
