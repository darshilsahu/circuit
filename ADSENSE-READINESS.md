# Circuit publishing notes

The static site includes a dedicated Learn guide, About, Privacy, Terms,
Contact, a sitemap, robots.txt, per-page metadata, and application structured
data. This is technical preparation, not a guarantee of indexing, rich results,
AdSense eligibility, or approval.

## Before an AdSense application or activation

- Replace the deliberately labeled sample contact with an operator-approved,
  monitored address in `lib/site.ts` (`contactEmail`). Review the policy and
  operator/contact details for the actual service before applying.
- The current `public/ads.txt` is comments only and authorizes no sellers. Add
  the exact record supplied by the real advertising account; do not invent IDs.
- No advertising script, publisher ID, ad iframe, or fake ad is installed.
  The hidden `guide-only` placement in `components/compiler-guide.tsx` is the
  sole reserved boundary, between reading sections on the Learn page. The
  compiler homepage has no advertising placement or long informational article.
  It produces no visible placeholder or whitespace while inactive.
- Before enabling ads, implement the required consent flow, including Google's
  certified CMP requirements where applicable. Update the privacy policy with
  actual vendors, their links, cookies, purposes, and user choices.
- Keep ads outside the entire compiler workspace. Exclude the editor, tabs,
  terminal, Run/Stop, downloads, and other controls from placements and Auto Ads.
  Do not use sticky, overlay, or anchor placements over the coding interface.
  Do not place ads on the trust/contact pages. Recheck mobile spacing and layout
  shifts once an actual approved ad integration exists.
- Verify compatibility with the existing COOP/COEP isolation headers before any
  third-party ad integration. Those headers enable interactive WASM stdin and
  must not be removed or weakened to make ad scripts load.
- Rebuild and deploy `dist/client` to publish these changes. The sitemap URL is
  `https://crunner.pages.dev/sitemap_index.xml`; submit it in Search Console if desired.

References reviewed September 12, 2026:

- https://support.google.com/adsense/answer/1348695
- https://support.google.com/adsense/answer/13554116
- https://support.google.com/adsense/answer/9785052
- https://developers.google.com/search/docs/appearance/structured-data/software-app
