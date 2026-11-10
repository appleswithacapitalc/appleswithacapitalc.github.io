#!/usr/bin/env python3
"""Fill in "location" for Sunrises / Sunsets posts from the GPS saved in media_metadata.json.

Usage (from anywhere):   files/fill_locations.py
compress_media.sh runs this automatically at the end (after strip_metadata.py has saved the GPS).

- Only fills posts whose "location" is empty (""), so anything you type yourself is never changed.
  To stop a post from getting a location, write something like "location": " " (a space).
- Uses Apple's map lookup (the same one Photos uses) to turn GPS into a place name:
    US / Canada:      [attraction,] city, state/province   "Stanley Park, Vancouver, British Columbia"
    everywhere else:  [attraction,] city, country          "Angkor Wat, Siem Reap, Cambodia"
- Hotels and resorts are skipped as attractions (just the city is used), so it doesn't say where you stayed.
- Looked-up places are remembered in media_metadata.json, so each photo is only looked up once.
"""
import json, os, re, subprocess, sys, tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
META = os.path.join(ROOT, 'media_metadata.json')
LOGS = [('files/sunrises/', 'files/sunrises/sunrises.js'), ('files/sunsets/', 'files/sunsets/sunsets.js')]
SKIP_ATTRACTION = re.compile(r'hotel|resort|inn\b|hostel|motel|suites|apartment|residence|airbnb|condo', re.I)

# Apple's reverse geocoder, via a tiny Swift program (reads "lat<TAB>lon" lines, prints one JSON per line)
SWIFT = r'''
import CoreLocation
import Foundation
let g = CLGeocoder()
while let line = readLine() {
  let p = line.split(separator: "\t").map { Double($0) ?? 0 }
  let sem = DispatchSemaphore(value: 0)
  var out: [String: String] = [:]
  g.reverseGeocodeLocation(CLLocation(latitude: p[0], longitude: p[1])) { pls, _ in
    if let pl = pls?.first {
      out["attraction"] = pl.areasOfInterest?.first ?? ""
      out["city"] = pl.locality ?? pl.subAdministrativeArea ?? pl.administrativeArea ?? ""
      out["country"] = pl.country ?? ""
      out["state"] = pl.administrativeArea ?? ""
      out["cc"] = pl.isoCountryCode ?? ""
    }
    sem.signal()
  }
  while sem.wait(timeout: .now() + 0.05) == .timedOut { RunLoop.current.run(until: Date().addingTimeInterval(0.05)) }
  let data = try! JSONSerialization.data(withJSONObject: out)
  print(String(data: data, encoding: .utf8)!)
  fflush(stdout)
  Thread.sleep(forTimeInterval: 1.2)   // Apple limits how often you can ask
}
'''


def gps_of(entry):
    """Latitude/longitude from a media_metadata.json entry (original first), or None."""
    t = entry.get('takeout')                     # found by import_takeout.py (Google Takeout)
    if t and (t.get('latitude') or t.get('longitude')):
        return t['latitude'], t['longitude']
    for key in ('original_metadata', 'metadata'):
        m = entry.get(key) or {}
        g = m.get('{GPS}')
        if g and 'Latitude' in g and 'Longitude' in g:
            lat = g['Latitude'] * (-1 if g.get('LatitudeRef') == 'S' else 1)
            lon = g['Longitude'] * (-1 if g.get('LongitudeRef') == 'W' else 1)
            return lat, lon
        # iPhone videos: "+40.4406-079.9959+262.000/"
        for tags in (m.get('format') or {}, ):
            iso = tags.get('com.apple.quicktime.location.ISO6709') or tags.get('location')
            hit = iso and re.match(r'([+-]\d+(?:\.\d+)?)([+-]\d+(?:\.\d+)?)', iso)
            if hit:
                return float(hit.group(1)), float(hit.group(2))
    return None


