#!/usr/bin/env python3
"""Write synced.js from a JSON file exported from Notion.

Usage: python3 tools/sync_data.py notion.json
JSON shape:
  {"reading": [{"date","title","link","type","topics":[...],"take"}],
   "journal": [{"date","kind":"Take"|"Capture","title","text","link"?}]}
"text" is Max's own words, published as written (no rewording).
Only publishable rows should be passed in (see SYNC.md).
"""
import json, sys, pathlib

d = json.load(open(sys.argv[1]))
clean = lambda x: " ".join(str(x or "").split())
keep = lambda x: "\n".join(" ".join(l.split()) for l in str(x or "").strip().splitlines()).strip()
reading = [{
    "date": clean(r.get("date"))[:10], "title": clean(r.get("title")),
    "link": clean(r.get("link")), "type": clean(r.get("type")) or "Reading",
    "topics": [clean(t) for t in r.get("topics", []) if clean(t)],
    "take": clean(r.get("take")),
} for r in d.get("reading", []) if clean(r.get("title"))]
journal = [{
    "date": clean(j.get("date"))[:10],
    "type": "Take" if clean(j.get("kind")).lower() == "take" else "Capture",
    "title": clean(j.get("title")), "text": keep(j.get("text")),
    **({"link": clean(j["link"])} if clean(j.get("link")) else {}),
} for j in d.get("journal", []) if clean(j.get("title")) or clean(j.get("text"))]
reading.sort(key=lambda r: r["date"], reverse=True)
journal.sort(key=lambda j: j["date"], reverse=True)
out = ("/* AUTO-GENERATED from Notion by tools/sync_data.py. Do not edit by hand. */\n"
       f"const READING = {json.dumps(reading, ensure_ascii=False, indent=2)};\n"
       f"const JOURNAL = {json.dumps(journal, ensure_ascii=False, indent=2)};\n")
pathlib.Path(__file__).resolve().parent.parent.joinpath("synced.js").write_text(out)
print(f"synced.js: {len(reading)} readings, {len(journal)} thoughts")
