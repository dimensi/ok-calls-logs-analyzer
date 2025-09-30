<script lang="ts">
  import type { LogEntry } from '../types';

  interface Props {
    logs: LogEntry[];
  }

  let { logs }: Props = $props();

  // State for expanded lines
  let expandedLines = $state<Set<number>>(new Set());

  function logToString(log: any[], expand = false): string {
    return log.map((item) => {
      if (typeof item === 'string' || typeof item === 'number') {
        return item;
      }
      return JSON.stringify(item, null, expand ? 2 : undefined);
    }).join(' ');
  }

  function toggleExpand(index: number) {
    if (expandedLines.has(index)) {
      expandedLines.delete(index);
    } else {
      expandedLines.add(index);
    }
    // Trigger reactivity
    expandedLines = new Set(expandedLines);
  }

  function isExpanded(index: number): boolean {
    return expandedLines.has(index);
  }
</script>

  <div class="result-wrap">
    <div class="result">
      {#each logs as logEntry, index (index)}
        <div 
          class="line level-{logEntry.l.toLowerCase()}"
          class:wrap={isExpanded(index)}
          onclick={() => toggleExpand(index)}
          role="button"
          tabindex="0"
          onkeydown={(e) => e.key === 'Enter' && toggleExpand(index)}
        >
          <div class="line-time">{logEntry.h}</div>
          <div class="line-data">{logToString(logEntry.d, isExpanded(index))}</div>
        </div>
      {/each}
    </div>
  </div>

<style>
  .result-wrap {
    overflow-x: auto;
    padding: 3px 5px;
    background: #444;
    margin-top: 10px;
  }

  .result {
    color: #fff;
    display: flex;
    flex-direction: column;
    width: fit-content;
    min-width: 100%;
    min-height: 100px;
    box-sizing: border-box;
  }

  .line {
    display: flex;
    border-bottom: 1px dotted #747474;
    cursor: pointer;
    transition: background-color 0.2s;
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
  }

  .line-data {
    white-space: nowrap;
    flex: 1;
  }

  .line.wrap .line-data {
    white-space: pre;
    width: calc(100vw - 238px);
  }
</style>
