export function checkHttpUrl(string) {
  let givenURL;
  try {
    givenURL = new URL(string);
  } catch (error) {
    return false;
  }
  return givenURL.protocol === 'http:' || givenURL.protocol === 'https:';
}

export function checkMobile() {
  if (document.body.clientWidth <= 768) { return true; }
  const info = navigator.userAgent;
  const agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPod', 'iPad'];
  for (let i = 0; i < agents.length; i += 1) {
    if (info.indexOf(agents[i]) >= 0) return true;
  }
  return false;
}
