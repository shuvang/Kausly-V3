/* Kausly — interactions */
(() => {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Nav scroll state ---------- */
  const nav = document.getElementById("nav");
  const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 24);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
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

  /* ---------- Hero rotating word ---------- */
  const rotator = document.getElementById("rotator");
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
      // force reflow so the enter transition starts from below
      void next.offsetWidth;
      next.classList.add("is-active");
      setTimeout(() => current.classList.remove("is-leaving"), 800);
    }, 2600);
  }

  /* ---------- Big statement: word-by-word reveal on scroll ---------- */
  const statement = document.getElementById("statement");
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
        // progress: 0 when the block enters, 1 when its bottom passes ~40% of viewport
        const progress = Math.min(Math.max((vh * 0.85 - rect.top) / (rect.height + vh * 0.35), 0), 1);
        const cutoff = Math.floor(progress * spans.length);
        spans.forEach((s, i) => s.classList.toggle("is-on", i < cutoff));
      };
      window.addEventListener("scroll", onStatementScroll, { passive: true });
      onStatementScroll();
    }
  }

  /* ---------- Scroll reveals ---------- */
  const revealables = document.querySelectorAll("[data-reveal]");
  if (prefersReducedMotion) {
    revealables.forEach((el) => el.classList.add("in-view"));
  } else {
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
  const format = (val, decimals, group) =>
    group ? Math.round(val).toLocaleString("en-US") : val.toFixed(decimals);
  const animateCount = (el) => {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || "0", 10);
    const group = el.dataset.group === "1";
    const duration = 1500;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 4); // easeOutQuart
      el.textContent = format(target * eased, decimals, group);
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if (prefersReducedMotion) {
    counters.forEach((el) => {
      el.textContent = format(
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

  /* ---------- What-we-do carousel ---------- */
  const track = document.getElementById("carouselTrack");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  if (track && prevBtn && nextBtn) {
    const cardWidth = () => {
      const card = track.querySelector(".scard");
      return card ? card.getBoundingClientRect().width + 20 : 400;
    };
    const updateButtons = () => {
      prevBtn.disabled = track.scrollLeft <= 4;
      nextBtn.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 4;
    };
    prevBtn.addEventListener("click", () => track.scrollBy({ left: -cardWidth(), behavior: "smooth" }));
    nextBtn.addEventListener("click", () => track.scrollBy({ left: cardWidth(), behavior: "smooth" }));
    track.addEventListener("scroll", updateButtons, { passive: true });
    window.addEventListener("resize", updateButtons);
    updateButtons();
  }

  /* ---------- FAQ: smooth open/close ---------- */
  document.querySelectorAll(".faq__item").forEach((item) => {
    const summary = item.querySelector("summary");
    const answer = item.querySelector(".faq__answer");
    if (!summary || !answer) return;
    summary.addEventListener("click", (e) => {
      if (prefersReducedMotion) return; // native toggle
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
