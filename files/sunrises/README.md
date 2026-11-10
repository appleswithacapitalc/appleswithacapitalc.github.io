# Sunrises

The Sunrises page (`inner/sunrises.html`) builds itself from `sunrises.js` in this folder.

The Sunsets page (`inner/sunsets.html`, linked from the moon) works exactly the same way, with
`files/sunsets/sunsets.js` and the photos/videos in `files/sunsets/`. Both pages share
`assets/js/sunlog.js` and `css/sunlog.css`, so a change there applies to both.

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
- Each post is titled `Sunrise #0012`, numbered automatically from the oldest (#0001). A `title` is added
  after it, e.g. `Sunrise #0012: Foggy one`. Leave it `""` for just `Sunrise #0012`.
- Videos play (muted, on loop) when their post is highlighted in the sidebar, and pause when you scroll on.
- `photo` can be a list for several photos: `["a.jpg", "b.jpg"]`
- In `text`, `\n\n` starts a new paragraph, and simple HTML works, e.g. `<a href="...">link</a>`.

## Photos & videos

Put the originals (`.jpeg`, `.HEIC`, `.png`, `.MOV`) in the year/month folder, then in Terminal:

```
cd ~/"Dropbox (Personal)/Website/personal"
files/compress_media.sh
```

- Videos get a web-friendly `.mp4` next to them, aiming for under 5 MB (starts at CRF 23 and
  steps up only if needed).
  Sound is removed. On the page, videos are sped up to last about 10 s ("Normal"), with
  a button (top-left) to watch at the speed they were filmed ("Slowed down"). To keep a video as filmed with
  no button, add `"speed": 1` to its entry (or e.g. `"speed": 3` to pick the speed). The 10 s is
  `VIDEO_SECONDS` in `inner/sunrises.html`.
- Photos get a `.web.jpg` next to them: at most 2048 px, usually 0.2-0.9 MB, with location
  (GPS) data removed.
- Originals are untouched and git ignores them, so only the small copies go online.
- Metadata: at the end, the script removes GPS, dates and camera info from every photo/video that gets
  pushed (`files/strip_metadata.py`). It's saved first in `media_metadata.json` in the website folder,
  which stays on your computer (git ignores it).
- Locations: posts with an empty `"location"` get one from the photo's GPS, e.g. `Stanley Park,
  Vancouver, Canada` or `Madison, United States` (`files/fill_locations.py`). Your own text is never
  changed; write `" "` to keep one blank. Hotels/resorts are skipped (just the city is used).
- To hide something in a photo (e.g. a face), edit its `.web.jpg` and save it with the JPEG comment
  `hand-edited: do not overwrite`. The script then never replaces it, even with `-f`.
- Files already done are skipped, so just run it whenever you add new ones. `-f` redoes
  everything; you can also pass one folder or file. Settings are at the top of the script.

In an entry, use the original file name and the page picks the small copy automatically:

```
"photo": "2026/10-Oct/2026-10-20.jpeg",
"video": "2026/11-Nov/2026-11-03.MOV",
```

Either can be a list, e.g. `"photo": ["a.jpeg", "b.HEIC"]`. Photos and videos show side by
side above the text; click a photo to open it full size. To change their size, edit
`--media-height` in `inner/sunrises.html`.

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
