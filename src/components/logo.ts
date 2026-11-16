/**
 * Kiri's official brand artwork, inlined once here so the header, the docs
 * layout and the social cards all draw the same mark.
 *
 * Source: github.com/libracoder/kiri — `brand/logo/` (kiri-horizontal-*.svg,
 * kiri-mark-*.svg). The horizontal wordmark has a light and a dark variant;
 * the mark is the square face used on share cards.
 */
export const logo = {
  width: 150.4,
  height: 64,
  light: `<g transform="translate(6 0) skewX(-10)">
    <clipPath id="klight-clip"><rect x="22" y="12" width="34" height="40" rx="10"/></clipPath>
    <g fill="#E0B420"><rect x="22" y="12" width="34" height="40" rx="10"/></g>
    <g clip-path="url(#klight-clip)" fill="#F2CF5B"><rect x="10" y="0" width="60" height="21.5"/></g>
    <g fill="#0F1419"><ellipse cx="41.5" cy="29" rx="3.1" ry="3.6"/><ellipse cx="50.5" cy="29" rx="3.1" ry="3.6"/></g>
  </g>
  <g fill="#0F1419"><rect x="5" y="21.5" width="13" height="5" rx="2.5"/><rect x="1" y="32" width="15" height="5" rx="2.5"/><rect x="7" y="42.5" width="7" height="5" rx="2.5"/></g>
  <g transform="translate(76 7.2) scale(0.8)"><g fill="none" stroke="#0F1419" stroke-width="9" stroke-linecap="round" stroke-linejoin="round">
    <path d="M4.5 14.5V51.5"/>
    <path d="M29 30.5L8 46"/>
    <path d="M16.5 40.5L29.5 51.5"/>
    <path d="M45 30.5V51.5"/>
    <path d="M61 51.5V41C61 34 66 30.5 74 30.5"/>
    <path d="M88.5 30.5V51.5"/>
  </g>
  <g fill="#E0B420">
    <rect x="40.5" y="10.5" width="9" height="9" rx="2.4" transform="rotate(-10 45 15)"/>
    <rect x="84" y="10.5" width="9" height="9" rx="2.4" transform="rotate(-10 88.5 15)"/>
  </g></g>`,
  dark: `<g transform="translate(6 0) skewX(-10)">
    <clipPath id="kdark-clip"><rect x="22" y="12" width="34" height="40" rx="10"/></clipPath>
    <g fill="#E0B420"><rect x="22" y="12" width="34" height="40" rx="10"/></g>
    <g clip-path="url(#kdark-clip)" fill="#F2CF5B"><rect x="10" y="0" width="60" height="21.5"/></g>
    <g fill="#0F1419"><ellipse cx="41.5" cy="29" rx="3.1" ry="3.6"/><ellipse cx="50.5" cy="29" rx="3.1" ry="3.6"/></g>
  </g>
  <g fill="#F6F2EA"><rect x="5" y="21.5" width="13" height="5" rx="2.5"/><rect x="1" y="32" width="15" height="5" rx="2.5"/><rect x="7" y="42.5" width="7" height="5" rx="2.5"/></g>
  <g transform="translate(76 7.2) scale(0.8)"><g fill="none" stroke="#F6F2EA" stroke-width="9" stroke-linecap="round" stroke-linejoin="round">
    <path d="M4.5 14.5V51.5"/>
    <path d="M29 30.5L8 46"/>
    <path d="M16.5 40.5L29.5 51.5"/>
    <path d="M45 30.5V51.5"/>
    <path d="M61 51.5V41C61 34 66 30.5 74 30.5"/>
    <path d="M88.5 30.5V51.5"/>
  </g>
  <g fill="#E0B420">
    <rect x="40.5" y="10.5" width="9" height="9" rx="2.4" transform="rotate(-10 45 15)"/>
    <rect x="84" y="10.5" width="9" height="9" rx="2.4" transform="rotate(-10 88.5 15)"/>
  </g></g>`,
};

/** The square mark alone, used by the social cards. */
export const mark = {
  width: 64,
  height: 64,
  svg: `<g transform="translate(6 0) skewX(-10)">
    <clipPath id="kmark-clip"><rect x="22" y="12" width="34" height="40" rx="10"/></clipPath>
    <g fill="#E0B420"><rect x="22" y="12" width="34" height="40" rx="10"/></g>
    <g clip-path="url(#kmark-clip)" fill="#F2CF5B"><rect x="10" y="0" width="60" height="21.5"/></g>
    <g fill="#0F1419"><ellipse cx="41.5" cy="29" rx="3.1" ry="3.6"/><ellipse cx="50.5" cy="29" rx="3.1" ry="3.6"/></g>
  </g>
  <g fill="#0F1419"><rect x="5" y="21.5" width="13" height="5" rx="2.5"/><rect x="1" y="32" width="15" height="5" rx="2.5"/><rect x="7" y="42.5" width="7" height="5" rx="2.5"/></g>`,
};
