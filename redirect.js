// Localize the page.
document.documentElement.lang = browser.i18n.getUILanguage();
for (const el of document.querySelectorAll("[data-i18n]")) {
  el.textContent = browser.i18n.getMessage(el.dataset.i18n);
}

const params = new URLSearchParams(location.search);
const appUrl = params.get("app");
const webUrl = params.get("web");

// A tab whose history only holds this page was freshly opened (new tab / external app).
const newTab = history.length <= 1;

let leftPage = false; // focus moved away (desktop app or Firefox's "open with" dialog)
let finished = false;

function finish() {
  if (finished) return;
  finished = true;
  clearTimeout(hintTimer);
  if (newTab) {
    browser.runtime.sendMessage({ type: "done", newTab: true });
  } else {
    history.back();
  }
}

document.getElementById("web").addEventListener("click", () => {
  finished = true;
  clearTimeout(hintTimer);
  browser.runtime.sendMessage({ type: "openInBrowser", url: webUrl });
});

// Don't close the tab while focus is elsewhere – Firefox may be showing its
// "choose an application" dialog in this tab. Clean up once the user is back.
window.addEventListener("blur", () => { leftPage = true; });
document.addEventListener("visibilitychange", () => {
  if (document.hidden) leftPage = true;
});
window.addEventListener("focus", () => {
  if (leftPage) finish();
});

// Nothing happened at all → the app is probably not installed. Keep the page and explain.
const hintTimer = setTimeout(() => {
  if (!leftPage && !finished) document.getElementById("hint").hidden = false;
}, 4000);

// Hand over to the desktop app.
location.href = appUrl;
