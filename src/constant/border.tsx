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
 * <svg width="100%" height="100%" fill="#4808FE" xmlns="http://www.w3.org/2000/svg">
 *  <rect x="2" y="2" width="100%" height="100%" style="width: calc(100% - 4px);height: calc(100% - 4px);" rx="4" stroke-width="2" stroke="url(#border)" stroke-linecap="round" />
 *  <defs>
 *    <linearGradient id="border" x1="0" y1="0" x2="100%" y2="100%" gradientUnits="userSpaceOnUse">
 *      <stop stop-color="#714EFF"/>
 *      <stop offset="0.75" stop-color="#fff"/>
 *      <stop offset="1" stop-color="#999"/>
 *    </linearGradient>
 *  </defs>
 * </svg>
 * ```
 */
const BORDER_WITH_PURPLE_BACKGROUND =
  'data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjNDgwOEZFIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHg9IjIiIHk9IjIiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHN0eWxlPSJ3aWR0aDpjYWxjKDEwMCUgLSA0cHgpO2hlaWdodDpjYWxjKDEwMCUgLSA0cHgpIiByeD0iNCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2U9InVybCgjYm9yZGVyKSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJib3JkZXIiIHkyPSIxMDAlIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agc3RvcC1jb2xvcj0iIzcxNEVGRiIvPjxzdG9wIG9mZnNldD0iLjc1IiBzdG9wLWNvbG9yPSIjZmZmIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjOTk5Ii8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PC9zdmc+';

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

export {
  BORDER,
  BORDER_WITH_PURPLE_BACKGROUND,
  BORDER_WITH_WHITE_BACKGROUND,
  TITLE_BORDER,
};
