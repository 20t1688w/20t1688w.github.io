// ============================================================
// gameData.js  ─  キャラクター・スキル・アイテム・敵・シナリオ
// ============================================================

const PLAYER_INITIAL = {
  name:"Natsumi", level:19,
  maxHp:420, hp:420, maxMp:180, mp:180,
  attack:48, defense:32, speed:65, exp:0, bond:10,
  stats:{ charm:85, power:25, wisdom:80 },
};

const PARTNER_INITIAL = {
  name:"Masaya", level:23,
  maxHp:380, hp:380, maxMp:80, mp:80,
  attack:72, defense:48, speed:80, ko:false, bond:10,
  stats:{ charm:80, power:85, wisdom:50 },
};

// Natsumiのスキル
const SKILLS_DATA = [
  { id:"smile",    name:"スマイル",          emoji:"✨", mpCost:15, type:"attack", powerMultiplier:1.6, description:"魅力で敵を魅了する" },
  { id:"inspire",  name:"インスピレーション", emoji:"💡", mpCost:28, type:"attack", powerMultiplier:2.4, description:"賢さで強力な一撃！" },
  { id:"hug",      name:"ハグ",              emoji:"💕", mpCost:10, type:"heal",   healAmount:80,       description:"HPを80回復する" },
  { id:"teamwork", name:"コンビネーション",   emoji:"💞", mpCost:40, type:"attack", powerMultiplier:3.0, description:"Masayaとの連携攻撃！", partnered:true },
];

// Masayaのスキル
const MASAYA_SKILLS_DATA = [
  { id:"cover", name:"庇う",  emoji:"🛡️", mpCost:10, type:"cover",  description:"Natsumiへの攻撃を代わりに受ける" },
  { id:"smash", name:"強打",  emoji:"💥", mpCost:15, type:"attack", powerMultiplier:1.8, description:"強力な一撃！" },
  { id:"cheer", name:"激励",  emoji:"📣", mpCost:20, type:"boost",  description:"Natsumiの次の攻撃力＋50%" },
];

const ITEMS_DATA = [
  { id:"potion",     name:"ポーション",     emoji:"🧪", count:3, healAmount:100, mpRestore:0,  description:"HPを100回復" },
  { id:"elixir",     name:"エーテル",       emoji:"💎", count:2, healAmount:0,   mpRestore:60, description:"MPを60回復" },
  { id:"megaPotion", name:"メガポーション", emoji:"💊", count:1, healAmount:250, mpRestore:0,  description:"HPを250回復" },
];

