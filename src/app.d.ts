// Global type definitions for Svelte 5
declare global {
  namespace svelte.JSX {
    interface HTMLAttributes<T> {
      onclick?: (event: MouseEvent) => void;
      onkeydown?: (event: KeyboardEvent) => void;
    }
  }
}

export {};
