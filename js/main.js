/* Databit Solution Ltd: page behaviour (no dependencies) */

/* ----------------------------------------------------------
   Contact details. Fill these in before launch.
   Anything left empty stays hidden on the page, so nothing
   links to a placeholder number.
   phone / whatsapp: international format, e.g. "+254 712 345 678"
   ---------------------------------------------------------- */
const SITE = {
  phone: "0758 358 610",
  phone2: "0702 605 096", // optional second line
  whatsapp: "",
  address: "",   // e.g. "Building name, Street, Nairobi". Empty shows "Nairobi, Kenya"
  hours: "",     // e.g. "Mon–Sat, 8:00am – 6:00pm"
};

const EMAIL = "info@databitsolution.co.ke";
const digits = (s) => s.replace(/[^\d]/g, "");
// "0712 345 678" or "+254 712 345 678" -> "254712345678"
const intl = (s) => { const d = digits(s); return d.startsWith("0") ? `254${d.slice(1)}` : d; };

(function applySiteDetails() {
  const values = {
    phone: SITE.phone,
    phone2: SITE.phone2,
    whatsapp: SITE.whatsapp,
    whatsappLabel: SITE.whatsapp,
    address: SITE.address,
    hours: SITE.hours,
  };
  const hrefs = {
    phone: SITE.phone && `tel:+${intl(SITE.phone)}`,
    phone2: SITE.phone2 && `tel:+${intl(SITE.phone2)}`,
    whatsapp: SITE.whatsapp && `https://wa.me/${intl(SITE.whatsapp)}`,
  };
  document.querySelectorAll("[data-site]").forEach((el) => {
    if (values[el.dataset.site]) el.hidden = false;
  });
  document.querySelectorAll("[data-site-href]").forEach((el) => {
    const v = hrefs[el.dataset.siteHref];
    if (v) el.href = v;
  });
  document.querySelectorAll("[data-site-text]").forEach((el) => {
    const v = values[el.dataset.siteText];
    if (v) el.textContent = v;
  });
})();

/* ---------- Header: border on scroll ---------- */
const header = document.getElementById("header");
const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ---------- Mobile menu ---------- */
const nav = document.getElementById("nav");
const menuBtn = document.getElementById("menuBtn");
const mqMobile = window.matchMedia("(max-width: 900px)");

function setMenu(open, { focusButton = false } = {}) {
  menuBtn.setAttribute("aria-expanded", String(open));
  nav.classList.toggle("is-open", open);
  if (open) nav.querySelector("a")?.focus();
  else if (focusButton) menuBtn.focus();
}
menuBtn.addEventListener("click", () => setMenu(menuBtn.getAttribute("aria-expanded") !== "true"));
nav.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && nav.classList.contains("is-open")) setMenu(false, { focusButton: true });
});
document.addEventListener("click", (e) => {
  if (nav.classList.contains("is-open") && !e.target.closest("#nav, #menuBtn")) setMenu(false);
});
mqMobile.addEventListener("change", () => setMenu(false));

/* ---------- Current section in the nav ---------- */
const navLinks = [...document.querySelectorAll(".nav__list a")];
if ("IntersectionObserver" in window) {
  const byId = new Map(navLinks.map((a) => [a.hash.slice(1), a]));
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const link = byId.get(entry.target.id);
      if (!link || !entry.isIntersecting) return;
      navLinks.forEach((a) => a.removeAttribute("aria-current"));
      link.setAttribute("aria-current", "true");
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  byId.forEach((_, id) => { const s = document.getElementById(id); if (s) spy.observe(s); });
}

/* ---------- "Ask for a quote" links pre-select the form ---------- */
const form = document.getElementById("quoteForm");
const interest = document.getElementById("interestSelect");
document.addEventListener("click", (e) => {
  const link = e.target.closest("[data-interest]");
  if (!link) return;
  const opt = [...interest.options].find((o) => o.text === link.dataset.interest);
  if (opt) interest.value = opt.value;
});

