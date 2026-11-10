#!/usr/bin/env python3
"""Remove metadata (GPS location, dates, camera, etc.) from the website's photos and videos,
after saving it to media_metadata.json in the website folder so you still have it.
media_metadata.json is in .gitignore, so it never goes to GitHub.

Usage (from anywhere):   files/strip_metadata.py
compress_media.sh runs this automatically at the end.

- Only files that would be pushed are touched (anything git ignores, like your originals, is left alone).
- JPEG / PNG: the metadata sections are deleted without re-compressing, so the image is unchanged.
  A photo stored sideways with a "rotate me" tag is turned upright first (the tag goes with the metadata).
- MP4 / MOV: metadata is removed without re-encoding.
- HEIC can't be cleaned this way; the script lists any it finds (convert them to .jpg instead).
- For .web.jpg / .mp4 copies made by compress_media.sh, the metadata of your original
  (in originals/, or next to it) is saved too, since that's the interesting one.
"""
import json, os, struct, subprocess, sys, tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'media_metadata.json')
PHOTO = ('.jpg', '.jpeg', '.png', '.heic', '.heif')
VIDEO = ('.mp4', '.mov', '.m4v')
ORIGINAL_EXT = ('.jpeg', '.jpg', '.JPG', '.JPEG', '.png', '.PNG', '.HEIC', '.heic', '.MOV', '.mov', '.m4v')

# Reads photo metadata with macOS's own image library (works for JPEG, PNG and HEIC)
JXA = r'''
ObjC.import('ImageIO'); ObjC.import('Foundation');
function clean(v) {
  if (v === null || v === undefined) return null;
  if (Array.isArray(v)) return v.map(clean);
  if (typeof v === 'object') { var o = {}; for (var k in v) { var c = clean(v[k]); if (c !== undefined) o[k] = c; } return o; }
  if (['number', 'string', 'boolean'].indexOf(typeof v) >= 0) return v;
  return undefined;
}
function run(argv) {
  var out = {};
  argv.forEach(function (p) {
    try {
      var src = $.CGImageSourceCreateWithURL($.NSURL.fileURLWithPath(p), null);
      out[p] = clean(ObjC.deepUnwrap(ObjC.castRefToObject($.CGImageSourceCopyPropertiesAtIndex(src, 0, null))));
    } catch (e) { out[p] = null; }
  });
  return JSON.stringify(out);
}
'''

# Keys that are just how the image is stored, not information about you
BORING = {'ColorModel', 'Depth', 'PixelHeight', 'PixelWidth', 'ProfileName', 'HasAlpha', 'DPIWidth', 'DPIHeight',
          'IsFloat', 'IsIndexed', 'PrimaryImage', 'FileContentsDictionary', 'FileSize', '{JFIF}', '{PNG}', '{HEIF}'}


def photo_meta(paths):
    if not paths:
        return {}
    with tempfile.NamedTemporaryFile('w', suffix='.js', delete=False) as f:
        f.write(JXA)
    try:
        r = subprocess.run(['osascript', '-l', 'JavaScript', f.name] + paths, capture_output=True, text=True)
        return json.loads(r.stdout or '{}')
    finally:
        os.unlink(f.name)


def interesting(meta):
    """The parts of the metadata worth keeping / worth removing."""
    if not isinstance(meta, dict):
        return {}
    return {k: v for k, v in meta.items() if k not in BORING and v not in ({}, None, '')}


def video_meta(path):
    r = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format_tags:stream_tags', '-of', 'json', path],
                       capture_output=True, text=True)
    try:
        d = json.loads(r.stdout or '{}')
    except ValueError:
        return {}
    out = {}
    tags = d.get('format', {}).get('tags', {})
    # These are added by the file format / encoder itself and say nothing about you
    tags = {k: v for k, v in tags.items() if k not in ('major_brand', 'minor_version', 'compatible_brands', 'encoder')}
    if tags:
        out['format'] = tags
    for i, s in enumerate(d.get('streams', [])):
        st = {k: v for k, v in s.get('tags', {}).items()
              if k not in ('language', 'handler_name', 'vendor_id', 'encoder')}
        if st:
            out['stream %d' % i] = st
    return out


def strip_jpeg(data):
    """Drop EXIF/XMP (APP1), IPTC (APP13), other app segments and comments; keep the image and colour profile."""
    if data[:2] != b'\xff\xd8':
        return data
    out, i = bytearray(b'\xff\xd8'), 2
    while i < len(data):
        if data[i] != 0xFF:
            return data                      # unexpected layout: leave the file alone
        marker = data[i + 1]
        if marker == 0xDA:                   # start of image data: copy the rest as is
            out += data[i:]
            return bytes(out)
        length = struct.unpack('>H', data[i + 2:i + 4])[0]
        seg = data[i:i + 2 + length]
        keep = marker in (0xE0, 0xE2, 0xEE) or not (0xE0 <= marker <= 0xEF or marker == 0xFE)
        if keep:                             # APP0 (JFIF), APP2 (colour profile), APP14 (Adobe), and image tables
            out += seg
        i += 2 + length
    return data


