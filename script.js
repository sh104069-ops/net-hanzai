'use strict';
/* =========================================
   ネットまもりクエスト  script.js
   特別支援学校中学部向け ネット犯罪防止 体験型学習アプリ
   ========================================= */

const SAVE_KEY = 'net-mamori-quest-v1';
const MAX_HP = 3;

/* ---------- レベル設定 ---------- */
const LEVELS = {
  1: { name: 'はじめの いっぽ', note: 'ひらがな ・ えらぶのは 2つ', teacher: 'ひらがな表記・2択。身近な場面で「教えない・おさない・おとなに言う」を身につける。' },
  2: { name: 'みならい ゆうしゃ', note: 'ひらがな ・ えらぶのは 2つ ・ すこし むずかしい', teacher: 'ひらがな中心・2択。写真の投稿、身分証の送信、無料アプリの課金など場面を広げる。' },
  3: { name: 'ぼうけんしゃ', note: 'かんたんな 漢字 ・ えらぶのは 3つ', teacher: '易しい漢字・3択。「いいねも加担」「学校名も個人情報」など、紛らわしい誤答を含む。' },
  4: { name: 'せんし', note: '漢字 ・ えらぶのは 3つ ・ 本当に ありそうな 場面', teacher: '3択。位置情報、匿名の書き込み、フィッシング、脅された後の対応、サブスクなど実際的な場面。' },
  5: { name: 'でんせつの ゆうしゃ', note: '漢字 ・ えらぶのは 4つ ・ 法律や 相談先も', teacher: '4択。デジタルタトゥー、デマ拡散、名義貸し、定期購入、相談先（110・#9110・188）まで扱う。' }
};

/* ---------- エリア設定 ---------- */
const AREA_ORDER = ['privacy', 'yami', 'shop'];
const AREAS = {
  privacy: { name: 'ひみつの もり', icon: '🌲', theme: 'theme-forest', topic: 'こじんじょうほう ・ わるぐち', badge: '🛡️' },
  yami:    { name: 'やみの まち',   icon: '🌃', theme: 'theme-night',  topic: 'やみバイト',                badge: '⚔️' },
  shop:    { name: 'おかいもの みなと', icon: '⚓', theme: 'theme-port', topic: 'ネットショッピング ・ かきん', badge: '💎' }
};

/* ---------- キャラクター（ニックネーム） ---------- */
const AVATARS = [
  { e: '🦸', n: 'ソラ' },
  { e: '🧙', n: 'ヒカリ' },
  { e: '🥷', n: 'ハヤテ' },
  { e: '🧝', n: 'ミント' },
  { e: '🤖', n: 'ロボタ' },
  { e: '🐱', n: 'ニャンタ' }
];

/* ---------- もんだいデータ ----------
   choices: [ 'せんたくし', 'かいせつ', true(=せいかい) ]
   ------------------------------------ */
const Q = (npc, who, lines, choices, rule, q) => ({
  npc, who, lines, rule, q: q || 'どうする？',
  choices: choices.map(c => ({ t: c[0], f: c[1], ok: !!c[2] }))
});

