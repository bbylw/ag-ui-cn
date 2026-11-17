/**
 * AG-UI brand artwork for the Chinese site (header, docs layout, social cards).
 *
 * The mark: the "A" of AG-UI, whose crossbar is a two-headed arrow threaded
 * through it. The letter names the protocol; the arrow is the thing the
 * protocol actually is — one stream of events leaving the agent, another
 * coming back from the interface, in both directions at once. The artwork
 * keeps the official logo's language (stroke-only, geometric, no fills).
 *
 * It is the same geometry as `public/favicon.svg`, so the tab icon and the
 * header are one drawing at two sizes. In the wordmark, "-UI" takes the brand
 * violet: the name itself names the two ends the protocol joins.
 */

/** The square mark, 64 × 64. `id` must be unique per rendered SVG. */
const shape = (id: string, top: string, bottom: string) => `<defs>
    <linearGradient id="${id}" x1="10" y1="4" x2="54" y2="60" gradientUnits="userSpaceOnUse">
      <stop stop-color="${top}"/>
      <stop offset="1" stop-color="${bottom}"/>
    </linearGradient>
  </defs>
  <rect x="4" y="4" width="56" height="56" rx="17" fill="url(#${id})"/>
  <rect x="5.1" y="5.1" width="53.8" height="53.8" rx="16" fill="none" stroke="#fff" stroke-opacity=".16" stroke-width="1.2"/>
  <g fill="#fff">
    <path d="M18.5 47.5 32 17 45.5 47.5" fill="none" stroke="#fff" stroke-width="6.6" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M20.5 32.8 11.5 37l9 4.2v-2.6h23v2.6l9-4.2-9-4.2v2.6h-23z"/>
  </g>`;

/** Wordmark: the mark, then the name with its violet second half. */
const wordmark = (id: string, top: string, bottom: string, ink: string, accent: string) => `<g fill="none" fill-rule="evenodd">
    <g transform="translate(2 6) scale(.59375)">${shape(id, top, bottom)}</g>
    <text x="55" y="32.5" font-family="Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif" font-size="27" font-weight="700" letter-spacing="-1" fill="${ink}">AG<tspan fill="${accent}">-UI</tspan></text>
  </g>`;

export const logo = {
  width: 148,
  height: 48,
  light: wordmark("agMarkLight", "#8b84ff", "#5a52e8", "#0f1419", "#5751d9"),
  dark: wordmark("agMarkDark", "#9a94ff", "#6b62f0", "#f6f2ea", "#b0acff"),
};

/** The square mark alone, used by social cards. */
export const mark = {
  width: 64,
  height: 64,
  svg: `<g fill="none" fill-rule="evenodd">${shape("agMarkCard", "#8b84ff", "#5a52e8")}</g>`,
};
