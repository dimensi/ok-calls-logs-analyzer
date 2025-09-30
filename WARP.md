# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a **VK Calls JS SDK Logs Analyzer** - a Svelte 5 web application that parses and analyzes JSON log files from the VK Calls JavaScript SDK. The application provides filtering, searching, and visualization capabilities for debugging call-related issues.

## Development Commands

### Essential Commands

- **Start development server**: `npm run dev` (runs on port 3000)
- **Build for production**: `npm run build`
- **Preview production build**: `npm run preview`

### TypeScript Commands

- **Type checking**: `npx svelte-check --tsconfig ./tsconfig.json`
- **Watch mode type checking**: `npx svelte-check --tsconfig ./tsconfig.json --watch`

### Code Formatting Commands

- **Format all files**: `npm run format`
- **Check formatting**: `npm run format:check`

### No Test Suite

This project currently has no test configuration. When adding tests, consider using Vitest (commonly used with Vite) or Jest with Svelte Testing Library.

## Architecture Overview

### Technology Stack

- **Framework**: Svelte 5 with Runes (modern reactivity system)
- **Build Tool**: Vite
- **Language**: TypeScript with strict mode
- **Code Formatting**: Prettier with prettier-plugin-svelte
- **Styling**: Scoped CSS within components

### Key Architectural Patterns

**Svelte 5 Runes Pattern**: The codebase uses Svelte 5's new reactivity system:

- `$state()` for reactive variables
- `$derived()` for computed values
- `$props()` for component props

**Component Architecture**:

- `App.svelte` - Main application container with state management
- `components/FileUpload.svelte` - Handles JSON file parsing
- `components/LogControls.svelte` - Filter and search controls
- `components/LogDisplay.svelte` - Log visualization with expand/collapse

**State Management Pattern**: Uses a single-file state approach in `App.svelte`:

- `currentLog` - Raw parsed log entries
- `filteredLog` - Derived state that applies filters/search/sort
- Filters and controls are passed down as props to child components

### Data Flow

1. User uploads JSON file via `FileUpload`
2. File is parsed into `LogEntry[]` format
3. `App.svelte` manages the raw log data
4. `LogControls` provides filtering UI (level filters, search, sort)
5. `LogDisplay` renders the filtered results with interactive features

## Log Data Structure

The application expects JSON files containing arrays of log entries with this structure:

```typescript
interface LogEntry {
  l: LogLevel; // 'debug' | 'log' | 'warn' | 'error'
  h: string; // timestamp
  d: any[]; // data payload
}
```

## Component Interaction Patterns

**Parent-Child Communication**: Uses callback props pattern:

- Parent defines handler functions
- Children receive callbacks via props
- State updates flow upward through callbacks

**Display Logic**: `LogDisplay.svelte` uses local state (`$state()`) for UI interactions (expand/collapse) while receiving filtered data as props.

## Development Notes

### Svelte 5 Configuration

- Runes are enabled in `svelte.config.js` (`runes: true`)
- Using `vitePreprocess` for TypeScript support
- Uses modern `mount()` API instead of `new App()` for component initialization
- Modern event handlers (`onchange`, `oninput`) instead of deprecated `on:change`, `on:input`

### TypeScript Configuration

- Strict mode enabled with additional checks (noUnusedLocals, noUnusedParameters)
- Uses `@tsconfig/svelte` base configuration
- ESNext target with bundler module resolution

### File Processing Logic

The `FileUpload` component expects:

- JSON files containing nested arrays
- Uses `.flat(1)` to handle single-level nesting
- Russian error messages for user feedback

### Code Formatting Configuration

- Prettier configured with Svelte plugin support
- Uses 2-space indentation, single quotes, and trailing commas
- Automatic formatting on `npm run format`
- Format checking with `npm run format:check`

### Styling Approach

- Each component has scoped CSS
- Dark theme with monospace fonts ("Space Mono")
- Color-coded log levels (debug: gray, log: white, warn: yellow, error: red background)
