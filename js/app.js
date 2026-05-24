(function () {
  'use strict';

  const state = {
    progress: null,
    session: [],
    sessionIndex: 0,
    sessionAnswers: [],
    sessionMeta: null,
    awaitingNext: false,
    currentSheetId: null,
    quizOptions: {
      direction: 'mixed',
      count: 20,
      includeNew: true,
    },
  };

  const screens = {
    home: document.getElementById('screen-home'),
    sheet: document.getElementById('screen-sheet'),
    quiz: document.getElementById('screen-quiz'),
    result: document.getElementById('screen-result'),
    stats: document.getElementById('screen-stats'),
  };

  function showScreen(name) {
    for (const key in screens) {
      screens[key].classList.toggle('hidden', key !== name);
    }
    document.querySelectorAll('.nav-btn').forEach((b) => {
      b.classList.toggle('active', b.dataset.nav === name || (name === 'sheet' && b.dataset.nav === 'home'));
    });
    window.scrollTo(0, 0);
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Escape HTML, then promote **bold** to <strong> (used in note fields).
  function escapeWithBold(s) {
    return escapeHtml(s).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  }

  function renderWordDetails(word) {
    const d = (window.WORD_DETAILS || {})[word.id];
    const enc = encodeURIComponent(word.en);
    const httpsUrl = `https://ejje.weblio.jp/content/${enc}`;
    // On Android, open the URL in the standalone Chrome app (escapes the PWA
    // and avoids Chrome Custom Tabs overlay). browser_fallback_url ensures
    // graceful degradation when Chrome isn't installed.
    const isAndroid = typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent || '');
    const weblioUrl = isAndroid
      ? `intent://ejje.weblio.jp/content/${enc}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(httpsUrl)};end`
      : httpsUrl;
    let parts = [];
    if (d) {
      if (d.pos) parts.push(`<div class="word-details__pos">${escapeHtml(d.pos)}</div>`);
      if (d.note) parts.push(`<div class="word-details__note">${escapeWithBold(d.note)}</div>`);
      if (d.examples && d.examples.length) {
        const items = d.examples.map((ex) =>
          `<li><div class="ex-en">${escapeHtml(ex.en)}</div><div class="ex-ja">${escapeHtml(ex.ja)}</div></li>`
        ).join('');
        parts.push(`<div class="word-details__section"><h5>例文</h5><ul class="ex-list">${items}</ul></div>`);
      }
      if (d.related && d.related.length) {
        const items = d.related.map((r) =>
          `<li><strong>${escapeHtml(r.word)}</strong> <em class="rel-pos">${escapeHtml(r.pos || '')}</em> <span class="rel-note">${escapeHtml(r.note || '')}</span></li>`
        ).join('');
        parts.push(`<div class="word-details__section"><h5>関連語</h5><ul class="rel-list">${items}</ul></div>`);
      }
      if (d.etymology) {
        parts.push(`<div class="word-details__section"><h5>語源</h5><p class="etym">${escapeHtml(d.etymology)}</p></div>`);
      }
    } else {
      parts.push('<p class="word-details__empty">この単語の詳細はまだ収録されていません。Weblioで調べてください。</p>');
    }
    parts.push(
      `<div class="word-details__actions">` +
      `<a class="btn btn--small btn--ghost word-details__weblio" href="${weblioUrl}" target="_blank" rel="noopener noreferrer">Weblioで開く</a>` +
      `</div>`
    );
    return parts.join('');
  }

  function toggleDetails(panelEl, word) {
    if (!panelEl || !word) return;
    if (panelEl.classList.contains('hidden') || panelEl.innerHTML.trim() === '') {
      panelEl.innerHTML = renderWordDetails(word);
      panelEl.classList.remove('hidden');
    } else {
      panelEl.classList.add('hidden');
    }
  }

  // ---------------- Home ----------------

  function renderHome() {
    const { progress } = state;
    const due = window.VocabStats.countDueToday(progress);
    const overall = window.VocabStats.overallStats(progress);

    const sheetCards = window.VOCAB_DATA.sheets
      .map((sheet) => {
        const m = window.VocabStats.sheetMastery(progress, sheet);
        return `
          <button class="sheet-card" data-sheet="${sheet.id}">
            <div class="sheet-card__title">
              <span class="sheet-badge sheet-badge--${sheet.skill}">${sheet.skill}${sheet.testNumber}</span>
              <span class="sheet-card__name">${escapeHtml(sheet.sheetName)}</span>
            </div>
            <div class="sheet-card__meta">${m.total} 語 ・ 習得 ${m.mastered} ・ 学習中 ${m.learned - m.mastered}</div>
            <div class="bar"><div class="bar__fill" style="width:${m.pct}%"></div></div>
            <div class="bar bar--secondary"><div class="bar__fill bar__fill--secondary" style="width:${m.learnedPct}%"></div></div>
          </button>`;
      })
      .join('');

    screens.home.innerHTML = `
      <div class="hero">
        <h2>今日の学習</h2>
        <div class="hero__stats">
          <div class="hero__stat">
            <span class="hero__num">${due.due}</span>
            <span class="hero__label">復習対象</span>
          </div>
          <div class="hero__stat">
            <span class="hero__num">${due.total - due.unseen}</span>
            <span class="hero__label">学習済み</span>
          </div>
          <div class="hero__stat">
            <span class="hero__num">${overall.accuracy}%</span>
            <span class="hero__label">累計正解率</span>
          </div>
        </div>
        <div class="hero__actions">
          <button class="btn btn--primary" data-action="start-review" ${due.due === 0 && due.unseen === 0 ? 'disabled' : ''}>
            ${due.due > 0 ? `今日の復習を始める（${due.due}語）` : '新しい単語から始める'}
          </button>
        </div>
        <p class="hint">※ 復習対象が0でも、未学習の単語から自動的に出題されます。</p>
      </div>

      <h3 class="section-title">シート別に学習</h3>
      <div class="sheet-grid">${sheetCards}</div>

      <p class="legend">
        <span class="legend__item"><span class="legend__swatch"></span>習得（連続3回正解）</span>
        <span class="legend__item"><span class="legend__swatch legend__swatch--secondary"></span>学習中（1回以上回答）</span>
      </p>
    `;
    showScreen('home');
  }

  // ---------------- Sheet detail ----------------

  function renderSheetDetail(sheetId) {
    state.currentSheetId = sheetId;
    const sheet = window.VOCAB_DATA.sheets.find((s) => s.id === sheetId);
    if (!sheet) {
      renderHome();
      return;
    }
    const { progress } = state;
    const m = window.VocabStats.sheetMastery(progress, sheet);

    const categoryCards = sheet.categories
      .map((cat) => {
        const cm = window.VocabStats.categoryMastery(progress, cat);
        return `
          <div class="cat-card">
            <div class="cat-card__head">
              <h4>${escapeHtml(cat.name)}</h4>
              <span class="cat-card__count">${cm.total} 語</span>
            </div>
            <div class="bar"><div class="bar__fill" style="width:${cm.pct}%"></div></div>
            <div class="cat-card__meta">習得 ${cm.mastered} / ${cm.total}・学習中 ${cm.learned - cm.mastered}</div>
            <div class="cat-card__actions">
              <button class="btn btn--small" data-action="quiz-category" data-cat="${cat.id}">このカテゴリでクイズ</button>
              <button class="btn btn--small btn--ghost" data-action="show-words" data-cat="${cat.id}">単語一覧</button>
            </div>
            <div class="word-list hidden" data-words-of="${cat.id}"></div>
          </div>`;
      })
      .join('');

    screens.sheet.innerHTML = `
      <button class="btn btn--back" data-action="home">← ホームへ</button>
      <div class="sheet-head">
        <span class="sheet-badge sheet-badge--${sheet.skill}">${sheet.skill}${sheet.testNumber}</span>
        <h2>${escapeHtml(sheet.sheetName)}</h2>
        <div class="sheet-head__meta">${sheet.categories.length} カテゴリ ・ 全 ${m.total} 語</div>
      </div>

      <div class="quiz-options" id="quiz-options"></div>

      <div class="sheet-actions">
        <button class="btn btn--primary" data-action="quiz-sheet">このシート全体でクイズ</button>
      </div>

      <h3 class="section-title">カテゴリ</h3>
      <div class="cat-grid">${categoryCards}</div>
    `;
    renderQuizOptions();
    showScreen('sheet');
  }

  function renderQuizOptions() {
    const el = document.getElementById('quiz-options');
    if (!el) return;
    const { direction, count } = state.quizOptions;
    el.innerHTML = `
      <div class="opt-row">
        <label class="opt-label">出題形式</label>
        <div class="seg">
          <button class="seg__btn ${direction === 'en-ja' ? 'active' : ''}" data-opt-dir="en-ja">英→日</button>
          <button class="seg__btn ${direction === 'ja-en' ? 'active' : ''}" data-opt-dir="ja-en">日→英</button>
          <button class="seg__btn ${direction === 'mixed' ? 'active' : ''}" data-opt-dir="mixed">ランダム</button>
        </div>
      </div>
      <div class="opt-row">
        <label class="opt-label">問題数</label>
        <div class="seg">
          <button class="seg__btn ${count === 10 ? 'active' : ''}" data-opt-count="10">10</button>
          <button class="seg__btn ${count === 20 ? 'active' : ''}" data-opt-count="20">20</button>
          <button class="seg__btn ${count === 30 ? 'active' : ''}" data-opt-count="30">30</button>
          <button class="seg__btn ${count === 50 ? 'active' : ''}" data-opt-count="50">50</button>
        </div>
      </div>
    `;
  }

  function toggleWordList(catId, button) {
    const sheet = window.VOCAB_DATA.sheets.find((s) => s.id === state.currentSheetId);
    if (!sheet) return;
    const cat = sheet.categories.find((c) => c.id === catId);
    if (!cat) return;
    const container = document.querySelector(`[data-words-of="${catId}"]`);
    if (!container) return;
    if (container.classList.contains('hidden')) {
      const rows = cat.words
        .map((w) => {
          const s = state.progress.wordStats[w.id];
          const badge = !s
            ? '<span class="word-badge word-badge--new">未</span>'
            : (s.repetitions || 0) >= 3
              ? '<span class="word-badge word-badge--mastered">◎</span>'
              : '<span class="word-badge word-badge--learning">学</span>';
          const stat = s
            ? `<span class="word-stat">正${s.correctCount}/誤${s.incorrectCount}</span>`
            : '';
          const hasDetail = !!(window.WORD_DETAILS && window.WORD_DETAILS[w.id]);
          const detailMark = hasDetail ? '📖' : '＋';
          return `<li class="word-row">
            <button class="word-row__head" data-action="toggle-row-details" data-word-id="${w.id}">
              ${badge}
              <span class="word-en">${escapeHtml(w.en)}</span>
              <span class="word-ja">${escapeHtml(w.ja)}</span>
              ${stat}
              <span class="word-row__chev">${detailMark}</span>
            </button>
            <div class="word-details word-row__details hidden"></div>
          </li>`;
        })
        .join('');
      container.innerHTML = `<ul>${rows}</ul>`;
      container.classList.remove('hidden');
      if (button) button.textContent = '単語一覧を閉じる';
    } else {
      container.classList.add('hidden');
      if (button) button.textContent = '単語一覧';
    }
  }

  // ---------------- Quiz ----------------

  function startQuiz(options) {
    const sessionOpts = Object.assign({}, state.quizOptions, options);
    const session = window.Quiz.buildSession(state.progress, sessionOpts);
    if (session.length === 0) {
      alert('対象の単語が見つかりませんでした。');
      return;
    }
    state.session = session;
    state.sessionIndex = 0;
    state.sessionAnswers = [];
    state.sessionMeta = sessionOpts;
    state.awaitingNext = false;
    renderQuestion();
    showScreen('quiz');
  }

  function renderQuestion() {
    const q = state.session[state.sessionIndex];
    if (!q) {
      finishQuiz();
      return;
    }
    const total = state.session.length;
    const current = state.sessionIndex + 1;
    const progressPct = Math.round((current / total) * 100);

    const dirLabel = q.direction === 'en-ja' ? '英 → 日' : '日 → 英';
    const choices = q.choices
      .map(
        (c, i) =>
          `<button class="choice" data-choice="${i}">${escapeHtml(c.text)}</button>`
      )
      .join('');

    screens.quiz.innerHTML = `
      <div class="quiz-head">
        <span class="quiz-progress">${current} / ${total}</span>
        <span class="quiz-direction">${dirLabel}</span>
        <button class="btn btn--ghost btn--small" data-action="abort-quiz">中断</button>
      </div>
      <div class="quiz-progressbar"><div class="quiz-progressbar__fill" style="width:${progressPct}%"></div></div>
      <div class="quiz-question">
        <div class="quiz-question__category">${escapeHtml(q.word.categoryName)}</div>
        <div class="quiz-question__text ${q.direction === 'en-ja' ? 'is-en' : 'is-ja'}">${escapeHtml(q.questionText)}</div>
      </div>
      <div class="choices">${choices}</div>
      <div class="quiz-feedback hidden" id="quiz-feedback"></div>
    `;
  }

  function handleAnswer(choiceIndex) {
    if (state.awaitingNext) return;
    const q = state.session[state.sessionIndex];
    const isCorrect = choiceIndex === q.correctIndex;

    // Update stats
    const prev = state.progress.wordStats[q.word.id];
    const next = window.SRS.updateOnAnswer(prev, isCorrect);
    state.progress.wordStats[q.word.id] = next;

    state.sessionAnswers.push({
      wordId: q.word.id,
      questionText: q.questionText,
      correctAnswer: q.correctAnswer,
      chosen: q.choices[choiceIndex].text,
      isCorrect,
      direction: q.direction,
      word: q.word,
    });

    // Update DOM
    const choiceButtons = screens.quiz.querySelectorAll('.choice');
    choiceButtons.forEach((btn, i) => {
      btn.disabled = true;
      if (i === q.correctIndex) btn.classList.add('choice--correct');
      if (i === choiceIndex && !isCorrect) btn.classList.add('choice--wrong');
    });

    const fb = document.getElementById('quiz-feedback');
    if (fb) {
      fb.classList.remove('hidden');
      fb.classList.toggle('quiz-feedback--correct', isCorrect);
      fb.classList.toggle('quiz-feedback--wrong', !isCorrect);
      const lowConfBtn = isCorrect
        ? `<button class="btn btn--ghost btn--lowconf" data-action="mark-low-confidence" title="自信なし。次回も早めに出題">自信なし</button>`
        : '';
      fb.innerHTML = `
        <div class="quiz-feedback__row">
          <div class="quiz-feedback__icon">${isCorrect ? '◯' : '×'}</div>
          <div class="quiz-feedback__detail">
            <div><strong>${escapeHtml(q.word.en)}</strong> — ${escapeHtml(q.word.ja)}</div>
            ${isCorrect ? '' : `<div class="quiz-feedback__correct">正解: ${escapeHtml(q.correctAnswer)}</div>`}
          </div>
          <button class="btn btn--ghost btn--small" data-action="toggle-quiz-details">📖 詳細</button>
          ${lowConfBtn}
          <button class="btn btn--primary" data-action="next-question">次へ</button>
        </div>
        <div class="word-details hidden" id="quiz-word-details"></div>
      `;
    }

    state.awaitingNext = true;
    // Persist incrementally — never lose progress mid-session
    window.VocabStorage.saveProgress(state.progress);
  }

  function markLowConfidence() {
    const q = state.session[state.sessionIndex];
    if (!q) return;
    const last = state.sessionAnswers[state.sessionAnswers.length - 1];
    // Only meaningful if the latest answer was correct and not already marked
    if (!last || last.wordId !== q.word.id || !last.isCorrect || last.lowConfidence) return;
    const prev = state.progress.wordStats[q.word.id];
    // Re-apply the SRS update as a low-confidence correct answer.
    // Note: prev already reflects the first correct update from handleAnswer;
    // we re-derive from a "rolled back" stats by decrementing correctCount and
    // restoring repetitions/ease to pre-answer values is not tracked. Instead
    // we just take the current prev as baseline and apply a single low-conf step,
    // which is acceptable: it clamps the interval to <=2 and increments lowConfidenceCount.
    const next = window.SRS.updateOnAnswer(prev, true, true);
    state.progress.wordStats[q.word.id] = next;
    last.lowConfidence = true;
    window.VocabStorage.saveProgress(state.progress);
    // Reflect on UI: disable the button so it can't be pressed twice
    const btn = screens.quiz.querySelector('[data-action="mark-low-confidence"]');
    if (btn) {
      btn.disabled = true;
      btn.textContent = '自信なし ✓';
    }
  }

  function nextQuestion() {
    state.awaitingNext = false;
    state.sessionIndex++;
    if (state.sessionIndex >= state.session.length) {
      finishQuiz();
    } else {
      renderQuestion();
    }
  }

  function finishQuiz() {
    const total = state.sessionAnswers.length;
    const correct = state.sessionAnswers.filter((a) => a.isCorrect).length;
    if (total > 0) {
      window.VocabStorage.recordSession(state.progress, total, correct);
      window.VocabStorage.saveProgress(state.progress);
    }
    renderResult();
  }

  function renderResult() {
    const total = state.sessionAnswers.length;
    const correct = state.sessionAnswers.filter((a) => a.isCorrect).length;
    const pct = total ? Math.round((100 * correct) / total) : 0;
    const wrongs = state.sessionAnswers.filter((a) => !a.isCorrect);

    const wrongList = wrongs.length
      ? `<ul class="wrong-list">${wrongs
          .map(
            (a) => `
            <li>
              <div class="wrong-list__q">${escapeHtml(a.questionText)}</div>
              <div class="wrong-list__a">
                <span class="wrong-list__chosen">あなた: ${escapeHtml(a.chosen)}</span>
                <span class="wrong-list__correct">正解: ${escapeHtml(a.correctAnswer)}</span>
              </div>
            </li>`
          )
          .join('')}</ul>`
      : '<p class="result__perfect">全問正解！🎉</p>';

    const grade = pct >= 90 ? 'excellent' : pct >= 70 ? 'good' : pct >= 50 ? 'fair' : 'weak';
    screens.result.innerHTML = `
      <div class="result result--${grade}">
        <div class="result__pct">${pct}%</div>
        <div class="result__detail">${correct} / ${total} 問正解</div>
      </div>
      <div class="result__actions">
        <button class="btn btn--primary" data-action="retry">もう一度</button>
        <button class="btn" data-action="home">ホームへ</button>
      </div>
      ${wrongs.length ? `<h3 class="section-title">間違えた単語</h3>` : ''}
      ${wrongList}
    `;
    showScreen('result');
  }

  function retryQuiz() {
    if (!state.sessionMeta) {
      renderHome();
      return;
    }
    startQuiz(state.sessionMeta);
  }

  // ---------------- Stats ----------------

  function renderStats() {
    const { progress } = state;
    const overall = window.VocabStats.overallStats(progress);
    const due = window.VocabStats.countDueToday(progress);
    const weak = window.VocabStats.weakestWords(progress, 20);
    const days = window.VocabStats.recentSessions(progress, 14);

    const sheetRows = window.VOCAB_DATA.sheets
      .map((sheet) => {
        const m = window.VocabStats.sheetMastery(progress, sheet);
        return `
          <tr>
            <td><span class="sheet-badge sheet-badge--${sheet.skill}">${sheet.skill}${sheet.testNumber}</span></td>
            <td>${escapeHtml(sheet.sheetName)}</td>
            <td class="num">${m.mastered}/${m.total}</td>
            <td class="bar-cell"><div class="bar"><div class="bar__fill" style="width:${m.pct}%"></div></div></td>
            <td class="num">${m.pct}%</td>
          </tr>`;
      })
      .join('');

    const maxAnswered = Math.max(1, ...days.map((d) => d.answered));
    const heatmap = days
      .map((d) => {
        const h = d.answered === 0 ? 4 : Math.max(8, Math.round((d.answered / maxAnswered) * 60));
        const acc = d.answered ? Math.round((100 * d.correct) / d.answered) : 0;
        const title = `${d.date}: ${d.answered}問, ${acc}%`;
        return `<div class="heatbar" title="${title}">
                  <div class="heatbar__fill" style="height:${h}px"></div>
                  <div class="heatbar__label">${d.date.slice(5)}</div>
                </div>`;
      })
      .join('');

    const weakList = weak.length
      ? weak
          .map(
            (w) => {
              const lc = w.stats.lowConfidenceCount || 0;
              const lcLabel = lc > 0 ? `<span class="weak__lowconf" title="自信なし回数">自信なし×${lc}</span>` : '';
              return `
            <li>
              <span class="weak__en">${escapeHtml(w.word.en)}</span>
              <span class="weak__ja">${escapeHtml(w.word.ja)}</span>
              <span class="weak__meta">${w.sheetId} ・ ${escapeHtml(w.categoryName)}</span>
              <span class="weak__score">正${w.stats.correctCount}/誤${w.stats.incorrectCount} ${lcLabel}</span>
            </li>`;
            }
          )
          .join('')
      : '<li class="weak__empty">まだ間違えた・自信なし単語はありません。</li>';

    screens.stats.innerHTML = `
      <h2>統計</h2>
      <div class="stat-grid">
        <div class="stat-card"><div class="stat-card__num">${due.total - due.unseen}</div><div class="stat-card__label">学習済み単語</div></div>
        <div class="stat-card"><div class="stat-card__num">${due.due}</div><div class="stat-card__label">今日の復習</div></div>
        <div class="stat-card"><div class="stat-card__num">${overall.accuracy}%</div><div class="stat-card__label">累計正解率</div></div>
        <div class="stat-card"><div class="stat-card__num">${overall.uniqueDays}</div><div class="stat-card__label">学習日数</div></div>
      </div>

      <h3 class="section-title">直近14日の学習</h3>
      <div class="heatmap">${heatmap}</div>

      <h3 class="section-title">シート別 習得度</h3>
      <table class="mastery-table">
        <thead><tr><th></th><th>シート</th><th>習得</th><th></th><th>%</th></tr></thead>
        <tbody>${sheetRows}</tbody>
      </table>

      <h3 class="section-title">苦手な単語 TOP 20</h3>
      <ul class="weak-list">${weakList}</ul>

      <h3 class="section-title">データ管理</h3>
      <p class="hint">学習記録はこのブラウザの localStorage に保存されています。</p>
      <button class="btn btn--danger" data-action="reset-progress">学習記録をすべて削除</button>
    `;
    showScreen('stats');
  }

  // ---------------- Event delegation ----------------

  function findWordById(wordId) {
    for (const sheet of window.VOCAB_DATA.sheets) {
      for (const cat of sheet.categories) {
        for (const w of cat.words) {
          if (w.id === wordId) return w;
        }
      }
    }
    return null;
  }

  function onClick(e) {
    const target = e.target.closest('[data-action], [data-sheet], [data-choice], [data-nav], [data-opt-dir], [data-opt-count], [data-cat]');
    if (!target) return;

    // Nav
    if (target.dataset.nav) {
      if (target.dataset.nav === 'home') renderHome();
      else if (target.dataset.nav === 'stats') renderStats();
      return;
    }

    // Sheet card on home
    if (target.dataset.sheet && !target.dataset.action) {
      renderSheetDetail(target.dataset.sheet);
      return;
    }

    // Quiz options
    if (target.dataset.optDir) {
      state.quizOptions.direction = target.dataset.optDir;
      renderQuizOptions();
      return;
    }
    if (target.dataset.optCount) {
      state.quizOptions.count = parseInt(target.dataset.optCount, 10);
      renderQuizOptions();
      return;
    }

    // Quiz choices
    if (target.dataset.choice !== undefined) {
      handleAnswer(parseInt(target.dataset.choice, 10));
      return;
    }

    const action = target.dataset.action;
    switch (action) {
      case 'home':
        renderHome();
        break;
      case 'start-review':
        startQuiz({ sheetIds: null, categoryIds: null });
        break;
      case 'quiz-sheet':
        startQuiz({ sheetIds: [state.currentSheetId] });
        break;
      case 'quiz-category':
        startQuiz({ sheetIds: [state.currentSheetId], categoryIds: [target.dataset.cat] });
        break;
      case 'show-words':
        toggleWordList(target.dataset.cat, target);
        break;
      case 'next-question':
        nextQuestion();
        break;
      case 'mark-low-confidence':
        markLowConfidence();
        break;
      case 'toggle-quiz-details': {
        const q = state.session[state.sessionIndex];
        const panel = document.getElementById('quiz-word-details');
        if (q && panel) toggleDetails(panel, q.word);
        break;
      }
      case 'toggle-row-details': {
        const wordId = target.dataset.wordId;
        const word = findWordById(wordId);
        const li = target.closest('.word-row');
        const panel = li ? li.querySelector('.word-row__details') : null;
        if (word && panel) toggleDetails(panel, word);
        break;
      }
      case 'abort-quiz':
        if (confirm('クイズを中断してホームに戻りますか？回答済みの記録は保存されます。')) {
          finishQuiz();
        }
        break;
      case 'retry':
        retryQuiz();
        break;
      case 'reset-progress':
        if (confirm('すべての学習記録を削除します。よろしいですか？')) {
          window.VocabStorage.clearAllProgress();
          state.progress = window.VocabStorage.loadProgress();
          renderStats();
        }
        break;
    }
  }

  // ---------------- Init ----------------

  function init() {
    if (!window.VOCAB_DATA || !window.VOCAB_DATA.sheets) {
      document.body.innerHTML = '<p style="padding:2em;color:#c00">語彙データ (data/vocabulary.js) を読み込めませんでした。scripts/convert-excel.ps1 を実行してください。</p>';
      return;
    }
    state.progress = window.VocabStorage.loadProgress();
    document.addEventListener('click', onClick);
    renderHome();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
