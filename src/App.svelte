<script lang="ts">
  import type { LogEntry, LogFilter, SortOrder } from './types';
  import FileUpload from './components/FileUpload.svelte';
  import LogControls from './components/LogControls.svelte';
  import LogDisplay from './components/LogDisplay.svelte';

  // State using Svelte 5 runes
  let currentLog = $state<LogEntry[]>([]);
  let isFileLoaded = $state(false);

  let filters = $state<LogFilter>({
    debug: true,
    log: true,
    warning: true,
    error: true
  });

  let sortOrder = $state<SortOrder>('asc');
  let searchText = $state('');

  // Derived state - automatically recalculates when dependencies change
  let filteredLog = $derived(() => {
    if (!isFileLoaded) return [];

    let result = [...currentLog];

    // Apply level filters
    result = result.filter(entry => {
      switch (entry.l) {
        case 'debug':
          return filters.debug;
        case 'log':
          return filters.log;
        case 'warn':
          return filters.warning;
        case 'error':
          return filters.error;
        default:
          return true;
      }
    });

    // Apply search filter
    if (searchText.trim()) {
      const words = searchText.trim().toLowerCase().split(' ');
      result = result.filter(entry => {
        const logStr = JSON.stringify(entry.d).toLowerCase();
        return words.every(word => logStr.includes(word));
      });
    }

    // Apply sort order
    if (sortOrder === 'desc') {
      result = result.reverse();
    }

    return result;
  });

  function handleFileLoad(logs: LogEntry[]) {
    currentLog = logs;
    isFileLoaded = true;
  }

  function handleFiltersChange(newFilters: LogFilter) {
    filters = newFilters;
  }

  function handleSortChange(newSortOrder: SortOrder) {
    sortOrder = newSortOrder;
  }

  function handleSearchChange(newSearchText: string) {
    searchText = newSearchText;
  }
</script>

<main>
  <h1>VK Calls JS SDK Logs Analyzer</h1>
  
  <FileUpload onFileLoad={handleFileLoad} />
  
  {#if isFileLoaded}
    <LogControls 
      {filters}
      {sortOrder}
      {searchText}
      onFiltersChange={handleFiltersChange}
      onSortChange={handleSortChange}
      onSearchChange={handleSearchChange}
    />
    
    <LogDisplay logs={filteredLog()} />
  {/if}
</main>

<style>
  main {
    padding: 14px;
    background: #555;
    color: #fff;
    min-height: 100vh;
    font: 12px / 24px "Space Mono", monospace;
  }

  h1 {
    margin: 0 0 20px 0;
    font-size: 18px;
    font-weight: 700;
  }
</style>
