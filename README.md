# Kausly — Website

Marketing website for **Kausly**, a Dubai-based IT services agency that acts as the outsourced IT department for small and medium businesses. Design language inspired by likewize.com: deep indigo type and buttons, lilac gradient fields, bright pink accent circles and badges, white cards, and scroll-driven motion.

## Pages

| Page | Purpose |
|---|---|
| `index.html` | Home: liquid-gradient hero, pinned services showcase, savings calculator, stats, quote, CTA |
| `about.html` | Company story, beliefs, stats |
| `services.html` | Services overview linking to the four detail pages |
| `service-procurement.html` | IT Procurement detail |
| `service-maintenance.html` | IT Maintenance detail |
| `service-management.html` | IT Management detail (24/7 monitoring folded in) |
| `service-consulting.html` | IT Consulting detail |
| `referral.html` | Referral program + referral form |
| `pricing.html` | Flat-fee pricing + FAQ |
| `rfq.html` | Alibaba-style request-for-quotation form |
| `partner.html` | "Partner with us" enquiry form |

## Stack

Zero-dependency static site — plain HTML, CSS and vanilla JavaScript (`styles.css`, `script.js` shared by every page). No build step.

## Signature interactions

- **Liquid hero** — blurred gradient blobs drifting behind centered display type, with pointer parallax and a rotating keyword.
- **Pinned services showcase** — the section pins for ~4 viewports while each service scene (device card + floating notification cards + icon badge + pill/statement/button) swaps in on scroll; a dotted ring rotates with progress.
- **Savings calculator** — three sliders (team size, current IT spend, downtime) drive a live estimate of the Kausly plan price and monthly/annual savings.
- Word-by-word statement reveal, animated stat counters, ticker band, staggered scroll reveals, smooth FAQ accordion, form → mailto handoff with inline confirmation.
- All motion respects `prefers-reduced-motion` (the showcase degrades to stacked static scenes).

## Run locally

```sh
python3 -m http.server 8000
# → http://localhost:8000
```

## Placeholders to replace

- Contact details: `hello@kausly.com`, `+971 4 000 0000`, Business Bay address.
- The testimonial quote on the home page.
- Form handling is a mailto: handoff — swap for a real backend/form service when available.
