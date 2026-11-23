/* ==============================================================
   SITE CONTENT — edit this file to update projects and journal.
   Changes show up on both the home page and their own pages.
   ============================================================== */

/* ---------- PROJECTS ----------
   status: shown on the right. live: true makes it red (active).
   past: true puts it in the "Past" list.                        */
const PROJECTS = [
  { title: "Short-form creator project", status: "Active", live: true,
    text: "I think there’s still a critical gap: young people with real AI safety context making videos that are both entertaining and informative. I’m working through a first series of videos and tracking the metrics to see whether this path is viable." },
  { title: "Short-form clipper contract", status: "Awaiting funding",
    text: "I’m setting up a 6-week pilot to hire a part-time clipper to cut significant AI safety interviews and podcasts into short-form clips, to see whether they can gain reasonable traction. I’ll run and oversee the contract, and I’m waiting to hear back on a BlueDot Rapid Grant to fund it." },
  { title: "Short-form peer accountability", status: "Building", live: true,
    text: "Basic infrastructure to match promising short-form creators into peer-accountability relationships, so they push each other to keep posting. It grew out of requests from top applicants to the DISPATCH fellowship." },
  { title: "AISST alumni database", status: "Building", live: true,
    text: "A database to connect current AI Safety Student Team members with our alumni network working throughout AI safety." },
  { title: "InkHaven for Beginners", status: "Considering",
    text: "A remote winter-break program where people hold each other accountable for blogging every day. It’s aimed at people who’ve finished an intro fellowship and want to build context quickly to be competitive for AI safety roles." },

  { title: "DISPATCH short-form content fellowship", status: "Did not run", past: true,
    text: "A planned six-week remote fellowship to train undergraduates as AI safety communicators through rapid-response short-form content. It didn’t run. A LessWrong post on what happened and what I learned is coming soon, and I’ll link it here." }
    /* add link: "https://..." to any project to show a "Read more" link */
];

/* ---------- JOURNAL: daily thoughts & pieces read ----------
   Newest first. type: "Thought" or "Reading".
   For readings, add  source: "Author, Publication"  and  link: "https://..."

   Example (copy, fill in, and remove the slashes):
   // { date: "2026-11-24", type: "Thought", title: "…", text: "…" },
   // { date: "2026-11-24", type: "Reading", title: "…", source: "…", link: "https://…", text: "My take: …" },
*/
const JOURNAL = [
];
