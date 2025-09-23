# Web Push Notifications

A Node.js + Express application for testing and managing **Web Push Notifications**, with data stored in a JSON file and fetched via API (no database required).

## Features
- Subscribe to receive push notifications directly in the browser
- Unsubscribe from notifications anytime
- Send push notifications from backend using `web-push`
- Store subscription data in a local JSON file
- Fetch and manage data through API endpoints
- Track number of notification clicks on the frontend (saved in local storage)

## Tech Stack

### Frontend
- HTML5 + CSS3 + JavaScript (Vanilla)
- Service Worker for handling push notifications
- Local Storage for storing click history

### Backend
- Node.js + Express.js
- `web-push` for sending push notifications
- `body-parser` for parsing request bodies
- `node-fetch` for external API requests
- JSON file for storing subscription data (instead of database)

## Github
[https://github.com/alaudindadek/web-push-api]
