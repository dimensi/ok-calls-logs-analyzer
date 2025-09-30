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
    children?: Snippet;
  }

  let {
    filters,
    sortOrder,
    searchText,
    onFiltersChange,
    onSortChange,
    onSearchChange,
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
</div>

<style>
  .control-filters {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 8px 12px;
    background: #ffffff;
    border-radius: 6px;
    border: 1px solid #e9ecef;
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
    background: #ffffff;
    border-radius: 6px;
    border: 1px solid #e9ecef;
  }

  .control-search {
    padding: 8px 12px;
    background: #ffffff;
    border-radius: 6px;
    border: 1px solid #e9ecef;
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
    background: #f8f9fa;
  }

  input[type='checkbox'],
  input[type='radio'] {
    width: 16px;
    height: 16px;
    cursor: pointer;
    accent-color: #0d6efd;
    transition: all 0.2s ease;
  }

  input[type='checkbox']:hover,
  input[type='radio']:hover {
    transform: scale(1.05);
  }

  label {
    cursor: pointer;
    font-weight: 500;
    color: #495057;
    transition: color 0.2s ease;
    user-select: none;
    font-size: 14px;
  }

  .control:hover label {
    color: #0d6efd;
  }

  /* Стили для разных уровней логов */
  .control:has(#control-debug) label {
    color: #6c757d;
  }

  .control:has(#control-log) label {
    color: #198754;
  }

  .control:has(#control-warning) label {
    color: #fd7e14;
  }

  .control:has(#control-error) label {
    color: #dc3545;
  }

  .control:has(#control-external) label {
    color: #6f42c1;
  }

  .control:has(#control-debug:checked) {
    background: #f8f9fa;
    border: 1px solid #6c757d;
  }

  .control:has(#control-log:checked) {
    background: #d1e7dd;
    border: 1px solid #198754;
  }

  .control:has(#control-warning:checked) {
    background: #fff3cd;
    border: 1px solid #fd7e14;
  }

  .control:has(#control-error:checked) {
    background: #f8d7da;
    border: 1px solid #dc3545;
  }

  .control:has(#control-external:checked) {
    background: #e2d9f3;
    border: 1px solid #6f42c1;
  }

  #search {
    width: 100%;
    height: 32px;
    border: 1px solid #e9ecef;
    border-radius: 4px;
    outline: none;
    padding: 0 12px;
    box-sizing: border-box;
    background: #ffffff;
    color: #495057;
    font-size: 14px;
    transition: all 0.2s ease;
  }

  #search:focus {
    border-color: #0d6efd;
    box-shadow: 0 0 0 2px rgba(13, 110, 253, 0.1);
  }

  #search::placeholder {
    color: #6c757d;
    font-style: italic;
  }

  /* Адаптивность */
  @media (max-width: 768px) {
    .controls {
      flex-direction: column;
      gap: 12px;
    }

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
    .controls {
      margin: 8px 0;
      padding: 8px;
    }

    .control-filters {
      flex-direction: column;
    }

    .control-sort {
      flex-direction: column;
      gap: 6px;
    }
  }
</style>
