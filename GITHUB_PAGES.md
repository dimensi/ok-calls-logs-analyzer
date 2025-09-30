# GitHub Pages Deployment Guide

## Настройка GitHub Pages в репозитории

### 1. Включите GitHub Pages
1. Перейдите в настройки репозитория: `Settings` → `Pages`
2. В разделе "Source" выберите **"GitHub Actions"**
3. Сохраните настройки

### 2. Проверьте permissions для GitHub Actions
1. Перейдите в `Settings` → `Actions` → `General`
2. В разделе "Workflow permissions" выберите:
   - **"Read and write permissions"**
   - Поставьте галочку "Allow GitHub Actions to create and approve pull requests"
3. Сохраните настройки

### 3. Запустите деплой
После настройки, деплой будет происходить автоматически:
- При push в ветку `main`
- Workflow находится в `.github/workflows/deploy.yml`

### 4. Проверьте результат
- Статус деплоя можно посмотреть во вкладке `Actions`
- После успешного деплоя сайт будет доступен по адресу:
  ```
  https://dimensi.github.io/ok-calls-logs-analyzer/
  ```

## Устранение проблем

### "Get Pages site failed" ошибка
Если вы видите ошибку `Get Pages site failed`, проверьте:

1. **GitHub Pages включен**: `Settings` → `Pages` → Source: "GitHub Actions"
2. **Права репозитория**: убедитесь, что у вас есть права администратора
3. **Public репозиторий**: для бесплатных аккаунтов GitHub Pages работает только с публичными репозиториями

### Проблемы с путями
Если ресурсы не загружаются:
1. Проверьте, что `base` в `vite.config.ts` настроен правильно
2. Имя репозитория должно совпадать с настройкой `base`

### Workflow не запускается
1. Проверьте, что файл `.github/workflows/deploy.yml` существует
2. Убедитесь, что в настройках Actions разрешены workflows

## Локальное тестирование production сборки

```bash
# Собрать с production настройками
NODE_ENV=production npm run build

# Проверить preview локально
npm run preview
```