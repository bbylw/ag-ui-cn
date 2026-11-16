/**
 * The site's logo, drawn once for every place it appears: the header and the
 * docs layout (Logo.astro) and the social cards (src/pages/og/_card.ts).
 *
 * The mark is an isometric container cube: three faces, separated by a hairline
 * gap, so it still reads as a cube in a single colour. `fills` gives the three
 * faces their depth in places that can't use the gradient tile (the OG card).
 */
export const logo = {
  /** The drawing's box; callers size it by height and keep the ratio. */
  width: 64,
  height: 64,
  paths: [
    // Top face.
    "M32 12.51L49.58 22.49L32 31.51L14.43 22.49Z",
    // Left face.
    "M14.05 23.39L31.45 32.31L31.45 51.59L14.05 41.72Z",
    // Right face.
    "M49.95 23.39L49.95 41.72L32.55 51.59L32.55 32.31Z",
  ],
  /** One fill per path; used by the social cards, which render on white. */
  fills: ["#171717", "#4a4a4a", "#737373"],
};
