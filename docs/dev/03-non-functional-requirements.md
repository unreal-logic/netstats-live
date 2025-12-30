
# 3. Non-Functional Requirements (NFRs) - NetStat Live

## 1.0 Performance

*   **Responsiveness**: Tapping a stat button and a player must result in a visual update (scoreboard, player highlight) in under **200ms**.
*   **Load Time**: The initial load of the live game page (`/game`), including all components, should be under **2 seconds** on a standard broadband connection.
*   **Memory Usage**: The application should not consume excessive memory, even with a large `statLog` containing thousands of entries.

---

## 2.0 Offline Support

*   **Core Functionality**: The entire process of tracking a live game (starting/pausing the timer, recording stats, making substitutions) **must function fully offline**.
*   **Data Persistence**: All in-game data (settings, stat log, etc.) must be persisted in the browser's `localStorage`.
*   **Syncing**: The app currently operates as a client-side only application. If cloud sync is introduced, the app must sync all locally stored games and settings once an internet connection is re-established.

---

## 3.0 Security & Privacy

*   **Data Storage**: All data is stored locally on the user's device/browser. No user or game data is transmitted to a server by default.
*   **User Authentication**: The current implementation features a mock login flow. A production-ready version would require secure authentication (e.g., OAuth 2.0 with Firebase Authentication).
*   **Data Sharing**: The "Share" functionality generates a compressed, base64-encoded URL containing all game data. This data is not stored server-side and is only accessible to those with the link.

---

## 4.0 Scalability

*   **Stat Volume**: The application must handle at least 5,000 stat entries per game without significant performance degradation.
*   **Team/Player Volume**: The app should manage up to 50 teams, each with up to 20 players, without UI lag in management screens.

---

## 5.0 Accessibility (A11y)

*   **Keyboard Navigation**: All interactive elements (buttons, inputs, links) must be focusable and operable via keyboard.
*   **Screen Readers**: All buttons and interactive elements should have appropriate ARIA labels (`aria-label`, `aria-describedby`) for screen readers. For example, icon-only buttons must have a `sr-only` span.
*   **Color Contrast**: UI elements must meet WCAG 2.1 AA contrast ratios.
*   **Semantic HTML**: Use appropriate HTML tags (`<nav>`, `<main>`, `<header>`, `<footer>`, `<button>`) to define the page structure.

---

## 6.0 Supported Devices

*   **Primary**: The application is designed as a web app with a "touch-first" philosophy, optimized for tablets (e.g., iPad) in landscape orientation.
*   **Secondary**: The app must be fully responsive and functional on modern desktop web browsers (Chrome, Firefox, Safari, Edge) and mobile phones (iOS and Android).