const DATA = {
  /* ===== レベル1 ===== */
  1: {
    privacy: [
      Q('👾', 'なぞの プレイヤー',
        ['ゲームを していたら、しらない ひとから メッセージが きたよ。', '「やあ！ きみの なまえと、すんでいる ところを おしえて！」'],
        [['おしえない。おうちの ひとや せんせいに いう', 'なまえや すんでいる ところは だいじな ひみつ。しらない ひとには ぜったいに おしえないよ。', true],
         ['なかよく なりたいから おしえる', 'ネットの むこうに いるのは どんな ひとか わからないよ。おしえると、いえに こられて しまうかも しれない。']],
        'なまえ・じゅうしょ・でんわばんごうは おしえない'),
      Q('👻', 'わるぐち ゴースト',
        ['クラスの グループで、ともだちが いったよ。', '「○○くんって むかつくよね。みんなで わるぐち かこうよ！」'],
        [['かかない。「やめよう」と いうか、せんせいに いう', 'わるぐちは あいての こころを きずつけるよ。かかない ことが だいじ。', true],
         ['みんなが かくなら ぼくも かく', 'ネットに かいた わるぐちは きえないし、たくさんの ひとに ひろがって しまうよ。']],
        'ネットで わるぐちを かかない')
    ],
    yami: [
      Q('🐍', 'あまいことば スネーク',
        ['スマホに こんな メッセージが きたよ。', '「かんたんな おしごとで、すぐに おかねが もらえるよ！ やってみない？」'],
        [['やらない。おうちの ひとに みせる', 'かんたんに おかねが もらえる はなしは うそ。わるい しごとの ことが あるよ。', true],
         ['おかねが ほしいから やる', 'わるい ことを させられて、けいさつに つかまって しまうかも しれないよ。']],
        '「かんたんに おかねが もらえる」は うそ'),
      Q('📦', 'なぞの にもつ',
        ['しらない ひとから メッセージが きたよ。', '「にもつを うけとって わたすだけで、1まんえん あげるよ」'],
        [['ことわって、おとなに そうだんする', 'あやしい しごとは ことわって、すぐ おとなに そうだん。それが いちばん つよい ゆうしゃ だよ。', true],
         ['うけとるだけなら いいかな', 'その にもつは わるい ものかも しれない。うけとった ひとも つかまって しまうよ。']],
        'あやしい しごとは ことわって おとなに そうだん')
    ],
    shop: [
      Q('🎰', 'ガチャ モンスター',
        ['ゲームを していたら、ボタンが でてきたよ。', '「ガチャ 10かい 3000えん！ いますぐ おしてね！」'],
        [['おさない。おうちの ひとに きく', 'おかねを つかう ときは、かならず おうちの ひとに きこうね。', true],
         ['ほしいから おしちゃう', 'かってに おすと、おうちの ひとの おかねが つかわれて しまうよ。']],
        'おかねの ボタンは かってに おさない'),
      Q('📝', 'とうろく ロボ',
        ['ネットの おみせで、こんな がめんが でたよ。', '「おなまえと でんわばんごうを いれて とうろくしてね！」'],
        [['いれない。おうちの ひとに みせる', 'とうろくは おうちの ひとと いっしょに。じぶん だけで いれないよ。', true],
         ['いわれた とおりに いれる', 'いれた なまえや でんわばんごうが、わるい ひとに つかわれる ことが あるよ。']],
        'かってに とうろくしない')
    ]
  },

  /* ===== レベル2 ===== */
  2: {
    privacy: [
      Q('📸', 'しゃしん トラップ',
        ['あたらしい せいふくで しゃしんを とったよ。', 'せなかに がっこうの なまえが うつっている。SNSに のせたいな。'],
        [['のせない。がっこうや すんでいる ばしょが わかって しまう', 'しゃしんに うつった がっこうの なまえや けしきから、どこに いるか わかって しまうよ。', true],
         ['かっこいいから のせる', 'がっこうの なまえが わかると、まちぶせ される ことも あるよ。しゃしんに うつる ものに きを つけよう。']],
        'しゃしんに うつる ものに きを つける'),
      Q('🤳', 'いたずら カメラ',
        ['ともだちの へんな かおの しゃしんを とったよ。', '「おもしろいから みんなに おくろう！」と さそわれた。'],
        [['おくらない。ともだちが いやな きもちに なる', 'じぶんが されたら どう おもうかな？ あいての きもちを かんがえられたね。', true],
         ['おもしろいから おくる', 'ひとの しゃしんを かってに おくったり のせたり しては いけないよ。いちど ひろがると けせないよ。']],
        'ひとの しゃしんを かってに のせない・おくらない')
    ],
    yami: [
      Q('💰', 'うまい はなし クラブ',
        ['SNSで こんな かきこみを みつけたよ。', '「てつだうだけで 1にち 5まんえん！ くわしくは DMしてね」'],
        [['DMしない。おとなに みせて そうだんする', 'みじかい じかんで たくさん おかねが もらえる しごとは 「やみバイト」 かも しれないよ。', true],
         ['くわしく ききたいから DMする', 'DMすると、なまえや じゅうしょを きかれて、ぬけられなく なる ことが あるよ。']],
        '「たくさん おかねが もらえる」 バイトに れんらく しない'),
      Q('🪪', 'みぶんしょう ハンター',
        ['しらない ひとから メッセージが きたよ。', '「バイトを する ために、がくせいしょうの しゃしんを おくってね」'],
        [['おくらない。おうちの ひとや せんせいに そうだんする', 'がくせいしょうは だいじな こじんじょうほう。おくらなくて せいかい！', true],
         ['バイトの ためなら おくる', 'がくせいしょうには なまえ・がっこう・かおが のっている。おくると 「いえを しっているぞ」と おどされる ことが あるよ。']],
        'みぶんしょうの しゃしんは おくらない')
    ],
    shop: [
      Q('📱', 'むりょう アプリ',
        ['「むりょう！」と かいてある ゲームアプリで あそんでいたよ。', 'とちゅうで 「つづきは 500えん」と でてきた。'],
        [['おうちの ひとに きいてから きめる', 'すこしの おかねでも、おうちの ひとに きいてから。えらいね！', true],
         ['500えんなら いいかな。じぶんで かう', '「むりょう」でも とちゅうから おかねが かかる ことが あるよ。かってに つかっては いけないよ。']],
        '「むりょう」でも とちゅうで おかねが かかる ことが ある'),
      Q('💳', 'ポチッと オクトパス',
        ['おうちの ひとの スマホを かりたよ。', 'ネットの おみせに 「ボタン ひとつで かえる」と でている。ほしい ものが ある！'],
        [['かわない。おうちの ひとに 「これが ほしい」と はなす', 'ほしい ときは ことばで つたえよう。かってに かわない ことが だいじ。', true],
         ['ボタン ひとつだから おしちゃう', 'おうちの ひとの カードが とうろく されていると、ボタン ひとつで おかねが はらわれて しまうよ。']],
        'ひとの スマホで かってに かわない')
    ]
  },

  /* ===== レベル3 ===== */
  3: {
    privacy: [
      Q('🎮', 'ゲーム友だち「ナイト」',
        ['オンラインゲームで、いつも いっしょに あそぶ 人が いるよ。', '「なかよく なったし、今度 会おうよ！ どこの学校？ 近くの駅は どこ？」'],
        [['教えないし、会わない。家の人や先生に 話す', 'ネットで 知り合った人とは 会わない。学校や駅の名前も 大切な 個人情報だよ。', true],
         ['学校の名前だけなら 教えても いい', '学校の名前だけでも、どこに 住んでいるか わかって しまうよ。'],
         ['駅で 会うだけなら だいじょうぶ', 'ネットで やさしい人が、本当に やさしい人とは かぎらない。子どもに 近づこうとする 大人も いるよ。']],
        'ネットで 知り合った人と 会わない。学校名・駅名も 個人情報'),
      Q('👻', 'いいね ゴースト',
        ['クラスの グループチャットで、Aさんの 悪口が 続いているよ。', 'みんなが 悪口に 「いいね」を おしている。'],
        [['書きこまない。いいねも おさない。先生や 家の人に 相談する', '悪口に 加わらず、大人に 知らせることが Aさんを 守ることに なるよ。', true],
         ['自分も 悪口を 書く', 'ネットの悪口は 相手を 深く 傷つけるし、消すことも むずかしいよ。'],
         ['書かないけど 「いいね」だけ おす', '「いいね」も 悪口に 参加しているのと 同じ。Aさんは とても つらい 気持ちに なるよ。']],
        '悪口には 書きこまない・いいねしない・相談する'),
      Q('🔑', 'パスワード ドロボー',
        ['友だちから メッセージが 来たよ。', '「ゲームの アカウント、かして！ パスワード 教えて」'],
        [['教えない。パスワードは 家の人 以外に 教えない', 'パスワードは 家のカギと 同じ。自分で しっかり 守ろう。', true],
         ['しんゆう だから 教えても いい', '仲よしでも、パスワードが 広まると アカウントを のっとられたり、勝手に 買い物を されたり するよ。'],
         ['ゲームの チャットに 書いて 送る', 'チャットに 書いたことは ほかの人に 見られる かも しれないよ。']],
        'パスワードは だれにも 教えない')
    ],
    yami: [
      Q('🐍', 'あまい言葉 スネーク',
        ['SNSで こんな 広告を 見たよ。', '「高収入！ 荷物を 運ぶだけ！ 年れい 不問！ 即日 現金！」'],
        [['応募しない。家の人や 先生に 見せる', '「高収入」「〜だけ」「即日」は 闇バイトの よくある 言葉。見ぬけたね！', true],
         ['1回だけ やって すぐ やめる', '1回でも 犯罪に なる。そして 「やめたら ばらすぞ」と おどされて、やめられなく なるよ。'],
         ['友だちも さそって いっしょに やる', '友だちまで 危ない目に あわせて しまうよ。']],
        '「高収入」「〜だけ」「即日」は 闇バイトの サイン'),
      Q('🧑‍🦱', 'なぞの 先ぱい',
        ['SNSで 知り合った 先ぱいが 言ったよ。', '「いいバイトが あるよ。身分証の 写真を 送るだけで OK」'],
        [['ことわる。大人に 相談する', 'ことわる 勇気が 自分を 守るよ。', true],
         ['先ぱい だから 信じて 送る', '身分証を 送ると、名前や 住所を 知られて、おどしに 使われるよ。'],
         ['家族の 保険証の 写真を 送る', '家族の 情報も 大切な 個人情報。家族まで 危険に なるよ。']],
        '身分証の 写真は 送らない'),
      Q('🏦', '口座かして ゴブリン',
        ['ネットで 知り合った人から メッセージが 来たよ。', '「使っていない 銀行の 口座、かして くれたら 1万円 あげるよ」'],
        [['ことわる。口座は 人に かしたり 売ったり しない', '口座を 人に わたすことは 法律で 禁止されているよ。正しい 判断！', true],
         ['使っていない から かしても いい', '口座は 詐欺の お金の 受け取りなどに 使われて、自分が 逮捕される ことも あるよ。'],
         ['家族の 口座を かす', '家族の 口座でも 同じ。家族も 犯罪に まきこまれるよ。']],
        '口座は 人に かさない・売らない')
    ],
    shop: [
      Q('⏰', 'いそがせ タイマー',
        ['ネットを 見ていたら 広告が 出たよ。', '「今だけ 90%OFF！ あと 3分で 終わり！」'],
        [['あわてずに、家の人に 相談する', '「今だけ」「あと〇分」は あわてさせる 作戦。落ち着いて 相談できたね。', true],
         ['いそいで 買う', 'あわてると よく 考えずに 買って しまうよ。それが 相手の ねらい。'],
         ['友だちにも 教えて あげる', 'あやしい 広告を 広めると、友だちも だまされる かも しれないよ。']],
        '「今だけ」「あと〇分」に あわてない'),
      Q('🎁', 'プレゼント さぎ',
        ['メールが 来たよ。', '「おめでとう！ プレゼントに 当選！ メールアドレスと 住所を 入力してね」'],
        [['入力しない。家の人に 見せる', '応募していないのに 当選は おかしい。よく 気づいたね。', true],
         ['住所だけ 入力する', '住所が わかると 家に 来られたり、たのんでいない 物を 送りつけられたり するよ。'],
         ['全部 入力して プレゼントを もらう', '個人情報を ぬすむ わな。プレゼントは 届かないよ。']],
        '「当選しました」メールに 入力しない'),
      Q('👟', 'ニセモノ スライム',
        ['家の人と ネットで くつを 買ったよ。', '届いたら、写真と ちがう ニセモノ だった！'],
        [['家の人と いっしょに お店に 連絡する', '困ったときは 大人と いっしょに 正しい 方法で 相談しよう。', true],
         ['だまって がまんする', 'がまん しなくて いい。大人と いっしょに お店や 相談まどぐちに 連絡しよう。'],
         ['SNSで お店の 悪口を 書く', '悪口を 書くと、今度は 自分が トラブルに なるかも。正しい 方法で 相談しよう。']],
        '困ったら 大人と いっしょに 相談する')
    ]
  },

  /* ===== レベル4 ===== */
  4: {
    privacy: [
      Q('📍', '位置情報 スパイ',
        ['家の庭で撮った ペットの写真を SNSに投稿しようとしているよ。', 'スマホの写真には、撮った場所の情報（位置情報）が 記録されることが あるんだ。'],
        [['位置情報をオフにして、背景に 家や住所が分かる物が 写っていないか 確認する', '投稿前のチェックが 自分と家族を 守るよ。', true],
         ['ペットの写真だから そのまま投稿する', '写真の位置情報から、家の場所が 分かって しまうことが あるよ。'],
         ['顔が写っていなければ 何でも大丈夫', '顔がなくても、背景の建物・電柱の住所・窓からの景色などで 場所が分かるよ。']],
        '投稿前に 位置情報と 背景を チェック'),
      Q('🎭', '匿名マスク',
        ['テレビで見た 有名人に 腹が立った。', '名前を出さない 「匿名」アカウントなら、ひどいことを 書いても バレないかな？'],
        [['書かない。匿名でも 書いた人は 特定できるし、罪になることもある', '画面の向こうにも 心がある人がいる。冷静な判断だね。', true],
         ['匿名なら バレないから 書く', '「発信者情報の開示」という手続きで、誰が書いたか 調べられるよ。侮辱罪などで 罰せられることもある。'],
         ['本当のことなら 書いても いい', '本当のことでも、人の評判を下げる書き込みは 名誉毀損（めいよきそん）になることが あるよ。']],
        '匿名でも 責任がある。人を傷つける書き込みは しない'),
      Q('🎣', 'フィッシング フィッシュ',
        ['ゲーム会社を 名乗る メッセージが 届いた。', '「あなたのアカウントが 停止されます。24時間以内に こちらから ログインしてください」'],
        [['リンクを押さない。大人に見せて、公式アプリから 確認する', 'ニセのサイトに IDとパスワードを 入力させる 「フィッシング詐欺」を 見ぬいたね。', true],
         ['あわてて リンクから ログインする', 'ニセのサイトに 入力すると、アカウントを ぬすまれるよ。'],
         ['メッセージに 返信して 本物か 聞く', '返信すると 「このアドレスは 使われている」と 相手に 知らせることに なるよ。']],
        'あやしいリンクは 押さない。公式アプリで 確認')
    ],
    yami: [
      Q('⚪', 'ホワイト案件の 仮面',
        ['SNSで こんな投稿を 見つけた。', '「#ホワイト案件 #即日即金 #手渡し #運ぶだけ 安全なお仕事です！」'],
        [['応募しない。これらの言葉は 闇バイトの よくあるサイン', '「安全」とわざわざ書く仕事ほど あやしい。見ぬけたね。', true],
         ['「ホワイト」と書いてあるから 安全', '闇バイトは わざと 「ホワイト」「安全」と書いて だまそうとするよ。'],
         ['話だけ聞いて、あやしかったら 断る', '連絡した時点で、名前や連絡先を 聞き出されるよ。最初から 連絡しないことが 大切。']],
        '「ホワイト案件」「即日即金」「運ぶだけ」は 危険のサイン'),
      Q('😈', 'おどしの影',
        ['（もしもの話）バイトに応募して、身分証の写真を 送ってしまった。', '仕事の中身は 犯罪だった。断ると 「やめたら お前の家族に 何かするぞ」と言われた。'],
        [['すぐに 家の人・先生・警察（110番 や #9110）に 相談する', '警察は 相談した人や 家族を 守ってくれるよ。勇気ある 行動！', true],
         ['言われた通りに 続ける', '続けると 犯罪の 実行役として 逮捕される。相手は 守ってくれないよ。'],
         ['誰にも言わず、無視する', '一人で かかえこむのは 危険。必ず 大人と 警察に 相談しよう。']],
        '応募してしまっても すぐ相談。警察は 守ってくれる'),
      Q('🤝', '友だちの ピンチ',
        ['友だちが こっそり 話してきた。', '「SNSで すごく かせげるバイト 見つけた。お前も やる？」'],
        [['「それは 闇バイトかも」と止めて、大人に相談しようと 伝える', '友だちを 止めることも、友だちを 守る 大切な 行動だよ。', true],
         ['聞かなかったことに する', '友だちが 犯罪に まきこまれる かもしれない。見て見ぬふりは しないでね。'],
         ['いっしょに やる', '2人とも 犯罪に まきこまれて しまうよ。']],
        '友だちが さそわれたら 止めて 大人に 伝える')
    ],
    shop: [
      Q('🛍️', 'フリマ ミミック',
        ['フリマアプリで、いらなくなった ゲームを 売りたい。', 'アプリを ダウンロードしたら、会員登録の 画面が 出てきた。'],
        [['一人で登録しない。保護者と一緒に 利用ルール（年齢の条件）を確認する', '多くのフリマアプリは、未成年は 保護者の同意が 必要だよ。', true],
         ['一人で登録して 売る', '住所や名前の やりとりで トラブルになることも。一人で 始めないでね。'],
         ['親の名前で 登録する', '人の名前で 登録するのは ルール違反。トラブルの 原因に なるよ。']],
        'アプリの登録は 保護者と いっしょに'),
      Q('🔁', 'サブスク ループ',
        ['動画アプリに 「30日間 無料体験」と 出てきた。', 'よく見ると、小さな字で 「期間内に解約しないと 自動で 月額980円」と 書いてある。'],
        [['登録しない。保護者と一緒に 条件を 確認する', '小さな字まで 読めたのは すごい！', true],
         ['無料だから すぐ登録する', '無料期間が 終わると、自動で お金が かかり続けるよ。'],
         ['登録して、あとで やめれば いい', '解約を 忘れると 毎月 お金がかかる。解約の方法が 分かりにくいことも 多いよ。']],
        '「無料体験」は 自動で お金が かかる ことがある'),
      Q('🏚️', 'ニセ通販 サイト',
        ['人気のスニーカーが 定価の 80%OFFで 売っている。', '日本語が 少しおかしく、支払いは 「個人名の口座への 振込のみ」。'],
        [['買わない。ニセ通販サイトの 特徴が そろっている', '安すぎる値段・おかしな日本語・個人名の口座は ニセサイトの サイン。', true],
         ['安いから 急いで 買う', 'お金を払っても 商品が 届かないよ。'],
         ['先に お金を 振り込んで 様子を見る', '振り込んだお金を 取りもどすのは とても むずかしいよ。']],
        '安すぎる・日本語が変・個人名の口座 は ニセサイト')
    ]
  },

  /* ===== レベル5 ===== */
  5: {
    privacy: [
      Q('💌', 'やさしい 仮面',
        ['SNSで 何か月も やりとりしている人がいる。悩みも 聞いてくれて、とても やさしい。', '「キミのこと もっと知りたいな。顔写真 送ってくれない？ ぼくも 送るから」'],
        [['送らない。しつこい場合は ブロックし、大人に 相談する', '写真は 一度送ると 取り消せない。体の写真などを 求められたら 絶対に送らず、すぐ 大人に 相談しよう。', true],
         ['相手が 先に送ってくれたら 送る', '相手の写真が 本物とは かぎらない。他人の写真で 信用させる 手口が あるよ。'],
         ['顔の 一部だけなら 送る', '一部でも、送った写真は 保存・加工・拡散 されるかもしれない。'],
         ['加工アプリで 顔を変えてから 送る', '加工しても 元にもどせることがある。送ること自体が 相手の要求に 応える 一歩に なってしまうよ。']],
        '写真は 一度送ると 取り消せない（デジタルタトゥー）'),
      Q('🛡️', 'ことばの 剣',
        ['SNSで、自分のことを 悪く 書かれているのを 見つけた。', 'くやしくて、悲しくて、言い返したく なった。'],
        [['返信せず、スクリーンショットで 証拠を残し、大人に相談。運営への 通報も 考える', '反応しない・証拠を残す・相談する。これが 被害にあったときの 正しい 行動だよ。', true],
         ['同じくらい ひどい言葉で 言い返す', '言い返すと 争いが 大きくなり、自分も 加害者に なってしまう。'],
         ['書いた人を さがして、名前を ネットに さらす', '人の 個人情報を さらすことは、それ自体が 大きな問題に なるよ。'],
         ['だれにも 言わず、一人で がまんする', '一人で かかえこまないで。相談すれば 削除依頼などの 方法が あるよ。']],
        '被害にあったら：反応しない・証拠を残す・相談する'),
      Q('🐉', 'デマ拡散 ドラゴン',
        ['大きな地震のあと、こんな投稿が たくさん シェアされている。', '「動物園から ライオンが にげた！ 拡散して！」（写真つき）'],
        [['すぐに シェアしない。自治体や ニュースなど 公式の情報で 確かめる', '確かめてから 行動できたね。実際の地震でも この デマが広がり、最初に 投稿した人が 逮捕されたことが あるよ。', true],
         ['みんなを 守るために すぐ シェアする', 'よかれと思っても、うそ（デマ）を広めると 混乱を 大きくしてしまうよ。'],
         ['「いいね」だけ おす', '「いいね」で、ほかの人の 画面にも 表示されやすく なることが あるよ。'],
         ['「本当？」と コメントを つけて シェアする', '「本当？」と書いても、シェアすれば 広めていることに なるよ。']],
        'シェアする前に 確かめる。デマを 広めない')
    ],
    yami: [
      Q('🎭', '指示役の 声',
        ['闇バイトの 募集係が 言っている。', '「顔も名前も出さないから 絶対つかまらない。荷物を受け取るだけ。何かあっても 弁護士を つけてあげる」'],
        [['うそだと 見ぬく。つかまるのは 現場で動く人。断って 相談する', '指示役は 実行役を 使い捨てにする。よく 見ぬいたね。', true],
         ['「絶対 つかまらない」なら やってみる', '防犯カメラなどで、実行役は すぐ 特定されるよ。'],
         ['弁護士が いるなら 安心', '指示役が 助けてくれることは ないよ。連絡が 取れなくなるだけ。'],
         ['荷物の中身を 知らなければ 罪にならない', '「あやしいと 分かっていた」と判断されれば 罪に問われる。「知らなかった」では すまされないことが 多いよ。']],
        '「つかまらない」「守ってあげる」は うそ。実行役が 逮捕される'),
      Q('📲', '名義貸し ゴースト',
        ['ネットで 知り合った人から メッセージ。', '「スマホを 新しく契約して、そのまま わたしてくれたら 3万円あげる。損は しないでしょ？」'],
        [['断る。自分名義の スマホや 口座を 人にわたすことは 犯罪になる', '自分の名前を 貸すことは、犯罪の道具を わたすことと 同じだよ。', true],
         ['スマホ 1台なら 大丈夫', '人にわたす目的で 契約したり わたしたりするのは 法律違反。詐欺などに 使われるよ。'],
         ['家族に 契約してもらって わたす', '家族を 犯罪に まきこむことに なるよ。'],
         ['SIMカードだけ わたす', 'SIMカードだけでも 同じ。犯罪の道具に なってしまう。']],
        '口座・スマホ・SIMカードは 人にわたさない・売らない'),
      Q('🧭', 'ぬけ出す 勇気',
        ['（もしもの話）友だちが 闇バイトの指示で、一度 荷物を 運んでしまった。', '「もう 抜けられない。警察に言ったら 自分も つかまるし…」と 泣いている。'],
        [['「今すぐ 大人と警察に 相談しよう」と伝え、一緒に 大人に 話す', '早く相談するほど、本人も家族も 守ってもらいやすい。友だちを 救う 行動だよ。', true],
         ['「つかまるから 黙っていよう」と言う', '黙っていると 次の犯罪を させられ、もっと 深刻に なるよ。'],
         ['指示役に 直接 「やめさせて」と 連絡する', '相手は 犯罪グループ。直接 連絡するのは とても 危険。'],
         ['自分たちで 指示役を さがし出す', '危険すぎる。必ず 警察に まかせよう。']],
        '途中でも 抜けられる。すぐ 大人・警察（110・#9110）へ')
    ],
    shop: [
      Q('💸', '課金の 落とし穴',
        ['親のスマホで ゲームをしていたら、気づかないうちに 課金が 1万円を こえていた。', '親は まだ 気づいていない…。'],
        [['正直に 親に話す。必要なら 消費生活センター（188）に 相談する', '早く話すほど 対応しやすい。未成年の契約は 取り消せる場合も あるよ。', true],
         ['バレないように 黙っておく', 'あとで 請求が来て 必ず分かる。時間がたつほど 対応が むずかしくなるよ。'],
         ['自分の おこづかいで こっそり 返す', 'こっそりでは 解決しない。課金の設定を 見直すことも 必要だよ。'],
         ['「友だちが やった」と 言う', 'うそは 信頼を なくす。正直に 話すことが 一番の 近道だよ。']],
        '困ったら 正直に話す。相談先は 188（消費者ホットライン）'),
      Q('🧴', '定期購入の ワナ',
        ['SNSの広告で 「初回 たった500円！ ニキビが すぐ消える！」という サプリを 見つけた。', '注文画面の いちばん下に 小さな字で 「5回以上の継続が条件・2回目以降 各8,000円」と 書いてある。'],
        [['注文しない。条件を 最後まで読み、保護者に 相談する', '最後まで 読めたから わなに 気づけたね。', true],
         ['初回 500円なら 安いから 注文する', '実は 「定期購入」。合計 3万2,500円も 払うことに なるよ。'],
         ['1回目だけ 買って すぐ解約する', '「〇回以上の 購入が条件」だと すぐには 解約できないことが 多いよ。'],
         ['「すぐ消える」と 書いてあるから 信じる', '「すぐ」「必ず」など 効果を 言いすぎる広告には 注意が 必要だよ。']],
        '「初回だけ安い」は 定期購入かも。条件を 最後まで 読む'),
      Q('🎫', 'カード番号 どろぼう',
        ['ネットで 知り合った人から 「ゲームのアイテムを 安く売るよ」と 言われた。', '「コンビニで ギフトカードを 買って、カードの番号を 写真で 送って」'],
        [['送らない。カードの番号を 送らせるのは 詐欺の 手口', '番号を 送らせる 支払いは 詐欺の 典型。よく 気づいたね。', true],
         ['番号だけなら 大丈夫', '番号を 送った時点で、お金を 使われて しまうよ。'],
         ['先に 半分だけ 送る', '半分でも だまし取られる。残りも 要求されるよ。'],
         ['親の お金で 買って 送る', '家族の お金まで だまし取られて しまうよ。']],
        '「カードの番号を 送って」は 詐欺。個人どうしの 取引に 注意')
    ]
  }
};

