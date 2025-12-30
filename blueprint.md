# NetStat Live Dashboard Blueprint

## Overview

NetStat Live is a modern, responsive dashboard application for managing sports-related data. It features a clean and intuitive user interface with a collapsible sidebar for easy navigation.

## Features & Design

### Layout

*   **Modern Dashboard Design:** A visually balanced layout with clean spacing and polished styles.
*   **Responsive:** Adapts to different screen sizes, working on both mobile and web.
*   **Collapsible Sidebar:** Provides easy navigation without cluttering the main content area.

### Sidebar

*   **Header:** Displays the application name, "NetStat Live", with a volleyball logo in the primary app color to the left.
*   **New Game Button:** A primary button with a circle play icon to start a new game.
*   **Navigation:** The main navigation includes the following items:
    *   **Dashboard:** The main landing page.
    *   **Analytics:** For viewing data visualizations.
    *   **Competitions:** For managing competitions.
    *   **Teams:** For managing teams.
    *   **Venues:** For managing venues with a map pin icon.
    *   **Settings:** For user and application settings.
*   **User Profile:** A user profile section is located in the sidebar footer.

### Main Content

*   **Section Cards:** Displays key metrics and information.
*   **Interactive Charts:** Provides interactive data visualizations.
*   **Data Table:** A table for displaying and managing data.
*   **Card Layout:** An alternative card-based layout for a more visual representation of data.
*   **Filtering:** Allows users to filter data by type and favorite status.
*   **Drag-and-Drop:** Enables users to reorder items in the data table.

## Current Plan: Refactor Competitions Feature & Enhance UX

*   **Objective:** To move the "competitions" feature to its own top-level route and improve the user experience with new features.
*   **Steps Taken:**
    1.  Moved the competitions pages from `src/app/dashboard/competitions` to `src/app/competitions`.
    2.  Created new `page.tsx`, `new/page.tsx`, and `[id]/edit/page.tsx` files under `src/app/competitions`.
    3.  Updated all links and redirects in the new files to point to the new `/competitions` route.
    4.  Updated the sidebar navigation to link to `/competitions`.
    5.  Deleted the old `src/app/dashboard/competitions` directory and its contents.
    6.  Updated `CompetitionContext.tsx` to ensure proper functionality with the new route.
    7.  Added a card layout option for a more visual representation of competitions.
    8.  Implemented filtering by competition type and favorite status.
    9.  Added drag-and-drop functionality to reorder competitions in the data table.
    10.  Fixed all linting errors to ensure a clean and maintainable codebase.
