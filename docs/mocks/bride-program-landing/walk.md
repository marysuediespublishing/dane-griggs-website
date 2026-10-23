# The Bride Program box-set landing page: the walk and the flip-through

*Job 4212, 2026-10-22. This is the design step for the page the Bride Program ad will send people to, instead of sending them straight to Amazon (Todd, 10-21: the paused `saving-ceraste-set-us-a` ad). It is built on the pattern of Gwen's Sophie Feegle box-set page.*

**Frames.** `lofi/` (boxes and words) and `hifi/` (Dane's own tokens: deep-space navy, cosmic rose, stellar gold, nebula purple; Playfair Display and Inter; the site's `.btn-primary` and `.btn-secondary`) are the same page in two skins, so they can't drift apart. `flip-through.mp4` goes through the hi-fi frames in order: the desktop page scrolled to its foot, the phone (in a phone-wide strip), the consent bar, and the three buttons hovered with `?utm_campaign=x`, with the browser's status line showing where each one goes. The sources are in `src/`. Open `page.html` in a browser, add `?lo` for the lo-fi, `?consent` for a non-US visitor, or `?utm_campaign=x` for a campaign's tags. To re-render everything, run `node docs/mocks/bride-program-landing/src/render.mjs --video`.

**Real content.** The set is *The Bride Program Box Set: Books 1–9* (Kindle ASIN `B0B2M4RGCS`, in KU). The cover image is the set's own, from its Goodreads page. The hook and the pitch come from the set's blurb, and the five reviews are real Goodreads reviews of the box set, quoted word for word. Two of them are cut, and the cuts are marked with "…".

The stars are **series-wide numbers, labelled as such** (4.5 average, 7,344 ratings, from `series/saving-ceraste.md`). The same choice was made on Gwen's page, because the box set's own count is small (Goodreads: 4.56 from 84 ratings).

The Attribution tags in the mock are placeholders (`maas_adg_DEFAULT…`, `…CAMPAIGN_X…`). In the build they come from site-config. The mock reuses the box-set tag on the paperback link for brevity. The build gives the paperback link its own tag (`paperbackAttributionTag` / `paperbackTag`).

## The walk

- **task**: Someone who clicked the Bride Program ad decides to read the set and goes to Amazon, either borrowing it on Kindle Unlimited or buying it.
- **persona**: A woman reading on her phone in the Facebook or Instagram in-app browser. She already reads alien romance, may or may not have KU, and will give the page a few seconds.
- **entry**: `https://danegriggs.com/series/saving-ceraste/box-set?utm_source=meta&utm_campaign=<the ad's campaign>`. The page is not linked from the site's nav.
- **done_when**: She has tapped one of the three buttons, and the pixel has recorded `LandingClickKU`, `LandingClickBuy` or `LandingClickPaperback` with her `utm_campaign` attached. The Amazon link she lands on carries the Attribution tag for her campaign.

| # | frame | she sees | she does |
|---|-------|----------|----------|
| 1 | `02-phone-fold` | The set (nine spines and the cover), "The Bride Program Box Set", the hook question, the promise. The two buttons are fixed to the bottom of the screen. | She reads the hook. If she's sold, she taps **Read free with Kindle Unlimited** (or **Buy**). |
| 2 | `03-phone-full` | She scrolls past the pull-quote, the nine books (each cover with one line), the pitch and the reviews. The bar stays put. | She scrolls and taps whenever she's ready. |
| 3 | `04-phone-closing` | At the foot, the closing line, with the same three choices inline. The fixed bar slides away so the buttons don't appear twice. | She taps one of the three. |
| 4 | `01-desktop` | At desktop width the buttons sit in a sticky card on the right, next to the whole page. | She clicks one. |
| 5 | `05-desktop-consent` | Outside the US (judged by the browser's time zone), an Allow / No thanks bar appears before any pixel loads. | Allow, No thanks, or she ignores it. The buttons work either way. |
| 6–8 | `06/07/08-campaign-hover-*` | With `?utm_campaign=x`, each button points at Amazon with campaign x's own Attribution tags. A campaign the config doesn't know keeps the default tags. | Hover only. Nothing is clicked. |

There is one decision per screen. **Kindle Unlimited** is the primary button, because the ad is optimised for KU clicks (`landing_click_ku`, as on Gwen's second campaign). **Buy** is secondary, and **paperback** is a quiet text link that measures interest in print.

## What the build carries over from Gwen's page, as one shared piece

- `src/lib/landing.ts`: Attribution tags applied to the links, per-campaign links keyed by `utm_campaign`, and the names of the click events.
- `src/lib/landing-client.ts`: the browser side. It remembers `utm_campaign` and the ad source for the tab session, swaps in the campaign's links, handles consent and loads the pixel (no click needed in a US time zone, Allow first anywhere else, and no pixel if the visitor already declined marketing cookies in the site's own banner), fires `LandingClickKU` / `LandingClickBuy` / `LandingClickPaperback`, and sends the Press `press.landing.ctr` keepalive beacon.
- `LandingLayout.astro` (the slim chrome: name mark, legal footer, no site pixel, no newsletter popup), `LandingCtas.astro`, `LandingConsentBar.astro` and `LandingTracking.astro`. The next box-set page should be one page file that uses these pieces, not a copy of this one.
- site-config fields with the same names as Gwen's: `metaPixelId`, `landingAttributionTag`, `paperbackAttributionTag`, `landingAttributionTags[]`, `pressCtrEndpoint` and `amazonBadge`. They are editable in the CMS.

## The build's walk

`build/` holds the built page (`dist/`), opened with `?utm_source=meta&utm_campaign=x`, with each button hovered and none clicked: `desktop-*` at 1280 wide and `phone-*` on a Pixel 5. To redo it, run `npm run build && node docs/mocks/bride-program-landing/src/walk.mjs`. The script prints where each button goes and what the pixel was told. On 10-23 it printed, at both widths, `init 2527209327539510` and `PageView {campaign: "x"}`, with no click events, and the page stayed on `/series/saving-ceraste/box-set/`. The KU and Buy buttons went to `https://www.amazon.com/dp/B0B2M4RGCS` and print went to `https://www.amazon.com/dp/1090344378`. The links had no tags because site-config has no Attribution tags yet, and `x` is not a configured campaign. The tag swap itself is covered by `npm run test:landing`, which gives campaign `x` its own tags.
