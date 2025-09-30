<script lang="ts">
  import { VList, type VListHandle } from 'virtua/svelte';
  import type { LogEntryInternal } from '../types';
  import { SvelteSet } from 'svelte/reactivity';

  interface Props {
    logs: LogEntryInternal[];
  }

  let { logs }: Props = $props();
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

  function toggleExpand(logEntryKey: string) {
    if (expandedLines.has(logEntryKey)) {
      expandedLines.delete(logEntryKey);
    } else {
      expandedLines.add(logEntryKey);
    }
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
      getKey={(logEntry) => logEntry.key}
    >
      {#snippet children(logEntry)}
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
            {logToString(logEntry.d, expandedLines.has(logEntry.key))}
          </div>
        </div>
      {/snippet}
    </VList>
  {/if}
</div>

<style>
  .result-wrap {
    background: #444;
    margin-top: 10px;
    min-height: 400px;
    height: calc(100vh - 300px);
    font:
      12px / 24px 'Space Mono',
      monospace;
  }

  .line {
    display: flex;
    border-bottom: 1px dotted #747474;
    cursor: pointer;
    transition: background-color 0.2s;
    padding: 2px 5px;
    box-sizing: border-box;
    width: 100%;
  }

  .line:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }

  .line:focus {
    outline: 2px solid #007acc;
    outline-offset: -2px;
  }

  .level-debug {
    color: #b8b8b8;
  }

  .level-log {
    color: #fff;
  }

  .level-warn {
    color: #ffbd00;
  }

  .level-error {
    background: #a40000;
  }

  .line-time {
    color: #bbb;
    white-space: nowrap;
    width: 200px;
    flex-shrink: 0;
    font-family: 'Courier New', monospace;
    font-size: 12px;
  }

  .line-data {
    white-space: nowrap;
    flex: 1;
    font-family: 'Courier New', monospace;
    font-size: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .line.wrap .line-data {
    white-space: pre-wrap;
    word-break: break-all;
    overflow: visible;
    text-overflow: unset;
  }
</style>
