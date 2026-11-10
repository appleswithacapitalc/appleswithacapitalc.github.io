// Builds the Sunrises / Sunsets pages: the date sidebar and the posts, from the entries in
// files/sunrises/sunrises.js or files/sunsets/sunsets.js. Used by inner/sunrises.html and inner/sunsets.html.
// You shouldn't need to edit this: add entries in those data files instead.
// (The page elements keep "sunrise-" names on both pages, e.g. #sunrise-dates; that's just their name.)
//
//   SunLog({ data: SUNSETS, name: 'Sunset', dir: '../files/sunsets/', file: 'sunsets.js' });

function SunLog(opts) {
  var PHOTO_DIR  = opts.dir;
  var NAME = opts.name, name = NAME.toLowerCase();   // e.g. "Sunset" / "sunset"
  var VIDEO_SECONDS = 10;   // videos are sped up to last about this long (button switches to as-filmed speed)
  var MONTHS = ['January','February','March','April','May','June',
                'July','August','September','October','November','December'];

  // Escape plain text so characters like < and & show up as typed
  function esc(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }

  function render(entries) {
    // Parse "YYYY-MM-DD" by hand so time zones can't shift the day
    entries = entries.map(function (e, i) {
      // "YYYY-MM-DD", or just "YYYY-MM" when the exact day isn't known (day 0 = sorts after that month's dated posts)
      var m = /^(\d{4})-(\d{1,2})(?:-(\d{1,2}))?$/.exec(String(e.date || '').trim());
      if (!m) throw new Error('Entry #' + (i + 1) + ' has a bad date "' + e.date + '" (use YYYY-MM-DD, or YYYY-MM if the day is unknown)');
      return Object.assign({}, e, { y: +m[1], mo: +m[2], d: m[3] ? +m[3] : 0 });
    });
    // Newest first, regardless of order in the file
    entries.sort(function (a, b) { return (b.y - a.y) || (b.mo - a.mo) || (b.d - a.d); });

    var posts = '', sidebar = '', usedIds = {};
    var lastYear = null, lastMonth = null, firstYear = true, firstMonth = true;

    entries.forEach(function (e, i) {
      // Post number: the oldest post is #1
      var num = ('000' + (entries.length - i)).slice(-4);   // 23 -> "0023"
      var pad = function (n) { return (n < 10 ? '0' : '') + n; };
      var id = name + '-' + e.y + '-' + pad(e.mo) + (e.d ? '-' + pad(e.d) : '');
      var dateText = MONTHS[e.mo - 1] + (e.d ? ' ' + e.d + ',' : '') + ' ' + e.y;   // "August 9, 2009" or "August 2009"
      if (usedIds[id]) { id += '-' + (++usedIds[id]); } else { usedIds[id] = 1; }

      // Sidebar: open a new year / month group when it changes. Newest year & month start open.
      if (e.y !== lastYear) {
        if (lastYear !== null) sidebar += '</div></div></div>';
        sidebar += '<button type="button" class="toggle year' + (firstYear ? '' : ' collapsed') +
                   '" data-bs-toggle="collapse" data-bs-target="#y' + e.y + '" aria-expanded="' + firstYear + '">' + e.y + '</button>' +
                   '<div class="collapse' + (firstYear ? ' show' : '') + '" id="y' + e.y + '">';
        lastYear = e.y; lastMonth = null;
      }
      if (e.mo !== lastMonth) {
        if (lastMonth !== null) sidebar += '</div></div>';
        var mid = 'm' + e.y + '-' + pad(e.mo);
        sidebar += '<button type="button" class="toggle month' + (firstMonth ? '' : ' collapsed') +
                   '" data-bs-toggle="collapse" data-bs-target="#' + mid + '" aria-expanded="' + firstMonth + '">' + MONTHS[e.mo - 1] + '</button>' +
                   '<div class="collapse' + (firstMonth ? ' show' : '') + '" id="' + mid + '"><div class="list-group">';
        lastMonth = e.mo; firstMonth = false; firstYear = false;
      }
      sidebar += '<a class="list-group-item list-group-item-action" href="#' + id + '">' +
                 '<span>' + MONTHS[e.mo - 1].slice(0, 3) + (e.d ? ' ' + pad(e.d) : '') + '</span><span>' + NAME + ' #' + num + '</span></a>';

      // Post card. "photo" and "video" can each be one filename or a list of filenames.
      // Photos: use the small .web.jpg copy made by compress_media.sh (e.g. 2026-10-20.jpeg -> 2026-10-20.web.jpg)
      var photos = [].concat(e.photo || []).filter(Boolean).map(function (f) {
        f = String(f);
        return /\.web\.jpg$/i.test(f) || /^https?:/i.test(f) ? f : f.replace(/\.[^.\/]+$/, '') + '.web.jpg';
      });
      // Videos: a .MOV name is switched to its compressed .mp4 (made by compress_media.sh)
      var videos = [].concat(e.video || []).filter(Boolean).map(function (f) {
        return String(f).replace(/\.(mov|m4v)$/i, '.mp4');
      });
      var dateLine = dateText + (e.location ? ' &middot; ' + esc(e.location) : '');
      // "text" may contain simple HTML (e.g. links). A blank line starts a new paragraph.
      var paras = String(e.text || '').split(/\n\s*\n/).filter(function (t) { return t.trim(); });

      var media = photos.map(function (f) {
          return '<a href="' + PHOTO_DIR + esc(f) + '" target="_blank" rel="noopener">' +
                 '<img loading="lazy" src="' + PHOTO_DIR + esc(f) +
                 '" alt="' + NAME + ' on ' + dateText + '"></a>';
        }).concat(videos.map(function (f) {
          // Videos are sped up to ~VIDEO_SECONDS; "speed" in the entry overrides it ("speed": 1 = as filmed, no button)
          return '<div class="sunrise-vid" data-speed="' + (e.speed ? +e.speed : 'auto') + '">' +
                 '<button type="button" class="speed-btn" hidden></button>' +
                 '<video controls muted loop playsinline preload="metadata" src="' +
                 PHOTO_DIR + esc(f) + '#t=0.1" aria-label="' + NAME + ' video, ' + dateText + '"></video></div>';
        })).join('');

      posts += '<div class="card sunrise-post" id="' + id + '">' +
        (media ? '<div class="sunrise-media">' + media + '</div>' : '') +
        '<div class="card-body">' +
          '<h4 class="card-title">' + NAME + ' #' + num + (e.title ? ': ' + esc(e.title) : '') + '</h4>' +
          '<p class="date">' + dateLine + '</p>' +
          paras.map(function (t) { return '<p class="card-text">' + t + '</p>'; }).join('') +
        '</div></div>';
    });
    if (lastYear !== null) sidebar += '</div></div></div>';

    document.getElementById('sunrise-dates').innerHTML = sidebar;
    document.getElementById('sunrise-posts').innerHTML =
      posts || '<p class="text-muted">No ' + name + 's yet.</p>';

    setUpSpeeds();
    sizeDateColumn();
    if (document.fonts) document.fonts.ready.then(sizeDateColumn);   // re-measure once Ageo has loaded

    var spy = bootstrap.ScrollSpy.getInstance(document.body);
    if (spy) spy.refresh();
    // If someone opened a link to a specific post, jump there now that it exists
    if (location.hash) {
      var target = document.getElementById(location.hash.slice(1));
      if (target) target.scrollIntoView();
    }
  }

  // Videos start sped up ("Normal"); the button switches to the speed they were filmed at ("Slowed down") and back.
  // The label shows what's playing now.
  function setUpSpeeds() {
    document.querySelectorAll('.sunrise-vid').forEach(function (box) {
      var v = box.querySelector('video'), btn = box.querySelector('.speed-btn'), fast = 1;
      function setRate(rate) {
        v.defaultPlaybackRate = rate; v.playbackRate = rate;
        btn.textContent = rate > 1 ? 'Normal' : 'Slowed down';
        btn.title = rate > 1 ? 'Click to watch at the speed it was filmed' : 'Click to speed back up';
      }
      function ready() {
        var want = box.dataset.speed;
        fast = want === 'auto' ? v.duration / VIDEO_SECONDS : +want;
        fast = Math.min(fast || 1, 16);             // browsers can't go faster than 16x
        if (fast <= 1.05) return;                   // already short, or "speed": 1: no button
        btn.hidden = false;
        setRate(fast);
      }
      btn.addEventListener('click', function () { setRate(v.playbackRate > 1 ? 1 : fast); });
      // Browsers can reset the speed when a video loads, so apply it again
      v.addEventListener('loadedmetadata', ready);
      v.addEventListener('play', function () { if (!btn.hidden) v.playbackRate = v.defaultPlaybackRate; });
      if (v.readyState >= 1) ready();
    });
  }

  // Make the sidebar's date column as wide as the widest date, so every "Sunrise #" / "Sunset #" lines up
  function sizeDateColumn() {
    var box = document.getElementById('sunrise-dates'), probe = document.createElement('span'), widest = 0;
    probe.style.cssText = 'position:absolute; visibility:hidden; white-space:nowrap;';
    box.appendChild(probe);
    box.querySelectorAll('.list-group-item > span:first-child').forEach(function (d) {
      probe.textContent = d.textContent;
      widest = Math.max(widest, probe.getBoundingClientRect().width);
    });
    box.removeChild(probe);
    if (widest) box.style.setProperty('--date-col', Math.ceil(widest) + 'px');
  }

  function showError(msg) {
    document.getElementById('sunrise-posts').innerHTML =
      '<div class="alert alert-warning">Couldn\'t load the ' + name + 's. ' + esc(msg) + '</div>';
  }

  if (!opts.data) {
    showError(window.SUNLOG_ERROR
      ? opts.file + ' has a typo: ' + window.SUNLOG_ERROR
      : opts.file + ' is missing or has a typo (often a missing comma or quote). '
      + 'To see the exact line, open the browser console: Cmd+Option+J in Chrome.');
  } else {
    try { render(opts.data); } catch (err) { showError(err.message); }
  }

  // When a post becomes active (scrolling or a #link), open its year and month in the sidebar
  // and play that post's video (muted, looping); videos in other posts pause.
  document.body.addEventListener('activate.bs.scrollspy', function () {
    var link = document.querySelector('#sunrise-dates .list-group-item.active');
    var post = link && document.getElementById(link.getAttribute('href').slice(1));
    document.querySelectorAll('.sunrise-post video').forEach(function (v) {
      if (post && post.contains(v)) {
        var p = v.play();
        if (p && p.catch) p.catch(function () {});   // browser blocked autoplay: the play button still works
      } else if (!v.paused) {
        v.pause();
      }
    });
    var section = link && link.closest('.collapse');
    while (section) {
      bootstrap.Collapse.getOrCreateInstance(section, { toggle: false }).show();
      section = section.parentElement.closest('.collapse');
    }
  });
}
