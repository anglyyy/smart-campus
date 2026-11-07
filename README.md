# CTU Smart Campus Service Request System

A Progressive Web App for submitting and tracking campus service requests.

**Live demo:** https://anglyyy.github.io/smart-campus/

## How to run locally
1. Open the `smart-campus` folder in VS Code.
2. Install the **Live Server** extension.
3. Right-click `index.html` and choose **Open with Live Server**.
4. Open http://127.0.0.1:5500/index.html.

Do not open `index.html` by double-clicking. ES modules and service workers need a server.

## Features
- Request form with validation (name, concern type, description)
- Unique auto-generated Request ID, even for identical descriptions
- Status management and search by ID or filter by status
- Works offline after the first load (service worker cache)
- Simulated "Sync to campus server" with clear offline and server-failure messages

## Architecture
- `js/ui.js`: page display only
- `js/service.js`: validation, ID generation, status rules
- `js/dataLayer.js`: localStorage access only
- `js/serverApi.js`: simulated campus server
- `js/config.js`: statuses and concern types
- `js/app.js`: connects the layers
- `sw.js`, `manifest.json`: PWA and offline support
- `architecture.svg` / `architecture.png`: architecture diagram

## Changing the statuses (HOTS challenge)
Edit `STATUSES` in `js/config.js`, for example to `["Submitted", "Under Review", "Completed"]`. No other file needs to change.

## Offline behavior
Viewing, searching, and submitting work offline because data is stored on the device. Syncing needs a connection and shows a clear message when offline or when the server fails. It never reports a false success.

## Challenges
- **Challenge A (server failure):** tick "Simulate server failure", then click Sync.
- **Challenge B (input validation):** submit with blank or invalid fields.
- **Challenge C (component modification):** change the card layout in `ui.js`; other modules keep working.

## Usability testing
See `usability-test.md`.