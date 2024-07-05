// https://www.zhangxinxu.com/sp/svgo/

/**
 * ```html
 * <svg width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
 *  <rect x="2" y="2" width="100%" height="100%" style="width: calc(100% - 4px);height: calc(100% - 4px);" rx="4" stroke-width="2" stroke="url(#border)" stroke-linecap="round" />
 *  <defs>
 *    <linearGradient id="border" x1="0" y1="0" x2="100%" y2="100%" gradientUnits="userSpaceOnUse">
 *      <stop stop-color="#5708FE"/>
 *      <stop offset="1" stop-color="#999"/>
 *    </linearGradient>
 *  </defs>
 * </svg>
 * ```
 */
const BORDER =
  'data:image/svg+xml;base64,PHN2ZyBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHg9IjIiIHk9IjIiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHN0eWxlPSJ3aWR0aDpjYWxjKDEwMCUgLSA0cHgpO2hlaWdodDpjYWxjKDEwMCUgLSA0cHgpIiByeD0iNCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2U9InVybCgjYm9yZGVyKSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJib3JkZXIiIHkyPSIxMDAlIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agc3RvcC1jb2xvcj0iIzU3MDhGRSIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzk5OSIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==';

/**
 * ```html
 * <svg width="100%" height="100%" fill="#fff" xmlns="http://www.w3.org/2000/svg">
 *  <rect x="2" y="2" width="100%" height="100%" style="width: calc(100% - 4px);height: calc(100% - 4px);" rx="4" stroke-width="2" stroke="url(#border)" stroke-linecap="round" />
 *  <defs>
 *    <linearGradient id="border" x1="0" y1="0" x2="100%" y2="100%" gradientUnits="userSpaceOnUse">
 *      <stop stop-color="#5708FE"/>
 *      <stop offset="1" stop-color="#999"/>
 *    </linearGradient>
 *  </defs>
 * </svg>
 * ```
 */
const BORDER_WITH_WHITE_BACKGROUND =
  'data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjZmZmIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHg9IjIiIHk9IjIiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHN0eWxlPSJ3aWR0aDpjYWxjKDEwMCUgLSA0cHgpO2hlaWdodDpjYWxjKDEwMCUgLSA0cHgpIiByeD0iNCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2U9InVybCgjYm9yZGVyKSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJib3JkZXIiIHkyPSIxMDAlIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agc3RvcC1jb2xvcj0iIzU3MDhGRSIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzk5OSIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==';

/**
 * ```html
 * <svg width="100%" height="100%" fill="#0E100C" xmlns="http://www.w3.org/2000/svg">
 *  <rect x="2" y="2" width="100%" height="100%" style="width: calc(100% - 4px);height: calc(100% - 4px);" rx="4" stroke-width="2" stroke="url(#border)" stroke-linecap="round" />
 *  <defs>
 *    <linearGradient id="border" x1="0" y1="0" x2="100%" y2="100%" gradientUnits="userSpaceOnUse">
 *      <stop stop-color="#5708FE"/>
 *      <stop offset="1" stop-color="#999"/>
 *    </linearGradient>
 *  </defs>
 * </svg>
 * ```
 */
const TITLE_BORDER =
  'data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjMEUxMDBDIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHg9IjIiIHk9IjIiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHN0eWxlPSJ3aWR0aDpjYWxjKDEwMCUgLSA0cHgpO2hlaWdodDpjYWxjKDEwMCUgLSA0cHgpIiByeD0iNCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2U9InVybCgjYm9yZGVyKSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJib3JkZXIiIHkyPSIxMDAlIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agc3RvcC1jb2xvcj0iIzU3MDhGRSIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzk5OSIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==';

/**
 * ```html
 * <svg width="36px" height="36px" viewBox="0 0 36 36" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
 * 		<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
 * 				<g fill="#FFFFFF">
 * 						<circle fill-opacity="0.2" cx="18" cy="18" r="18"></circle>
 * 						<path d="M14.3616898,24.1685113 C13.8794367,23.68625 13.8794367,22.9043247 14.3616898,22.4221456 L19.0187143,17.7650882 L14.3616898,13.108072 C13.8794367,12.6258188 13.8794367,11.8439347 14.3616898,11.3616898 C14.843943,10.8794367 15.6258188,10.8794367 16.108072,11.3616898 L21.638304,16.8918642 C22.1205653,17.3741256 22.1205653,18.1560509 21.638304,18.6383122 L16.108072,24.1685113 C15.6258188,24.6507727 14.843943,24.6507727 14.3616898,24.1685113 Z"></path>
 * 				</g>
 * 		</g>
 * </svg>
 * ```
 */
const ARROW_WHITE_ROUNDED = '';

/**
 * ```html
 * <svg width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
 *  <rect x="1" y="1" width="100%" height="100%" style="width: calc(100% - 2px);height: calc(100% - 2px);" rx="10" stroke-width="1" stroke="url(#border)" stroke-linecap="round" />
 *  <defs>
 *    <linearGradient id="border" x1="0" y1="0" x2="0" y2="100%" gradientUnits="userSpaceOnUse">
 *      <stop stop-color="rgba(255, 255, 255, 0.15)"/>
 *      <stop offset="1" stop-color="rgba(255, 255, 255, 0)"/>
 *    </linearGradient>
 *  </defs>
 * </svg>
 * ```
 */
const DATA_CARD_BORDER_WITH_ALPHA =
  'data:image/svg+xml;base64,PHN2ZyBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHg9IjEiIHk9IjEiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHN0eWxlPSJ3aWR0aDpjYWxjKDEwMCUgLSAycHgpO2hlaWdodDpjYWxjKDEwMCUgLSAycHgpIiByeD0iMTAiIHN0cm9rZT0idXJsKCNib3JkZXIpIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImJvcmRlciIgeDI9IjAiIHkyPSIxMDAlIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agc3RvcC1jb2xvcj0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjE1KSIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0icmdiYSgyNTUsIDI1NSwgMjU1LCAwKSIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==';

export {
  BORDER,
  BORDER_WITH_WHITE_BACKGROUND,
  DATA_CARD_BORDER_WITH_ALPHA,
  TITLE_BORDER,
};
