// Sunset entries. Works exactly like Sunrises: see files/sunrises/README.md for details.
// Kept newest first (add new ones at the top), though the page sorts by date anyway. Only "date" is required (YYYY-MM-DD, or YYYY-MM if you don't know the day).
// Lines starting with // are comments and are ignored.
// Titles show as "Sunset #0012: your title" (just "Sunset #0012" if title is blank). #0001 is the oldest; numbers are automatic.
//
// PHOTOS & VIDEOS: drop the originals (.jpeg/.HEIC/.png/.MOV) into the year folder, then run
//   In Terminal:  cd ~/"Dropbox (Personal)/Website/personal" && files/compress_media.sh
//   Videos get a small silent .mp4 (under ~5 MB); photos get a small .web.jpg with GPS removed.
//   On the page, videos are sped up to last ~10 s, with a "Slowed down" button for the speed they were filmed at.
//   "speed": 1 keeps one as filmed (no button); e.g. "speed": 3 picks the speed yourself.
//   Files already done are skipped. Settings are at the top of compress_media.sh.
//   It also fills in an empty "location" from the photo's GPS (a place or city, never overwrites yours).
//   Then in an entry, use the ORIGINAL file name; the page picks the small copy automatically:
//     "photo": "2026/2026-10-27.jpeg",      "video": "pre2026/2019-05-17.MOV"
//   (Either can be a list: ["a.jpeg", "b.HEIC"].) The script moves originals into originals/ (same folders),
//   which stays on your computer: git ignores it.

