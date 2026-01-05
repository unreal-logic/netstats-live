
# NetStats Live Blueprint

## 1. Overview

**NetStats Live** is a real-time netball statistics tracking application designed for coaches, players, and statisticians. It provides a fast, accurate, and intuitive tool for recording, viewing, and analyzing netball game statistics in real-time.

## 2. Core Features

### Implemented

*   **Game Setup Wizard**: A guided process to configure new games.
*   **Team & Player Management**: Functionality to create, manage, and view team rosters.
*   **Venue Management**: Functionality to create and manage game and training venues.
*   **Competition Management**: Functionality to create and manage seasons and tournaments.
*   **Live Game Tracking**: Real-time scoreboard, game clock, and stat entry.
*   **Data Persistence**: Game data is saved locally using the browser's `localStorage`.
*   **Multi-select rows**: in the tables on the Teams, Venues, and Competitions pages.

### In Progress & Future

*   **AI-Powered Game Analytics**: A "parked" feature that uses Google's Generative AI (via Genkit) to generate narrative summaries and performance insights from game data.
*   **Cloud Sync & Collaboration**: A major future phase to move from a local, single-user app to a collaborative, multi-device platform with user authentication (Firebase Auth) and a cloud database (Firestore).
*   **Advanced Player Profiles**: To track career stats and performance trends.
*   **Data Export**: To export game data to CSV or PDF.

## 3. Design & Styling

*   **UI Framework**: `shadcn/ui` built on **Tailwind CSS**.
*   **Layout**: The application features a responsive layout with both table and card views for Teams, Venues, and Competitions.
*   **Interactivity**: Includes interactive elements like:
    *   **Favorite button**: Toggle the "favorite" status of teams, venues, and competitions.
    *   **Multi-select checkboxes**: In all tables for row selection.
    *   **Dropdown menus**: For actions like editing and deleting items.
    *   **Drag-and-drop reordering**: In all tables for reordering rows.

## 4. Change Log

### Session 1

*   **Added multi-select functionality**: Added a checkbox column to the tables on the Teams, Venues, and Competitions pages to allow for multiple row selection, consistent with the dashboard table.
*   **Fixed "favorite" status bug**: Corrected an issue where the "favorite" status was not being saved correctly when creating new teams, venues, or competitions.
*   **Corrected typo**: Fixed a typo in the `AlertDialogDescription` component on the `teams` page.
*   **Improved table UI**: Moved the drag handle for reordering rows to the end of the row in the Teams, Venues, and Competitions tables for better usability and consistency with the dashboard.

### Session 2

*   **Fixed Checkbox Alignment**: Addressed a visual bug where checkboxes in the data tables for Teams, Competitions, and Venues were not vertically centered within their rows.
*   **Resolved Linting and Parsing Errors**: Cleaned up the codebase by fixing a critical parsing error in `src/app/venues/columns.tsx` and removing several unused `lucide-react` and `@tabler/icons-react` imports from multiple data table components, which were causing linting warnings.
*   **Improved Drag Handle Alignment**: Adjusted the vertical alignment of the drag-and-drop handle in the Teams, Competitions, and Venues tables to be perfectly centered with the selection checkbox, creating a more polished and professional UI.
*   **Corrected `className` Typo**: Fixed a typo where `classNamen` was used instead of `className` in the `MoreHorizontal` icon within the venues table, which was causing a React warning.
*   **Fixed Responsive Table Column Spacing**: Re-applied a fixed `size` to the drag-handle and checkbox columns in the Teams, Venues, and Competitions tables. This prevents them from expanding on larger screen sizes and resolves the unwanted spacing issue.
*   **Refined Column Sizing**: Adjusted the `size` of the `drag-handle` column to `10` in all tables for a more compact and balanced layout.
