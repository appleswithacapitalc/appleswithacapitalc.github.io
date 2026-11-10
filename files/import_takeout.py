#!/usr/bin/env python3
"""Get locations for Sunrises / Sunsets photos from a Google Takeout export.

Usage:   files/import_takeout.py ~/Downloads/Takeout
         (the unzipped Takeout folder; it can contain several "Takeout" parts)

Google keeps photo locations in small .json files next to each photo in the export. Your website photos
are renamed to dates, so this matches each one to a Takeout photo taken on the same day that also LOOKS
the same (it compares tiny thumbnails, so edited/resized copies still match). Then it:
  - saves the location in media_metadata.json (on this computer only, never pushed)
  - runs fill_locations.py, which fills in empty "location"s in sunrises.js / sunsets.js
Nothing in the Takeout folder is changed. Photos that already have a location are skipped.
"""
import datetime, glob, json, os, re, subprocess, sys, tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
META = os.path.join(ROOT, 'media_metadata.json')
FOLDERS = ['files/sunrises', 'files/sunsets']
PHOTO = ('.jpg', '.jpeg', '.png', '.heic', '.heif')
MATCH = 12          # how different two thumbnails may be (out of 64) and still count as the same photo

try:
    from PIL import Image
except ImportError:
    Image = None


def thumb_hash(path):
    """A 64-bit fingerprint of what the photo looks like (survives resizing, compression, light edits)."""
    if Image is None:
        return None
    src = path
    tmp = None
    if path.lower().endswith(('.heic', '.heif')):           # PIL can't read HEIC: let macOS convert it
        tmp = tempfile.NamedTemporaryFile(suffix='.png', delete=False).name
        subprocess.run(['sips', '-Z', '64', '-s', 'format', 'png', path, '--out', tmp], capture_output=True)
        src = tmp
    try:
        from PIL import ImageOps
        im = ImageOps.exif_transpose(Image.open(src)).convert('L').resize((9, 8))
        px = list(im.tobytes())
        return sum(1 << i for i in range(64) if px[(i // 8) * 9 + i % 8] < px[(i // 8) * 9 + i % 8 + 1])
    except Exception:
        return None
    finally:
        if tmp and os.path.exists(tmp):
            os.unlink(tmp)


def has_gps(entry):
    for key in ('original_metadata', 'metadata'):
        g = (entry.get(key) or {}).get('{GPS}') or {}
        if 'Latitude' in g:
            return True
    return 'takeout' in entry


def takeout_photos(folder):
    """Every photo in the Takeout export that has a location: (photo path, date, lat, lon)."""
    out = []
    for js in glob.glob(os.path.join(folder, '**', '*.json'), recursive=True):
        try:
            d = json.load(open(js))
        except (OSError, ValueError):
            continue
        if not isinstance(d, dict) or 'title' not in d:
            continue
        geo = d.get('geoDataExif') or {}
        if not geo.get('latitude') and not geo.get('longitude'):
            geo = d.get('geoData') or {}
        lat, lon = geo.get('latitude', 0), geo.get('longitude', 0)
        if not lat and not lon:
            continue
        ts = (d.get('photoTakenTime') or {}).get('timestamp')
        if not ts:
            continue
        # The photo sits next to its .json; Google sometimes shortens names, so match loosely
        folder_of = os.path.dirname(js)
        title = d['title']
        cands = [os.path.join(folder_of, title)]
        stem = os.path.splitext(title)[0]
        cands += sorted(glob.glob(os.path.join(folder_of, glob.escape(stem[:40]) + '*')))
        photo = next((c for c in cands if os.path.exists(c) and c.lower().endswith(PHOTO)), None)
        if photo:
            taken = datetime.datetime.fromtimestamp(int(ts), datetime.timezone.utc).date()
            out.append((photo, taken, lat, lon))
    return out


def main():
    if len(sys.argv) < 2 or not os.path.isdir(os.path.expanduser(sys.argv[1])):
        print(__doc__)
        return 1
    folder = os.path.expanduser(sys.argv[1])
    try:
        meta = json.load(open(META))
    except (OSError, ValueError):
        print('No media_metadata.json yet: run files/strip_metadata.py first.')
        return 1

    found = takeout_photos(folder)
    print('Takeout: %d photo(s) with a location.' % len(found))
    by_day = {}
    for p in found:
        by_day.setdefault(p[1], []).append(p)

    hashes = {}
    def h(path):
        if path not in hashes:
            hashes[path] = thumb_hash(path)
        return hashes[path]

    matched = 0
    for key, entry in sorted(meta.items()):
        if not key.startswith(tuple(FOLDERS)) or not key.endswith('.web.jpg') or has_gps(entry):
            continue
        m = re.match(r'(\d{4})-(\d{2})-(\d{2})', os.path.basename(key))
        if not m:
            continue                                   # month-only dates: too vague to match safely
        day = datetime.date(int(m.group(1)), int(m.group(2)), int(m.group(3)))
        # Google stores the time in UTC, so a sunset can land on the next day: look at the days around it
        cands = [p for d in (day - datetime.timedelta(1), day, day + datetime.timedelta(1)) for p in by_day.get(d, [])]
        if not cands:
            continue
        mine = h(os.path.join(ROOT, entry.get('original') or key))
        best = None
        if mine is not None:
            scored = [(bin(mine ^ h(c[0])).count('1'), c) for c in cands if h(c[0]) is not None]
            scored.sort(key=lambda s: s[0])
            if scored and scored[0][0] <= MATCH:
                best = scored[0][1]
        elif len(cands) == 1 and cands[0][1] == day:
            best = cands[0]                             # can't compare pictures: only trust a single same-day photo
        if best:
            entry['takeout'] = {'latitude': best[2], 'longitude': best[3],
                                'file': os.path.relpath(best[0], folder)}
            entry.pop('place', None)                    # look the place up again with the new location
            matched += 1
            print('matched  %-46s <- %s' % (key, os.path.basename(best[0])))

    json.dump(dict(sorted(meta.items())), open(META, 'w'), indent=1, ensure_ascii=False)
    print('%d photo(s) matched.\n' % matched, flush=True)
    if matched:
        subprocess.run([os.path.join(ROOT, 'files', 'fill_locations.py')])
    return 0


if __name__ == '__main__':
    sys.exit(main())