/* ---------- 保存 ---------- */
const store = {
  load() {
    try { return JSON.parse(localStorage.getItem(SAVE_KEY)) || null; } catch (e) { return null; }
  },
  save(data) {
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(data)); } catch (e) { /* 保存できなくても動作する */ }
  },
  clear() {
    try { localStorage.removeItem(SAVE_KEY); } catch (e) { /* noop */ }
  }
};

/* ---------- 状態 ---------- */
let S = { avatar: null, level: 1, cleared: {}, exp: 0, speak: false, big: false };
let run = null; // 冒険中の状態
let $screen, $topbar;
const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function saveState() { store.save(S); }

/* ---------- よみあげ ---------- */
function cleanForSpeech(text) {
  return String(text)
    .replace(/\p{Extended_Pictographic}/gu, '')
    .replace(/[\u200d\ufe0f]/g, '')
    .replace(/○○|〇/g, 'まるまる')
    .replace(/#9110/g, 'シャープ きゅう いち いち まる')
    .replace(/188/g, 'いち はち はち');
}

function speak(text) {
  if (!('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(cleanForSpeech(text));
    u.lang = 'ja-JP';
    u.rate = 0.9;
    window.speechSynthesis.speak(u);
  } catch (e) { /* noop */ }
}

function stopSpeak() {
  try { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); } catch (e) { /* noop */ }
}

/* ---------- 文字送り ---------- */
const TW = { timer: null, el: null, chars: [], done: null };

function typeText(el, text, done) {
  stopType();
  TW.el = el;
  TW.chars = Array.from(text);
  TW.done = done || null;
  if (reducedMotion) { finishType(); return; }
  let i = 0;
  el.textContent = '';
  TW.timer = setInterval(() => {
    i += 1;
    el.textContent = TW.chars.slice(0, i).join('');
    if (i >= TW.chars.length) finishType();
  }, 40);
}

function finishType() {
  if (!TW.el) return;
  clearInterval(TW.timer);
  TW.timer = null;
  TW.el.textContent = TW.chars.join('');
  const d = TW.done;
  TW.el = null;
  TW.done = null;
  if (d) d();
}

function stopType() {
  clearInterval(TW.timer);
  TW.timer = null;
  TW.el = null;
  TW.done = null;
}

function isTyping() { return TW.timer !== null; }

/* ---------- 共通 ---------- */
function render(html) {
  stopType();
  $screen.innerHTML = html;
  window.scrollTo(0, 0);
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function stars(n) { return '★'.repeat(n) + '☆'.repeat(5 - n); }

function isCleared(level, area) { return !!(S.cleared[level] && S.cleared[level][area]); }
function levelDone(level) { return AREA_ORDER.every(a => isCleared(level, a)); }

function updateTopbar() {
  const show = !!S.avatar;
  $topbar.classList.toggle('hidden', !show);
  if (!show) return;
  document.getElementById('tbAvatar').textContent = S.avatar.e;
  document.getElementById('tbName').textContent = S.avatar.n;
  document.getElementById('tbLevel').textContent = 'レベル' + S.level + '　' + stars(S.level);
  document.getElementById('tbExp').textContent = '⭐' + S.exp;
  document.getElementById('btnSpeak').textContent = S.speak ? '🔊' : '🔇';
  const hp = document.getElementById('tbHp');
  if (run) {
    hp.textContent = '❤️'.repeat(run.hp) + '🤍'.repeat(MAX_HP - run.hp);
    hp.classList.remove('hidden');
  } else {
    hp.textContent = '';
    hp.classList.add('hidden');
  }
}

/* =========================================
   画面
   ========================================= */

/* タイトル */
function showTitle() {
  run = null;
  updateTopbar();
  $topbar.classList.add('hidden');
  const saved = store.load();
  render(`
    <section class="title-screen">
      <div class="logo">
        <span class="logo-shield">🛡️</span>
        <h1>ネットまもり<br>クエスト</h1>
        <p class="sub">〜 ネットの わなを のりこえろ！ 〜</p>
      </div>
      <button class="btn primary" data-act="newGame">▶ はじめから</button>
      ${saved && saved.avatar ? '<button class="btn" data-act="continue">▶ つづきから（' + saved.avatar.n + '）</button>' : ''}
      <details class="teacher">
        <summary>先生・保護者の方へ（使い方）</summary>
        <p>ネットの危険（個人情報・誹謗中傷／闇バイト／ネットショッピング・課金）を、RPG形式の選択問題で体験的に学ぶ教材です。間違えても解説を読んで選び直せるので、失敗から学べる構成にしています。</p>
        <table>
          <tr><th>Lv</th><th>内容の目安</th></tr>
          ${Object.keys(LEVELS).map(k => `<tr><td>${k}</td><td>${LEVELS[k].teacher}</td></tr>`).join('')}
        </table>
        <p>・各エリア：Lv1〜2は2問、Lv3〜5は3問。3エリアをクリアすると認定証（印刷可）が出ます。<br>
        ・🔇/🔊ボタンで読み上げ、「あA」で文字の拡大ができます。キーボードの数字キー（1〜4）でも選べます。<br>
        ・進み具合はこの端末のブラウザに保存されます。<br>
        ・「もしもの話」の場面（脅された後の対応など）は、事前に「練習のお話」であることを伝えると安心して取り組めます。</p>
      </details>
    </section>
  `);
}

/* キャラクター選択 */
function showAvatar() {
  run = null;
  $topbar.classList.add('hidden');
  render(`
    <h2>ゆうしゃを えらぼう</h2>
    <div class="tip">💡 ネットでは ほんとうの なまえは つかわないよ。<br>ニックネームの ゆうしゃを えらんでね。</div>
    <div class="avatar-grid">
      ${AVATARS.map((a, i) => `
        <button class="avatar-card" data-act="pickAvatar" data-i="${i}">
          <span class="emoji">${a.e}</span><span>${a.n}</span>
        </button>`).join('')}
    </div>
  `);
  speakIf('ゆうしゃを えらぼう。ネットでは ほんとうの なまえは つかわないよ。');
}

/* レベル選択 */
function showLevel() {
  run = null;
  updateTopbar();
  render(`
    <h2>レベルを えらぼう</h2>
    <p class="lead">じぶんに あった レベルを えらんでね</p>
    <div class="level-list">
      ${Object.keys(LEVELS).map(k => {
        const L = LEVELS[k];
        const n = Number(k);
        return `
        <button class="level-card" data-act="pickLevel" data-lv="${n}">
          <span class="lv-num">${n}</span>
          <span class="lv-body">
            <span class="lv-name">${L.name}</span>
            <span class="lv-stars">${stars(n)}</span>
            <span class="lv-note">${L.note}</span>
          </span>
          ${levelDone(n) ? '<span class="lv-done">🏆</span>' : ''}
        </button>`;
      }).join('')}
    </div>
    <button class="btn small" data-act="toAvatar">ゆうしゃを えらびなおす</button>
  `);
  speakIf('レベルを えらぼう');
}

/* マップ */
function showMap() {
  run = null;
  updateTopbar();
  const all = levelDone(S.level);
  render(`
    <h2>🗺️ ぼうけんの マップ</h2>
    <p class="lead">レベル${S.level}「${LEVELS[S.level].name}」　いきたい ばしょを えらんでね</p>
    <div class="map-grid">
      ${AREA_ORDER.map(id => {
        const A = AREAS[id];
        const n = DATA[S.level][id].length;
        return `
        <button class="area-card ${A.theme}" data-act="startArea" data-area="${id}">
          ${isCleared(S.level, id) ? '<span class="a-badge">クリア ' + A.badge + '</span>' : ''}
          <span class="a-icon">${A.icon}</span>
          <span class="a-name">${A.name}</span>
          <span class="a-topic">${A.topic}</span>
          <span class="a-topic">もんだい ${n}もん</span>
        </button>`;
      }).join('')}
    </div>
    <div class="map-footer">
      ${all ? '<button class="btn primary" data-act="ending">🏆 にんていしょうを もらう</button>' : ''}
      <button class="btn small" data-act="toLevel">レベルを かえる</button>
    </div>
  `);
  speakIf(all ? 'ぜんぶ クリア！ にんていしょうを もらおう' : 'いきたい ばしょを えらんでね');
}

/* ---------- 冒険 ---------- */
function startArea(areaId) {
  run = {
    area: areaId,
    list: DATA[S.level][areaId],
    idx: 0,
    hp: MAX_HP,
    line: 0,
    phase: 'lines',
    order: [],
    disabled: new Set()
  };
  showQuestion();
}

function cur() { return run.list[run.idx]; }

function showQuestion() {
  const q = cur();
  const A = AREAS[run.area];
  run.line = 0;
  run.phase = 'lines';
  run.disabled = new Set();
  run.order = shuffle(q.choices);
  updateTopbar();
  render(`
    <section class="scene">
      <div class="scene-head">
        <span>${A.icon} ${A.name}</span>
        <span class="q-progress" aria-label="もんだい ${run.idx + 1} / ${run.list.length}">
          ${run.list.map((_, i) => `<span class="q-dot ${i < run.idx ? 'done' : (i === run.idx ? 'now' : '')}"></span>`).join('')}
        </span>
      </div>
      <div class="stage ${A.theme}" id="stage">
        <div class="hero" id="hero"><span class="emoji">${S.avatar.e}</span><span class="tag">${S.avatar.n}</span></div>
        <div class="vs">VS</div>
        <div class="enemy" id="enemy"><span class="emoji">${q.npc}</span><span class="tag">${q.who}</span></div>
      </div>
      <div class="msgbox" id="msgbox" data-act="advance" role="button" tabindex="0" aria-label="メッセージ。タップで つぎへ">
        <span class="speaker" id="speaker">${q.who}</span>
        <button class="read-btn" data-act="read" aria-label="よみあげ">🔈</button>
        <p class="msgtext" id="msgtext"></p>
        <span class="next-ind" id="nextInd">▼</span>
      </div>
      <p class="tap-hint" id="tapHint">メッセージを タップすると つぎへ すすむよ</p>
      <div class="choices" id="choices"></div>
    </section>
  `);
  showLine();
}

function showLine() {
  const q = cur();
  const text = q.lines[run.line];
  const el = document.getElementById('msgtext');
  document.getElementById('nextInd').classList.add('hidden');
  typeText(el, text, () => {
    const ind = document.getElementById('nextInd');
    if (ind) ind.classList.remove('hidden');
  });
  speakIf(text);
}

function advance() {
  if (!run || run.phase !== 'lines') return;
  if (isTyping()) { finishType(); return; }
  run.line += 1;
  if (run.line < cur().lines.length) showLine();
  else showChoices();
}

function showChoices(msg) {
  const q = cur();
  run.phase = 'choose';
  document.getElementById('speaker').textContent = S.avatar.n;
  document.getElementById('nextInd').classList.add('hidden');
  const hint = document.getElementById('tapHint');
  if (hint) hint.classList.add('hidden');
  const text = msg || q.q;
  typeText(document.getElementById('msgtext'), text);
  const box = document.getElementById('choices');
  box.innerHTML = run.order.map((c, i) => `
    <button class="choice" data-act="choose" data-i="${i}" ${run.disabled.has(i) ? 'disabled' : ''} style="animation-delay:${i * 0.08}s">
      <span class="num">${i + 1}</span><span>${c.t}</span>
    </button>`).join('');
  speakIf(text + '。' + run.order.map((c, i) => run.disabled.has(i) ? '' : (i + 1) + 'ばん、' + c.t).join('。'));
  const first = box.querySelector('.choice:not(:disabled)');
  if (first && !reducedMotion) setTimeout(() => { first.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 200);
}

function choose(i) {
  if (!run || run.phase !== 'choose' || run.disabled.has(i)) return;
  const c = run.order[i];
  const q = cur();
  run.phase = 'feedback';
  stopType();

  if (c.ok) {
    S.exp += 10;
    saveState();
    const hero = document.getElementById('hero');
    const enemy = document.getElementById('enemy');
    if (hero) hero.classList.add('attack');
    if (enemy) enemy.classList.add('hit');
    updateTopbar();
    setTimeout(() => {
      showFeedback(true, c, q);
    }, reducedMotion ? 0 : 700);
  } else {
    run.hp = Math.max(0, run.hp - 1);
    run.disabled.add(i);
    const stage = document.getElementById('stage');
    if (stage) { stage.classList.remove('shake'); void stage.offsetWidth; stage.classList.add('shake'); }
    updateTopbar();
    showFeedback(false, c, q);
  }
}

function showFeedback(ok, c, q) {
  const fairy = !ok && run.hp <= 0;
  const html = `
    <div class="overlay" id="overlay">
      <div class="feedback ${ok ? 'ok' : 'ng'}" role="dialog" aria-modal="true">
        <div class="fb-head"><span class="fb-icon">${ok ? '⭕' : '⚠️'}</span>${ok ? 'せいかい！' : 'あぶない！'}</div>
        <p class="fb-text">${c.f}</p>
        ${ok ? `<div class="rule-card"><span class="rc-label">📜 まもりの おきて</span>${q.rule}</div>
                <p class="fb-gain">⭐ +10　${q.who}を やっつけた！</p>` : ''}
        ${fairy ? `<div class="fairy">🧚 ハートが なくなったよ。でも だいじょうぶ！<br>まちがえても、かんがえなおせば いいんだよ。こまったときは おとなに そうだんしようね。ハートを かいふく したよ！</div>` : ''}
        <button class="btn primary" id="fbBtn" data-act="${ok ? 'nextQ' : 'retry'}">
          ${ok ? (run.idx + 1 < run.list.length ? 'つぎへ すすむ ▶' : 'エリア クリア！ ▶') : 'もういちど かんがえる'}
        </button>
      </div>
    </div>`;
  $screen.insertAdjacentHTML('beforeend', html);
  const btn = document.getElementById('fbBtn');
  if (btn) btn.focus();
  speakIf((ok ? 'せいかい！ ' : 'あぶない！ ') + c.f + (ok ? ' まもりの おきて。' + q.rule : '') + (fairy ? ' ハートを かいふく したよ。' : ''));
}

function closeOverlay() {
  const o = document.getElementById('overlay');
  if (o) o.remove();
}

function retry() {
  closeOverlay();
  if (run.hp <= 0) run.hp = MAX_HP;
  updateTopbar();
  showChoices('もういちど かんがえよう。どうする？');
}

function nextQ() {
  closeOverlay();
  run.idx += 1;
  if (run.idx < run.list.length) showQuestion();
  else areaClear();
}

/* エリアクリア */
function areaClear() {
  const A = AREAS[run.area];
  const rules = run.list.map(q => q.rule);
  if (!S.cleared[S.level]) S.cleared[S.level] = {};
  S.cleared[S.level][run.area] = true;
  S.exp += 30;
  saveState();
  run = null;
  updateTopbar();
  const all = levelDone(S.level);
  render(`
    <section class="clear-screen">
      <h2>🎉 ${A.name} クリア！</h2>
      <div class="clear-badge">${A.badge}</div>
      <p>${S.avatar.n}は 「${A.topic}」の わなを のりこえた！<br><strong style="color:var(--gold)">ボーナス ⭐+30</strong></p>
      <h3>📜 おぼえた まもりの おきて</h3>
      <ol class="rule-list">${rules.map(r => `<li>${r}</li>`).join('')}</ol>
      ${all ? '<button class="btn primary" data-act="ending">🏆 ぜんぶ クリア！ にんていしょうを もらう</button>' : ''}
      <button class="btn ${all ? '' : 'primary'}" data-act="goMap">🗺️ マップに もどる</button>
    </section>
  `);
  speakIf(A.name + ' クリア！ おぼえた まもりの おきて。' + rules.join('。'));
}

/* エンディング（認定証） */
function showEnding() {
  run = null;
  updateTopbar();
  const d = new Date();
  const date = d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日';
  const high = S.level >= 3;
  render(`
    <section class="certificate" id="cert">
      <h2>にんていしょう</h2>
      <div class="cert-avatar">${S.avatar.e}</div>
      <div class="cert-name">${S.avatar.n} さん</div>
      <p class="cert-body">あなたは ネットまもりクエスト レベル${S.level}「${LEVELS[S.level].name}」の ぼうけんを すべて クリアしました。ネットの わなに まけない ちからを みにつけた 「ネットまもり ゆうしゃ」で あることを ここに みとめます。</p>
      <ol class="okite">
        <li>じぶんや ひとの ひみつ（こじんじょうほう）を まもる</li>
        <li>ネットで わるぐちを かかない・ひろめない</li>
        <li>「かんたんに おかねが もらえる」はなしに のらない</li>
        <li>かってに かわない・とうろくしない</li>
        <li>こまったら すぐ おとなに そうだんする</li>
      </ol>
      ${high ? `<div class="contact"><strong>こまったときの そうださき</strong><br>
        ・きけんが せまっている → <strong>110</strong>（けいさつ）<br>
        ・けいさつに そうだんしたい → <strong>#9110</strong><br>
        ・かいもの・けいやくの トラブル → <strong>188</strong>（しょうひしゃ ホットライン）</div>` : ''}
      <p class="cert-date">${date}　⭐ ${S.exp}</p>
    </section>
    <div class="btn-row no-print">
      <button class="btn" data-act="print">🖨️ いんさつする</button>
      <button class="btn primary" data-act="toLevel">ほかの レベルに ちょうせん</button>
    </div>
    <button class="btn small no-print" data-act="resetAll">さいしょから やりなおす（きろくを けす）</button>
  `);
  speakIf('おめでとう！ にんていしょう。' + S.avatar.n + 'さんは、ネットまもり ゆうしゃ です。');
}

function speakIf(text) { if (S.speak) speak(text); }

/* =========================================
   操作
   ========================================= */
function handleAction(act, el) {
  switch (act) {
    case 'newGame':
      S = { avatar: null, level: 1, cleared: {}, exp: 0, speak: S.speak, big: S.big };
      showAvatar();
      break;
    case 'continue': {
      const saved = store.load();
      if (saved) S = Object.assign(S, saved);
      document.body.classList.toggle('big', !!S.big);
      showMap();
      break;
    }
    case 'pickAvatar':
      S.avatar = AVATARS[Number(el.dataset.i)];
      saveState();
      showLevel();
      break;
    case 'toAvatar': showAvatar(); break;
    case 'pickLevel':
      S.level = Number(el.dataset.lv);
      saveState();
      showMap();
      break;
    case 'toLevel': showLevel(); break;
    case 'startArea': startArea(el.dataset.area); break;
    case 'advance': advance(); break;
    case 'read': {
      const t = document.getElementById('msgtext');
      if (t) { if (isTyping()) finishType(); speak(t.textContent); }
      break;
    }
    case 'choose': choose(Number(el.dataset.i)); break;
    case 'retry': retry(); break;
    case 'nextQ': nextQ(); break;
    case 'goMap':
      if (!S.avatar) return;
      if (run && !window.confirm('マップに もどる？（いまの エリアは はじめから やりなおしに なるよ）')) return;
      closeOverlay();
      stopSpeak();
      showMap();
      break;
    case 'ending': showEnding(); break;
    case 'print': window.print(); break;
    case 'resetAll':
      if (window.confirm('きろくを ぜんぶ けして、さいしょから やりなおしますか？')) {
        store.clear();
        S = { avatar: null, level: 1, cleared: {}, exp: 0, speak: S.speak, big: S.big };
        showTitle();
      }
      break;
    case 'toggleSpeak':
      S.speak = !S.speak;
      if (!S.speak) stopSpeak();
      saveState();
      updateTopbar();
      if (S.speak) speak('よみあげを オンに したよ');
      break;
    case 'toggleBig':
      S.big = !S.big;
      document.body.classList.toggle('big', S.big);
      saveState();
      break;
    default: break;
  }
}

function init() {
  $screen = document.getElementById('screen');
  $topbar = document.getElementById('topbar');

  const saved = store.load();
  if (saved) {
    S.speak = !!saved.speak;
    S.big = !!saved.big;
    document.body.classList.toggle('big', S.big);
  }

  document.addEventListener('click', e => {
    const el = e.target.closest('[data-act]');
    if (!el) return;
    if (el.disabled) return;
    // メッセージ内のよみあげボタンは、文字送りを進めない
    if (el.dataset.act === 'read') e.stopPropagation();
    handleAction(el.dataset.act, el);
  });

  document.addEventListener('keydown', e => {
    if (e.target && (e.target.tagName === 'BUTTON' || e.target.tagName === 'SUMMARY') && (e.key === 'Enter' || e.key === ' ')) {
      if (e.target.id !== 'msgbox') return; // ボタンは標準の動作にまかせる
    }
    const overlay = document.getElementById('overlay');
    if (overlay) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const b = document.getElementById('fbBtn');
        if (b) b.click();
      }
      return;
    }
    if (!run) return;
    if (run.phase === 'lines' && (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight')) {
      e.preventDefault();
      advance();
    } else if (run.phase === 'choose' && /^[1-4]$/.test(e.key)) {
      const i = Number(e.key) - 1;
      if (i < run.order.length) choose(i);
    }
  });

  showTitle();
}

window.addEventListener('DOMContentLoaded', init);
