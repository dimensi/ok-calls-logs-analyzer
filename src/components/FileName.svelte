<script lang="ts">
  interface Props {
    selectedFileName: string;
  }

  let { selectedFileName }: Props = $props();
</script>

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

<style>
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
