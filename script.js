/* Kausly — interactions (shared across all pages) */
(() => {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (id) => document.getElementById(id);

  /* ---------- Nav scroll state ---------- */
  const nav = $("nav");
  if (nav) {
    const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Highlight current page in nav ---------- */
  const here = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav__links a").forEach((a) => {
    const target = a.getAttribute("href");
    if (target === here) a.classList.add("is-active");
    if (here.startsWith("service-") && target === "services.html") a.classList.add("is-active");
  });

  /* ---------- Mobile menu ---------- */
  const toggle = $("navToggle");
  const links = $("navLinks");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    links.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        links.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      })
    );
  }

  /* ---------- Hero rotating word ---------- */
  const rotator = $("rotator");
  if (rotator && !prefersReducedMotion) {
    const words = Array.from(rotator.querySelectorAll(".rotator__word"));
    let idx = 0;
    setInterval(() => {
      const current = words[idx];
      idx = (idx + 1) % words.length;
      const next = words[idx];
      current.classList.remove("is-active");
      current.classList.add("is-leaving");
      next.classList.remove("is-leaving");
      void next.offsetWidth; // restart enter transition from below
      next.classList.add("is-active");
      setTimeout(() => current.classList.remove("is-leaving"), 800);
    }, 2600);
  }

  /* ---------- Liquid hero: gentle pointer parallax ---------- */
  const liquid = document.querySelector(".liquid");
  if (liquid && !prefersReducedMotion && matchMedia("(pointer: fine)").matches) {
    document.addEventListener("mousemove", (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 26;
      const y = (e.clientY / window.innerHeight - 0.5) * 18;
      liquid.style.transform = `translate(${x}px, ${y}px)`;
    }, { passive: true });
  }

  /* ---------- Big statement: word-by-word reveal ---------- */
  const statement = $("statement");
  if (statement) {
    const words = statement.textContent.trim().split(/\s+/);
    statement.innerHTML = words.map((w) => `<span class="w">${w}</span>`).join(" ");
    const spans = statement.querySelectorAll(".w");
    if (prefersReducedMotion) {
      spans.forEach((s) => s.classList.add("is-on"));
    } else {
      const onStatementScroll = () => {
        const rect = statement.getBoundingClientRect();
        const vh = window.innerHeight;
        const progress = Math.min(Math.max((vh * 0.85 - rect.top) / (rect.height + vh * 0.35), 0), 1);
        const cutoff = Math.floor(progress * spans.length);
        spans.forEach((s, i) => s.classList.toggle("is-on", i < cutoff));
      };
      window.addEventListener("scroll", onStatementScroll, { passive: true });
      onStatementScroll();
    }
  }

  /* ---------- Services showcase: pinned scene-swap on scroll ---------- */
  const show = document.querySelector(".show");
  if (show && !prefersReducedMotion) {
    const scenes = Array.from(show.querySelectorAll(".show__scene"));
    const dots = Array.from(show.querySelectorAll(".show__progress span"));
    const ring = show.querySelector(".show__ring");
    const count = scenes.length;
    // each scene gets ~90vh of scroll; +1 viewport for the pinned frame itself
    const setHeight = () => { show.style.height = `${(count * 0.9 + 1) * window.innerHeight}px`; };
    setHeight();
    window.addEventListener("resize", setHeight);

    let active = 0;
    const update = () => {
      const rect = show.getBoundingClientRect();
      const total = show.offsetHeight - window.innerHeight;
      const progress = Math.min(Math.max(-rect.top / total, 0), 0.9999);
      const idx = Math.floor(progress * count);
      if (ring) ring.style.transform = `translateX(-50%) rotate(${progress * 160}deg)`;
      if (idx !== active) {
        active = idx;
        scenes.forEach((s, i) => {
          s.classList.toggle("is-active", i === idx);
          s.classList.toggle("is-past", i < idx);
        });
        dots.forEach((d, i) => d.classList.toggle("is-on", i === idx));
      }
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
  }

  /* ---------- Scroll reveals ---------- */
  const revealables = document.querySelectorAll("[data-reveal]");
  if (prefersReducedMotion) {
    revealables.forEach((el) => el.classList.add("in-view"));
  } else if (revealables.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    revealables.forEach((el) => io.observe(el));
  }

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll("[data-count]");
  const formatCount = (val, decimals, group) =>
    group ? Math.round(val).toLocaleString("en-US") : val.toFixed(decimals);
  const animateCount = (el) => {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || "0", 10);
    const group = el.dataset.group === "1";
    const duration = 1500;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 4);
      el.textContent = formatCount(target * eased, decimals, group);
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if (counters.length) {
    if (prefersReducedMotion) {
      counters.forEach((el) => {
        el.textContent = formatCount(
          parseFloat(el.dataset.count),
          parseInt(el.dataset.decimals || "0", 10),
          el.dataset.group === "1"
        );
      });
    } else {
      const cio = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animateCount(entry.target);
              cio.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.6 }
      );
      counters.forEach((el) => cio.observe(el));
    }
  }

  /* ---------- Savings calculator ---------- */
  const teamRange = $("teamRange");
  if (teamRange) {
    const spendRange = $("spendRange");
    const downRange = $("downRange");
    const money = (n) => "$" + Math.max(0, Math.round(n)).toLocaleString("en-US");
    const setFill = (input) => {
      const pct = ((input.value - input.min) / (input.max - input.min)) * 100;
      input.style.setProperty("--fill", pct + "%");
    };
    const HOURLY_DOWNTIME_COST = 120;
    const PREVENTABLE_SHARE = 0.7;
    const PER_USER_RATE = 50;
    const BASE_PLAN = 1000;

    const compute = () => {
      const team = +teamRange.value;
      const spend = +spendRange.value;
      const down = +downRange.value;

      const plan = Math.max(BASE_PLAN, team * PER_USER_RATE);
      const overspend = Math.max(0, spend - plan);
      const downSaved = down * HOURLY_DOWNTIME_COST * PREVENTABLE_SHARE;
      const monthly = overspend + downSaved;

      $("teamOut").textContent = team + " people";
      $("spendOut").textContent = money(spend);
      $("downOut").textContent = down + (down === 1 ? " hour" : " hours");
      $("planPrice").textContent = money(plan) + "/mo";
      $("overspend").textContent = money(overspend) + "/mo";
      $("downSaved").textContent = money(downSaved) + "/mo";
      $("savingMonthly").textContent = money(monthly);
      $("savingAnnual").textContent = money(monthly * 12);

      [teamRange, spendRange, downRange].forEach(setFill);
    };
    [teamRange, spendRange, downRange].forEach((r) => r.addEventListener("input", compute));
    compute();
  }

  /* ---------- Forms: mailto handoff + inline confirmation ---------- */
  document.querySelectorAll("form[data-mailto]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const lines = [];
      for (const [key, value] of data.entries()) {
        if (String(value).trim() !== "") lines.push(`${key}: ${value}`);
      }
      const subject = form.dataset.subject || "Website enquiry";
      const href =
        "mailto:hello@kausly.com" +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(lines.join("\n"));
      form.classList.add("is-sent");
      const success = form.querySelector(".form__success");
      if (success) success.scrollIntoView({ block: "nearest", behavior: prefersReducedMotion ? "auto" : "smooth" });
      window.location.href = href;
    });
  });

  /* ---------- FAQ: smooth open/close ---------- */
  document.querySelectorAll(".faq__item").forEach((item) => {
    const summary = item.querySelector("summary");
    const answer = item.querySelector(".faq__answer");
    if (!summary || !answer) return;
    summary.addEventListener("click", (e) => {
      if (prefersReducedMotion) return;
      e.preventDefault();
      if (item.open) {
        const h = answer.offsetHeight;
        answer.animate(
          [{ height: h + "px", opacity: 1 }, { height: "0px", opacity: 0 }],
          { duration: 350, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }
        ).onfinish = () => { item.open = false; };
      } else {
        item.open = true;
        const h = answer.offsetHeight;
        answer.animate(
          [{ height: "0px", opacity: 0 }, { height: h + "px", opacity: 1 }],
          { duration: 450, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }
        );
      }
    });
  });
})();
