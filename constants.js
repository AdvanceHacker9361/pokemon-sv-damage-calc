// ==========================================
// ポケモンSV ダメージ計算ツール - 定数データ
// ==========================================

const TYPES = [
    'ノーマル', 'ほのお', 'みず', 'でんき', 'くさ', 'こおり',
    'かくとう', 'どく', 'じめん', 'ひこう', 'エスパー', 'むし',
    'いわ', 'ゴースト', 'ドラゴン', 'あく', 'はがね', 'フェアリー'
];

// タイプ相性表 (攻撃側 → 防御側)  1=等倍, 2=効果抜群, 0.5=いまひとつ, 0=無効
const TYPE_CHART = [
    // ノ  炎  水  電  草  氷  闘  毒  地  飛  超  虫  岩  霊  竜  悪  鋼  妖
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, .5, 0, 1, 1, .5, 1], // ノーマル
    [1, .5, .5, 1, 2, 2, 1, 1, 1, 1, 1, 2, .5, 1, .5, 1, 2, 1], // ほのお
    [1, 2, .5, 1, .5, 1, 1, 1, 2, 1, 1, 1, 2, 1, .5, 1, 1, 1], // みず
    [1, 1, 2, .5, .5, 1, 1, 1, 0, 2, 1, 1, 1, 1, .5, 1, 1, 1], // でんき
    [1, .5, 2, 1, .5, 1, 1, .5, 2, .5, 1, .5, 2, 1, .5, 1, .5, 1], // くさ
    [1, .5, .5, 1, 2, .5, 1, 1, 2, 2, 1, 1, 1, 1, 2, 1, .5, 1], // こおり
    [2, 1, 1, 1, 1, 2, 1, .5, 1, .5, .5, .5, 2, 0, 1, 2, 2, .5], // かくとう
    [1, 1, 1, 1, 2, 1, 1, .5, .5, 1, 1, 1, .5, .5, 1, 1, 0, 2], // どく
    [1, 2, 1, 2, .5, 1, 1, 2, 1, 0, 1, .5, 2, 1, 1, 1, 2, 1], // じめん
    [1, 1, 1, .5, 2, 1, 2, 1, 1, 1, 1, 2, .5, 1, 1, 1, .5, 1], // ひこう
    [1, 1, 1, 1, 1, 1, 2, 2, 1, 1, .5, 1, 1, 1, 1, 0, .5, 1], // エスパー
    [1, .5, 1, 1, 2, 1, .5, .5, 1, .5, 2, 1, 1, .5, 1, 2, .5, .5], // むし
    [1, 2, 1, 1, 1, 2, .5, 1, .5, 2, 1, 2, 1, 1, 1, 1, .5, 1], // いわ
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, .5, 1, 1], // ゴースト
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, .5, 0], // ドラゴン
    [1, 1, 1, 1, 1, 1, .5, 1, 1, 1, 2, 1, 1, 2, 1, .5, 1, .5], // あく
    [1, .5, .5, .5, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, .5, 2], // はがね
    [1, .5, 1, 1, 1, 1, 2, .5, 1, 1, 1, 1, 1, 1, 2, 2, .5, 1], // フェアリー
];