# Apple gives US states / Canadian provinces as abbreviations; spell them out
REGIONS = {
    'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas', 'CA': 'California', 'CO': 'Colorado',
    'CT': 'Connecticut', 'DE': 'Delaware', 'DC': 'District of Columbia', 'FL': 'Florida', 'GA': 'Georgia',
    'HI': 'Hawaii', 'ID': 'Idaho', 'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa', 'KS': 'Kansas',
    'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland', 'MA': 'Massachusetts', 'MI': 'Michigan',
    'MN': 'Minnesota', 'MS': 'Mississippi', 'MO': 'Missouri', 'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada',
    'NH': 'New Hampshire', 'NJ': 'New Jersey', 'NM': 'New Mexico', 'NY': 'New York', 'NC': 'North Carolina',
    'ND': 'North Dakota', 'OH': 'Ohio', 'OK': 'Oklahoma', 'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island',
    'SC': 'South Carolina', 'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah', 'VT': 'Vermont',
    'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia', 'WI': 'Wisconsin', 'WY': 'Wyoming', 'PR': 'Puerto Rico',
    'AB': 'Alberta', 'BC': 'British Columbia', 'MB': 'Manitoba', 'NB': 'New Brunswick', 'NL': 'Newfoundland and Labrador',
    'NS': 'Nova Scotia', 'NT': 'Northwest Territories', 'NU': 'Nunavut', 'ON': 'Ontario', 'PE': 'Prince Edward Island',
    'QC': 'Quebec', 'SK': 'Saskatchewan', 'YT': 'Yukon',
}


def place_name(p):
    city, country, att = p.get('city', ''), p.get('country', ''), p.get('attraction', '')
    # US and Canada get the state / province instead of the country
    state = REGIONS.get(p.get('state', ''), p.get('state', '')) if p.get('cc') in ('US', 'CA') else ''
    if att and SKIP_ATTRACTION.search(att):
        att = ''
    att = att.replace('’', "'")
    parts = [att] if att else []
    if city and city.lower() not in att.lower():
        parts.append(city)
    if state and state != city:
        parts.append(state)
    if country and not state:
        parts.append(country)
    return ', '.join(parts)


def web_name(rel):
    """The published file for a name used in sunrises.js / sunsets.js (same rule as the page)."""
    if re.search(r'\.(mov|m4v|mp4)$', rel, re.I):
        return re.sub(r'\.(mov|m4v)$', '.mp4', rel, flags=re.I)
    return rel if rel.lower().endswith('.web.jpg') else re.sub(r'\.[^./]+$', '', rel) + '.web.jpg'


def main():
    try:
        meta = json.load(open(META))
    except (OSError, ValueError):
        print('No media_metadata.json yet: run files/strip_metadata.py first.')
        return

    # Find posts with an empty location that have a photo/video with GPS
    todo = []   # (js file, entry text span, published file key)
    texts = {}
    for folder, js in LOGS:
        path = os.path.join(ROOT, js)
        if not os.path.exists(path):
            continue
        text = texts[js] = open(path).read()
        for block in re.finditer(r'\{[^{}]*\}', text):
            b = block.group(0)
            if not re.search(r'"location":\s*""', b):
                continue
            files = re.findall(r'"(?:photo|video)":\s*(?:"([^"]+)"|\[([^\]]*)\])', b)
            names = []
            for one, many in files:
                names += [one] if one else re.findall(r'"([^"]+)"', many)
            for n in names:
                key = folder + web_name(n)
                if key in meta and gps_of(meta[key]):
                    todo.append((js, b, key))
                    break

    # Look up places not looked up before
    need = [k for _, _, k in todo if 'cc' not in (meta[k].get('place') or {})]
    if need:
        print('Looking up %d place(s)...' % len(need))
        with tempfile.NamedTemporaryFile('w', suffix='.swift', delete=False) as f:
            f.write(SWIFT)
        try:
            lines = ''.join('%f\t%f\n' % gps_of(meta[k]) for k in need)
            r = subprocess.run(['swift', f.name], input=lines, capture_output=True, text=True)
            for k, line in zip(need, r.stdout.splitlines()):
                try:
                    meta[k]['place'] = json.loads(line)
                except ValueError:
                    pass
        finally:
            os.unlink(f.name)
        json.dump(meta, open(META, 'w'), indent=1, ensure_ascii=False)

    # Write the names into the data files
    filled = 0
    for js, block, key in todo:
        name = place_name(meta[key].get('place') or {})
        if not name:
            continue
        new = re.sub(r'"location":\s*""', '"location": %s' % json.dumps(name, ensure_ascii=False), block, count=1)
        texts[js] = texts[js].replace(block, new, 1)
        filled += 1
        print('%-48s %s' % (key, name))
    for js, text in texts.items():
        open(os.path.join(ROOT, js), 'w').write(text)
    print('%d location(s) filled in.' % filled)


if __name__ == '__main__':
    sys.exit(main())
