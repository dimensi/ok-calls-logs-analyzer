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
  import ThemeToggle from './components/ThemeToggle.svelte';
  import { LogProcessor } from './utils/logProcessor';

  let currentLog = $state.raw<LogEntryInternal[]>([]);
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
  let logDisplayRef = $state<LogDisplay | undefined>(undefined);

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

  function handleResetExpanded() {
    if (logDisplayRef) {
      logDisplayRef.resetExpanded();
    }
  }
</script>

<main>
  <header>
    <div class="header-top">
      <h1>VK Calls JS SDK Logs Analyzer</h1>
      <ThemeToggle />
    </div>

    <div class="controls" class:controls--center={!selectedFileName}>
      <FileUpload onFileLoad={handleFileLoad} bind:selectedFileName />

      {#if isFileLoaded}
        <LogControls
          {filters}
          {sortOrder}
          {searchText}
          onFiltersChange={handleFiltersChange}
          onSortChange={handleSortChange}
          onSearchChange={handleSearchChange}
          onResetExpanded={handleResetExpanded}
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
      <LogDisplay logs={filteredLog} bind:this={logDisplayRef} />
    </div>
  {/if}
</main>

<style>
  main {
    padding: 14px 14px;
    background: var(--color-bg-primary);
    color: var(--color-text-primary);
    min-height: 100vh;
    font-family:
      system-ui, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
  }

  .header-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  h1 {
    margin: 0;
    font-size: 18px;
    font-weight: 700;
  }

  .controls {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    margin: 12px 0;
    padding: 12px;
    background: var(--color-bg-secondary);
    border-radius: 8px;
    border: 1px solid var(--color-border-muted);
  }

  .controls--center {
    justify-content: center;
  }

  /* Адаптивность */
  @media (max-width: 768px) {
    .header-top {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
    }

    .controls {
      flex-direction: column;
      gap: 12px;
    }
  }

  @media (max-width: 480px) {
    .header-top {
      margin-bottom: 16px;
    }

    h1 {
      font-size: 16px;
    }

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
    background: var(--color-bg-secondary);
    border-radius: 8px;
    margin-top: 10px;
    color: var(--color-text-primary);
    font-size: 16px;
  }

  .spinner {
    width: 24px;
    height: 24px;
    border: 3px solid var(--color-spinner-bg);
    border-top: 3px solid var(--color-spinner-active);
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
