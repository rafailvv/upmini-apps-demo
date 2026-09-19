const STAGES = [
  'Загружаем интерфейс',
  'Подключаем Telegram',
  'Подготавливаем каталог',
  'Открываем выбранное приложение',
  'Приложение готово',
] as const;

export function setStartupStage(stage: number): void {
  const safeStage = Math.max(0, Math.min(stage, STAGES.length - 1));
  const loader = document.getElementById('startup-loader');
  const status = document.getElementById('startup-status');
  const progress = document.getElementById('startup-progress');
  if (status) status.textContent = STAGES[safeStage];
  if (progress) {
    const value = Math.round(((safeStage + 1) / STAGES.length) * 100);
    progress.style.width = `${value}%`;
    progress.setAttribute('aria-valuenow', String(value));
  }
  if (loader) loader.dataset.stage = String(safeStage);
}

export function finishStartup(): void {
  setStartupStage(STAGES.length - 1);
  window.setTimeout(() => {
    const loader = document.getElementById('startup-loader');
    loader?.classList.add('startup-loader--hide');
    window.setTimeout(() => loader?.remove(), 220);
  }, 120);
}
