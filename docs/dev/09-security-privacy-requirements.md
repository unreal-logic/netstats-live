
# 9. Security & Privacy Requirements - NetStat Live

This document details the security posture and data privacy considerations for the application.

---

## 1.0 User Authentication

*   **Current State**: The application includes a non-functional, cosmetic-only login and signup flow (`/login`, `/signup`). There is no actual authentication system in place.
*   **Requirement**: Before any feature involving cloud data storage is implemented, a secure authentication mechanism must be integrated.
*   **Preferred Provider**: **Firebase Authentication** is the recommended solution, given the app's target deployment on Firebase App Hosting. It provides secure, managed integration with social providers (Google, Apple) and email/password.

---

## 2.0 Data Storage and Privacy

*   **Primary Storage**: All user-generated data, including team rosters, player names, and all game statistics, is stored exclusively on the client-side within the browser's **`localStorage`**.
*   **Data Transmission**: No game or user data is transmitted to a remote server during normal operation. The application is designed to be fully functional offline.
*   **Privacy by Design**: As there is no central database, the risk of a large-scale data breach is minimized. The privacy of user data is inherent to the client-side architecture.

### 2.1 Share Functionality
*   **Mechanism**: The "Share Game" feature serializes the `GameLog` object (including player names and stats) into a JSON string. This string is then compressed (using `pako`) and Base64-encoded into a single URL parameter.
*   **Risk**: This creates a publicly accessible link to that specific game's data. Users should be aware that anyone with the link can view the stats.
*   **Mitigation**: The app does not store or index these generated links. The link's obscurity is its primary (and only) security layer. No personally identifiable information (PII) beyond player names is included.

---

## 3.0 Role-Based Access Control (RBAC)

*   **Current State**: Not applicable. The application operates in a single-user mode.
*   **Future Requirement**: If multi-user "Club" or "Organization" accounts are introduced, a full RBAC model will be necessary. This would define roles such as:
    *   **Admin**: Can manage billing, add/remove members, and view all team data.
    *   **Coach**: Can manage their assigned teams and record games.
    *   **Player/Viewer**: Can only view stats for their team.

---

## 4.0 Data Retention

*   **Policy**: Data retention is managed entirely by the user and their browser. The data persists in `localStorage` until the user manually clears their browser data.
*   **Requirement**: The application must provide a user-facing way to delete specific data (e.g., delete a team, delete a competition, delete a game) and to wipe all application data entirely ("Reset All Settings" partially covers this, but a full data wipe should be a separate, explicit action).

---

## 5.0 Dependencies and Auditing

*   **Requirement**: All third-party npm packages should be regularly audited for known vulnerabilities using `npm audit`.
*   **Constraint**: Only well-maintained and reputable libraries should be added to the project to minimize supply chain attack risks.
