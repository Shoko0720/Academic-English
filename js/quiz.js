(function () {
  'use strict';

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = a[i];
      a[i] = a[j];
      a[j] = tmp;
    }
    return a;
  }

  // Collect all words in scope, annotated with their sheet/category for distractor selection.
  function flattenWords(sheetIds, categoryIds) {
    const result = [];
    for (const sheet of window.VOCAB_DATA.sheets) {
      if (sheetIds && sheetIds.length && !sheetIds.includes(sheet.id)) continue;
      for (const cat of sheet.categories) {
        if (categoryIds && categoryIds.length && !categoryIds.includes(cat.id)) continue;
        for (const w of cat.words) {
          result.push({
            id: w.id,
            en: w.en,
            ja: w.ja,
            sheetId: sheet.id,
            categoryId: cat.id,
            categoryName: cat.name,
          });
        }
      }
    }
    return result;
  }

  function buildQuestion(target, distractorPool, direction) {
    const isEnJa = direction === 'en-ja';
    const questionText = isEnJa ? target.en : target.ja;
    const correctAnswer = isEnJa ? target.ja : target.en;

    const sameCat = distractorPool.filter(
      (w) => w.categoryId === target.categoryId && w.id !== target.id
    );
    const otherCat = distractorPool.filter((w) => w.categoryId !== target.categoryId);

    const seen = new Set([correctAnswer]);
    const distractors = [];

    function take(list) {
      for (const w of list) {
        if (distractors.length >= 3) return;
        const txt = isEnJa ? w.ja : w.en;
        if (!txt || seen.has(txt)) continue;
        seen.add(txt);
        distractors.push(txt);
      }
    }

    take(shuffle(sameCat));
    if (distractors.length < 3) take(shuffle(otherCat));

    // Guarantee 4 choices even with tiny pools
    while (distractors.length < 3) {
      const filler = isEnJa ? '（選択肢なし）' : '(no option)';
      const unique = `${filler}-${distractors.length + 1}`;
      if (!seen.has(unique)) {
        seen.add(unique);
        distractors.push(unique);
      }
    }

    const choices = shuffle([
      { text: correctAnswer, isCorrect: true },
      ...distractors.map((t) => ({ text: t, isCorrect: false })),
    ]);

    return {
      word: target,
      direction,
      questionText,
      correctAnswer,
      choices,
      correctIndex: choices.findIndex((c) => c.isCorrect),
    };
  }

  // Pick which words to ask in this session: prioritize due > weak > new.
  function selectStudyWords(progress, pool, maxCount, includeNew) {
    const today = window.SRS.todayStr();
    const due = [];
    const newWords = [];

    for (const w of pool) {
      const stats = progress.wordStats[w.id];
      if (!stats) {
        newWords.push(w);
      } else if (stats.nextReview <= today) {
        due.push(w);
      }
    }

    // Hardest first within due bucket
    due.sort((a, b) => {
      const sa = progress.wordStats[a.id];
      const sb = progress.wordStats[b.id];
      const diff =
        (sb.incorrectCount || 0) - (sb.correctCount || 0) -
        ((sa.incorrectCount || 0) - (sa.correctCount || 0));
      if (diff !== 0) return diff;
      return (sa.nextReview || '').localeCompare(sb.nextReview || '');
    });

    const picked = due.slice(0, maxCount);
    if (includeNew !== false && picked.length < maxCount) {
      const need = maxCount - picked.length;
      const shuffledNew = shuffle(newWords);
      picked.push(...shuffledNew.slice(0, need));
    }
    return shuffle(picked);
  }

  function buildSession(progress, options) {
    const pool = flattenWords(options.sheetIds, options.categoryIds);
    const count = Math.min(options.count || 20, pool.length);
    const targets = selectStudyWords(progress, pool, count, options.includeNew !== false);

    if (targets.length === 0) return [];

    // Distractor pool: prefer same sheet so words look thematically related.
    // If only one sheet selected (or category), pool == sheet's words.
    const distractorPool = pool.length >= 4 ? pool : flattenWords(null, null);

    return targets.map((w) => {
      let direction = options.direction;
      if (direction === 'mixed' || !direction) {
        direction = Math.random() < 0.5 ? 'en-ja' : 'ja-en';
      }
      return buildQuestion(w, distractorPool, direction);
    });
  }

  window.Quiz = { buildSession, flattenWords, selectStudyWords, buildQuestion };
})();
