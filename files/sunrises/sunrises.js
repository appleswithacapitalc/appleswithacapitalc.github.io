// Sunrise entries. See README.md in this folder for details.
// Kept newest first (add new ones at the top), though the page sorts by date anyway. Only "date" is required (YYYY-MM-DD, or YYYY-MM if you don't know the day).
// Lines starting with // are comments and are ignored.
// Titles show as "Sunrise #0012: your title" (just "Sunrise #0012" if title is blank). #0001 is the oldest; numbers are automatic.
//
// PHOTOS & VIDEOS: drop the originals (.jpeg/.HEIC/.png/.MOV) into the year/month folder, then run
//   In Terminal:  cd ~/"Dropbox (Personal)/Website/personal" && files/compress_media.sh
//   Videos get a small silent .mp4 (under ~5 MB); photos get a small .web.jpg with GPS removed.
//   On the page, videos are sped up to last ~10 s, with a "Slowed down" button for the speed they were filmed at.
//   "speed": 1 keeps one as filmed (no button); e.g. "speed": 3 picks the speed yourself.
//   Files already done are skipped. Settings are at the top of compress_media.sh.
//   It also fills in an empty "location" from the photo's GPS (a place or city, never overwrites yours).
//   Then in an entry, use the ORIGINAL file name; the page picks the small copy automatically:
//     "photo": "2026/10-Oct/2026-10-20.jpeg",      "video": "2026/11-Nov/2026-11-03.MOV"
//   (Either can be a list: ["a.jpeg", "b.HEIC"].) Originals stay on your computer; git ignores them.

const SUNRISES = [

  {
    "date": "2026-11-10",
    "title": "",
    "location": "",
    "video": "2026/11-Nov/2026-11-10.mp4",
    "text": ""
  },

  {
    "date": "2026-11-09",
    "title": "",
    "location": "",
    "video": "2026/11-Nov/2026-11-09.mp4",
    "text": ""
  },

  {
    "date": "2026-11-06",
    "title": "",
    "location": "",
    "video": "2026/11-Nov/2026-11-06.mp4",
    "text": ""
  },

  {
    "date": "2026-11-05",
    "title": "",
    "location": "",
    "video": "2026/11-Nov/2026-11-05.mp4",
    "text": ""
  },

  {
    "date": "2026-11-04",
    "title": "",
    "location": "",
    "video": "2026/11-Nov/2026-11-04.mp4",
    "text": ""
  },

  {
    "date": "2026-11-03",
    "title": "",
    "location": "",
    "video": "2026/11-Nov/2026-11-03.mp4",
    "text": ""
  },

  {
    "date": "2026-11-02",
    "title": "",
    "location": "",
    "video": "2026/11-Nov/2026-11-02.mp4",
    "text": ""
  },

  {
    "date": "2026-10-27",
    "title": "",
    "location": "",
    "video": "2026/10-Oct/2026-10-27.mp4",
    "text": ""
  },

  {
    "date": "2026-10-20",
    "title": "",
    "location": "",
    "photo": "2026/10-Oct/2026-10-20.jpeg",
    "text": ""
  },

  {
    "date": "2026-10-19",
    "title": "",
    "location": "",
    "photo": "2026/10-Oct/2026-10-19.jpeg",
    "text": ""
  },

  {
    "date": "2026-10-08",
    "title": "",
    "location": "",
    "photo": "2026/10-Oct/2026-10-08.jpeg",
    "text": ""
  },

  {
    "date": "2026-02-14",
    "title": "",
    "location": "",
    "photo": "2026/02-Feb/2026-02-14.jpeg",
    "text": ""
  },

  {
    "date": "2025-11-04",
    "title": "",
    "location": "",
    "photo": "pre2026/2025-11-04.jpeg",
    "text": ""
  },

  {
    "date": "2025-08-17",
    "title": "",
    "location": "",
    "photo": "pre2026/2025-08-17.jpeg",
    "text": ""
  },

  {
    "date": "2025-08-08",
    "title": "",
    "location": "",
    "photo": "pre2026/2025-08-08.jpeg",
    "text": ""
  },

  {
    "date": "2025-02-16",
    "title": "",
    "location": "",
    "photo": "pre2026/2025-02-16.jpeg",
    "text": ""
  },

  {
    "date": "2024-06-24",
    "title": "",
    "location": "",
    "video": "pre2026/2024-06-24.mp4",
    "text": ""
  },

  {
    "date": "2024-06-16",
    "title": "",
    "location": "",
    "video": "pre2026/2024-06-16.mp4",
    "speed": 1,
    "text": ""
  },

  {
    "date": "2023-10-15",
    "title": "",
    "location": "",
    "video": "pre2026/2023-10-15.mp4",
    "text": ""
  },

  {
    "date": "2023-10-09",
    "title": "",
    "location": "",
    "photo": "pre2026/2023-10-09.jpeg",
    "text": ""
  },

  {
    "date": "2022-09-22",
    "title": "",
    "location": "",
    "photo": "pre2026/2022-09-22.jpg",
    "text": ""
  },

  {
    "date": "2016-04-28",
    "title": "",
    "location": "Angkor Wat, Siem Reap, Cambodia",
    "photo": "pre2026/2016-04-28.JPG",
    "text": ""
  },

  {
    "date": "2015-12-23",
    "title": "",
    "location": "Mazatlán, Mexico",
    "photo": "pre2026/2015-12-23.JPG",
    "text": ""
  },

  {
    "date": "2014-09-01",
    "title": "",
    "location": "",
    "photo": "pre2026/2014-09-01.jpeg",
    "text": ""
  },

  {
    "date": "2009-08",
    "title": "",
    "location": "",
    "photo": "pre2026/2009-08.jpg",
    "text": ""
  },

];
