<script lang="ts">
  import type { LogFilter, SortOrder } from '../types';

  interface Props {
    filters: LogFilter;
    sortOrder: SortOrder;
    searchText: string;
    onFiltersChange: (filters: LogFilter) => void;
    onSortChange: (sortOrder: SortOrder) => void;
    onSearchChange: (searchText: string) => void;
  }

  let { filters, sortOrder, searchText, onFiltersChange, onSortChange, onSearchChange }: Props = $props();

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

<div class="controls">
  <div class="control-group">
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
  </div>

  <div class="control-group control-sort">
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

  <div class="control-group control-filter">
    <input 
      type="text" 
      id="search" 
      placeholder="Введите текст, нажмите Enter" 
      autocomplete="off"
      bind:value={searchText}
      oninput={handleSearchChange}
    />
  </div>
</div>

<style>
  .controls {
    display: flex;
    flex-wrap: wrap;
    margin: 10px 0;
    gap: 10px;
  }

  .control-group {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  .control-sort {
    flex-basis: 100%;
  }

  .control {
    display: flex;
    align-items: center;
    gap: 5px;
  }

  input[type="checkbox"], 
  input[type="radio"], 
  label {
    cursor: pointer;
  }

  #search {
    width: 400px;
    border: 1px solid #ccc;
    height: 24px;
    border-radius: 4px;
    outline: none;
    padding: 0 5px;
    box-sizing: border-box;
    background: #fff;
    color: #000;
  }
</style>
