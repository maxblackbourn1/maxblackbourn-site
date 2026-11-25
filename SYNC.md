# Notion to site sync

The site's Reading, Takes and Running notes sections come from Notion. Run daily by a scheduled task.

Publish rules (set by Max):
- Reading Notes & Review (collection://406c94bb-6444-490e-8b3d-1918d6e24631): only rows with Publish checked.
  Fields: Reading (title), Date read, Link, Type, Topic (multi-select), My take. Never publish notes, prediction, objection or verdict.
- Captures (collection://4218a5dc-7888-81dd-b8ac-000bd05dab2b):
  - Kind = Take -> journal entry with kind "Take". Shown on the home page and on journal.html.
  - Kind = Thought, Reading or X / thread -> journal entry with kind "Capture". Shown only on journal.html under "Running notes".
  - Never publish Kind = Meeting or Conversation (they name other people and private discussions).
  - title = Capture. text = Max's own words: the contents of the "## In my words" section of the page body, copied exactly (no rewording, no summarising, no tidying). If a row has no "## In my words" section (older rows), use Claim, then Do I buy it, then "Open question: ..." if present.
  - link = Link if present. date = Date (else createdTime). No filter on Integrated.
  - Never publish phone numbers, email addresses, or anything Max marks private.

Steps: query Captures and Reading, fetch each publishable Captures page for its body, write notion.json (shape in tools/sync_data.py), run `python3 tools/sync_data.py notion.json`, commit synced.js, push to main.
Skip the push if synced.js did not change.
