// Sunrise entries. See README.md in this folder for details.
// Order doesn't matter: the page sorts by date. Only "date" is required.
// Lines starting with // are comments and are ignored.
//
// PHOTOS & VIDEOS: drop the originals (.jpeg/.HEIC/.png/.MOV) into the year/month folder, then run
//   In Terminal:  cd ~/"Dropbox (Personal)/Website/personal" && files/sunrises/compress_media.sh
//   Videos get a small .mp4 (aims for under 5 MB, starting at CRF 23); photos get a small .web.jpg with GPS removed.
//   Files already done are skipped. Settings are at the top of compress_media.sh.
//   Then in an entry, use the ORIGINAL file name; the page picks the small copy automatically:
//     "photo": "2026/10-Oct/2026-10-20.jpeg",      "video": "2026/11-Nov/2026-11-03.MOV"
//   (Either can be a list: ["a.jpeg", "b.HEIC"].) Originals stay on your computer; git ignores them.

const SUNRISES = [

  // ---- TEST photo posts (delete or edit these) ----

  {
    "date": "2026-10-27",
    "title": "Test photo",
    "location": "",
    "photo": "2026/10-Oct/2026-10-27.jpeg",
    "text": "Test post for photos."
  },

  {
    "date": "2026-10-20",
    "title": "Test photo",
    "location": "",
    "photo": "2026/10-Oct/2026-10-20.jpeg",
    "text": "Test post for photos."
  },

  {
    "date": "2026-10-08",
    "title": "Test photo",
    "location": "",
    "photo": "2026/10-Oct/2026-10-08.jpeg",
    "text": "Test post for photos."
  },

  {
    "date": "2026-02-14",
    "title": "Test photo",
    "location": "",
    "photo": "2026/02-Feb/2026-02-14.jpeg",
    "text": "Test post for photos."
  },

  {
    "date": "2025-11-04",
    "title": "Test photo",
    "location": "",
    "photo": "pre2026/2025-11-04.jpeg",
    "text": "Test post for photos."
  },

  {
    "date": "2025-08-17",
    "title": "Test photo",
    "location": "",
    "photo": "pre2026/2025-08-17.jpeg",
    "text": "Test post for photos."
  },

  {
    "date": "2025-08-08",
    "title": "Test photo",
    "location": "",
    "photo": "pre2026/2025-08-08.jpeg",
    "text": "Test post for photos."
  },

  {
    "date": "2025-02-16",
    "title": "Test photo",
    "location": "",
    "photo": "pre2026/2025-02-16.jpeg",
    "text": "Test post for photos."
  },

  {
    "date": "2023-10-09",
    "title": "Test photo",
    "location": "",
    "photo": "pre2026/2023-10-09.jpeg",
    "text": "Test post for photos."
  },

  {
    "date": "2022-09-22",
    "title": "Test photo",
    "location": "",
    "photo": "pre2026/2022-09-22.jpg",
    "text": "Test post for photos."
  },

  {
    "date": "2016-04-28",
    "title": "Test photo",
    "location": "",
    "photo": "pre2026/2016-04-28.JPG",
    "text": "Test post for photos."
  },

  {
    "date": "2015-12-23",
    "title": "Test photo",
    "location": "",
    "photo": "pre2026/2015-12-23.JPG",
    "text": "Test post for photos."
  },

  // ---- TEST video posts (delete or edit these) ----

  {
    "date": "2026-11-09",
    "title": "Test video",
    "location": "",
    "video": "2026/11-Nov/2026-11-09.mp4",
    "text": "Test post for the video player."
  },

  {
    "date": "2026-11-06",
    "title": "Test video",
    "location": "",
    "video": "2026/11-Nov/2026-11-06.mp4",
    "text": "Test post for the video player."
  },

  {
    "date": "2026-11-05",
    "title": "Test video",
    "location": "",
    "video": "2026/11-Nov/2026-11-05.mp4",
    "text": "Test post for the video player."
  },

  {
    "date": "2026-11-04",
    "title": "Test video",
    "location": "",
    "video": "2026/11-Nov/2026-11-04.mp4",
    "text": "Test post for the video player."
  },

  {
    "date": "2026-11-03",
    "title": "Test video",
    "location": "",
    "video": "2026/11-Nov/2026-11-03.mp4",
    "text": "Test post for the video player."
  },

  {
    "date": "2026-11-02",
    "title": "Test video",
    "location": "",
    "video": "2026/11-Nov/2026-11-02.mp4",
    "text": "Test post for the video player."
  },

  {
    "date": "2026-10-26",
    "title": "Test video",
    "location": "",
    "video": "2026/10-Oct/2026-10-26.mp4",
    "text": "Test post for the video player."
  },

  {
    "date": "2024-06-24",
    "title": "Test video",
    "location": "",
    "video": "pre2026/2024-06-24.mp4",
    "text": "Test post for the video player."
  },

  {
    "date": "2024-06-16",
    "title": "Test video",
    "location": "",
    "video": "pre2026/2024-06-16.mp4",
    "text": "Test post for the video player."
  },

  {
    "date": "2023-10-15",
    "title": "Test video",
    "location": "",
    "video": "pre2026/2023-10-15.mp4",
    "text": "Test post for the video player."
  },

];
