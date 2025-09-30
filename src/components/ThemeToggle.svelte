<script lang="ts">
  let currentTheme = $state<'light' | 'dark' | 'auto'>('auto');
  let isMounted = $state(false);

  // Инициализация темы при монтировании компонента
  $effect(() => {
    if (!isMounted) {
      // Получаем сохраненную тему из localStorage или определяем по системным настройкам
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'auto' | null;
      if (savedTheme && ['light', 'dark', 'auto'].includes(savedTheme)) {
        currentTheme = savedTheme;
      } else {
        currentTheme = 'auto';
      }
      applyTheme(currentTheme);
      isMounted = true;
    }
  });

  function applyTheme(theme: 'light' | 'dark' | 'auto') {
    const root = document.documentElement;
    
    if (theme === 'auto') {
      // Удаляем data-theme атрибут для использования системных настроек
      root.removeAttribute('data-theme');
    } else {
      // Устанавливаем конкретную тему
      root.setAttribute('data-theme', theme);
    }
    
    // Сохраняем выбор пользователя
    localStorage.setItem('theme', theme);
  }

  function handleThemeChange(theme: 'light' | 'dark' | 'auto') {
    currentTheme = theme;
    applyTheme(theme);
  }

  function getThemeIcon(theme: 'light' | 'dark' | 'auto'): string {
    switch (theme) {
      case 'light':
        return '☀️';
      case 'dark':
        return '🌙';
      case 'auto':
        return '🔄';
      default:
        return '🔄';
    }
  }
</script>

<div class="theme-toggle">
  <div class="theme-options">
    <button
      class="theme-option"
      class:active={currentTheme === 'light'}
      onclick={() => handleThemeChange('light')}
      title="Светлая тема"
    >
      <span class="theme-icon">☀️</span>
      <span class="theme-label">Светлая</span>
    </button>

    <button
      class="theme-option"
      class:active={currentTheme === 'dark'}
      onclick={() => handleThemeChange('dark')}
      title="Темная тема"
    >
      <span class="theme-icon">🌙</span>
      <span class="theme-label">Темная</span>
    </button>

    <button
      class="theme-option"
      class:active={currentTheme === 'auto'}
      onclick={() => handleThemeChange('auto')}
      title="Автоматическая тема (следует системным настройкам)"
    >
      <span class="theme-icon">🔄</span>
      <span class="theme-label">Авто</span>
    </button>
  </div>
</div>

<style>
  .theme-toggle {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .theme-options {
    display: flex;
    gap: 4px;
    padding: 4px;
    background: var(--color-bg-secondary);
    border-radius: 8px;
    border: 1px solid var(--color-border-muted);
  }

  .theme-option {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 10px;
    border: none;
    border-radius: 6px;
    background: transparent;
    color: var(--color-text-secondary);
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 12px;
    font-weight: 500;
    white-space: nowrap;
  }

  .theme-option:hover {
    background: var(--color-bg-hover);
    color: var(--color-text-primary);
  }

  .theme-option.active {
    background: var(--color-focus-outline);
    color: var(--color-text-primary);
  }

  .theme-icon {
    font-size: 14px;
    line-height: 1;
  }

  .theme-label {
    font-size: 12px;
  }

  /* Адаптивность */
  @media (max-width: 480px) {
    .theme-options {
      gap: 2px;
      padding: 2px;
    }

    .theme-option {
      padding: 4px 6px;
      gap: 4px;
    }

    .theme-label {
      display: none;
    }

    .theme-icon {
      font-size: 16px;
    }
  }
</style>
