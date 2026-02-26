// ==========================================
// ポケモンSV ダメージ計算ツール - 技データ
// ==========================================

const MOVES = [
    // --- ノーマル ---
    { name: 'からげんき', type: 'ノーマル', power: 70, category: '物理', flags: ['facade'] },
    { name: 'すてみタックル', type: 'ノーマル', power: 120, category: '物理', flags: ['recoil'] },
    { name: 'ギガインパクト', type: 'ノーマル', power: 150, category: '物理', flags: [] },
    { name: 'はかいこうせん', type: 'ノーマル', power: 150, category: '特殊', flags: [] },
    { name: 'しんそく', type: 'ノーマル', power: 80, category: '物理', flags: ['priority'] },
    { name: 'テラバースト', type: 'ノーマル', power: 80, category: '物理', flags: ['terablast'] },
    { name: 'ボディプレス', type: 'かくとう', power: 80, category: '物理', flags: ['bodyPress'] },
    { name: 'ハイパーボイス', type: 'ノーマル', power: 90, category: '特殊', flags: ['sound'] },

    // --- ほのお ---
    { name: 'フレアドライブ', type: 'ほのお', power: 120, category: '物理', flags: ['recoil', 'contact'] },
    { name: 'かえんほうしゃ', type: 'ほのお', power: 90, category: '特殊', flags: [] },
    { name: 'だいもんじ', type: 'ほのお', power: 110, category: '特殊', flags: [] },
    { name: 'オーバーヒート', type: 'ほのお', power: 130, category: '特殊', flags: [] },
    { name: 'ふんえん', type: 'ほのお', power: 80, category: '特殊', flags: [] },
    { name: 'せいなるほのお', type: 'ほのお', power: 100, category: '物理', flags: [] },
    { name: 'もえあがるいかり', type: 'ほのお', power: 90, category: '特殊', flags: [] },
    { name: 'ブレイズキック', type: 'ほのお', power: 85, category: '物理', flags: ['contact', 'highCrit'] },
    { name: 'ビターブレード', type: 'ほのお', power: 90, category: '物理', flags: ['contact', 'drain'], drainRate: 0.5 },

    // --- みず ---
    { name: 'なみのり', type: 'みず', power: 90, category: '特殊', flags: [] },
    { name: 'ハイドロポンプ', type: 'みず', power: 110, category: '特殊', flags: [] },
    { name: 'アクアジェット', type: 'みず', power: 40, category: '物理', flags: ['priority', 'contact'] },
    { name: 'しおふき', type: 'みず', power: 150, category: '特殊', flags: ['waterSpout'] },
    { name: 'すいりゅうれんだ', type: 'みず', power: 25, category: '物理', flags: ['contact', 'multiHit3', 'alwaysCrit'] },
    { name: 'アクアブレイク', type: 'みず', power: 85, category: '物理', flags: ['contact'] },
    { name: 'しおみず', type: 'みず', power: 65, category: '特殊', flags: [] },
    { name: 'うずしお', type: 'みず', power: 35, category: '特殊', flags: [] },
    { name: 'ねっとう', type: 'みず', power: 80, category: '特殊', flags: [] },

    // --- でんき ---
    { name: '10まんボルト', type: 'でんき', power: 90, category: '特殊', flags: [] },
    { name: 'かみなり', type: 'でんき', power: 110, category: '特殊', flags: [] },
    { name: 'ボルトチェンジ', type: 'でんき', power: 70, category: '特殊', flags: [] },
    { name: 'ワイルドボルト', type: 'でんき', power: 90, category: '物理', flags: ['recoil', 'contact'] },
    { name: 'イナズマドライブ', type: 'でんき', power: 100, category: '特殊', flags: [] },
    { name: 'パラボラチャージ', type: 'でんき', power: 65, category: '特殊', flags: [] },

    // --- くさ ---
    { name: 'リーフストーム', type: 'くさ', power: 130, category: '特殊', flags: [] },
    { name: 'エナジーボール', type: 'くさ', power: 90, category: '特殊', flags: [] },
    { name: 'ギガドレイン', type: 'くさ', power: 75, category: '特殊', flags: ['drain'], drainRate: 0.5 },
    { name: 'ウッドホーン', type: 'くさ', power: 75, category: '物理', flags: ['contact', 'drain'], drainRate: 0.5 },
    { name: 'ウッドハンマー', type: 'くさ', power: 120, category: '物理', flags: ['recoil', 'contact'] },
    { name: 'パワーウィップ', type: 'くさ', power: 120, category: '物理', flags: ['contact'] },
    { name: 'くさわけ', type: 'くさ', power: 50, category: '物理', flags: ['contact'] },
    { name: 'タネマシンガン', type: 'くさ', power: 25, category: '物理', flags: ['multiHit'] },
    { name: 'グラススライダー', type: 'くさ', power: 55, category: '物理', flags: ['contact', 'grassGlide'] },
    { name: 'トリックフラワー', type: 'くさ', power: 70, category: '物理', flags: ['alwaysCrit'] },

    // --- こおり ---
    { name: 'れいとうビーム', type: 'こおり', power: 90, category: '特殊', flags: [] },
    { name: 'ふぶき', type: 'こおり', power: 110, category: '特殊', flags: [] },
    { name: 'こおりのつぶて', type: 'こおり', power: 40, category: '物理', flags: ['priority'] },
    { name: 'つららおとし', type: 'こおり', power: 85, category: '物理', flags: [] },
    { name: 'つららばり', type: 'こおり', power: 25, category: '物理', flags: ['multiHit'] },
    { name: 'フリーズドライ', type: 'こおり', power: 70, category: '特殊', flags: ['freezeDry'] },
    { name: 'トリプルアクセル', type: 'こおり', power: 20, category: '物理', flags: ['contact', 'tripleAxel'] },
    { name: 'アイススピナー', type: 'こおり', power: 80, category: '物理', flags: ['contact'] },

    // --- かくとう ---
    { name: 'インファイト', type: 'かくとう', power: 120, category: '物理', flags: ['contact'] },
    { name: 'ドレインパンチ', type: 'かくとう', power: 75, category: '物理', flags: ['contact', 'punch', 'drain'], drainRate: 0.5 },
    { name: 'きあいだま', type: 'かくとう', power: 120, category: '特殊', flags: [] },
    { name: 'マッハパンチ', type: 'かくとう', power: 40, category: '物理', flags: ['priority', 'contact', 'punch'] },
    { name: 'はどうだん', type: 'かくとう', power: 80, category: '特殊', flags: ['pulse'] },
    { name: 'せいなるつるぎ', type: 'かくとう', power: 90, category: '物理', flags: ['contact'] },
    { name: 'あんこくきょうだ', type: 'あく', power: 75, category: '物理', flags: ['contact', 'alwaysCrit'] },
    { name: 'きょけんとつげき', type: 'はがね', power: 100, category: '物理', flags: ['contact'] },

    // --- どく ---
    { name: 'ヘドロばくだん', type: 'どく', power: 90, category: '特殊', flags: [] },
    { name: 'ダストシュート', type: 'どく', power: 120, category: '物理', flags: [] },
    { name: 'どくづき', type: 'どく', power: 80, category: '物理', flags: ['contact'] },
    { name: 'しおづけ', type: 'いわ', power: 40, category: '物理', flags: ['saltCure'] },

    // --- じめん ---
    { name: 'じしん', type: 'じめん', power: 100, category: '物理', flags: [] },
    { name: 'だいちのちから', type: 'じめん', power: 90, category: '特殊', flags: [] },
    { name: 'じだんだ', type: 'じめん', power: 75, category: '物理', flags: ['contact'] },
    { name: 'ホースタンプ', type: 'じめん', power: 85, category: '物理', flags: ['contact'] },
    { name: 'サウザンアロー', type: 'じめん', power: 90, category: '物理', flags: [] },
    { name: 'ねっさのだいち', type: 'じめん', power: 70, category: '特殊', flags: [] },
    { name: 'だんがいのつるぎ', type: 'じめん', power: 120, category: '物理', flags: [] },

    // --- ひこう ---
    { name: 'ブレイブバード', type: 'ひこう', power: 120, category: '物理', flags: ['recoil', 'contact'] },
    { name: 'エアスラッシュ', type: 'ひこう', power: 75, category: '特殊', flags: [] },
    { name: 'ぼうふう', type: 'ひこう', power: 110, category: '特殊', flags: [] },
    { name: 'アクロバット', type: 'ひこう', power: 55, category: '物理', flags: ['contact'] },
    { name: 'ガリョウテンセイ', type: 'ひこう', power: 120, category: '物理', flags: ['contact'] },

    // --- エスパー ---
    { name: 'サイコキネシス', type: 'エスパー', power: 90, category: '特殊', flags: [] },
    { name: 'サイコショック', type: 'エスパー', power: 80, category: '特殊', flags: ['psyshock'] },
    { name: 'ワイドフォース', type: 'エスパー', power: 80, category: '特殊', flags: [] },
    { name: 'アストラルビット', type: 'ゴースト', power: 120, category: '特殊', flags: [] },
    { name: 'みらいよち', type: 'エスパー', power: 120, category: '特殊', flags: [] },

    // --- むし ---
    { name: 'とんぼがえり', type: 'むし', power: 70, category: '物理', flags: ['contact'] },
    { name: 'シザークロス', type: 'むし', power: 80, category: '物理', flags: ['contact'] },
    { name: 'バレットパンチ', type: 'はがね', power: 40, category: '物理', flags: ['priority', 'contact', 'punch'] },

    // --- いわ ---
    { name: 'ストーンエッジ', type: 'いわ', power: 100, category: '物理', flags: ['highCrit'] },
    { name: 'いわなだれ', type: 'いわ', power: 75, category: '物理', flags: [] },
    { name: 'ステルスロック', type: 'いわ', power: 0, category: '変化', flags: [] },
    { name: 'パワージェム', type: 'いわ', power: 80, category: '特殊', flags: [] },
    { name: 'がんせきふうじ', type: 'いわ', power: 60, category: '物理', flags: [] },
    { name: 'もろはのずつき', type: 'いわ', power: 150, category: '物理', flags: ['recoil', 'contact'] },

    // --- ゴースト ---
    { name: 'シャドーボール', type: 'ゴースト', power: 80, category: '特殊', flags: [] },
    { name: 'シャドークロー', type: 'ゴースト', power: 70, category: '物理', flags: ['contact', 'highCrit'] },
    { name: 'かげうち', type: 'ゴースト', power: 40, category: '物理', flags: ['priority', 'contact'] },
    { name: 'ポルターガイスト', type: 'ゴースト', power: 110, category: '物理', flags: [] },
    { name: 'たたりめ', type: 'ゴースト', power: 65, category: '特殊', flags: ['hex'] },

    // --- ドラゴン ---
    { name: 'げきりん', type: 'ドラゴン', power: 120, category: '物理', flags: ['contact'] },
    { name: 'りゅうせいぐん', type: 'ドラゴン', power: 130, category: '特殊', flags: [] },
    { name: 'ドラゴンクロー', type: 'ドラゴン', power: 80, category: '物理', flags: ['contact'] },
    { name: 'りゅうのはどう', type: 'ドラゴン', power: 85, category: '特殊', flags: ['pulse'] },
    { name: 'スケイルショット', type: 'ドラゴン', power: 25, category: '物理', flags: ['multiHit'] },
    { name: 'ドラゴンアロー', type: 'ドラゴン', power: 50, category: '物理', flags: [] },

    // --- あく ---
    { name: 'かみくだく', type: 'あく', power: 80, category: '物理', flags: ['contact', 'bite'] },
    { name: 'はたきおとす', type: 'あく', power: 65, category: '物理', flags: ['contact', 'knockOff'] },
    { name: 'ふいうち', type: 'あく', power: 70, category: '物理', flags: ['priority', 'contact'] },
    { name: 'あくのはどう', type: 'あく', power: 80, category: '特殊', flags: ['pulse'] },
    { name: 'イカサマ', type: 'あく', power: 95, category: '物理', flags: ['contact', 'foulPlay'] },
    { name: 'ドゲザン', type: 'あく', power: 85, category: '物理', flags: [] },

    // --- はがね ---
    { name: 'アイアンヘッド', type: 'はがね', power: 80, category: '物理', flags: ['contact'] },
    { name: 'ラスターカノン', type: 'はがね', power: 80, category: '特殊', flags: [] },
    { name: 'ヘビーボンバー', type: 'はがね', power: 0, category: '物理', flags: ['contact', 'heavySlam'] },
    { name: 'ジャイロボール', type: 'はがね', power: 0, category: '物理', flags: ['contact', 'gyroBall'] },
    { name: 'ゴールドラッシュ', type: 'はがね', power: 120, category: '特殊', flags: [] },
    { name: 'メイクアップ', type: 'はがね', power: 100, category: '特殊', flags: [] },
    { name: 'エレクトロビーム', type: 'でんき', power: 130, category: '特殊', flags: [] },

    // --- フェアリー ---
    { name: 'ムーンフォース', type: 'フェアリー', power: 95, category: '特殊', flags: [] },
    { name: 'じゃれつく', type: 'フェアリー', power: 90, category: '物理', flags: ['contact'] },
    { name: 'マジカルシャイン', type: 'フェアリー', power: 80, category: '特殊', flags: [] },
    { name: 'ドレインキッス', type: 'フェアリー', power: 50, category: '特殊', flags: ['contact', 'drain'], drainRate: 0.75 },
    { name: 'マジカルフレイム', type: 'ほのお', power: 75, category: '特殊', flags: [] },
    { name: 'きょじゅうざん', type: 'はがね', power: 100, category: '物理', flags: ['contact', 'behemothBlade'] },

    // --- その他よく使われる技 ---
    { name: 'かみなりパンチ', type: 'でんき', power: 75, category: '物理', flags: ['contact', 'punch'] },
    { name: 'れいとうパンチ', type: 'こおり', power: 75, category: '物理', flags: ['contact', 'punch'] },
    { name: 'ほのおのパンチ', type: 'ほのお', power: 75, category: '物理', flags: ['contact', 'punch'] },
    { name: 'じゃくてんほけん', type: 'ノーマル', power: 0, category: '変化', flags: [] },
    { name: 'こおりのキバ', type: 'こおり', power: 65, category: '物理', flags: ['contact', 'bite'] },
    { name: 'ほのおのキバ', type: 'ほのお', power: 65, category: '物理', flags: ['contact', 'bite'] },
    { name: 'かみなりのキバ', type: 'でんき', power: 65, category: '物理', flags: ['contact', 'bite'] },
    { name: 'サイコファング', type: 'エスパー', power: 85, category: '物理', flags: ['contact', 'bite'] },
    { name: 'ネコブラスト', type: 'あく', power: 100, category: '特殊', flags: [] },
    { name: 'ブラッドムーン', type: 'ノーマル', power: 140, category: '特殊', flags: [] },
    { name: 'ツタこんぼう', type: 'くさ', power: 100, category: '物理', flags: [] },
].filter(m => m.category !== '変化'); // 変化技を除外
