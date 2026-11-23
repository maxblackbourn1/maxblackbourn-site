# Notion to site sync

The site's Reading and Journal sections come from Notion. Run daily by a scheduled task.

Publish rules (set by Max):
- Reading Notes & Review (collection://406c94bb-6444-490e-8b3d-1918d6e24631): only rows with Publish checked.
  Fields: Reading (title), Date read, Link, Type, Topic (multi-select), My take. Never publish notes, prediction, objection or verdict.
- Captures (collection://4218a5dc-7888-81dd-b8ac-000bd05dab2b): only rows with Kind = Thought.
  title = Capture, text = Claim, then Do I buy it, then "Open question: ..." if present, date = Date (else createdTime). Skip anything Integrated or not, no filter on that.

Steps: query both, write notion.json, run `python3 tools/sync_data.py notion.json`, commit synced.js, push to main.
Skip the push if synced.js did not change.
