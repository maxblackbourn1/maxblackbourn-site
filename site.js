(function () {
  const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const pad = n => String(n).padStart(2, "0");
  const fmtDate = d => { const t = new Date(d + "T12:00:00"); return isNaN(t) ? esc(d) : t.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }); };

  function cards(list, past) {
    return list.map((p, i) => `
      <article class="item${past ? " past" : ""}">
        <div class="thumb">${window.FACE ? FACE(p.face || p.title) : ""}</div>
        <div class="body">
          <div class="item-head"><span class="num">${pad(i + 1)}</span><h3>${esc(p.title)}</h3><span class="status${p.live ? " live" : ""}">${esc(p.status)}</span></div>
          <p>${esc(p.text)}</p>${p.link ? `<a class="more" href="${esc(p.link)}" target="_blank" rel="noopener">Read more</a>` : ""}
        </div>
      </article>`).join("");
  }
  function entries(list) {
    if (!list.length) return `<p class="empty">The first entries are on their way: short daily thoughts and notes on what I’m reading.</p>`;
    return list.map(e => `
      <article class="entry">
        <div class="when">${fmtDate(e.date)}<br><span class="kind${e.type === "Reading" ? " reading" : ""}">${esc(e.type || "Thought")}</span></div>
        <div>
          <h3>${e.link ? `<a href="${esc(e.link)}" target="_blank" rel="noopener">${esc(e.title)}</a>` : esc(e.title)}</h3>
          ${e.source ? `<div class="source">${esc(e.source)}</div>` : ""}
          ${e.text ? `<p>${esc(e.text)}</p>` : ""}
        </div>
      </article>`).join("");
  }

  document.querySelectorAll("[data-projects]").forEach(el => {
    const past = el.dataset.projects === "past";
    el.innerHTML = cards(PROJECTS.filter(p => !!p.past === past), past);
  });
  document.querySelectorAll("[data-journal]").forEach(el => {
    const n = parseInt(el.dataset.journal, 10);
    const list = [...JOURNAL].sort((a, b) => (b.date || "").localeCompare(a.date || ""));
    el.innerHTML = entries(n ? list.slice(0, n) : list);
  });
  document.querySelectorAll("[data-face]").forEach(el => {
    el.innerHTML = FACE(el.dataset.face, { track: el.hasAttribute("data-track") });
  });

  // eyes follow the cursor
  const pupils = () => document.querySelectorAll("[data-track] .pupil");

  let raf;
  window.addEventListener("pointermove", ev => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => pupils().forEach(p => {
      const svg = p.ownerSVGElement.getBoundingClientRect();
      const dx = ev.clientX - (svg.left + svg.width / 2), dy = ev.clientY - (svg.top + svg.height / 2);
      const d = Math.hypot(dx, dy) || 1, k = Math.min(6, d / 40);
      p.style.transform = `translate(${(dx / d) * k}px, ${(dy / d) * k}px)`;
    }));
  });
  document.getElementById("y") && (document.getElementById("y").textContent = new Date().getFullYear());
})();