// speed: 素早さ（行動順を決定）
const ENEMIES_DATA = {
  wildBear:      { id:"wildBear",      name:"野生のネコ",            emoji:"🐱",  maxHp:200, attack:28, defense:12, speed:40, exp:100,  chapter:1, boss:false, bonus:false, description:"自然の中で突然現れた！",       bgColor:"#0d1f0d", borderColor:"#16a34a" },
  hardPuzzle:    { id:"hardPuzzle",    name:"難しいパズル",          emoji:"🧩",  maxHp:320, attack:30, defense:18, speed:45, exp:160,  chapter:2, boss:false, bonus:false, description:"ボードゲームカフェの難問！",     bgColor:"#1e1b4b", borderColor:"#7c3aed" },
  christmasTree: { id:"christmasTree", name:"クリスマスツリー",     emoji:"🎄",  maxHp:500, attack:42, defense:25, speed:35, exp:450,  chapter:2, boss:false, bonus:true,  description:"ボーナスバトル！大量経験値！",   bgColor:"#1c1200", borderColor:"#d97706" },
  sasikama:      { id:"sasikama",      name:"笹かま大将",            emoji:"🍱",  maxHp:280, attack:35, defense:20, speed:55, exp:190,  chapter:2, boss:false, bonus:false, description:"仙台名物が立ちはだかる！",       bgColor:"#0f1e1a", borderColor:"#0d9488" },
  iceCreamCake:  { id:"iceCreamCake",  name:"31アイスクリームケーキ", emoji:"🍰",  maxHp:360, attack:38, defense:18, speed:48, exp:600,  chapter:2, boss:false, bonus:true,  description:"甘くて強力なボーナスボス！",     bgColor:"#1a0a1a", borderColor:"#ec4899" },
  frenchDinner:  { id:"frenchDinner",  name:"豪華フレンチコース",    emoji:"🍽️",  maxHp:400, attack:45, defense:25, speed:50, exp:700,  chapter:2, boss:false, bonus:true,  description:"Masayaの誕生日ボーナス！",       bgColor:"#1a1000", borderColor:"#f59e0b" },
  rollercoaster: { id:"rollercoaster", name:"絶叫コースター",        emoji:"🎢",  maxHp:420, attack:55, defense:22, speed:72, exp:320,  chapter:2, boss:false, bonus:false, description:"富士急の恐怖に打ち勝て！",       bgColor:"#1a0505", borderColor:"#ef4444" },
  accenture:     { id:"accenture",     name:"大企業の壁",            emoji:"🏢",  maxHp:650, attack:65, defense:42, speed:58, exp:520,  chapter:3, boss:false, bonus:false, description:"Masayaの前に立ちはだかる！",     bgColor:"#0a0f1a", borderColor:"#3b82f6" },
  anxiety:       { id:"anxiety",       name:"この先の不安",          emoji:"🌑",  maxHp:999, attack:85, defense:55, speed:62, exp:1200, chapter:3, boss:true,  bonus:false, description:"二人の絆で乗り越えろ！",         bgColor:"#0f0510", borderColor:"#9333ea" },
  anxietyFinal:  { id:"anxietyFinal",  name:"不安の残骸",            emoji:"💥",  maxHp:300, attack:70, defense:30, speed:68, exp:0,    chapter:3, boss:true,  bonus:false, description:"最後の一撃で終わらせろ！",       bgColor:"#0f0510", borderColor:"#f43f5e" },
};

