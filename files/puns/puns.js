// Puns for the Puns page. See README.md in this folder for details.
// Lines starting with // are comments and are ignored.

// ---- Settings ---------------------------------------------------------------
const PUNS_SETTINGS = {
  carouselCount: 5,          // how many random puns the carousel picks on each visit (0 = all of them)
  reshuffleEachRound: true,  // true = shuffle the order of those puns every time round; false = same order each time
  secondsPerSlide: 7,        // how long each pun stays up before moving on
  showFullList: true         // also list every pun below the carousel (true / false)
};

// ---- Puns -------------------------------------------------------------------
// Only "pun" is required. Order doesn't matter: the carousel picks at random,
// and the list is sorted by date (newest first).
//   "pun"  : the pun itself. Use \n for a line break (e.g. setup \n punchline).
//   "note" : optional small text underneath (context, who it was for, a groan count...).
//   "date" : optional, as YYYY-MM-DD. Puns without a date go at the end of the list.

const PUNS = [

  {
    "pun": "That's a real is-shoe",
    "note": "Applicable anytime someone complains about shoe-related things, for example, these shoes are cluttering my floor."
  },

  {
    "pun": "Placeholder pun 2: setup line\nPlaceholder punchline on its own line",
    "note": "",
    "date": "2026-11-09"
  },

  {
    "pun": "Placeholder pun 3",
    "note": "Placeholder note (optional)",
    "date": "2026-11-01"
  },

  {
    "pun": "Placeholder pun 4",
    "note": "",
    "date": "2026-10-15"
  },

  {
    "pun": "Placeholder pun 5 (no date: goes at the end of the list)"
  },

  {
    "pun": "Placeholder pun 6",
    "note": "Placeholder note (optional)",
    "date": "2026-09-30"
  },

];
