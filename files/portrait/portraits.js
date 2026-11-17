// Photos for the Bio section on the homepage (mera.html).
// "photo" is a file in this folder (files/portrait/); "caption" shows in the bottom-right corner of the photo.
// To add one: put a small .jpg in this folder (no GPS: ask Claude, or run files/strip_metadata.py) and add a line.
//
// The photo marked "default": true shows most of the time. The rest of the time (PORTRAIT_OTHER_CHANCE,
// 0.3 = 30% of visits) one of the others is shown instead, each equally likely.

const PORTRAIT_OTHER_CHANCE = 0.3;

const PORTRAITS = [
  { "photo": "2025_mian_banff.jpg",     "caption": "2025: Moraine Lake, Banff", "default": true },
  { "photo": "2025_mian_planta.jpg",    "caption": "2025: Post-PhD dinner at Planta, Toronto" },
  { "photo": "2023_mian_iccv.jpg",      "caption": "2023: YYZ → CDG to ICCV Paris with Sotiris" },
  { "photo": "2019_mian_fujiq.jpg",     "caption": "2019: Fuji-Q Highland, Japan" },
  { "photo": "2018_mian_salkantay.jpg", "caption": "2018: Salkantay Trek, Peru" },
  { "photo": "2016_mian_angkor.jpg",    "caption": "2016: Angkor Wat, Cambodia" },
  { "photo": "2016_mian_kuangsi.jpg",   "caption": "2016: Kuang Si Falls, Laos" },
];
