export type LogLevel = 'debug' | 'log' | 'warn' | 'error';

export interface LogEntry {
  l: LogLevel;
  h: string; // timestamp
  d: any[]; // data
}

export interface LogEntryInternal extends LogEntry {
  key: string; // unique UUID v4
}

export interface LogFilter {
  debug: boolean;
  log: boolean;
  warning: boolean;
  error: boolean;
  external: boolean;
}

export type SortOrder = 'asc' | 'desc';

// Svelte 5 runes types
export type State<T> = T;
export type Derived<T> = T;
