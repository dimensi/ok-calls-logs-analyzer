import type { LogEntry, LogEntryInternal } from '../types';
import { generateUUID, generateUUIDs } from './uuid';

/**
 * Process logs with optimization for large datasets
 * Uses batch UUID generation and chunked processing
 */
export class LogProcessor {
  private static readonly CHUNK_SIZE = 1000; // Process in chunks of 1000 items

  /**
   * Convert LogEntry array to LogEntryInternal array with optimization
   * @param logs Array of LogEntry to process
   * @returns Promise<LogEntryInternal[]> for large datasets, LogEntryInternal[] for small ones
   */
  static processLogs(
    logs: LogEntry[]
  ): LogEntryInternal[] | Promise<LogEntryInternal[]> {
    // For small datasets, process synchronously
    if (logs.length <= this.CHUNK_SIZE) {
      return this.processLogsSync(logs);
    }

    // For large datasets, process asynchronously in chunks
    return this.processLogsAsync(logs);
  }

  /**
   * Synchronous processing for small datasets
   */
  private static processLogsSync(logs: LogEntry[]): LogEntryInternal[] {
    const uuids = generateUUIDs(logs.length);

    return logs.map((log, index) => ({
      key: uuids[index],
      l: log.l,
      h: log.h,
      d: log.d,
    }));
  }

  /**
   * Asynchronous processing for large datasets
   * Uses chunked processing to avoid blocking the main thread
   */
  private static async processLogsAsync(
    logs: LogEntry[]
  ): Promise<LogEntryInternal[]> {
    const result: LogEntryInternal[] = new Array(logs.length);
    const totalChunks = Math.ceil(logs.length / this.CHUNK_SIZE);

    for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
      const startIndex = chunkIndex * this.CHUNK_SIZE;
      const endIndex = Math.min(startIndex + this.CHUNK_SIZE, logs.length);
      const chunk = logs.slice(startIndex, endIndex);

      // Generate UUIDs for this chunk
      const uuids = generateUUIDs(chunk.length);

      // Process chunk
      for (let i = 0; i < chunk.length; i++) {
        const log = chunk[i];
        result[startIndex + i] = {
          key: uuids[i],
          l: log.l,
          h: log.h,
          d: log.d,
        };
      }

      // Yield control to the browser to prevent blocking
      if (chunkIndex < totalChunks - 1) {
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
    }

    return result;
  }

  /**
   * Convert single LogEntry to LogEntryInternal
   */
  static processSingleLog(log: LogEntry): LogEntryInternal {
    return {
      key: generateUUID(),
      l: log.l,
      h: log.h,
      d: log.d,
    };
  }
}
