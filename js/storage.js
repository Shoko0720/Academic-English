(function () {
  'use strict';

  const STORAGE_KEY = 'vocab-app:progress';

  function defaultProgress() {
    return { version: 1, wordStats: {}, sessionHistory: [] };
  }

  function loadProgress() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultProgress();
      const parsed = JSON.parse(raw);
      if (!parsed.wordStats) parsed.wordStats = {};
      if (!parsed.sessionHistory) parsed.sessionHistory = [];
      return parsed;
    } catch (e) {
      console.warn('Failed to load progress, resetting:', e);
      return defaultProgress();
    }
  }

  function saveProgress(progress) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.error('Failed to save progress:', e);
    }
  }

  function recordSession(progress, answered, correct) {
    const today = window.SRS.todayStr();
    progress.sessionHistory.push({ date: today, answered, correct });
    if (progress.sessionHistory.length > 500) {
      progress.sessionHistory = progress.sessionHistory.slice(-500);
    }
  }

  function clearAllProgress() {
    localStorage.removeItem(STORAGE_KEY);
  }

  window.VocabStorage = {
    loadProgress,
    saveProgress,
    recordSession,
    clearAllProgress,
    defaultProgress,
  };
})();
