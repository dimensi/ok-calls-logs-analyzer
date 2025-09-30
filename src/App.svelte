<script lang="ts">
  import type {
    LogEntry,
    LogEntryInternal,
    LogFilter,
    SortOrder,
  } from './types';
  import FileUpload from './components/FileUpload.svelte';
  import LogControls from './components/LogControls.svelte';
  import LogDisplay from './components/LogDisplay.svelte';
  import FileName from './components/FileName.svelte';
  import { LogProcessor } from './utils/logProcessor';

  let currentLog = $state<LogEntryInternal[]>([]);
  let isFileLoaded = $state(false);
  let selectedFileName = $state<string | null>(null);
  let isProcessing = $state(false);

  let filters = $state<LogFilter>({
    debug: true,
    log: true,
    warning: true,
    error: true,
    external: false,
  });

  let sortOrder = $state<SortOrder>('asc');
  let searchText = $state('');

  let filteredLog = $derived.by(() => {
    if (!isFileLoaded) return [];

    let result = [...currentLog];

    // Apply level filters
    result = result.filter((entry) => {
      switch (entry.l.toLowerCase()) {
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

    // Apply external filter
    if (filters.external) {
      result = result.filter((entry) => {
        const logStr = JSON.stringify(entry.d);
        return logStr.includes('[external]');
      });
    }

    // Apply search filter
    if (searchText.trim()) {
      const words = searchText.trim().toLowerCase().split(' ');
      result = result.filter((entry) => {
        const logStr = JSON.stringify(entry.d).toLowerCase();
        return words.every((word) => logStr.includes(word));
      });
    }

    // Apply sort order
    if (sortOrder === 'desc') {
      result = result.reverse();
    }

    return result;
  });

  async function handleFileLoad(logs: LogEntry[]) {
    isProcessing = true;
    isFileLoaded = false;

    try {
      const processedLogs = LogProcessor.processLogs(logs);

      if (processedLogs instanceof Promise) {
        // Large dataset - process asynchronously
        currentLog = await processedLogs;
      } else {
        // Small dataset - processed synchronously
        currentLog = processedLogs;
      }

      isFileLoaded = true;
    } catch (error) {
      console.error('Error processing logs:', error);
      // Fallback to original logs without IDs
      currentLog = logs.map((log) => LogProcessor.processSingleLog(log));
      isFileLoaded = true;
    } finally {
      isProcessing = false;
    }
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
  <header>
    <h1>VK Calls JS SDK Logs Analyzer</h1>

    <div class="controls">
      <FileUpload onFileLoad={handleFileLoad} bind:selectedFileName />

      {#if isFileLoaded}
        <LogControls
          {filters}
          {sortOrder}
          {searchText}
          onFiltersChange={handleFiltersChange}
          onSortChange={handleSortChange}
          onSearchChange={handleSearchChange}
        >
          {#if selectedFileName}
            <FileName {selectedFileName} />
          {/if}
        </LogControls>
      {/if}
    </div>
  </header>

  {#if isProcessing}
    <div class="processing-indicator">
      <div class="spinner"></div>
      <span>Обработка логов...</span>
    </div>
  {:else if isFileLoaded}
    <div class="log-display">
      <LogDisplay logs={filteredLog} />
    </div>
  {/if}
</main>

<style>
  main {
    padding: 14px 14px;
    background: #555;
    color: #fff;
    min-height: 100vh;
    font-family:
      system-ui, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
  }

  h1 {
    margin: 0 0 20px 0;
    font-size: 18px;
    font-weight: 700;
  }

  .controls {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    margin: 12px 0;
    padding: 12px;
    background: #f8f9fa;
    border-radius: 8px;
    border: 1px solid #dee2e6;
  }

  /* Адаптивность */
  @media (max-width: 768px) {
    .controls {
      flex-direction: column;
      gap: 12px;
    }
  }

  @media (max-width: 480px) {
    .controls {
      margin: 8px 0;
      padding: 8px;
    }
  }

  .processing-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 40px;
    background: #444;
    border-radius: 8px;
    margin-top: 10px;
    color: #fff;
    font-size: 16px;
  }

  .spinner {
    width: 24px;
    height: 24px;
    border: 3px solid #666;
    border-top: 3px solid #007acc;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
