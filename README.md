# Kausly — Website

Premium marketing website for **Kausly**, a Dubai-based IT services agency that acts as the outsourced IT department for small and medium businesses.

## Services covered

- IT Procurement
- IT Maintenance
- IT Management
- IT Consulting
- Managed IT Monitoring

## Stack

Zero-dependency static site — plain HTML, CSS and vanilla JavaScript. No build step required.

| File | Purpose |
|---|---|
| `index.html` | Single-page site: hero, services, approach, why-Kausly, pricing, FAQ, CTA |
| `styles.css` | Design system (light premium aesthetic), layout, animations |
| `script.js` | Scroll reveals, animated counters, sticky nav, mobile menu, FAQ accordion |

## Design notes

- **Aesthetic:** minimal, corporate, trustworthy — warm off-white background, ink typography, a single restrained blue accent, editorial serif italics for emphasis.
- **Typography:** Inter (UI) + Instrument Serif (accents), fluid `clamp()` sizing, tight letter-spacing on display sizes.
- **Motion:** staggered hero line-mask entrance, IntersectionObserver scroll reveals, animated stat counters, industry marquee, hover micro-interactions on buttons/cards/service rows, smooth FAQ accordion. All motion respects `prefers-reduced-motion`.

## Run locally

Open `index.html` directly, or serve it:

```sh
python3 -m http.server 8000
# → http://localhost:8000
```
