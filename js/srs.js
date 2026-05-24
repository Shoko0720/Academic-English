(function () {
  'use strict';

  function todayStr(d) {
    const date = d || new Date();
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  function daysFromToday(daysOffset) {
    const t = new Date();
    t.setDate(t.getDate() + daysOffset);
    return todayStr(t);
  }

  function defaultStats() {
    return {
      correctCount: 0,
      incorrectCount: 0,
      lowConfidenceCount: 0,
      ease: 2.5,
      interval: 0,
      repetitions: 0,
      nextReview: todayStr(),
      lastReviewed: null,
    };
  }

  // Simplified SM-2.
  // Correct + confident -> interval grows (1, 3, prev*ease), ease += 0.1 (cap 3.0)
  // Correct + low confidence -> interval clamped to [1, 2], repetitions/ease unchanged
  // Wrong -> repetitions reset, interval=1, ease -= 0.2 (floor 1.3)
  function updateOnAnswer(stats, isCorrect, lowConfidence) {
    const s = Object.assign({}, stats || defaultStats());
    s.lastReviewed = todayStr();
    if (isCorrect && lowConfidence) {
      s.correctCount = (s.correctCount || 0) + 1;
      s.lowConfidenceCount = (s.lowConfidenceCount || 0) + 1;
      // Hold the interval back so the word comes around again soon.
      const prevInterval = s.interval || 1;
      s.interval = Math.max(1, Math.min(2, prevInterval));
      // repetitions and ease intentionally unchanged: not a real progression
      s.nextReview = daysFromToday(s.interval);
    } else if (isCorrect) {
      s.correctCount = (s.correctCount || 0) + 1;
      s.repetitions = (s.repetitions || 0) + 1;
      if (s.repetitions === 1) {
        s.interval = 1;
      } else if (s.repetitions === 2) {
        s.interval = 3;
      } else {
        s.interval = Math.max(1, Math.round((s.interval || 1) * (s.ease || 2.5)));
      }
      s.ease = Math.min(3.0, (s.ease || 2.5) + 0.1);
      s.nextReview = daysFromToday(s.interval);
    } else {
      s.incorrectCount = (s.incorrectCount || 0) + 1;
      s.repetitions = 0;
      s.interval = 1;
      s.ease = Math.max(1.3, (s.ease || 2.5) - 0.2);
      s.nextReview = daysFromToday(1);
    }
    return s;
  }

  function isDue(stats, today) {
    const t = today || todayStr();
    if (!stats) return true; // never seen -> always due
    return stats.nextReview <= t;
  }

  window.SRS = { defaultStats, updateOnAnswer, isDue, todayStr, daysFromToday };
})();
