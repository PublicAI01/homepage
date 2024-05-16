import Google from '@/assets/imgs/google.svg';

// https://www.zhangxinxu.com/sp/svgo/

/**
 * ```html
 * <svg width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
 *  <rect x="2" y="2" width="100%" height="100%" fill="white" style="width: calc(100% - 4px);height: calc(100% - 4px);" rx="6" stroke-width="2" stroke="url(#border)"/>
 *  <defs>
 *    <linearGradient id="border" x1="0" y1="0" x2="100%" y2="100%" gradientUnits="userSpaceOnUse">
 *      <stop stop-color="rgb(38, 237, 214)"/>
 *      <stop offset="1" stop-color="rgb(116, 92, 249)"/>
 *    </linearGradient>
 *  </defs>
 * </svg>
 * ```
 */
// eslint-disable-next-line max-len
const BORDER = 'data:image/svg+xml;base64,PHN2ZyBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHg9IjIiIHk9IjIiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNmZmYiIHN0eWxlPSJ3aWR0aDpjYWxjKDEwMCUgLSA0cHgpO2hlaWdodDpjYWxjKDEwMCUgLSA0cHgpIiByeD0iNiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2U9InVybCgjYm9yZGVyKSIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYm9yZGVyIiB5Mj0iMTAwJSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiMyNkVERDYiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM3NDVDRjkiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48L3N2Zz4=';

function ChromeButton() {
  return (
    <a
      role="button"
      className="h-[56px] relative hover:opacity-80 xmd:hidden"
      style={{
        background: `url(${BORDER})`,
      }}
      href="https://chromewebstore.google.com/detail/icbbdjflabjciapbohkkkmaangfjaanl"
      rel="noreferrer"
      target="_blank"
    >
      <div className="flex items-center w-full h-full px-5">
        <p className="text-[#333] text-lg font-bold">Download Data Hunter</p>
        <Google className="w-5 h-5 ml-3" />
      </div>
    </a>
  );
}

export default ChromeButton;
