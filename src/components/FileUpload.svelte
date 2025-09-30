<script lang="ts">
  import type { LogEntry } from "../types";

  interface Props {
    onFileLoad: (logs: LogEntry[]) => void;
  }

  let { onFileLoad }: Props = $props();

  async function handleFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (!file) return;

    try {
      const content = await file.text();
      const data = JSON.parse(content);
      const logs: LogEntry[] = data.flat(1);
      onFileLoad(logs);
    } catch (err) {
      target.value = "";
      alert("Не удалось распарсить файл, возможно, он повреждён");
    }
  }
</script>

<div class="file-upload">
  <label for="file">Выберите лог-файл</label>
  <input
    type="file"
    id="file"
    accept="application/json"
    onchange={handleFileChange}
  />
</div>

<style>
  .file-upload {
    margin-bottom: 20px;
  }

  .file-upload label {
    display: block;
    margin-bottom: 5px;
    cursor: pointer;
  }

  .file-upload input[type="file"] {
    cursor: pointer;
  }
</style>
