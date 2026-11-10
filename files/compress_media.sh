#!/bin/bash
# Compress Sunrises / Sunsets videos and photos for the website.
#
# Videos (.MOV / .m4v)                -> a web-friendly .mp4 next to it
#   e.g. 2026/11-Nov/2026-11-03.MOV   -> 2026/11-Nov/2026-11-03.mp4
# Photos (.jpg / .jpeg / .png / .heic) -> a smaller .web.jpg next to it, with location (GPS) data removed
#   e.g. 2026/10-Oct/2026-10-20.jpeg  -> 2026/10-Oct/2026-10-20.web.jpg
# The originals are left untouched (and git ignores them).
# At the end it also runs strip_metadata.py (removes GPS/dates from anything pushed, saving them in
# media_metadata.json on this computer) and fill_locations.py (fills empty "location"s from the GPS).
#
# Usage (from anywhere):
#   files/compress_media.sh                        # everything under files/sunrises and files/sunsets
#   files/compress_media.sh sunsets                # just one of them (relative to files/, or a full path)
#   files/compress_media.sh sunrises/2026/11-Nov   # just one folder
#   files/compress_media.sh some.MOV               # just one file
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
HERE="$(cd "$(dirname "$0")" && pwd)"
FORCE=0
TARGETS=()
for arg in "$@"; do
  case "$arg" in
    -f|--force) FORCE=1 ;;
    -h|--help) sed -n '2,18p' "$0"; exit 0 ;;
    *) if [ -e "$arg" ]; then TARGETS+=("$arg"); elif [ -e "$HERE/$arg" ]; then TARGETS+=("$HERE/$arg");
       else echo "Not found: $arg" >&2; exit 1; fi ;;
  esac
done
FOLDERS=("$HERE/sunrises" "$HERE/sunsets")   # files sitting directly in these (e.g. page backgrounds) are skipped
[ ${#TARGETS[@]} -eq 0 ] && TARGETS=("${FOLDERS[@]}")

command -v ffmpeg >/dev/null || { echo "ffmpeg isn't installed (brew install ffmpeg)" >&2; exit 1; }

size_mb() { awk -v b="$(stat -f%z "$1")" 'BEGIN { printf "%.1f", b / 1048576 }'; }

compress() {
  local in="$1" out="${1%.*}.mp4"
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
  local in="$1" out="${1%.*}.web.jpg"
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

count=0
for t in "${TARGETS[@]}"; do
  # Skip files sitting directly in files/sunrises or files/sunsets (e.g. page backgrounds), and our own outputs
  while IFS= read -r -d '' f; do
    d="$(cd "$(dirname "$f")" && pwd)"
    [ "$d" = "$HERE/sunrises" ] || [ "$d" = "$HERE/sunsets" ] && continue
    case "$f" in
      *.web.jpg|*.tmp.*) continue ;;
      *.[mM][oO][vV]|*.[mM]4[vV]) compress "$f" ;;
      *) photo "$f" ;;
    esac && count=$((count + 1))
  done < <(find "$t" -type f \( -iname '*.mov' -o -iname '*.m4v' -o -iname '*.jpg' -o -iname '*.jpeg' \
                               -o -iname '*.png' -o -iname '*.heic' -o -iname '*.heif' \) -print0 | sort -z)
done
[ "$count" -eq 0 ] && echo "No videos or photos found."

# Save metadata (GPS, dates...) to media_metadata.json, remove it from everything that gets pushed,
# then use the GPS to fill in empty "location"s in sunrises.js / sunsets.js
echo
"$HERE/strip_metadata.py" && "$HERE/fill_locations.py"
exit 0