def strip_png(data):
    """Drop text, EXIF and timestamp chunks; keep the image and colour profile."""
    sig = b'\x89PNG\r\n\x1a\n'
    if data[:8] != sig:
        return data
    out, i = bytearray(sig), 8
    while i < len(data):
        length = struct.unpack('>I', data[i:i + 4])[0]
        kind = data[i + 4:i + 8]
        chunk = data[i:i + 12 + length]
        if kind not in (b'eXIf', b'tEXt', b'zTXt', b'iTXt', b'tIME'):
            out += chunk
        i += 12 + length
    return bytes(out)


def make_upright(path, orientation):
    rot = {3: 180, 6: 90, 8: 270}.get(orientation)
    if rot:
        subprocess.run(['sips', '-r', str(rot), path], capture_output=True)


def strip_video(path):
    tmp = path + '.strip.mp4'
    r = subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-y', '-i', path, '-map', '0', '-c', 'copy',
                        '-map_metadata', '-1', '-map_chapters', '-1', '-movflags', '+faststart', tmp])
    if r.returncode == 0:
        os.replace(tmp, path)
    elif os.path.exists(tmp):
        os.unlink(tmp)


def original_of(path):
    """For a compress_media.sh copy (x.web.jpg / x.mp4), the original next to it, if it's still there."""
    stem = path[:-len('.web.jpg')] if path.endswith('.web.jpg') else os.path.splitext(path)[0]
    stems = [stem]
    files_dir = os.path.join(ROOT, 'files') + os.sep
    if stem.startswith(files_dir):                 # originals now live in originals/, same folders
        stems.insert(0, os.path.join(ROOT, 'originals', stem[len(files_dir):]))
    for st in stems:
        for ext in ORIGINAL_EXT:
            p = st + ext
            if p != path and os.path.exists(p):
                return p
    return None


def main():
    files = subprocess.run(['git', 'ls-files', '-co', '--exclude-standard'], cwd=ROOT,
                           capture_output=True, text=True).stdout.splitlines()
    files = [f for f in files if f.lower().endswith(PHOTO + VIDEO) and not f.startswith('dist/')
             and os.path.exists(os.path.join(ROOT, f))]
    try:
        saved = json.load(open(OUT))
    except (OSError, ValueError):
        saved = {}

    photos = [os.path.join(ROOT, f) for f in files if f.lower().endswith(PHOTO)]
    originals = {p: original_of(p) for p in map(lambda f: os.path.join(ROOT, f), files)}
    pmeta = photo_meta(photos + [o for o in originals.values() if o and o.lower().endswith(PHOTO)])

    cleaned, heic = 0, []
    for f in files:
        path = os.path.join(ROOT, f)
        is_video = f.lower().endswith(VIDEO)
        own = video_meta(path) if is_video else interesting(pmeta.get(path))
        orig = originals.get(path)
        orig_meta = None
        if orig:
            orig_meta = video_meta(orig) if orig.lower().endswith(VIDEO) else interesting(pmeta.get(orig))

        # Save what we know (never overwrite earlier saved info with an empty result)
        entry = saved.get(f, {})
        if own:
            entry['metadata'] = own
        if orig_meta:
            entry['original'] = os.path.relpath(orig, ROOT)
            entry['original_metadata'] = orig_meta
        if entry:
            saved[f] = entry

        if not own:
            continue
        if f.lower().endswith(('.heic', '.heif')):
            heic.append(f)
            continue
        if is_video:
            strip_video(path)
        else:
            make_upright(path, (pmeta.get(path) or {}).get('Orientation', 1))
            data = open(path, 'rb').read()
            new = strip_jpeg(data) if f.lower().endswith(('.jpg', '.jpeg')) else strip_png(data)
            if new != data:
                open(path, 'wb').write(new)
        cleaned += 1
        print('cleaned  ' + f)

    with open(OUT, 'w') as fh:
        json.dump(dict(sorted(saved.items())), fh, indent=1, ensure_ascii=False)
    for f in heic:
        print('HEIC     ' + f + '  (still has metadata: use a .jpg copy on the site instead)')
    print('%d file(s) cleaned; metadata saved in media_metadata.json (not pushed to GitHub)' % cleaned)


if __name__ == '__main__':
    sys.exit(main())
