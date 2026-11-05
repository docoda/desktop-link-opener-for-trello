# Desktop Link Opener for Trello

Firefox extension that opens Trello board, card and workspace links in the **Trello desktop app** instead of the browser – no matter where you click them (Slack, email, other websites).

## How it works

- Intercepts top-level navigations to `trello.com/b/…`, `/c/…` and `/w/…`
- Hands the link to the desktop app via Trello's URL scheme (`https://trello.com/c/…` → `trello://trello.com/c/…`)
- Closes the leftover tab (or goes back to the previous page) once you return to Firefox
- Does not interfere while you use Trello in the browser
- Shows an "open in browser instead" link for exceptions
- Toolbar button toggles the redirect on/off

The extension collects no data and makes no network requests of its own.

Available in English and German (follows your Firefox language).

## Requirements

- Firefox 140+ on Windows, macOS or Linux
- Trello desktop app installed. On the first redirect, Firefox asks which app should handle `trello://` links – choose Trello and tick "Always".

## Development

Load the extension temporarily via `about:debugging` → "This Firefox" → "Load Temporary Add-on…" and select `manifest.json`.

Build a package for addons.mozilla.org:

```sh
./build.sh
```

## Support

Found a bug or have an idea? [Open an issue](https://github.com/docoda/desktop-link-opener-for-trello/issues).

If the extension saves you a few clicks every day, you can [buy me a coffee on Ko-fi](https://ko-fi.com/docodadev) ☕

## Changelog

See [CHANGELOG.md](CHANGELOG.md).

## Disclaimer

This extension is not affiliated with or endorsed by Atlassian or Trello.

## License

[MIT](LICENSE)
