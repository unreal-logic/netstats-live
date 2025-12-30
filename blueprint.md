# NetStat Live - Blueprint

## Overview

NetStat Live is a web application designed to provide a real-time dashboard for monitoring network and server statistics. It features a clean, modern interface with data visualizations, making it easy to track key performance indicators.

## Development Workflow

To ensure consistency, quality, and adherence to best practices, all development in this project must follow a structured, agent-based workflow. This process leverages specialized AI agents and available MCP servers to handle distinct phases of development, from requirements analysis to implementation and final review.

1.  **Analyze Requirements**: For any new feature or change, the first step is to use the **`shadcn-requirements-analyzer`** agent. This agent will break down the request into a structured list of required `shadcn/ui` components and generate a `requirements.md` file.

2.  **Research Components**: Once requirements are defined, the **`shadcn-component-researcher`** agent is used. It gathers detailed information, usage examples, and installation commands for each required component, creating a `component-research.md` file.

3.  **Implement with Builder**: With the research complete, the **`shadcn-implementation-builder`** agent generates the production-ready code. This ensures proper TypeScript, state management, validation, and adherence to `shadcn/ui` best practices.

4.  **Styling and Theming**: All styling changes, theme modifications, color palette generation, and CSS conversions will be handled programmatically using the `tailwindcss-mcp-server` tools. Direct modification of CSS files should be avoided.

5.  **Refactor and Review**: After the initial implementation, the **`code-refactorer`** and **`code-reviewer`** agents are employed. They ensure high code quality, improve maintainability, and check for any potential issues before the code is finalized.

6.  **Commit Changes**: Finally, the **`git-commit-helper`** agent is used to create clean, conventional commit messages for all changes.

This process ensures that all development is systematic, leverages the best of our tooling, and results in a high-quality, maintainable codebase.

## Implemented Features & Design

### Dashboard Implementation

- **Primary Implementation**: The core of the dashboard was built using the `@shadcn/dashboard-01` block. This provided a comprehensive starting point with a pre-built layout and all the necessary components.
- **Technology Stack**: Next.js with TypeScript and Tailwind CSS.
- **Structure**:
    - The main dashboard page is located at `app/dashboard/page.tsx`.
    - The layout is managed by `app/dashboard/layout.tsx`, which includes the `SidebarProvider`.
- **UI Components**:
    - **Navigation**: The `app-sidebar.tsx` component was updated to provide a clean and relevant navigation structure with links to "Dashboard", "Analytics", and "Settings".
    - **Header**: A `site-header.tsx` component includes a search bar and user menu.
    - **Data Display**:
        - `section-cards.tsx` displays key metrics.
        - `chart-area-interactive.tsx` provides a chart for data visualization.
        - `data-table.tsx` displays tabular data with pagination and sorting.
- **Styling & Design**:
    - **Theme**: The application has been reverted to the default Tailwind CSS theme. Future theme modifications will be handled using the `tailwindcss-mcp-server`.
    - **Icons**: `lucide-react` is used for all iconography.
    - **Component Library**: All necessary `shadcn/ui` components were automatically installed and configured by the `dashboard-01` block.

## Current Plan

### Revert to Default Theme

The immediate goal is to revert the application to its default "out of the box" theme and establish a new workflow for theme and style management.

### Steps Taken

1.  **Reverted `globals.css`**: The `src/app/globals.css` file was reverted to the default Tailwind CSS styles.
2.  **Updated `GEMINI.md`**: The `GEMINI.md` file has been updated to include instructions to use the `tailwindcss-mcp-server` for all styling and theming tasks.
3.  **Updated `blueprint.md`**: This `blueprint.md` file has been updated to reflect the new workflow and the current state of the application.

### Next Steps

1.  **Verify Theme**: Ensure the default theme is applied correctly across the application.
2.  **Await User Instruction**: Await further instructions from the user for new features or design changes, which will be implemented using the new `tailwindcss-mcp-server` workflow.