const SCENARIO = [
  // ─── 第1章 ───
  { type:"dialogue", id:"ch1_intro", bgColor:"#050d10",
    pages:[
      { speaker:"ナレーション", emoji:"📖", text:"第1章：出会い" },
      { speaker:"ナレーション", emoji:"🚗", text:"ドライブで自然豊かな場所へ。広大な緑の中、二人は並んで歩いた。" },
      { speaker:"Masaya",     emoji:"👨", text:"やっぱり田舎は空気が美味しいし、景色がいいね。" },
      { speaker:"Natsumi",    emoji:"👩", text:"うん…なんか、遠くまで来た感じがして、不思議な感覚。" },
    ],
  },
  { type:"battle", enemyId:"wildBear" },
  { type:"dialogue", id:"ch1_hanabi", bgColor:"#050a1a",
    pages:[
      { speaker:"ナレーション", emoji:"🎆", text:"静かな公園で線香花火の明かりが灯る。二人は並んで、静かにその光を見つめていた。" },
      { speaker:"Masaya",     emoji:"👨", text:"…ねえ、なつみちゃん。" },
      { speaker:"Natsumi",    emoji:"👩", text:"え、なに？" },
      { speaker:"Masaya",     emoji:"👨", text:"僕、Natsumiちゃんのことが好きです。付き合いたいと思ってる" },
      { speaker:"Natsumi",    emoji:"👩", text:"Masayaが真剣な目で見ている。どう答える？",
        choices:[
          { label:"💗 付き合う！", bondDelta:20, branchId:"ch1_yes" },
          { label:"😶 断る…",                   branchId:"ch1_no"  },
        ],
      },
    ],
    branches:{
      ch1_yes:[
        { speaker:"Natsumi",    emoji:"👩", text:"…うん！私も、好きだよ。これからよろしくね。" },
        { speaker:"Masaya",     emoji:"👨", text:"よかった、付き合えて... こちらこそよろしくね。" },
        { speaker:"ナレーション", emoji:"💑", text:"暗闇の中で、二人の関係が始まった。\n連携 ＋20！" },
      ],
      ch1_no:[
        { speaker:"Natsumi",    emoji:"👩", text:"ごめん、私…" },
        { speaker:"ナレーション", emoji:"💔", text:"物語は終わってしまった…", gameOver:true },
      ],
    },
  },
  // ─── 第2章 ───
  { type:"dialogue", id:"ch2_intro", bgColor:"#0a0a0a",
    pages:[
      { speaker:"ナレーション", emoji:"📖", text:"第2章：楽しい日々" },
      { speaker:"ナレーション", emoji:"🎲", text:"ボードゲームカフェへ。二人は難しいゲームに挑戦した。" },
    ],
  },
  { type:"battle", enemyId:"hardPuzzle" },
  { type:"dialogue", id:"ch2_bowling", bgColor:"#060a12",
    pages:[
      { speaker:"ナレーション", emoji:"🎳", text:"ボウリングへ。Natsumiはなかなかストライクが出ない。" },
      { speaker:"Masaya",  emoji:"👨", text:"惜しい！あと少しだよ。" },
      { speaker:"Natsumi", emoji:"👩", text:"もう〜！なんでそんな上手いの？" },
      { speaker:"Natsumi", emoji:"👩", text:"Masayaにコツを聞く？それとも自分でやる？",
        choices:[
          { label:"🤝 教えて！", bondDelta:10, statDelta:{ wisdom:5 }, effectLabel:"賢さ＋5・連携＋10", branchId:"bowling_teach" },
          { label:"💪 自分でやる！", bondDelta:5, statDelta:{ power:5 }, effectLabel:"力＋5・連携＋5",   branchId:"bowling_self" },
        ],
      },
    ],
    branches:{
      bowling_teach:[
        { speaker:"Masaya",  emoji:"👨", text:"じゃあ、こう持つといいよ。ほら、当たった！" },
        { speaker:"Natsumi", emoji:"👩", text:"ほんとだ！やったあ！" },
      ],
      bowling_self:[
        { speaker:"Natsumi", emoji:"👩", text:"えいっ！…ストライク！！やった！！" },
        { speaker:"Masaya",  emoji:"👨", text:"すごい！さすが！！" },
      ],
    },
  },
  { type:"battle", enemyId:"christmasTree" },
  { type:"item", id:"ch2_xmas_item", gifts:[
    { who:"Natsumi", name:"Acne Studios マフラー", emoji:"🧣", description:"Masayaからのクリスマスプレゼント。" },
    { who:"Masaya",  name:"AirPods Pro",          emoji:"🎧", description:"「これで俺の声、いつでも届くぞ」" },
  ]},
  { type:"battle", enemyId:"sasikama" },
  { type:"dialogue", id:"ch2_fujiko", bgColor:"#0a060a",
    pages:[
      { speaker:"ナレーション", emoji:"🗺️", text:"藤子・F・不二雄ミュージアム。二人はドラえもんの展示を見て回っていた。" },
      { speaker:"Masaya",     emoji:"👨", text:"さっきはごめんね、あのカチューシャ可愛くない？" },
      { speaker:"Natsumi",    emoji:"👩", text:"確かに、めっちゃ可愛い。" },
      { speaker:"Masaya",     emoji:"👨", text:"専用のプリ機もあるよ、一緒にとろっか！" },
      { speaker:"Natsumi",    emoji:"👩", text:"うん！あとでガチャガチャもやりたい！" },
      { speaker:"ナレーション", emoji:"🌀", text:"はじめは少し喧嘩もしたが、二人の仲は深まっていた。" },
    ],
  },
  { type:"battle", enemyId:"iceCreamCake",  levelUp:{ who:"Natsumi", newLevel:20 } },
  { type:"item", id:"ch2_natsumi_bday", gifts:[
    { who:"Natsumi", name:"Miu Miu 財布",    emoji:"👛", description:"Natsumiの誕生日プレゼント。Natsumiに似合うかわいい財布。" },
  ]},
  { type:"battle", enemyId:"frenchDinner", levelUp:{ who:"Masaya", newLevel:24 } },
  { type:"item", id:"ch2_masaya_bday", gifts:[
    { who:"Masaya", name:"BALENCIAGA 財布", emoji:"👜", description:"Masayaの誕生日プレゼント。Masayaに合う個性的な財布。" },
  ]},
  { type:"battle", enemyId:"rollercoaster" },
  { type:"dialogue", id:"ch2_cruise", bgColor:"#050a14",
    pages:[
      { speaker:"ナレーション", emoji:"🚢", text:"クリスマス、クルージング。東京湾に浮かぶ船の上で、二人は夜景を眺めた。" },
      { speaker:"Masaya",     emoji:"👨", text:"綺麗だね。雨もやんで良かった。" },
      { speaker:"Natsumi",    emoji:"👩", text:"来年も来ようね。絶対。" },
      { speaker:"Masaya",     emoji:"👨", text:"もちろん。これから先も一緒にね。" },
      { speaker:"ナレーション", emoji:"💑", text:"二人の連携が大きく高まった！ Bond ＋30", bondDelta:30 },
    ],
  },
  // ─── 第3章 ───
  { type:"dialogue", id:"ch3_intro", bgColor:"#080808",
    pages:[
      { speaker:"ナレーション", emoji:"📖", text:"第3章：すれ違い" },
      { speaker:"ナレーション", emoji:"🏠", text:"同棲開始。二人は一緒に暮らし始めた。" },
      { speaker:"Masaya",     emoji:"👨", text:"服とか出しっぱなしじゃん。使わないものはちゃんとしまうよ！" },
      { speaker:"Natsumi",    emoji:"👩", text:"うるさい！今片付けようとしてたじゃん！" },
      { speaker:"Natsumi",    emoji:"👩", text:"Masayaくんこそ洗い物全然しないじゃん。" },
      { speaker:"ナレーション", emoji:"💑", text:"二人の連携に少し亀裂が入る。 Bond -20", bondDelta:-20 },
    ],
  },
  { type:"battle", enemyId:"accenture", partnerHpPenalty:120 },
  { type:"dialogue", id:"ch3_gunma", bgColor:"#050b0b",
    pages:[
      { speaker:"ナレーション", emoji:"♨️",  text:"群馬旅行。慣れない仕事で疲れたMasayaは久しぶりにリラックスしているようだ。" },
      { speaker:"Masaya",     emoji:"👨", text:"最高だ…生き返る。来てよかった。" },
      { speaker:"Natsumi",    emoji:"👩", text:"景色すごく綺麗だね。終わっちゃうのがさみしい。" },
      { speaker:"ナレーション", emoji:"💚", text:"温泉に入り、MasayaのHPが大きく回復した！", partnerHpRestore:120 },
    ],
  },
  { type:"battle", enemyId:"anxiety" },
  { type:"dialogue", id:"ch3_choice", bgColor:"#0a050f",
    pages:[
      { speaker:"ナレーション", emoji:"🌌", text:"不安を打ち破った先で、二人は向き合った。" },
      { speaker:"Masaya",     emoji:"👨", text:"正直、いろいろ不安なこともある。仕事も、将来も。" },
      { speaker:"Natsumi",    emoji:"👩", text:"…私もそう。でも、一人じゃないじゃん。" },
      { speaker:"Masaya",     emoji:"👨", text:"これからも二人で進んでいきますか？",
        choices:[
          { label:"💗 はい、一緒に！", bondDelta:30, branchId:"ch3_yes" },
          { label:"😶 いいえ…",                     branchId:"ch3_no"  },
        ],
      },
    ],
    branches:{
      ch3_yes:[
        { speaker:"Masaya",     emoji:"👨", text:"よし。じゃあ行こう。最後の不安をやっつけに。" },
        { speaker:"Natsumi",    emoji:"👩", text:"うん！一緒にやっつけよう！" },
        { speaker:"ナレーション", emoji:"💫", text:"二人の連携が最大に達した！ → ラストバトルへ" },
      ],
      ch3_no:[
        { speaker:"ナレーション", emoji:"🌑", text:"決意が揺らいだ。不安に飲み込まれてしまう…\nもう一度ボス戦から挑戦しよう。", retryBoss:true },
      ],
    },
  },
  { type:"battle", enemyId:"anxietyFinal", isFinal:true },
  { type:"ending" },
];
