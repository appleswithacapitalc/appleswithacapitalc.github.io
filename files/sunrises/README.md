# Sunrises

The Sunrises page (`inner/sunrises.html`) builds itself from `sunrises.js` in this folder.

## Add a sunrise

1. Put the photo in this folder, e.g. `2026-11-15.jpg`.
2. Add an entry to `sunrises.js` (order doesn't matter, the page sorts by date):

```js
  {
    "date": "2026-11-15",
    "title": "Foggy one",
    "location": "Pittsburgh",
    "photo": "2026-11-15.jpg",
    "text": "First paragraph.\n\nSecond paragraph."
  },
```

- `date` is required, as `YYYY-MM-DD`. Everything else is optional; leave it `""` or delete the line.
- `photo` can be a list for several photos: `["a.jpg", "b.jpg"]`
- In `text`, `\n\n` starts a new paragraph, and simple HTML works, e.g. `<a href="...">link</a>`.

## Gotchas

- Put a comma after each entry's `}` (a comma after the last one is fine too).
- Use straight double quotes `"`, not curly quotes. If your text contains a `"`, write it as `\"`.
- Lines starting with `//` are comments, handy for hiding an entry temporarily.
- If something's wrong, the page shows a yellow box. To find the exact line, open the
  browser console (Cmd+Option+J in Chrome).

## Preview

Just open `inner/sunrises.html` in your browser by double-clicking it.

On the live site, changes can take a few minutes to appear after you push (GitHub and
browsers cache files briefly). A hard refresh (Cmd+Shift+R) helps.
