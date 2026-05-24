(function () {
  'use strict';

  function countDueToday(progress) {
    const today = window.SRS.todayStr();
    let due = 0;
    let total = 0;
    let unseen = 0;
    for (const sheet of window.VOCAB_DATA.sheets) {
      for (const cat of sheet.categories) {
        for (const w of cat.words) {
          total++;
          const s = progress.wordStats[w.id];
          if (!s) {
            unseen++;
          } else if (s.nextReview <= today) {
            due++;
          }
        }
      }
    }
    return { due, total, unseen };
  }

  function sheetMastery(progress, sheet) {
    let learned = 0;
    let total = 0;
    let mastered = 0;
    for (const cat of sheet.categories) {
      for (const w of cat.words) {
        total++;
        const s = progress.wordStats[w.id];
        if (s) {
          learned++;
          if ((s.repetitions || 0) >= 3) mastered++;
        }
      }
    }
    return {
      learned,
      total,
      mastered,
      pct: total ? Math.round((100 * mastered) / total) : 0,
      learnedPct: total ? Math.round((100 * learned) / total) : 0,
    };
  }

  function categoryMastery(progress, category) {
    let learned = 0;
    let mastered = 0;
    const total = category.words.length;
    for (const w of category.words) {
      const s = progress.wordStats[w.id];
      if (s) {
        learned++;
        if ((s.repetitions || 0) >= 3) mastered++;
      }
    }
    return {
      learned,
      total,
      mastered,
      pct: total ? Math.round((100 * mastered) / total) : 0,
    };
  }

  function overallStats(progress) {
    let totalCorrect = 0;
    let totalIncorrect = 0;
    for (const id in progress.wordStats) {
      const s = progress.wordStats[id];
      totalCorrect += s.correctCount || 0;
      totalIncorrect += s.incorrectCount || 0;
    }
    const sessions = progress.sessionHistory.length;
    const uniqueDays = new Set(progress.sessionHistory.map((s) => s.date)).size;
    const totalAnswered = totalCorrect + totalIncorrect;
    const accuracy = totalAnswered ? Math.round((100 * totalCorrect) / totalAnswered) : 0;
    return {
      totalCorrect,
      totalIncorrect,
      totalAnswered,
      accuracy,
      sessions,
      uniqueDays,
    };
  }

  function weakestWords(progress, topN) {
    topN = topN || 20;
    const arr = [];
    for (const sheet of window.VOCAB_DATA.sheets) {
      for (const cat of sheet.categories) {
        for (const w of cat.words) {
          const s = progress.wordStats[w.id];
          if (!s) continue;
          const incorrect = s.incorrectCount || 0;
          const lowConf = s.lowConfidenceCount || 0;
          if (incorrect === 0 && lowConf === 0) continue;
          const total = (s.correctCount || 0) + incorrect;
          const errorRate = total ? incorrect / total : 0;
          // Weakness score: each incorrect = 1.0, each lowConf = 0.5, each confident correct = -0.5
          const weakness = incorrect + 0.5 * lowConf - 0.5 * (s.correctCount || 0);
          arr.push({
            word: w,
            sheetId: sheet.id,
            categoryName: cat.name,
            stats: s,
            weakness,
            errorRate,
          });
        }
      }
    }
    arr.sort((a, b) => {
      if (b.weakness !== a.weakness) return b.weakness - a.weakness;
      return b.errorRate - a.errorRate;
    });
    return arr.slice(0, topN);
  }

  function recentSessions(progress, days) {
    days = days || 14;
    const today = new Date();
    const cutoff = new Date(today);
    cutoff.setDate(cutoff.getDate() - (days - 1));
    const cutoffStr = window.SRS.todayStr(cutoff);
    const result = {};
    for (let i = 0; i < days; i++) {
      const d = new Date(cutoff);
      d.setDate(cutoff.getDate() + i);
      result[window.SRS.todayStr(d)] = { date: window.SRS.todayStr(d), answered: 0, correct: 0 };
    }
    for (const s of progress.sessionHistory) {
      if (s.date < cutoffStr) continue;
      if (!result[s.date]) continue;
      result[s.date].answered += s.answered;
      result[s.date].correct += s.correct;
    }
    return Object.values(result);
  }

  window.VocabStats = {
    countDueToday,
    sheetMastery,
    categoryMastery,
    overallStats,
    weakestWords,
    recentSessions,
  };
})();
