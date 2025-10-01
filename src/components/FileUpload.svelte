<script lang="ts">
  import type { LogEntry } from '../types';
  interface Props {
    onFileLoad: (logs: LogEntry[]) => void;
    selectedFileName: string | null;
  }

  let { onFileLoad, selectedFileName = $bindable(null) }: Props = $props();

  let isDragOver = $state(false);
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
    background: var(--color-drag-overlay);
    backdrop-filter: blur(4px);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: fadeIn 0.2s ease-out;
  }

  .drag-message {
    text-align: center;
    color: var(--color-drag-text);
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
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  /* Компактное поле загрузки */
  .file-upload {
    border: 2px dashed var(--color-border-muted);
    border-radius: 8px;
    padding: 12px 16px;
    cursor: pointer;
    transition: all 0.3s ease;
    background: var(--color-bg-secondary);
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-width: 200px;
  }

  .file-upload:hover {
    border-color: var(--color-focus-outline);
    background: var(--color-bg-primary);
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 122, 204, 0.3);
  }

  .file-upload:focus {
    outline: none;
    border-color: var(--color-focus-outline);
    box-shadow: 0 0 0 3px rgba(0, 122, 204, 0.2);
  }

  .upload-content {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .upload-icon {
    color: var(--color-text-secondary);
    transition: color 0.3s ease;
  }

  .file-upload:hover .upload-icon {
    color: var(--color-focus-outline);
  }

  .upload-text {
    font-size: 14px;
    font-weight: 500;
    color: var(--color-text-primary);
  }

  .file-upload:hover .upload-text {
    color: var(--color-focus-outline);
  }
</style>
