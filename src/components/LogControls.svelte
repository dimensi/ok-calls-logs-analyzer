<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { LogFilter, SortOrder } from '../types';

  interface Props {
    filters: LogFilter;
    sortOrder: SortOrder;
    searchText: string;
    onFiltersChange: (filters: LogFilter) => void;
    onSortChange: (sortOrder: SortOrder) => void;
    onSearchChange: (searchText: string) => void;
    onResetExpanded?: () => void;
    children?: Snippet;
  }

  let {
    filters,
    sortOrder,
    searchText,
    onFiltersChange,
    onSortChange,
    onSearchChange,
    onResetExpanded,
    children,
  }: Props = $props();

  function handleFilterChange(level: keyof LogFilter, checked: boolean) {
    const newFilters = { ...filters, [level]: checked };
    onFiltersChange(newFilters);
  }

  function handleSortChange(event: Event) {
    const target = event.target as HTMLInputElement;
    onSortChange(target.value as SortOrder);
  }

  function handleSearchChange(event: Event) {
    const target = event.target as HTMLInputElement;
    onSearchChange(target.value);
  }
</script>

<div class="control-group control-filters">
  <div class="control">
    <input
      type="checkbox"
      id="control-debug"
      checked={filters.debug}
      onchange={(e) => handleFilterChange('debug', e.currentTarget.checked)}
    />
    <label for="control-debug">Debug</label>
  </div>

  <div class="control">
    <input
      type="checkbox"
      id="control-log"
      checked={filters.log}
      onchange={(e) => handleFilterChange('log', e.currentTarget.checked)}
    />
    <label for="control-log">Log</label>
  </div>

  <div class="control">
    <input
      type="checkbox"
      id="control-warning"
      checked={filters.warning}
      onchange={(e) => handleFilterChange('warning', e.currentTarget.checked)}
    />
    <label for="control-warning">Warning</label>
  </div>

  <div class="control">
    <input
      type="checkbox"
      id="control-error"
      checked={filters.error}
      onchange={(e) => handleFilterChange('error', e.currentTarget.checked)}
    />
    <label for="control-error">Error</label>
  </div>

  <div class="control">
    <input
      type="checkbox"
      id="control-external"
      checked={filters.external}
      onchange={(e) => handleFilterChange('external', e.currentTarget.checked)}
    />
    <label for="control-external">External Only</label>
  </div>
</div>

<div class="control-group control-right">
  {@render children?.()}

  <div class="control-sort">
    <div class="control">
      <input
        type="radio"
        id="sort-asc"
        name="sort"
        value="asc"
        checked={sortOrder === 'asc'}
        onchange={handleSortChange}
      />
      <label for="sort-asc">Старые сверху</label>
    </div>

    <div class="control">
      <input
        type="radio"
        id="sort-desc"
        name="sort"
        value="desc"
        checked={sortOrder === 'desc'}
        onchange={handleSortChange}
      />
      <label for="sort-desc">Новые сверху</label>
    </div>
  </div>

  <div class="control-search">
    <input
      type="text"
      id="search"
      placeholder="Поиск по логам..."
      autocomplete="off"
      bind:value={searchText}
      oninput={handleSearchChange}
    />
  </div>

  {#if onResetExpanded}
    <div class="control-reset">
      <button
        type="button"
        onclick={onResetExpanded}
        class="reset-button"
        title="Свернуть все развернутые строки"
      >
        Свернуть все
      </button>
    </div>
  {/if}
</div>

<style>
  .control-filters {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 8px 12px;
    background: var(--color-bg-primary);
    border-radius: 6px;
    border: 1px solid var(--color-border-muted);
    min-width: 120px;
  }

  .control-right {
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
  }

  .control-sort {
    display: flex;
    gap: 12px;
    padding: 8px 12px;
    background: var(--color-bg-primary);
    border-radius: 6px;
    border: 1px solid var(--color-border-muted);
  }

  .control-search {
    padding: 8px 12px;
    background: var(--color-bg-primary);
    border-radius: 6px;
    border: 1px solid var(--color-border-muted);
  }

  .control-reset {
    padding: 8px 12px;
    background: var(--color-bg-primary);
    border-radius: 6px;
    border: 1px solid var(--color-border-muted);
  }

  .control {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 8px;
    border-radius: 4px;
    transition: all 0.2s ease;
    white-space: nowrap;
  }

  .control:hover {
    background: var(--color-bg-hover);
  }

  input[type='checkbox'],
  input[type='radio'] {
    width: 16px;
    height: 16px;
    cursor: pointer;
    accent-color: var(--color-checkbox-accent);
    transition: all 0.2s ease;
  }

  input[type='checkbox']:hover,
  input[type='radio']:hover {
    transform: scale(1.05);
  }

  label {
    cursor: pointer;
    font-weight: 500;
    color: var(--color-text-primary);
    transition: color 0.2s ease;
    user-select: none;
    font-size: 14px;
  }

  .control:hover label {
    color: var(--color-text-primary);
  }

  /* Стили для разных уровней логов */
  .control:has(#control-debug) label {
    color: var(--color-text-light);
  }

  .control:has(#control-log) label {
    color: var(--color-log-log-accent);
  }

  .control:has(#control-warning) label {
    color: var(--color-log-warn-accent);
  }

  .control:has(#control-error) label {
    color: var(--color-log-error-accent);
  }

  .control:has(#control-external) label {
    color: var(--color-log-external-accent);
  }

  .control:has(#control-debug:checked) {
    background: rgba(108, 117, 125, 0.2);
    border: 1px solid var(--color-log-debug-border);
  }

  .control:has(#control-log:checked) {
    background: rgba(25, 135, 84, 0.2);
    border: 1px solid var(--color-log-log-border);
  }

  .control:has(#control-warning:checked) {
    background: rgba(253, 126, 20, 0.2);
    border: 1px solid var(--color-log-warn-border);
  }

  .control:has(#control-error:checked) {
    background: rgba(220, 53, 69, 0.2);
    border: 1px solid var(--color-log-error-border);
  }

  .control:has(#control-external:checked) {
    background: rgba(111, 66, 193, 0.2);
    border: 1px solid var(--color-log-external-border);
  }

  #search {
    width: 100%;
    height: 32px;
    border: 1px solid var(--color-border-muted);
    border-radius: 4px;
    outline: none;
    padding: 0 12px;
    box-sizing: border-box;
    background: var(--color-bg-primary);
    color: var(--color-text-primary);
    font-size: 14px;
    transition: all 0.2s ease;
  }

  #search:focus {
    border-color: var(--color-focus-outline);
    box-shadow: 0 0 0 2px rgba(0, 122, 204, 0.2);
  }

  #search::placeholder {
    color: var(--color-text-secondary);
  }

  .reset-button {
    width: 100%;
    height: 32px;
    border: 1px solid var(--color-border-muted);
    border-radius: 4px;
    background: var(--color-bg-primary);
    color: var(--color-text-primary);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .reset-button:hover {
    background: var(--color-bg-hover);
    border-color: var(--color-focus-outline);
  }

  .reset-button:active {
    transform: translateY(1px);
  }

  /* Адаптивность */
  @media (max-width: 768px) {
    .control-filters {
      flex-direction: row;
      flex-wrap: wrap;
      min-width: auto;
    }

    .control-right {
      gap: 8px;
    }

    .control-sort {
      flex-wrap: wrap;
    }
  }

  @media (max-width: 480px) {
    .control-filters {
      flex-direction: column;
    }

    .control-sort {
      flex-direction: column;
      gap: 6px;
    }
  }
</style>