/* ---------- Quote form ---------- */
const status = document.getElementById("formStatus");
const icon = (name) => `<svg class="ic" aria-hidden="true"><use href="#i-${name}"/></svg>`;

const rules = {
  name: (v) => (v.trim() ? "" : "Enter your name."),
  phone: (v) => {
    if (!v.trim()) return "Enter a phone number so we can reach you.";
    const n = digits(v);
    return n.length >= 9 && n.length <= 13 ? "" : "Enter a valid phone number, for example 0712 345 678.";
  },
  email: (v) => (!v.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? "" : "Enter a valid email address, or leave it empty."),
};

function check(field) {
  const msg = rules[field.name](field.value);
  const err = document.getElementById(`e-${field.name}`);
  field.setAttribute("aria-invalid", msg ? "true" : "false");
  err.innerHTML = msg ? `${icon("circle-alert")}<span>${msg}</span>` : "";
  return !msg;
}

Object.keys(rules).forEach((name) => {
  const field = form.elements[name];
  // validate on leaving a field, then live once it has been flagged
  field.addEventListener("blur", () => { if (field.value.trim() || field.getAttribute("aria-invalid")) check(field); });
  field.addEventListener("input", () => { if (field.getAttribute("aria-invalid") === "true") check(field); });
});

function showStatus(type, html) {
  status.className = `form__status form__status--${type}`;
  status.innerHTML = `${icon(type === "ok" ? "circle-check" : "circle-alert")}<div>${html}</div>`;
}