const SUNSETS = [

  {
    "date": "2026-11-08",
    "title": "",
    "location": "Pittsburgh, Pennsylvania",
    "photo": "2026/2026-11-08.jpeg",
    "text": ""
  },

  {
    "date": "2026-11-05",
    "title": "",
    "location": "Cathedral of Learning, Pittsburgh, Pennsylvania",
    "photo": "2026/2026-11-05.jpeg",
    "text": ""
  },

  {
    "date": "2026-10-27",
    "title": "",
    "location": "Schenley Park, Pittsburgh, Pennsylvania",
    "photo": "2026/2026-10-27.jpeg",
    "text": ""
  },

  {
    "date": "2026-10-09",
    "title": "",
    "location": "Pittsburgh, Pennsylvania",
    "photo": "2026/2026-10-09.jpeg",
    "text": ""
  },

  {
    "date": "2026-10-03",
    "title": "",
    "location": "West Lafayette, Indiana",
    "photo": "2026/2026-10-03.jpeg",
    "text": ""
  },

  {
    "date": "2026-09-08",
    "title": "",
    "location": "Pittsburgh, Pennsylvania",
    "photo": "2026/2026-09-08.jpeg",
    "text": ""
  },

  {
    "date": "2026-08-26",
    "title": "",
    "location": "Pittsburgh, Pennsylvania",
    "photo": "2026/2026-08-26.jpeg",
    "text": ""
  },

  {
    "date": "2026-07-16",
    "title": "",
    "location": "Hudson River, New York City, New York",
    "photo": "2026/2026-07-16.jpeg",
    "text": ""
  },

  {
    "date": "2026-07-11",
    "title": "",
    "location": "Princeton University, Princeton, New Jersey",
    "photo": "2026/2026-07-11.HEIC",
    "text": ""
  },

  {
    "date": "2026-05-15",
    "title": "",
    "location": "Mount Washington, Pittsburgh, Pennsylvania",
    "photo": "2026/2026-05-15.jpeg",
    "text": ""
  },

  {
    "date": "2026-04-09",
    "title": "",
    "location": "Carnegie Mellon University, Pittsburgh, Pennsylvania",
    "photo": "2026/2026-04-09.HEIC",
    "text": ""
  },

  {
    "date": "2026-03-08",
    "title": "",
    "location": "Pittsburgh, Pennsylvania",
    "photo": "2026/2026-03-08.jpeg",
    "text": ""
  },

  {
    "date": "2025-10-04",
    "title": "",
    "location": "London, Ontario",
    "photo": "pre2026/2025-10-04.HEIC",
    "text": ""
  },

  {
    "date": "2025-08-18",
    "title": "",
    "location": "Lake Minnewanka, Banff National Park, Alberta",
    "photo": "pre2026/2025-08-18.HEIC",
    "text": ""
  },

  {
    "date": "2025-08-16",
    "title": "",
    "location": "Lake Louise, Alberta",
    "photo": "pre2026/2025-08-16.HEIC",
    "text": ""
  },

  {
    "date": "2025-08-07",
    "title": "",
    "location": "The Beaches Boardwalk, Toronto, Ontario",
    "photo": "pre2026/2025-08-07.jpeg",
    "text": ""
  },

  {
    "date": "2025-06-10",
    "title": "",
    "location": "Nashville, Tennessee",
    "photo": "pre2026/2025-06-10.jpeg",
    "text": ""
  },

  {
    "date": "2025-04-12",
    "title": "",
    "location": "",
    "photo": "pre2026/2025-04-12.HEIC",
    "text": ""
  },

  {
    "date": "2025-02-28",
    "title": "",
    "location": "Miroir d'eau, Bordeaux, France",
    "photo": "pre2026/2025-02-28.jpeg",
    "text": ""
  },

  {
    "date": "2025-02-25",
    "title": "",
    "location": "Grenoble, France",
    "photo": "pre2026/2025-02-25.HEIC",
    "text": ""
  },

  {
    "date": "2025-02-21",
    "title": "",
    "location": "Vittoriano, Rome, Italy",
    "photo": "pre2026/2025-02-21.jpeg",
    "text": ""
  },

  {
    "date": "2025-02-20",
    "title": "",
    "location": "Santa Maria in Aracoeli, Rome, Italy",
    "photo": "pre2026/2025-02-20.jpeg",
    "text": ""
  },

  {
    "date": "2024-12-25",
    "title": "",
    "location": "Rattray Marsh Conservation Area, Mississauga, Ontario",
    "photo": "pre2026/2024-12-25.jpeg",
    "text": ""
  },

  {
    "date": "2024-11-24",
    "title": "",
    "location": "",
    "photo": "pre2026/2024-11-24.jpeg",
    "text": ""
  },

  {
    "date": "2024-08-21",
    "title": "",
    "location": "Toronto, Ontario",
    "photo": "pre2026/2024-08-21.jpeg",
    "text": ""
  },

  {
    "date": "2024-07-03",
    "title": "",
    "location": "Riverdale Park East, Toronto, Ontario",
    "photo": "pre2026/2024-07-03.jpeg",
    "text": ""
  },

  {
    "date": "2024-07-01",
    "title": "",
    "location": "Riverdale Park East, Toronto, Ontario",
    "photo": "pre2026/2024-07-01.jpeg",
    "text": ""
  },

  {
    "date": "2024-06-23",
    "title": "",
    "location": "",
    "photo": "pre2026/2024-06-23.jpeg",
    "text": ""
  },

  {
    "date": "2024-04-16",
    "title": "",
    "location": "University of Toronto, Toronto, Ontario",
    "photo": "pre2026/2024-04-16.HEIC",
    "text": ""
  },

  {
    "date": "2024-03-21",
    "title": "",
    "location": "",
    "photo": "pre2026/2024-03-21.HEIC",
    "text": ""
  },

  {
    "date": "2023-10-24",
    "title": "",
    "location": "",
    "photo": "pre2026/2023-10-24.jpeg",
    "text": ""
  },

  {
    "date": "2023-10-14",
    "title": "",
    "location": "Nice, France",
    "photo": "pre2026/2023-10-14.jpeg",
    "text": ""
  },

  {
    "date": "2023-10-10",
    "title": "",
    "location": "Lake Neuchâtel, Switzerland",
    "photo": "pre2026/2023-10-10.jpeg",
    "text": ""
  },

  {
    "date": "2023-10-03",
    "title": "",
    "location": "Paris, France",
    "photo": "pre2026/2023-10-03.HEIC",
    "text": ""
  },

  {
    "date": "2023-09-29",
    "title": "",
    "location": "On a plane over Toronto, Ontario",
    "photo": "pre2026/2023-09-29.jpeg",
    "text": ""
  },

  {
    "date": "2023-09-11",
    "title": "",
    "location": "Evergreen Brick Works, Toronto, Ontario",
    "photo": "pre2026/2023-09-11.HEIC",
    "text": ""
  },

  {
    "date": "2023-08-27",
    "title": "",
    "location": "Madison, Wisconsin",
    "photo": "pre2026/2023-08-27.HEIC",
    "text": ""
  },

  {
    "date": "2023-08-26",
    "title": "",
    "location": "Madison, Wisconsin",
    "photo": "pre2026/2023-08-26.jpeg",
    "text": ""
  },

  {
    "date": "2023-07-25",
    "title": "",
    "location": "",
    "photo": "pre2026/2023-07-25.jpeg",
    "text": ""
  },

  {
    "date": "2023-07-07",
    "title": "",
    "location": "Toronto, Ontario",
    "photo": "pre2026/2023-07-07.jpeg",
    "text": ""
  },

  {
    "date": "2022-12-20",
    "title": "",
    "location": "Ben T. Davis Beach, Tampa, Florida",
    "photo": "pre2026/2022-12-20.jpg",
    "text": ""
  },

  {
    "date": "2022-10-01",
    "title": "",
    "location": "Niagara Falls, Ontario",
    "photo": "pre2026/2022-10-01.jpg",
    "text": ""
  },

  {
    "date": "2022-08-25",
    "title": "",
    "location": "",
    "photo": "pre2026/2022-08-25.jpg",
    "text": ""
  },

  {
    "date": "2022-03-06",
    "title": "",
    "location": "San Francisco, California",
    "photo": "pre2026/2022-03-06.jpg",
    "text": ""
  },

  {
    "date": "2021-12-02",
    "title": "",
    "location": "",
    "photo": "pre2026/2021-12-02.jpg",
    "text": ""
  },

  {
    "date": "2021-05-16",
    "title": "",
    "location": "",
    "photo": "pre2026/2021-05-16.jpg",
    "text": ""
  },

  {
    "date": "2021-01-16",
    "title": "",
    "location": "",
    "photo": "pre2026/2021-01-16.jpg",
    "text": ""
  },

  {
    "date": "2020-11-28",
    "title": "",
    "location": "Evergreen Brick Works, Toronto, Ontario",
    "photo": "pre2026/2020-11-28.jpg",
    "text": ""
  },

  {
    "date": "2020-11-10",
    "title": "",
    "location": "",
    "photo": "pre2026/2020-11-10.jpg",
    "text": ""
  },

  {
    "date": "2020-11-09",
    "title": "",
    "location": "",
    "photo": "pre2026/2020-11-09.jpg",
    "text": ""
  },

  {
    "date": "2020-08-21",
    "title": "",
    "location": "Toronto, Ontario",
    "photo": "pre2026/2020-08-21.jpg",
    "text": ""
  },

  {
    "date": "2020-01-25",
    "title": "",
    "location": "Whistler, British Columbia",
    "photo": "pre2026/2020-01-25.jpg",
    "text": ""
  },

  {
    "date": "2019-09-23",
    "title": "",
    "location": "",
    "photo": "pre2026/2019-09-23.jpg",
    "text": ""
  },

  {
    "date": "2019-09-17",
    "title": "",
    "location": "",
    "photo": "pre2026/2019-09-17.jpg",
    "text": ""
  },

  {
    "date": "2019-09-16",
    "title": "",
    "location": "Madison, Wisconsin",
    "photo": "pre2026/2019-09-16.jpg",
    "text": ""
  },

  {
    "date": "2019-09-02",
    "title": "",
    "location": "",
    "photo": "pre2026/2019-09-02.jpg",
    "text": ""
  },

  {
    "date": "2019-08-14",
    "title": "",
    "location": "",
    "photo": "pre2026/2019-08-14.jpg",
    "text": ""
  },

  {
    "date": "2019-08-12",
    "title": "",
    "location": "",
    "photo": "pre2026/2019-08-12.jpg",
    "text": ""
  },

  {
    "date": "2019-05-17",
    "title": "",
    "location": "Koto, Japan",
    "video": "pre2026/2019-05-17.mp4",
    "speed": 1,
    "text": ""
  },

  {
    "date": "2019-02-20",
    "title": "",
    "location": "Golden Gate Bridge, San Francisco, California",
    "photo": "pre2026/2019-02-20.jpeg",
    "text": ""
  },

  {
    "date": "2018-11-18",
    "title": "",
    "location": "Madison, Wisconsin",
    "photo": "pre2026/2018-11-18.jpeg",
    "text": ""
  },

  {
    "date": "2018-11-14",
    "title": "",
    "location": "Tenney Park, Madison, Wisconsin",
    "photo": "pre2026/2018-11-14.jpeg",
    "text": ""
  },

  {
    "date": "2018-08-16",
    "title": "",
    "location": "Lulu Island, Richmond, British Columbia",
    "photo": "pre2026/2018-08-16.jpeg",
    "text": ""
  },

  {
    "date": "2018-07-17",
    "title": "",
    "location": "Madison, Wisconsin",
    "photo": "pre2026/2018-07-17.jpeg",
    "text": ""
  },

  {
    "date": "2018-06-27",
    "title": "",
    "location": "Cusco, Peru",
    "photo": "pre2026/2018-06-27.jpeg",
    "text": ""
  },

  {
    "date": "2017-08-30",
    "title": "",
    "location": "Stanley Park, Vancouver, British Columbia",
    "photo": "pre2026/2017-08-30.JPG",
    "text": ""
  },

  {
    "date": "2017-08-20",
    "title": "",
    "location": "Calgary, Alberta",
    "photo": "pre2026/2017-08-20.JPG",
    "text": ""
  },

  {
    "date": "2016-04-28",
    "title": "",
    "location": "Phnom Bakheng, Siem Reap, Cambodia",
    "photo": "pre2026/2016-04-28.JPG",
    "text": ""
  },

  {
    "date": "2015-12-24",
    "title": "",
    "location": "Malecón de Mazatlán, Mexico",
    "photo": "pre2026/2015-12-24.JPG",
    "text": ""
  },

  {
    "date": "2015-05-06",
    "title": "",
    "location": "Devil's Punchbowl, Hamilton, Ontario",
    "photo": "pre2026/2015-05-06.JPG",
    "text": ""
  },

  {
    "date": "2009-08",
    "title": "",
    "location": "An airport in Belgium or the Netherlands",
    "photo": "pre2026/2009-08.jpg",
    "text": ""
  },

];
