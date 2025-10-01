<script lang="ts">
  import { VList, type VListHandle } from 'virtua/svelte';
  import type { LogEntryInternal } from '../types';
  import { SvelteSet } from 'svelte/reactivity';

  interface Props {
    logs: LogEntryInternal[];
    searchText?: string;
    searchMode?: 'text' | 'regex';
  }

  let { logs, searchText = '', searchMode = 'text' }: Props = $props();
  let internalLogs = $state.raw<LogEntryInternal[]>(logs);
  let list = $state<VListHandle>();
  // State for expanded lines
  let expandedLines = new SvelteSet<string>();

  function logToString(log: any[], expand = false): string {
    return log
      .map((item) => {
        if (typeof item === 'string' || typeof item === 'number') {
          return item;
        }
        return JSON.stringify(item, null, expand ? 2 : undefined);
      })
      .join(' ');
  }

  function highlightText(text: string, searchText: string, searchMode: 'text' | 'regex'): string {
    if (!searchText.trim()) return text;

    try {
      let regex: RegExp;
      
      if (searchMode === 'regex') {
        regex = new RegExp(`(${searchText.trim()})`, 'gi');
      } else {
        // Экранируем специальные символы для обычного текстового поиска
        const escapedText = searchText.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        regex = new RegExp(`(${escapedText})`, 'gi');
      }

      return text.replace(regex, '<mark class="search-highlight">$1</mark>');
    } catch {
      // Если regex некорректный, возвращаем исходный текст
      return text;
    }
  }

  function toggleExpand(logEntryKey: string) {
    if (expandedLines.has(logEntryKey)) {
      expandedLines.delete(logEntryKey);
    } else {
      expandedLines.add(logEntryKey);
    }
  }

  export function resetExpanded() {
    expandedLines.clear();
  }

  // Calculate item height based on content
  function getItemHeight(logEntry: LogEntryInternal): number {
    const isExpandedLine = expandedLines.has(logEntry.key);
    const content = logToString(logEntry.d, isExpandedLine);

    // Базовая высота для времени + отступы
    const baseHeight = 24;

    if (isExpandedLine) {
      // Для раскрытых строк считаем количество строк по количеству \n
      const lineCount = content.split('\n').length + 2;
      // 20px на строку + небольшой отступ
      return Math.max(baseHeight, lineCount * 20 + 8);
    } else {
      // Для свернутых строк — чуть выше, если длинный текст
      if (content.length > 100) {
        return baseHeight + 4;
      }
      return baseHeight;
    }
  }

  function restoreScrollPosition() {
    const index = internalLogs.findIndex(
      (log) => log.key === [...expandedLines.values()].at(-1)
    );

    if (index !== -1) {
      list?.scrollToIndex(index);
    }
  }

  $effect(() => {
    if (internalLogs !== logs) {
      internalLogs = logs;
      if (expandedLines.size > 0) {
        setTimeout(restoreScrollPosition, 50);
      }
    }
  });
</script>

<div class="result-wrap">
  {#if internalLogs.length > 0}
    <VList
      bind:this={list}
      data={internalLogs}
      style="height: 100%; width: 100%;"
      getKey={(logEntry) => {
        try {
          return logEntry.key;
        } catch {
          return Math.random().toString(36).substring(2, 15);
        }
      }}
    >
      {#snippet children(logEntry)}
        {#if logEntry}
          <div
            class="line level-{logEntry.l.toLowerCase()}"
            class:wrap={expandedLines.has(logEntry.key)}
            onclick={() => toggleExpand(logEntry.key)}
            role="button"
            tabindex="0"
            onkeydown={(e) => e.key === 'Enter' && toggleExpand(logEntry.key)}
            style="height: {getItemHeight(logEntry)}px;"
          >
            <div class="line-time">{logEntry.h}</div>
            <div class="line-data">
              {@html highlightText(logToString(logEntry.d, expandedLines.has(logEntry.key)), searchText, searchMode)}
            </div>
          </div>
        {/if}
      {/snippet}
    </VList>
  {/if}
</div>

<style>
  .result-wrap {
    background: var(--color-bg-secondary);
    margin-top: 10px;
    min-height: 400px;
    height: calc(100vh - 300px);
    font:
      12px / 24px 'Space Mono',
      monospace;
  }

  .line {
    display: flex;
    border-bottom: 1px dotted var(--color-border-muted);
    cursor: pointer;
    transition: background-color 0.2s;
    padding: 2px 5px;
    box-sizing: border-box;
    width: 100%;
  }

  .line:hover {
    background-color: var(--color-bg-hover);
  }

  .line:focus {
    outline: 2px solid var(--color-focus-outline);
    outline-offset: -2px;
  }

  .level-debug {
    color: var(--color-log-debug);
  }

  .level-log {
    color: var(--color-log-log);
  }

  .level-warn {
    color: var(--color-log-warn);
  }

  .level-error {
    background: var(--color-log-error-bg);
  }

  .line-time {
    color: var(--color-text-secondary);
    white-space: nowrap;
    width: 200px;
    flex-shrink: 0;
  }

  .line-data {
    white-space: nowrap;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .line.wrap {
    background-color: var(--color-bg-hover);
  }

  .line.wrap .line-data {
    white-space: pre-wrap;
    word-break: break-all;
    overflow: visible;
    text-overflow: unset;
  }

  :global(.search-highlight) {
    background-color: var(--color-search-highlight-bg, #ffeb3b);
    color: var(--color-search-highlight-text, #000);
    padding: 1px 2px;
    border-radius: 2px;
    font-weight: 600;
  }
</style>