// 性格補正テーブル { name: [上昇ステータスindex, 下降ステータスindex] }
// index: 0=HP(なし), 1=こうげき, 2=ぼうぎょ, 3=とくこう, 4=とくぼう, 5=すばやさ
const NATURES = {
    'さみしがり': { up: 1, down: 2 }, // A↑ B↓
    'いじっぱり': { up: 1, down: 3 }, // A↑ C↓
    'やんちゃ': { up: 1, down: 4 }, // A↑ D↓
    'ゆうかん': { up: 1, down: 5 }, // A↑ S↓
    'ずぶとい': { up: 2, down: 1 }, // B↑ A↓
    'わんぱく': { up: 2, down: 3 }, // B↑ C↓
    'のうてんき': { up: 2, down: 4 }, // B↑ D↓
    'のんき': { up: 2, down: 5 }, // B↑ S↓
    'ひかえめ': { up: 3, down: 1 }, // C↑ A↓
    'おっとり': { up: 3, down: 2 }, // C↑ B↓
    'うっかりや': { up: 3, down: 4 }, // C↑ D↓
    'れいせい': { up: 3, down: 5 }, // C↑ S↓
    'おだやか': { up: 4, down: 1 }, // D↑ A↓
    'おとなしい': { up: 4, down: 2 }, // D↑ B↓
    'しんちょう': { up: 4, down: 3 }, // D↑ C↓
    'なまいき': { up: 4, down: 5 }, // D↑ S↓
    'おくびょう': { up: 5, down: 1 }, // S↑ A↓
    'せっかち': { up: 5, down: 2 }, // S↑ B↓
    'ようき': { up: 5, down: 3 }, // S↑ C↓
    'むじゃき': { up: 5, down: 4 }, // S↑ D↓
    // 補正なし
    'がんばりや': { up: 0, down: 0 },
    'すなお': { up: 0, down: 0 },
    'てれや': { up: 0, down: 0 },
    'きまぐれ': { up: 0, down: 0 },
    'まじめ': { up: 0, down: 0 },
};

// 特性 (ダメージ計算に影響するもの)
const ABILITIES = {
    // --- 攻撃補正系 ---
    'ちからもち': { type: 'atkMod', value: 2.0, condition: 'physical' },
    'ヨガパワー': { type: 'atkMod', value: 2.0, condition: 'physical' },
    'はりきり': { type: 'atkMod', value: 1.5, condition: 'physical' },
    'こんじょう': { type: 'atkMod', value: 1.5, condition: 'physicalStatus' },
    'サンパワー': { type: 'spaMod', value: 1.5, condition: 'sun' },
    'フラワーギフト': { type: 'atkMod', value: 1.5, condition: 'sun' },
    // --- 火力補正系 ---
    'てきおうりょく': { type: 'adaptability' },
    'スナイパー': { type: 'sniper' },
    'いろめがね': { type: 'tintedLens' },
    'フェアリーオーラ': { type: 'aura', moveType: 'フェアリー', value: 1.33 },
    'ダークオーラ': { type: 'aura', moveType: 'あく', value: 1.33 },
    'トランジスタ': { type: 'typePower', moveType: 'でんき', value: 1.3 },
    'りゅうのあぎと': { type: 'typePower', moveType: 'ドラゴン', value: 1.5 },
    'ひひいろのこどう': { type: 'atkBoostSun', value: 1.3 },
    'ハドロンエンジン': { type: 'spaBoostField', value: 1.3 },
    'こだいかっせい': { type: 'protosynthesis' },
    'クォークチャージ': { type: 'quarkDrive' },
    // --- 防御補正系 ---
    'ファーコート': { type: 'defMod', value: 2.0, condition: 'physical' },
    'くさのけがわ': { type: 'defMod', value: 1.5, condition: 'grassyTerrain' },
    'アイスフェイス': { type: 'defMod', value: 0, condition: 'physicalIce' },
    'マルチスケイル': { type: 'multiscale' },
    'ファントムガード': { type: 'multiscale' },
    'もふもふ': { type: 'fluffy' },
    // --- 災厄系 ---
    'わざわいのつるぎ': { type: 'ruinSword' },   // 相手のB 0.75倍
    'わざわいのおふだ': { type: 'ruinTablet' },  // 相手のD 0.75倍
    'わざわいのうつわ': { type: 'ruinVessel' },  // 相手のC 0.75倍 (attacker doesn't use this directly)
    'わざわいのたま': { type: 'ruinBeads' },   // 相手のD 0.75倍
    // --- その他 ---
    'テクニシャン': { type: 'technician' },
    'すてみ': { type: 'reckless' },
    'てつのこぶし': { type: 'ironFist' },
    'がんじょうあご': { type: 'strongJaw' },
    'メガランチャー': { type: 'megaLauncher' },
    'タフネス': { type: 'thickFat' },
    'たいねつ': { type: 'heatproof' },
    'かんそうはだ': { type: 'drySkin' },
    'もらいび': { type: 'flashFire' },
    'ちょすい': { type: 'waterAbsorb' },
    'よびみず': { type: 'stormDrain' },
    'そうしょく': { type: 'sapSipper' },
    'ひらいしん': { type: 'lightningRod' },
    'ふゆう': { type: 'levitate' },
    'かたやぶり': { type: 'moldBreaker' },
    'ふとうのけん': { type: 'intrepidSword' },
    'ばけのかわ': { type: 'disguise' },
    'クリアボディ': { type: 'none' },
    'いかく': { type: 'intimidate' },
    'てんねん': { type: 'unaware' },
    'あついしぼう': { type: 'thickFat' },
    'きよめのしお': { type: 'purifyingSalt' },
    'おわりのだいち': { type: 'desolateLand' },
    'はじまりのうみ': { type: 'primordialSea' },
    'ビーストブースト': { type: 'none' },
    'プレッシャー': { type: 'none' },
};

