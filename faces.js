/* Original generative portraits — heavy outlines, cubist planes, odd eyes.
   face(seed, opts) returns an SVG string. Same seed = same face. */
(function () {
  const PAL = ["#e5321e", "#2742c9", "#18a39a", "#f5c518", "#f07b1d", "#ef5fa7", "#7bc043", "#7d4cc2"];
  const SKIN = ["#f5c518", "#18a39a", "#ef5fa7", "#f07b1d", "#e9dcc4", "#7bc043", "#5b8bf0", "#e5321e"];

  function rng(seed) {
    let h = 1779033703 ^ String(seed).length;
    for (const c of String(seed)) { h = Math.imul(h ^ c.charCodeAt(0), 3432918353); h = (h << 13) | (h >>> 19); }
    return function () { h = Math.imul(h ^ (h >>> 16), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); h ^= h >>> 16; return (h >>> 0) / 4294967296; };
  }
  const pick = (r, a) => a[Math.floor(r() * a.length)];
  const f = n => n.toFixed(1);

  function blob(r, cx, cy, rx, ry, n, jit) {
    const pts = [];
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2, k = 1 + (r() - .5) * jit;
      pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
    }
    let d = "";
    for (let i = 0; i < n; i++) {
      const p = pts[i], q = pts[(i + 1) % n];
      const m = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
      d += i === 0 ? `M${f(m[0])} ${f(m[1])}` : "";
      const nq = pts[(i + 2) % n], m2 = [(q[0] + nq[0]) / 2, (q[1] + nq[1]) / 2];
      d += ` Q${f(q[0])} ${f(q[1])} ${f(m2[0])} ${f(m2[1])}`;
    }
    return d + "Z";
  }

  function eye(r, x, y, s, id, track) {
    const t = Math.floor(r() * 5);
    const pc = track ? ' class="pupil"' : "";
    if (t === 0) { // spiral
      let d = `M${x} ${y}`;
      for (let i = 0; i < 40; i++) { const a = i * .55, rr = i * s / 40; d += ` L${f(x + Math.cos(a) * rr)} ${f(y + Math.sin(a) * rr)}`; }
      return `<circle cx="${x}" cy="${y}" r="${s}" fill="#fff" stroke="#111" stroke-width="4"/><path d="${d}" fill="none" stroke="#111" stroke-width="2.5"/>`;
    }
    if (t === 1) // sleepy half-lid
      return `<path d="M${x - s} ${y} Q${x} ${y + s * 1.1} ${x + s} ${y}" fill="#fff" stroke="#111" stroke-width="4"/><path d="M${x - s} ${y} L${x + s} ${y}" stroke="#111" stroke-width="5"/><g${pc}><circle cx="${x}" cy="${y + s * .35}" r="${s * .28}" fill="#111"/></g>`;
    if (t === 2) // almond with big iris
      return `<path d="M${x - s * 1.3} ${y} Q${x} ${y - s * 1.2} ${x + s * 1.3} ${y} Q${x} ${y + s * 1.2} ${x - s * 1.3} ${y}Z" fill="#fff" stroke="#111" stroke-width="4"/><g${pc}><circle cx="${x}" cy="${y}" r="${s * .55}" fill="${pick(r, PAL)}" stroke="#111" stroke-width="3"/><circle cx="${x}" cy="${y}" r="${s * .22}" fill="#111"/></g>`;
    if (t === 3) // ringed stare
      return `<circle cx="${x}" cy="${y}" r="${s * 1.15}" fill="${pick(r, PAL)}" stroke="#111" stroke-width="4"/><circle cx="${x}" cy="${y}" r="${s * .75}" fill="#fff" stroke="#111" stroke-width="3"/><g${pc}><circle cx="${x}" cy="${y}" r="${s * .3}" fill="#111"/></g>`;
    // X eye
    return `<circle cx="${x}" cy="${y}" r="${s}" fill="#fff" stroke="#111" stroke-width="4"/><g${pc}><path d="M${x - s * .45} ${y - s * .45} L${x + s * .45} ${y + s * .45} M${x + s * .45} ${y - s * .45} L${x - s * .45} ${y + s * .45}" stroke="#111" stroke-width="4" stroke-linecap="round"/></g>`;
  }

  function mouth(r, x, y, w) {
    const t = Math.floor(r() * 4);
    if (t === 0) { // toothy grin
      const h = w * .32; let teeth = "";
      for (let i = 1; i < 7; i++) teeth += `M${f(x - w / 2 + i * w / 7)} ${f(y - h / 2)} L${f(x - w / 2 + i * w / 7)} ${f(y + h / 2)} `;
      return `<path d="M${x - w / 2} ${y - h / 2} Q${x} ${y - h} ${x + w / 2} ${y - h / 2} L${x + w / 2} ${y + h / 2} Q${x} ${y + h * 1.1} ${x - w / 2} ${y + h / 2}Z" fill="#fff" stroke="#111" stroke-width="4"/><path d="${teeth} M${x - w / 2} ${y} L${x + w / 2} ${y}" stroke="#111" stroke-width="2.5"/>`;
    }
    if (t === 1) // scream O
      return `<ellipse cx="${x}" cy="${y}" rx="${w * .22}" ry="${w * .3}" fill="#111"/><ellipse cx="${x}" cy="${y + w * .1}" rx="${w * .12}" ry="${w * .1}" fill="#e5321e"/>`;
    if (t === 2) // big lips
      return `<path d="M${x - w / 2} ${y} Q${x - w / 4} ${y - w * .25} ${x} ${y - w * .08} Q${x + w / 4} ${y - w * .25} ${x + w / 2} ${y} Q${x} ${y + w * .35} ${x - w / 2} ${y}Z" fill="${pick(r, ["#e5321e", "#ef5fa7", "#7d4cc2"])}" stroke="#111" stroke-width="4"/><path d="M${x - w / 2} ${y} Q${x} ${y + w * .06} ${x + w / 2} ${y}" fill="none" stroke="#111" stroke-width="3"/>`;
    // zigzag
    let d = `M${x - w / 2} ${y}`; for (let i = 1; i <= 8; i++) d += ` L${f(x - w / 2 + i * w / 8)} ${f(y + (i % 2 ? -1 : 1) * w * .08)}`;
    return `<path d="${d}" fill="none" stroke="#111" stroke-width="5" stroke-linejoin="round"/>`;
  }

  function face(seed, opts = {}) {
    const r = rng(seed), id = "f" + Math.floor(r() * 1e9);
    const skin = opts.skin || pick(r, SKIN);
    let plane = pick(r, PAL); if (plane === skin) plane = "#111";
    const bg = opts.bg === undefined ? null : opts.bg;
    const cx = 100 + (r() - .5) * 8, cy = 112;
    const rx = 58 + r() * 18, ry = 72 + r() * 18;
    const head = blob(r, cx, cy, rx, ry, 9, .28);
    const split = cx + (r() - .5) * 30, tilt = (r() - .5) * 60;
    const ex = 24 + r() * 10, ey = cy - 18 + (r() - .5) * 12;
    const s1 = 14 + r() * 8, s2 = 12 + r() * 12;
    const nose = `M${f(cx + (r() - .5) * 10)} ${f(ey + 6)} L${f(cx + 14 + r() * 14)} ${f(cy + 26)} L${f(cx - 4)} ${f(cy + 30)}`;
    const my = cy + 46 + r() * 8, mw = 44 + r() * 30;
    // hair / spikes
    let hair = "";
    const ht = Math.floor(r() * 4);
    if (ht === 0) { for (let i = 0; i < 14; i++) { const a = Math.PI + (i / 13) * Math.PI, x0 = cx + Math.cos(a) * rx * .9, y0 = cy + Math.sin(a) * ry * .9; hair += `M${f(x0)} ${f(y0)} L${f(x0 + Math.cos(a) * (18 + r() * 22))} ${f(y0 + Math.sin(a) * (18 + r() * 22))} `; } hair = `<path d="${hair}" fill="none" stroke="#111" stroke-width="4" stroke-linecap="round"/>`; }
    else if (ht === 1) { hair = `<path d="${blob(r, cx, cy - ry * .75, rx * .9, ry * .38, 8, .5)}" fill="${pick(r, PAL)}" stroke="#111" stroke-width="5"/>`; }
    else if (ht === 2) { for (let i = 0; i < 30; i++) { const x0 = cx - rx * .8 + r() * rx * 1.6, y0 = cy - ry * .85 + r() * 18; hair += `M${f(x0)} ${f(y0)} q${f((r() - .5) * 30)} ${f(-20 - r() * 20)} ${f((r() - .5) * 30)} ${f(-30 - r() * 20)} `; } hair = `<path d="${hair}" fill="none" stroke="#111" stroke-width="2.2"/>`; }
    // marks
    let marks = "";
    for (let i = 0; i < 3; i++) { const mx = cx + (r() - .5) * rx * 1.2, my2 = cy + (r() - .2) * ry * .8; marks += `<path d="M${f(mx - 5)} ${f(my2)} L${f(mx + 5)} ${f(my2)} M${f(mx)} ${f(my2 - 5)} L${f(mx)} ${f(my2 + 5)}" stroke="#111" stroke-width="2.5"/>`; }
    const blush = r() > .5 ? `<circle cx="${f(cx - ex - 6)}" cy="${f(cy + 22)}" r="9" fill="${pick(r, ["#e5321e", "#ef5fa7", "#f07b1d"])}" opacity=".85"/>` : "";
    const neck = `<path d="M${f(cx - 22)} ${f(cy + ry - 8)} L${f(cx - 26)} 222 L${f(cx + 24)} 222 L${f(cx + 20)} ${f(cy + ry - 8)}" fill="${skin}" stroke="#111" stroke-width="5"/>`;
    const drips = r() > .5 ? `<path d="M${f(cx + 20)} ${f(cy + ry - 4)} v${f(10 + r() * 20)} M${f(cx - 30)} ${f(cy + ry - 14)} v${f(8 + r() * 24)}" stroke="${plane}" stroke-width="5" stroke-linecap="round"/>` : "";

    return `<svg viewBox="0 0 200 222" class="face" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <filter id="${id}w"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="2" seed="${Math.floor(r() * 99)}"/><feDisplacementMap in="SourceGraphic" scale="5"/></filter>
    <clipPath id="${id}c"><path d="${head}"/></clipPath>
  </defs>
  ${bg ? `<rect width="200" height="222" fill="${bg}"/>` : ""}
  <g filter="url(#${id}w)">
    ${neck}
    <path d="${head}" fill="${skin}"/>
    <g clip-path="url(#${id}c)">
      <polygon points="${f(split - tilt)},0 220,0 220,222 ${f(split + tilt)},222" fill="${plane}" opacity=".92"/>
      <polygon points="0,${f(cy + 10)} ${f(split)},${f(cy - 5)} ${f(split)},${f(cy + 30)} 0,${f(cy + 45)}" fill="${pick(r, PAL)}" opacity=".55"/>
    </g>
    <path d="${head}" fill="none" stroke="#111" stroke-width="6"/>
    ${hair}${blush}${drips}
    <path d="${nose}" fill="none" stroke="#111" stroke-width="4" stroke-linejoin="round"/>
    ${eye(r, +(cx - ex).toFixed(1), +ey.toFixed(1), +s1.toFixed(1), id, opts.track)}
    ${eye(r, +(cx + ex).toFixed(1), +(ey + (r() - .5) * 10).toFixed(1), +s2.toFixed(1), id, opts.track)}
    ${mouth(r, +(cx + (r() - .5) * 10).toFixed(1), +my.toFixed(1), +mw.toFixed(1))}
    ${marks}
  </g>
</svg>`;
  }
  window.FACE = face;
})();
