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

document.getElementById("web").addEventListener("click", () => {
  clearTimeout(timer);
  browser.runtime.sendMessage({ type: "openInBrowser", url: webUrl });
});

// Hand over to the desktop app.
location.href = appUrl;

const timer = setTimeout(() => {
  if (newTab) {
    browser.runtime.sendMessage({ type: "done", newTab: true });
  } else {
    history.back();
  }
}, 1500);