// 持ち物 (ダメージ計算に影響するもの)
const ITEMS = {
    'こだわりハチマキ': { type: 'atkItem', value: 1.5 },
    'こだわりメガネ': { type: 'spaItem', value: 1.5 },
    'いのちのたま': { type: 'lifeOrb', value: 1.3 },
    'たつじんのおび': { type: 'expertBelt', value: 1.2 },
    'ちからのハチマキ': { type: 'muscleBand', value: 1.1 },
    'ものしりメガネ': { type: 'wiseGlasses', value: 1.1 },
    'パンチグローブ': { type: 'punchingGlove', value: 1.1 },
    'ノーマルジュエル': { type: 'normalGem', value: 1.3 },

    // 連続補正アイテム
    'メトロノーム(最大)': { type: 'metronomeMax', value: 2.0 },
    'メトロノーム(2回目)': { type: 'metronomeMid', value: 1.2 },

    // タイプ強化アイテム (1.2倍)
    'シルクのスカーフ': { type: 'typeBoostItem', boostType: 'ノーマル', value: 1.2 },
    'もくたん': { type: 'typeBoostItem', boostType: 'ほのお', value: 1.2 },
    'しんぴのしずく': { type: 'typeBoostItem', boostType: 'みず', value: 1.2 },
    'じしゃく': { type: 'typeBoostItem', boostType: 'でんき', value: 1.2 },
    'きせきのタネ': { type: 'typeBoostItem', boostType: 'くさ', value: 1.2 },
    'とけないこおり': { type: 'typeBoostItem', boostType: 'こおり', value: 1.2 },
    'くろおび': { type: 'typeBoostItem', boostType: 'かくとう', value: 1.2 },
    'どくバリ': { type: 'typeBoostItem', boostType: 'どく', value: 1.2 },
    'やわらかいすな': { type: 'typeBoostItem', boostType: 'じめん', value: 1.2 },
    'するどいくちばし': { type: 'typeBoostItem', boostType: 'ひこう', value: 1.2 },
    'まがったスプーン': { type: 'typeBoostItem', boostType: 'エスパー', value: 1.2 },
    'ぎんのこな': { type: 'typeBoostItem', boostType: 'むし', value: 1.2 },
    'かたいいし': { type: 'typeBoostItem', boostType: 'いわ', value: 1.2 },
    'のろいのおふだ': { type: 'typeBoostItem', boostType: 'ゴースト', value: 1.2 },
    'りゅうのキバ': { type: 'typeBoostItem', boostType: 'ドラゴン', value: 1.2 },
    'くろいメガネ': { type: 'typeBoostItem', boostType: 'あく', value: 1.2 },
    'メタルコート': { type: 'typeBoostItem', boostType: 'はがね', value: 1.2 },
    'せいれいプレート': { type: 'typeBoostItem', boostType: 'フェアリー', value: 1.2 },
    'こぶしのプレート': { type: 'typeBoostItem', boostType: 'かくとう', value: 1.2 },

    // 半減実
    'オッカのみ': { type: 'resistBerry', resistType: 'ほのお' },
    'イトケのみ': { type: 'resistBerry', resistType: 'みず' },
    'ソクノのみ': { type: 'resistBerry', resistType: 'でんき' },
    'リンドのみ': { type: 'resistBerry', resistType: 'くさ' },
    'ヤチェのみ': { type: 'resistBerry', resistType: 'こおり' },
    'ヨプのみ': { type: 'resistBerry', resistType: 'かくとう' },
    'ビアーのみ': { type: 'resistBerry', resistType: 'どく' },
    'シュカのみ': { type: 'resistBerry', resistType: 'じめん' },
    'バコウのみ': { type: 'resistBerry', resistType: 'ひこう' },
    'ウタンのみ': { type: 'resistBerry', resistType: 'エスパー' },
    'タンガのみ': { type: 'resistBerry', resistType: 'むし' },
    'ヨロギのみ': { type: 'resistBerry', resistType: 'いわ' },
    'カシブのみ': { type: 'resistBerry', resistType: 'ゴースト' },
    'ハバンのみ': { type: 'resistBerry', resistType: 'ドラゴン' },
    'ナモのみ': { type: 'resistBerry', resistType: 'あく' },
    'リリバのみ': { type: 'resistBerry', resistType: 'はがね' },
    'ロゼルのみ': { type: 'resistBerry', resistType: 'フェアリー' },
    'ホズのみ': { type: 'resistBerry', resistType: 'ノーマル' }, // ノーマル半減

    // おめん (オーガポン 1.2倍)
    'いどのめん': { type: 'typeBoostItem', boostType: 'みず', value: 1.2 },
    'かまどのめん': { type: 'typeBoostItem', boostType: 'ほのお', value: 1.2 },
    'いしずえのめん': { type: 'typeBoostItem', boostType: 'いわ', value: 1.2 },

    // その他
    'こだわりスカーフ': { type: 'none' }, // ダメージ影響なし
    'とつげきチョッキ': { type: 'spdItem', value: 1.5 },
    'しんかのきせき': { type: 'eviolite', value: 1.5 },
    'ラムのみ': { type: 'none' },
    'きあいのタスキ': { type: 'none' },
    'たべのこし': { type: 'none' },
    'くろいヘドロ': { type: 'none' },
    'ゴツゴツメット': { type: 'none' },
    'オボンのみ': { type: 'none' },
    'フィラのみ': { type: 'none' },
    'ブーストエナジー': { type: 'boosterEnergy' },
    'でんきだま': { type: 'none' },
    'くちたけん': { type: 'rustedSword' },
    'くちたたて': { type: 'rustedShield' },
    'こころのしずく': { type: 'soulDew', value: 1.2 },
    'なし': { type: 'none' },
};

// 天候
const WEATHERS = ['なし', 'はれ', 'あめ', 'すなあらし', 'ゆき'];

// フィールド
const FIELDS = ['なし', 'エレキフィールド', 'グラスフィールド', 'サイコフィールド', 'ミストフィールド'];

// ランク補正倍率 (-6 ~ +6)
const RANK_MODIFIERS = {
    '-6': 2 / 8, '-5': 2 / 7, '-4': 2 / 6, '-3': 2 / 5, '-2': 2 / 4, '-1': 2 / 3,
    '0': 1,
    '1': 3 / 2, '2': 4 / 2, '3': 5 / 2, '4': 6 / 2, '5': 7 / 2, '6': 8 / 2,
};
