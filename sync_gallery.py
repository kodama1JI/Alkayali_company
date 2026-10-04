# يحدّث قائمة الصور من مجلد images دون تعديل صفحات الموقع.
# صورة جديدة: images\hooks__خطافات الرافعة.jpg
# التصنيفات: molds  hooks  parts  grates  segments
import json
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent
IMAGES = ROOT / "images"
OUT = ROOT / "gallery-data.js"
EXTS = {".jpg", ".jpeg", ".png", ".webp"}
CATEGORIES = {
    "molds": "قوالب",
    "hooks": "خطافات",
    "parts": "قطع غيار",
    "grates": "شبكات",
    "segments": "قطاعات",
}
LEGACY = {
    "mold-red.jpg": ("molds", "قالب رملي دائري"),
    "mold-boxes.jpg": ("molds", "صناديق القوالب"),
    "mold-cavities.jpg": ("molds", "قالب متعدد التجاويف"),
    "hooks.jpg": ("hooks", "خطافات معدنية"),
    "tines.jpg": ("parts", "أسنان منحنية"),
    "curved-segments.jpg": ("segments", "قطاعات منحنية"),
    "hollow-castings.jpg": ("parts", "مصبوبات مجوفة"),
    "grate.jpg": ("grates", "شبكة معدنية"),
    "cylinders.jpg": ("parts", "قطع أسطوانية"),
    "ring.jpg": ("parts", "حلقة معدنية"),
    "y-piece.jpg": ("parts", "قطعة مخصصة"),
}
SKIP = {"logo-alkayali.jpg"}


def title_from_name(stem):
    return stem.replace("-", " ").replace("_", " ").strip()


def collect():
    items = []
    for path in sorted(IMAGES.iterdir(), key=lambda p: p.name.lower()):
        if not path.is_file() or path.suffix.lower() not in EXTS:
            continue
        if path.name.lower() in SKIP:
            continue
        if "__" in path.stem:
            category, raw_title = path.stem.split("__", 1)
            category = category.lower()
            if category not in CATEGORIES:
                continue
            title = title_from_name(raw_title) or CATEGORIES[category]
        elif path.name in LEGACY:
            category, title = LEGACY[path.name]
        else:
            continue
        items.append({
            "src": f"images/{path.name}",
            "title": title,
            "category": category,
            "label": CATEGORIES[category],
        })
    return items


def write_list():
    items = collect()
    payload = json.dumps(items, ensure_ascii=False, indent=2)
    OUT.write_text(f"window.ALKAYALI_MEDIA = {payload};\n", encoding="utf-8")
    print(f"{len(items)} image(s) -> {OUT.name}")
    return items


def watch():
    previous = None
    print("Watching images/. Add a file, then refresh the page.")
    while True:
        current = tuple(sorted(
            (p.name, p.stat().st_mtime_ns)
            for p in IMAGES.iterdir()
            if p.is_file() and p.suffix.lower() in EXTS
        ))
        if current != previous:
            write_list()
            previous = current
        time.sleep(1)


if __name__ == "__main__":
    import sys
    write_list()
    if "--watch" in sys.argv:
        watch()
