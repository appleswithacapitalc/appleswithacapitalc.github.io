# Puns

The Puns page (`inner/puns.html`) builds itself from `puns.js` in this folder.
It's only reachable by hovering the "b" in "Pubs" in the menu bar.

## Add a pun

Add an entry to the `PUNS` list in `puns.js`:

```js
  {
    "pun": "Setup line\nPunchline",
    "note": "Optional small text underneath",
    "date": "2026-11-15"
  },
```

- Only `pun` is required; delete `note` or `date` lines you don't need.
- `\n` makes a line break. Simple HTML works too, e.g. `<em>`, `<a href="...">`.
- `date` is `YYYY-MM-DD`. The list below the carousel is sorted newest first.

## Settings (top of `puns.js`)

- `carouselCount`: how many random puns the carousel picks on each visit (0 = all).
- `reshuffleEachRound`: `true` shuffles the order of those puns every round; `false` keeps one order.
- `secondsPerSlide`: how long each pun stays up.
- `showFullList`: `false` hides the list below the carousel.

## Gotchas

- Put a comma after each entry's `}` (one after the last is fine too).
- Use straight double quotes `"`. If your pun contains a `"`, write it as `\"`.
- Lines starting with `//` are ignored, handy for hiding a pun temporarily.
- If something's wrong, the page shows a yellow box. Open the browser console
  (Cmd+Option+J in Chrome) to see the exact line.

## Preview

Just double-click `inner/puns.html`.
