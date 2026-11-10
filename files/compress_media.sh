#!/bin/bash
# Compress Sunrises / Sunsets videos and photos for the website.
#
# Drop new originals (.jpeg / .HEIC / .png / .MOV) into files/sunrises/... or files/sunsets/... as usual.
# This script then:
#   1. moves every original into the matching place under originals/ (in the website folder;
#      git ignores it, so originals never go to GitHub)
#        files/sunrises/2026/11-Nov/2026-11-03.MOV  ->  originals/sunrises/2026/11-Nov/2026-11-03.MOV
#   2. makes the web copies back in files/:
#        videos -> .mp4       e.g. files/sunrises/2026/11-Nov/2026-11-03.mp4
#        photos -> .web.jpg   e.g. files/sunrises/2026/10-Oct/2026-10-20.web.jpg (location data removed)
#   3. runs strip_metadata.py (removes GPS/dates from anything pushed, saving them in media_metadata.json
#      on this computer) and fill_locations.py (fills empty "location"s from the GPS)
# Files directly in files/sunrises or files/sunsets (the page backgrounds) are left alone.
#
# Usage (from anywhere):
#   files/compress_media.sh                        # everything
#   files/compress_media.sh sunsets                # just one of them
#   files/compress_media.sh sunrises/2026/11-Nov   # just one folder
#   files/compress_media.sh -f                     # redo files that were already compressed
#
# Files that already have an up-to-date compressed copy are skipped, so it's safe to run any time.

# ---- Settings ------------------------------------------------------------------
CRF=23            # quality: lower = better and bigger (18-28 is sensible)
MAX_CRF=31        # if a video is over TARGET_MB, retry with CRF +2 until it fits or hits this
TARGET_MB=5       # aim to keep each video under this many MB
MAX_SIDE=1920     # shrink anything larger than this (pixels, longest side); never enlarges
PRESET=slow       # x264 speed/size trade-off: slower = smaller files, same quality
AUDIO=drop        # drop = remove sound (default), keep = keep sound if there is any (AAC 128k)
PHOTO_MAX_SIDE=2048  # photos: shrink to this many pixels on the longest side
PHOTO_QUALITY=2      # photos: 2 = best ... 6 = smaller files (ffmpeg JPEG scale, lower is better)
# --------------------------------------------------------------------------------

set -u
HERE="$(cd "$(dirname "$0")" && pwd)"          # .../personal/files
ORIG="$(dirname "$HERE")/originals"             # .../personal/originals (not pushed)
FORCE=0
ARGS=()
for arg in "$@"; do
  case "$arg" in
    -f|--force) FORCE=1 ;;
    -h|--help) sed -n '2,24p' "$0"; exit 0 ;;
    *) ARGS+=("$arg") ;;
  esac
done

command -v ffmpeg >/dev/null || { echo "ffmpeg isn't installed (brew install ffmpeg)" >&2; exit 1; }

is_original() {   # photos/videos that aren't one of our web copies
  case "$1" in
    *.web.jpg|*.tmp.*|*.mp4) return 1 ;;
    *.[jJ][pP][gG]|*.[jJ][pP][eE][gG]|*.[pP][nN][gG]|*.[hH][eE][iI][cC]|*.[hH][eE][iI][fF]|*.[mM][oO][vV]|*.[mM]4[vV]) return 0 ;;
  esac
  return 1
}

# 1. Move new originals out of files/ into originals/ (same folders), keeping their dates
for top in sunrises sunsets; do
  [ -d "$HERE/$top" ] || continue
  while IFS= read -r -d '' f; do
    is_original "$f" || continue
    dest="$ORIG/${f#$HERE/}"
    if [ -e "$dest" ]; then echo "NOTE   $(basename "$f") is already in originals/; left where it is" >&2; continue; fi
    mkdir -p "$(dirname "$dest")" && mv "$f" "$dest" && echo "moved  ${f#$HERE/}  ->  originals/"
  done < <(find "$HERE/$top" -mindepth 2 -type f -print0 | sort -z)
done

