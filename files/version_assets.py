#!/usr/bin/env python3
"""Make browsers pick up new CSS / JS after you push, without anyone clearing their cache.

Usage (from anywhere):   files/version_assets.py
Run it before committing whenever a .css / .js file (including sunrises.js / sunsets.js) has changed.

Each page's links to the site's own .css / .js / icon / .png files get a tag based on the file's contents:
    <link href="css/stylesheet.css?v=3f9a1c2e">
When a file changes, its tag changes, so browsers download the new version; unchanged files stay cached.
"""
import hashlib, os, re, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LINK = re.compile(r'((?:href|src)=")([^"?#:]+\.(?:css|js|svg|png))(?:\?v=[0-9a-f]*)?(")')


def main():
    pages = [p for p in subprocess.run(['git', 'ls-files', '*.html'], cwd=ROOT, capture_output=True, text=True).stdout.split()
             if not p.startswith('assets/')]          # skip the font's own demo page
    changed = []
    for page in pages:
        path = os.path.join(ROOT, page)
        text = open(path).read()

        def tag(m):
            target = os.path.normpath(os.path.join(os.path.dirname(path), m.group(2)))
            if not os.path.isfile(target):
                return m.group(0)                    # leave links to missing files alone
            v = hashlib.md5(open(target, 'rb').read()).hexdigest()[:8]
            return m.group(1) + m.group(2) + '?v=' + v + m.group(3)

        new = LINK.sub(tag, text)
        if new != text:
            open(path, 'w').write(new)
            changed.append(page)
    for p in changed:
        print('updated  ' + p)
    return 0


if __name__ == '__main__':
    sys.exit(main())
