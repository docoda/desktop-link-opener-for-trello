// Desktop Link Opener for Trello – hands Trello links over to the desktop app (trello://).

const t = (key) => browser.i18n.getMessage(key);

let enabled = true;
// URLs the user chose to open in the browser once ("Open in browser instead").
const bypass = new Set();

browser.storage.local.get({ enabled: true }).then((s) => {
  enabled = s.enabled;
  updateButton();
});

// Only boards, cards and workspaces – login, settings etc. stay in the browser.
const TRELLO_PATH = /^\/(b|c|w)\//;

function isTrelloOrigin(url) {
  if (!url) return false;
  try {
    return new URL(url).hostname === "trello.com";
  } catch {
    return false;
  }
}

browser.webRequest.onBeforeRequest.addListener(
  (details) => {
    if (!enabled) return {};

    const url = new URL(details.url);
    if (!TRELLO_PATH.test(url.pathname)) return {};

    // One-time exception after "Open in browser instead".
    if (bypass.has(details.url)) {
      bypass.delete(details.url);
      return {};
    }

    // Don't intercept navigation within the Trello web app.
    if (isTrelloOrigin(details.originUrl)) return {};

    const appUrl = "trello://" + url.host + url.pathname + url.search + url.hash;
    const page =
      browser.runtime.getURL("redirect.html") +
      "?app=" + encodeURIComponent(appUrl) +
      "&web=" + encodeURIComponent(details.url);

    return { redirectUrl: page };
  },
  { urls: ["*://trello.com/*"], types: ["main_frame"] },
  ["blocking"]
);

browser.runtime.onMessage.addListener((msg, sender) => {
  if (msg.type === "openInBrowser") {
    bypass.add(msg.url);
    browser.tabs.update(sender.tab.id, { url: msg.url });
  } else if (msg.type === "done") {
    // Freshly opened tab → close it. Otherwise redirect.js goes back in history.
    if (msg.newTab) {
      browser.tabs.remove(sender.tab.id);
    }
  }
});

browser.browserAction.onClicked.addListener(() => {
  enabled = !enabled;
  browser.storage.local.set({ enabled });
  updateButton();
});

function updateButton() {
  browser.browserAction.setBadgeText({ text: enabled ? "" : t("badgeOff") });
  browser.browserAction.setBadgeBackgroundColor({ color: "#8a8a8a" });
  browser.browserAction.setTitle({ title: t(enabled ? "toggleTitleOn" : "toggleTitleOff") });
}