# What to process: everything in originals/, or the folders/files given (as files/... or originals/... paths)
TARGETS=()
for arg in ${ARGS[@]+"${ARGS[@]}"}; do
  a="$arg"; [ -e "$a" ] && a="$(cd "$(dirname "$a")" && pwd)/$(basename "$a")"
  case "$a" in "$HERE"/*) a="$ORIG/${a#$HERE/}" ;; esac
  if [ -e "$a" ]; then TARGETS+=("$a"); elif [ -e "$ORIG/$arg" ]; then TARGETS+=("$ORIG/$arg");
  else echo "Not found: $arg" >&2; exit 1; fi
done
[ ${#TARGETS[@]} -eq 0 ] && for top in sunrises sunsets; do [ -d "$ORIG/$top" ] && TARGETS+=("$ORIG/$top"); done
web_of() { local rel="${1#$ORIG/}"; echo "$HERE/${rel%.*}$2"; }   # originals/x/y.HEIC -> files/x/y.web.jpg

size_mb() { awk -v b="$(stat -f%z "$1")" 'BEGIN { printf "%.1f", b / 1048576 }'; }

compress() {
  local in="$1" out; out="$(web_of "$1" .mp4)"; mkdir -p "$(dirname "$out")"
  if [ "$FORCE" -eq 0 ] && [ -f "$out" ] && [ "$out" -nt "$in" ]; then
    echo "skip   $(basename "$in")  (already done: $(size_mb "$out") MB)"; return
  fi

  # Shrink to MAX_SIDE on the longest side (keeps portrait/landscape), convert to standard
  # web colour range. HDR iPhone videos (HLG / PQ) are tone-mapped to normal colours first,
  # otherwise they look washed out.
  local transfer vf
  transfer=$(ffprobe -v error -select_streams v:0 -show_entries stream=color_transfer -of csv=p=0 "$in")
  local fit="scale='if(gt(iw,ih),min($MAX_SIDE,iw),-2)':'if(gt(iw,ih),-2,min($MAX_SIDE,ih))'"
  if [ "$transfer" = "arib-std-b67" ] || [ "$transfer" = "smpte2084" ]; then
    vf="zscale=t=linear:npl=100,format=gbrpf32le,zscale=p=bt709,tonemap=hable:desat=0,zscale=t=bt709:m=bt709:r=tv,format=yuv420p,$fit"
    echo "       $(basename "$in") is HDR, converting to normal colours"
  else
    vf="$fit:out_range=tv,format=yuv420p"
  fi

  local audio=(-an)
  [ "$AUDIO" = "keep" ] && audio=(-map 0:a:0? -c:a aac -b:a 128k)

  local crf=$CRF tmp="${out%.mp4}.tmp.mp4"
  while :; do
    printf "encode %s  (CRF %s) ... " "$(basename "$in")" "$crf"
    if ! ffmpeg -nostdin -v error -y -i "$in" -map 0:v:0 "${audio[@]}" \
         -vf "$vf" -c:v libx264 -preset "$PRESET" -crf "$crf" -profile:v high \
         -color_primaries bt709 -color_trc bt709 -colorspace bt709 -color_range tv \
         -map_metadata -1 -movflags +faststart "$tmp"; then
      echo "FAILED"; rm -f "$tmp"; return 1
    fi
    local mb; mb=$(size_mb "$tmp")
    echo "$mb MB"
    if [ "$(echo "$mb <= $TARGET_MB" | bc)" -eq 1 ] || [ $((crf + 2)) -gt "$MAX_CRF" ]; then break; fi
    crf=$((crf + 2))
  done
  mv "$tmp" "$out"
  echo "done   $(basename "$out")  $(size_mb "$in") MB -> $(size_mb "$out") MB"
}

photo() {
  local in="$1" out; out="$(web_of "$1" .web.jpg)"; mkdir -p "$(dirname "$out")"
  # A web copy edited by hand (e.g. a face darkened) is tagged "hand-edited" and never replaced, even with -f
  if [ -f "$out" ] && grep -aq "hand-edited: do not overwrite" "$out"; then
    echo "keep   $(basename "$out")  (hand-edited, left as is)"; return
  fi
  if [ "$FORCE" -eq 0 ] && [ -f "$out" ] && [ "$out" -nt "$in" ]; then
    echo "skip   $(basename "$in")  (already done: $(size_mb "$out") MB)"; return
  fi
  # sips (built into macOS) reads HEIC, fixes rotation, shrinks and converts to normal sRGB colours.
  # ffmpeg then saves the JPEG without any metadata, so GPS location never ends up on the website.
  local tmp="${out%.web.jpg}.tmp.png" rot=0 fit=()
  # Only shrink, never enlarge: small photos keep their size
  local w h; w=$(sips -g pixelWidth "$in" | awk '/pixelWidth/{print $2}'); h=$(sips -g pixelHeight "$in" | awk '/pixelHeight/{print $2}')
  [ "${w:-0}" -gt "$PHOTO_MAX_SIDE" ] || [ "${h:-0}" -gt "$PHOTO_MAX_SIDE" ] && fit=(-Z "$PHOTO_MAX_SIDE")
  # Phones often save photos sideways plus a "rotate me" tag; read that tag via macOS's image library
  case "$(osascript -l JavaScript -e 'ObjC.import("ImageIO"); function run(a) {
            var src = $.CGImageSourceCreateWithURL($.NSURL.fileURLWithPath(a[0]), null);
            var o = src ? ObjC.castRefToObject($.CGImageSourceCopyPropertiesAtIndex(src, 0, null)).objectForKey("Orientation") : null;
            return (o && !o.isNil()) ? o.intValue : 1; }' "$in" 2>/dev/null)" in
    3) rot=180 ;; 6) rot=90 ;; 8) rot=270 ;;
  esac
  if ! sips -r "$rot" ${fit[@]+"${fit[@]}"} -m "/System/Library/ColorSync/Profiles/sRGB Profile.icc" \
         -s format png "$in" --out "$tmp" >/dev/null 2>&1 ||
     ! ffmpeg -nostdin -v error -y -i "$tmp" -q:v "$PHOTO_QUALITY" -pix_fmt yuvj420p -map_metadata -1 "$out"; then
    echo "FAILED $(basename "$in")"; rm -f "$tmp"; return 1
  fi
  rm -f "$tmp"
  echo "done   $(basename "$out")  $(size_mb "$in") MB -> $(size_mb "$out") MB"
}

# 2. Make the web copies
count=0
for t in ${TARGETS[@]+"${TARGETS[@]}"}; do
  while IFS= read -r -d '' f; do
    is_original "$f" || continue
    [ "$(dirname "$f")" = "$ORIG/sunrises" ] || [ "$(dirname "$f")" = "$ORIG/sunsets" ] && continue
    case "$f" in
      *.[mM][oO][vV]|*.[mM]4[vV]) compress "$f" ;;
      *) photo "$f" ;;
    esac && count=$((count + 1))
  done < <(find "$t" -type f -print0 | sort -z)
done
[ "$count" -eq 0 ] && echo "No videos or photos found."

# 3. Save metadata (GPS, dates...) to media_metadata.json, remove it from everything that gets pushed,
# then use the GPS to fill in empty "location"s in sunrises.js / sunsets.js
echo
"$HERE/strip_metadata.py" && "$HERE/fill_locations.py"
exit 0