const WEB3FORMS_URL = "https://api.web3forms.com/submit";
const submitBtn = form.querySelector('button[type="submit"]');

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (submitBtn.disabled) return; // already sending
  const fields = Object.keys(rules).map((n) => form.elements[n]);
  const invalid = fields.filter((f) => !check(f));
  if (invalid.length) {
    showStatus("error", `Check the ${invalid.length === 1 ? "highlighted field" : `${invalid.length} highlighted fields`} and try again.`);
    invalid[0].focus();
    return;
  }

  const formData = new FormData(form);
  formData.set("subject", `Quote request: ${form.elements.interest.value} (${form.elements.name.value.trim()})`);
  if (!formData.get("email")) formData.delete("email"); // optional; Web3Forms rejects an empty email

  const originalText = submitBtn.textContent;
  submitBtn.textContent = "Sending…";
  submitBtn.disabled = true;
  form.setAttribute("aria-busy", "true");

  try {
    const response = await fetch(WEB3FORMS_URL, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: formData,
    });
    const data = await response.json().catch(() => ({}));
    if (response.ok && data.success !== false) {
      form.reset();
      fields.forEach((f) => f.removeAttribute("aria-invalid"));
      showStatus("ok", `<strong>Thank you, your request has been sent.</strong> Our team will get back to you shortly.`);
    } else {
      showStatus("error", `We couldn't send your request${data.message ? ` (${String(data.message).replace(/[<>&"]/g, "")})` : ""}. Please try again, or email <a href="mailto:${EMAIL}">${EMAIL}</a> directly.`);
    }
  } catch {
    showStatus("error", `Something went wrong. Check your connection and try again, or email <a href="mailto:${EMAIL}">${EMAIL}</a> directly.`);
  } finally {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
    form.removeAttribute("aria-busy");
    status.focus();
  }
});

/* ---------- Partners: optional logos + gentle marquee ---------- */
(function partners() {
  const rows = [...document.querySelectorAll(".partners__track")];
  if (!rows.length) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  // swap a name for its logo when data-logo names a file that loads
  const loads = [...document.querySelectorAll(".partners__track [data-logo]")]
    .filter((li) => li.dataset.logo.trim())
    .map((li) => new Promise((done) => {
      const img = new Image();
      img.alt = li.textContent.trim();
      img.onload = () => { li.textContent = ""; li.append(img); done(); };
      img.onerror = done; // keep the text name
      img.src = `assets/partners/${li.dataset.logo.trim()}`;
    }));

  function build(track) {
    track.querySelectorAll("[data-copy]").forEach((el) => el.remove());
    track.classList.remove("is-moving");
    track.style.removeProperty("--shift");
    if (reduce.matches) return;
    const originals = [...track.children];
    const setWidth = originals.reduce((w, li) => w + li.getBoundingClientRect().width, 0);
    const view = track.parentElement.getBoundingClientRect().width;
    if (!setWidth) return;
    const copies = Math.ceil(view / setWidth) + 1;
    for (let c = 0; c < copies; c++) {
      originals.forEach((li) => {
        const copy = li.cloneNode(true);
        copy.dataset.copy = "";
        copy.setAttribute("aria-hidden", "true");
        track.append(copy);
      });
    }
    track.style.setProperty("--shift", `${-setWidth}px`);
    track.style.setProperty("--dur", `${Math.round(setWidth / 30)}s`); // ~30px per second
    track.classList.add("is-moving");
  }
  const buildAll = () => rows.forEach(build);

  buildAll();
  Promise.all(loads).then(buildAll);
  document.fonts?.ready.then(buildAll);
  reduce.addEventListener("change", buildAll);
  let t;
  window.addEventListener("resize", () => { clearTimeout(t); t = setTimeout(buildAll, 200); });
})();

/* ---------- Process: climbing line ---------- */
(function climb() {
  const box = document.getElementById("climb");
  const line = document.getElementById("climbLine");
  if (!box || !line) return;
  const steps = [...box.querySelectorAll(".climb__step")];
  const nodes = [...box.querySelectorAll(".climb__node")];
  const note = box.querySelector(".climb__note");
  const list = box.querySelector(".climb__steps");
  const still = window.matchMedia("(prefers-reduced-motion: reduce)");
  const narrow = window.matchMedia("(max-width: 899px)");

  // where along the line (0..1) each step's plateau begins
  const total = line.getTotalLength();
  const at = (x) => {
    let lo = 0, hi = total;
    for (let i = 0; i < 24; i++) {
      const mid = (lo + hi) / 2;
      if (line.getPointAtLength(mid).x < x) lo = mid; else hi = mid;
    }
    return hi / total;
  };
  const marks = steps.map((s) => at(+s.dataset.x));

  function update() {
    const vh = window.innerHeight;
    const r = box.getBoundingClientRect();
    const p = Math.max(0, Math.min(1, (vh * 0.85 - r.top) / (r.height * 0.95)));
    if (narrow.matches) {
      list.style.setProperty("--rail", p.toFixed(3));
      steps.forEach((s) => s.classList.toggle("is-on", s.getBoundingClientRect().top < vh * 0.8));
      note.classList.toggle("is-on", note.getBoundingClientRect().top < vh * 0.9);
    } else {
      line.style.setProperty("--off", (1 - p).toFixed(4));
      steps.forEach((s, i) => s.classList.toggle("is-on", p >= marks[i] - 0.01));
      nodes.forEach((n, i) => n.classList.toggle("is-on", p >= marks[i] - 0.01));
      note.classList.toggle("is-on", p >= 0.97);
    }
  }
  function showAll() {
    line.style.setProperty("--off", "0");
    list.style.setProperty("--rail", "1");
    [...steps, ...nodes, note].forEach((el) => el.classList.add("is-on"));
  }

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { ticking = false; update(); });
  };
  function setup() {
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onScroll);
    if (still.matches) { showAll(); return; }
    box.classList.add("is-armed");
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
  }
  still.addEventListener("change", setup);
  narrow.addEventListener("change", update);
  setup();
})();

/* ---------- Services: reveal the card row once ---------- */
(function () {
  const grid = document.querySelector(".svc-grid");
  if (!grid) return;
  if (!("IntersectionObserver" in window)) return;
  grid.classList.add("will-reveal");
  const io = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) { grid.classList.add("is-in"); io.disconnect(); }
  }, { threshold: 0.15 });
  io.observe(grid);
})();

/* ---------- Footer year ---------- */
document.getElementById("year").textContent = new Date().getFullYear();
