<script lang="ts">
  import type { LogEntry } from '../types';

  interface Props {
    onFileLoad: (logs: LogEntry[]) => void;
  }

  let { onFileLoad }: Props = $props();

  let isDragOver = $state(false);
  let selectedFileName = $state<string | null>(null);
  let fileInput: HTMLInputElement;

  async function processFile(file: File | null | undefined) {
    if (!file) return;

    try {
      const content = await file.text();
      const data = JSON.parse(content);
      const logs: LogEntry[] = data.flat(1);
      selectedFileName = file.name;
      onFileLoad(logs);
    } catch (err) {
      alert('Не удалось распарсить файл, возможно, он повреждён');
    }
  }

  function handleFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (file) {
      processFile(file);
      // Очищаем input для возможности повторной загрузки того же файла
      target.value = '';
    }
  }

  function handleDragOver(event: DragEvent) {
    event.preventDefault();
    isDragOver = true;
  }

  function handleDragLeave(event: DragEvent) {
    event.preventDefault();
    // Проверяем, что мы действительно покинули область
    const currentTarget = event.currentTarget as HTMLElement;
    if (!currentTarget.contains(event.relatedTarget as Node)) {
      isDragOver = false;
    }
  }

  function handleDrop(event: DragEvent) {
    event.preventDefault();
    isDragOver = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  }

  function handleClick() {
    fileInput.click();
  }

  // Глобальные обработчики для полноэкранной подсветки
  function handleGlobalDragOver(event: DragEvent) {
    event.preventDefault();
    isDragOver = true;
  }

  function handleGlobalDragLeave(event: DragEvent) {
    event.preventDefault();
    // Проверяем, что мы покинули окно браузера
    if (!event.relatedTarget) {
      isDragOver = false;
    }
  }

  function handleGlobalDrop(event: DragEvent) {
    event.preventDefault();
    isDragOver = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  }
</script>

<!-- Глобальные обработчики drag and drop -->
<svelte:window
  ondragover={handleGlobalDragOver}
  ondragleave={handleGlobalDragLeave}
  ondrop={handleGlobalDrop}
/>

<!-- Полноэкранная подсветка при drag over -->
{#if isDragOver}
  <div class="drag-overlay">
    <div class="drag-message">
      <div class="drag-icon">
        <svg
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7,10 12,15 17,10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      </div>
      <h2>Отпустите файл для загрузки</h2>
    </div>
  </div>
{/if}

<div class="file-upload-container">
  <div
    class="file-upload"
    ondragover={handleDragOver}
    ondragleave={handleDragLeave}
    ondrop={handleDrop}
    onclick={handleClick}
    role="button"
    tabindex="0"
    onkeydown={(e) => e.key === 'Enter' && handleClick()}
  >
    <div class="upload-content">
      <div class="upload-icon">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7,10 12,15 17,10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      </div>
      <span class="upload-text">Выберите файл</span>
    </div>
  </div>

  {#if selectedFileName}
    <div class="selected-file">
      <div class="file-info">
        <div class="file-icon">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
            />
            <polyline points="14,2 14,8 20,8" />
          </svg>
        </div>
        <span class="file-name"> {selectedFileName}</span>
      </div>
    </div>
  {/if}

  <input
    bind:this={fileInput}
    type="file"
    accept="application/json"
    onchange={handleFileChange}
    style="display: none;"
  />
</div>

<style>
  /* Полноэкранная подсветка при drag over */
  .drag-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(16, 185, 129, 0.1);
    backdrop-filter: blur(4px);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: fadeIn 0.2s ease-out;
  }

  .drag-message {
    text-align: center;
    color: #10b981;
  }

  .drag-icon {
    margin-bottom: 16px;
    animation: bounce 0.6s ease-in-out infinite;
  }

  .drag-message h2 {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes bounce {
    0%,
    20%,
    50%,
    80%,
    100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-10px);
    }
    60% {
      transform: translateY(-5px);
    }
  }

  /* Контейнер для загрузки файлов */
  .file-upload-container {
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  /* Компактное поле загрузки */
  .file-upload {
    border: 2px dashed #d1d5db;
    border-radius: 8px;
    padding: 12px 16px;
    cursor: pointer;
    transition: all 0.3s ease;
    background: #f9fafb;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-width: 200px;
  }

  .file-upload:hover {
    border-color: #3b82f6;
    background: #eff6ff;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.15);
  }

  .file-upload:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  .upload-content {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .upload-icon {
    color: #6b7280;
    transition: color 0.3s ease;
  }

  .file-upload:hover .upload-icon {
    color: #3b82f6;
  }

  .upload-text {
    font-size: 14px;
    font-weight: 500;
    color: #374151;
  }

  .file-upload:hover .upload-text {
    color: #3b82f6;
  }

  /* Отображение выбранного файла */
  .selected-file {
    margin-top: 12px;
    padding: 8px 12px;
    background: #f0f9ff;
    border: 1px solid #0ea5e9;
    border-radius: 6px;
    display: inline-block;
  }

  .file-info {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .file-icon {
    color: #0ea5e9;
    flex-shrink: 0;
  }

  .file-name {
    font-size: 13px;
    font-weight: 500;
    color: #0c4a6e;
  }
</style>
