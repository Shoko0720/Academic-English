// Word details (sample): part-of-speech, example sentences, related words, etymology.
// Keyed by word.id from vocabulary.js. Sparse — words without entries fall back
// to the "Weblioで開く" link only.
window.WORD_DETAILS = {

  // ===== 天文学 (R1) =====
  "R1-cat-d9fabae8-001": {
    pos: "noun",
    examples: [
      { en: "Astronomy is the study of celestial objects and phenomena beyond Earth's atmosphere.",
        ja: "天文学は地球の大気圏外の天体や現象を研究する学問である。" }
    ],
    related: [
      { word: "astronomer",   pos: "noun",      note: "天文学者" },
      { word: "astronomical", pos: "adjective", note: "天文の／天文学的に巨大な" },
      { word: "astrology",    pos: "noun",      note: "占星術（混同注意）" }
    ],
    etymology: "古代ギリシャ語 ástron「星」 + nómos「法則」 → 「星の法則を扱う学問」。"
  },

  "R1-cat-d9fabae8-003": {
    pos: "noun",
    examples: [
      { en: "Modern cosmology seeks to understand the origin and structure of the universe.",
        ja: "現代宇宙論は宇宙の起源と構造の理解を目指す。" }
    ],
    related: [
      { word: "cosmos",        pos: "noun",      note: "宇宙（秩序ある全体）" },
      { word: "cosmological",  pos: "adjective", note: "宇宙論の" },
      { word: "cosmologist",   pos: "noun",      note: "宇宙論研究者" }
    ],
    etymology: "ギリシャ語 kósmos「秩序ある世界」 + -logy「〜の学問」。"
  },

  "R1-cat-d9fabae8-006": {
    pos: "noun phrase",
    examples: [
      { en: "Stars, planets, and asteroids are all celestial bodies.",
        ja: "恒星・惑星・小惑星はすべて天体である。" }
    ],
    related: [
      { word: "celestial",     pos: "adjective", note: "天の／天上の" },
      { word: "heavenly body", pos: "noun",      note: "同義のやさしい言い方" }
    ],
    etymology: "celestial は ラテン語 caelestis「天の」、caelum「空」から。"
  },

  "R1-cat-d9fabae8-007": {
    pos: "noun phrase",
    examples: [
      { en: "Before Copernicus, the geocentric theory dominated Western thought.",
        ja: "コペルニクス以前は天動説が西洋思想を支配していた。" }
    ],
    related: [
      { word: "geocentric",   pos: "adjective", note: "地球中心の" },
      { word: "geocentrism",  pos: "noun",      note: "天動説" },
      { word: "heliocentric", pos: "adjective", note: "（反意）太陽中心の" }
    ],
    etymology: "ギリシャ語 gē「大地」 + kéntron「中心」 →「地球を中心とする」。"
  },

  "R1-cat-d9fabae8-008": {
    pos: "noun phrase",
    examples: [
      { en: "Copernicus proposed the heliocentric theory in 1543.",
        ja: "コペルニクスは1543年に地動説を提唱した。" }
    ],
    related: [
      { word: "heliocentric",  pos: "adjective", note: "太陽中心の" },
      { word: "heliocentrism", pos: "noun",      note: "地動説" },
      { word: "geocentric",    pos: "adjective", note: "（反意）地球中心の" }
    ],
    etymology: "ギリシャ語 hḗlios「太陽」 + kéntron「中心」 →「太陽を中心とする」。helium (ヘリウム) も同根。"
  },

  "R1-cat-d9fabae8-009": {
    pos: "noun",
    examples: [
      { en: "Greek mythology is filled with stories of gods and heroes.",
        ja: "ギリシャ神話は神々や英雄の物語で満ちている。" }
    ],
    related: [
      { word: "myth",          pos: "noun",      note: "神話（個々のお話）／俗説" },
      { word: "mythical",      pos: "adjective", note: "神話の／架空の" },
      { word: "mythological",  pos: "adjective", note: "神話学の" }
    ],
    etymology: "ギリシャ語 mŷthos「物語・伝承」 + -logy「学問」。"
  },

  // ===== 歴史・政治 (R1) =====
  "R1-cat-76be015f-001": {
    pos: "noun (uncountable)",
    examples: [
      { en: "Kyoto's temples are part of Japan's cultural heritage.",
        ja: "京都の寺院は日本の文化遺産の一部である。" }
    ],
    related: [
      { word: "inherit",     pos: "verb",      note: "（遺産を）相続する" },
      { word: "heir",        pos: "noun",      note: "相続人（hは発音しない）" },
      { word: "hereditary",  pos: "adjective", note: "遺伝の／世襲の" }
    ],
    etymology: "古フランス語 heritage、ラテン語 hereditare「相続する」から。"
  },

  "R1-cat-76be015f-002": {
    pos: "noun (proper)",
    examples: [
      { en: "Christianity spread throughout the Roman Empire in its first three centuries.",
        ja: "キリスト教は初期の3世紀でローマ帝国全土に広まった。" }
    ],
    related: [
      { word: "Christian", pos: "noun/adj.", note: "キリスト教徒／キリスト教の" },
      { word: "Christ",    pos: "noun",      note: "キリスト" },
      { word: "christen",  pos: "verb",      note: "洗礼を授ける" }
    ],
    etymology: "ギリシャ語 Khristós「油を注がれた者(=メシア)」 + -ity（抽象名詞化）。"
  },

  "R1-cat-76be015f-006": {
    pos: "noun",
    examples: [
      { en: "Industrialization transformed Britain in the 18th and 19th centuries.",
        ja: "産業化は18・19世紀にイギリスを変貌させた。" }
    ],
    related: [
      { word: "industry",      pos: "noun",      note: "産業" },
      { word: "industrial",    pos: "adjective", note: "産業の" },
      { word: "industrialize", pos: "verb",      note: "産業化する" }
    ],
    etymology: "ラテン語 industria「勤勉」 → industrial → industrialize → industrialization と派生。"
  },

  "R1-cat-76be015f-007": {
    pos: "noun",
    examples: [
      { en: "The textile industry was central to the Industrial Revolution.",
        ja: "織物産業は産業革命の中心だった。" }
    ],
    related: [
      { word: "text",    pos: "noun", note: "元来「織られたもの」 → 文章" },
      { word: "texture", pos: "noun", note: "肌理・質感" },
      { word: "context", pos: "noun", note: "文脈（共に織られたもの）" }
    ],
    etymology: "ラテン語 texere「織る」、textilis「織られた」から。text / texture / context と同根。"
  },

  // ===== 地質学・鉱業 (R1) =====
  "R1-cat-f9a51632-001": {
    pos: "noun",
    examples: [
      { en: "Geology explains how mountains form and earthquakes occur.",
        ja: "地質学は山がどう形成され地震がどう起こるかを説明する。" }
    ],
    related: [
      { word: "geological", pos: "adjective", note: "地質学の" },
      { word: "geologist",  pos: "noun",      note: "地質学者" },
      { word: "geography",  pos: "noun",      note: "地理学（混同注意）" }
    ],
    etymology: "ギリシャ語 gē「大地」 + -logy「学問」。geography, geometry と同じ接頭辞。"
  },

  "R1-cat-f9a51632-003": {
    pos: "noun",
    examples: [
      { en: "Mineralogy classifies minerals by their chemical composition.",
        ja: "鉱物学は化学組成によって鉱物を分類する。" }
    ],
    related: [
      { word: "mineral",      pos: "noun/adj.", note: "鉱物／無機物の" },
      { word: "mineralogist", pos: "noun",      note: "鉱物学者" },
      { word: "mining",       pos: "noun",      note: "採掘業" }
    ],
    etymology: "ラテン語 minera「鉱石・鉱脈」 + -logy。mine（鉱山／採掘する）と同根。"
  },

  "R1-cat-f9a51632-004": {
    pos: "noun",
    examples: [
      { en: "The Earth's crust is the outermost solid layer of the planet.",
        ja: "地殻は地球の最も外側の固体層である。" }
    ],
    related: [
      { word: "crusty",     pos: "adjective", note: "硬い皮の／無愛想な" },
      { word: "encrust",    pos: "verb",      note: "（外側を）覆う" },
      { word: "crustacean", pos: "noun",      note: "甲殻類" }
    ],
    etymology: "ラテン語 crusta「硬い表面・殻」から。パンの皮 (bread crust) も同じ単語。"
  },

  "R1-cat-f9a51632-005": {
    pos: "noun",
    examples: [
      { en: "Beneath the crust lies the mantle, a layer of hot semi-solid rock.",
        ja: "地殻の下にマントル、つまり高温の半固体岩石の層がある。" }
    ],
    related: [
      { word: "mantle (cloak)",       pos: "noun", note: "外套・覆い（原義）" },
      { word: "mantle (mantelpiece)", pos: "noun", note: "暖炉の上の棚" },
      { word: "take up the mantle",   pos: "idiom", note: "（責任・伝統を）引き継ぐ" }
    ],
    etymology: "ラテン語 mantellum「マント・覆い」から。地球を「覆う」層なのでこの名がついた。"
  },

  "R1-cat-f9a51632-006": {
    pos: "noun",
    examples: [
      { en: "Magma rises through the crust and becomes lava when it reaches the surface.",
        ja: "マグマは地殻を通って上昇し、地表に達するとlava（溶岩）になる。" }
    ],
    related: [
      { word: "magmatic",     pos: "adjective", note: "マグマの・マグマ起源の" },
      { word: "magma chamber", pos: "noun",     note: "マグマだまり" },
      { word: "massage",       pos: "noun/v.",  note: "（同根）「練る」動作" }
    ],
    etymology: "ギリシャ語 mágma「練り粉・軟膏」から。massage（マッサージ）も同根。"
  },

  "R1-cat-f9a51632-007": {
    pos: "noun",
    examples: [
      { en: "The lava cooled and hardened into volcanic rock.",
        ja: "溶岩は冷えて固まり火山岩になった。" }
    ],
    related: [
      { word: "lava flow",  pos: "noun",      note: "溶岩流" },
      { word: "volcanic",   pos: "adjective", note: "火山の" },
      { word: "magma",      pos: "noun",      note: "（地下のマグマ）地表で lava になる" }
    ],
    etymology: "イタリア語ナポリ方言 lava「(ヴェスヴィオ山の)流れ」、ラテン語 labes「滑落・流下」から。"
  },

  // ===== 産業・貿易 (R1) =====
  "R1-cat-5c2e0466-001": {
    pos: "noun phrase",
    examples: [
      { en: "The Industrial Revolution began in Britain in the late 18th century.",
        ja: "産業革命は18世紀後半にイギリスで始まった。" }
    ],
    related: [
      { word: "industrialize",   pos: "verb", note: "産業化する" },
      { word: "industrialization", pos: "noun", note: "産業化（プロセス）" },
      { word: "revolution",      pos: "noun", note: "革命／回転" }
    ],
    etymology: "industrial（産業の）+ revolution（革命）。「社会を回転させるほどの大変化」というニュアンス。"
  },

  "R1-cat-5c2e0466-009": {
    pos: "noun phrase",
    examples: [
      { en: "Japan ran a large trade surplus with the U.S. in the 1980s.",
        ja: "1980年代、日本は対米で大きな貿易黒字を計上した。" }
    ],
    related: [
      { word: "trade deficit",     pos: "noun", note: "（反意）貿易赤字" },
      { word: "surplus",           pos: "noun", note: "余剰・余り" },
      { word: "balance of trade",  pos: "noun", note: "貿易収支" }
    ],
    etymology: "surplus = フランス語 sur「上に」+ plus「より多く」 →「余分・過剰」。"
  },

  // ===== 単数形と複数形 (R1) =====
  "R1-cat-01ba7716-005": {
    pos: "noun (countable)",
    note: "**単数**で「権威・専門家」、**複数 authorities** で「当局」に意味が変わる代表例。",
    examples: [
      { en: "She is an authority on medieval literature.",
        ja: "彼女は中世文学の権威である。" }
    ],
    related: [
      { word: "authoritative", pos: "adjective", note: "権威ある・確かな" },
      { word: "authorize",     pos: "verb",      note: "権限を与える・認可する" },
      { word: "author",        pos: "noun",      note: "著者（同根：原典を作る人）" }
    ],
    etymology: "ラテン語 auctoritas「権威・原典」、auctor「創始者・作者」から。"
  },

  "R1-cat-01ba7716-006": {
    pos: "noun (plural form, distinct meaning)",
    note: "**複数形** authorities で「当局・行政機関」を表す。authority（権威）と区別。",
    examples: [
      { en: "The authorities ordered an investigation into the accident.",
        ja: "当局は事故の調査を命じた。" }
    ],
    related: [
      { word: "authority",      pos: "noun (sg.)", note: "権威・専門家" },
      { word: "customs / forces", pos: "noun",     note: "同じ「複数で意味が変わる」パターン" }
    ],
    etymology: "authority と同源。複数形になることで「権威を行使する側＝当局」を指す慣用が定着。"
  },

  "R1-cat-01ba7716-007": {
    pos: "noun (countable)",
    note: "**単数**で「習慣」、**複数 customs** で「関税・税関」。",
    examples: [
      { en: "It is a Japanese custom to bow when greeting.",
        ja: "お辞儀をして挨拶するのは日本の習慣である。" }
    ],
    related: [
      { word: "customary", pos: "adjective", note: "慣例の・通例の" },
      { word: "customer",  pos: "noun",      note: "客（原義は「常連＝慣れた人」）" },
      { word: "accustom",  pos: "verb",      note: "慣らす（accustomed to ～に慣れている）" }
    ],
    etymology: "ラテン語 consuetudo「慣れ」、consuescere「慣らす」から。"
  },

  "R1-cat-01ba7716-008": {
    pos: "noun (plural form, distinct meaning)",
    note: "**複数形** customs で「関税・税関」。「常に支払う通行料」が転化した語。",
    examples: [
      { en: "I had to declare the camera at customs.",
        ja: "税関でそのカメラを申告しなければならなかった。" }
    ],
    related: [
      { word: "custom",         pos: "noun (sg.)", note: "習慣" },
      { word: "customs duty",   pos: "noun",       note: "関税" },
      { word: "customs officer", pos: "noun",      note: "税関職員" }
    ],
    etymology: "custom と同源。中世以来「常に取られる通行料」→「関税」に意味が分岐。"
  },

  "R1-cat-01ba7716-009": {
    pos: "noun (countable)",
    note: "**単数**で「力」、**複数 forces** で「軍隊・軍勢」。",
    examples: [
      { en: "Gravity is the force that pulls objects toward Earth.",
        ja: "重力は物体を地球に引き寄せる力である。" }
    ],
    related: [
      { word: "forceful",  pos: "adjective", note: "力強い・説得力のある" },
      { word: "enforce",   pos: "verb",      note: "（法を）施行する" },
      { word: "reinforce", pos: "verb",      note: "補強する" }
    ],
    etymology: "ラテン語 fortis「強い」、fortia「力」から。effort, comfort, fortify と同根。"
  },

  "R1-cat-01ba7716-010": {
    pos: "noun (plural form, distinct meaning)",
    note: "**複数形** forces で「軍隊・軍勢」。集合的な「力」が「軍勢」に転化。",
    examples: [
      { en: "The armed forces were placed on high alert.",
        ja: "軍は高度な警戒態勢に置かれた。" }
    ],
    related: [
      { word: "force",        pos: "noun (sg.)", note: "力" },
      { word: "armed forces", pos: "noun",       note: "軍隊" },
      { word: "task force",   pos: "noun",       note: "機動部隊・特別作業班" }
    ],
    etymology: "force と同源。「(集合的な)力」 → 「軍勢」へ。"
  }

};
