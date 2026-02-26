// ==========================================
// ポケモンSV ダメージ計算ツール - ポケモンデータ
// Reg.I シングル使用率上位80匹 (シーズン39)
// ==========================================

const POKEMON = [
    // 1位
    {
        id: 'dinlu', name: 'ディンルー', types: ['じめん', 'あく'], bs: [155, 110, 125, 55, 80, 45],
        abilities: ['わざわいのうつわ'], defaultAbility: 'わざわいのうつわ'
    },
    // 2位
    {
        id: 'koraidon', name: 'コライドン', types: ['かくとう', 'ドラゴン'], bs: [100, 135, 115, 85, 100, 135],
        abilities: ['ひひいろのこどう'], defaultAbility: 'ひひいろのこどう'
    },
    // 3位
    {
        id: 'chienpao', name: 'パオジアン', types: ['あく', 'こおり'], bs: [80, 120, 80, 90, 65, 135],
        abilities: ['わざわいのつるぎ'], defaultAbility: 'わざわいのつるぎ'
    },
    // 4位
    {
        id: 'calyrexS', name: 'バドレックス(黒馬)', types: ['エスパー', 'ゴースト'], bs: [100, 85, 80, 165, 100, 150],
        abilities: ['じんばいったい'], defaultAbility: 'じんばいったい'
    },
    // 5位
    {
        id: 'miraidon', name: 'ミライドン', types: ['でんき', 'ドラゴン'], bs: [100, 85, 115, 135, 100, 135],
        abilities: ['ハドロンエンジン'], defaultAbility: 'ハドロンエンジン'
    },
    // 6位
    {
        id: 'fluttermane', name: 'ハバタクカミ', types: ['ゴースト', 'フェアリー'], bs: [55, 55, 55, 135, 135, 135],
        abilities: ['こだいかっせい'], defaultAbility: 'こだいかっせい'
    },
    // 7位
    {
        id: 'landorusT', name: 'ランドロス(霊獣)', types: ['じめん', 'ひこう'], bs: [89, 145, 90, 105, 80, 91],
        abilities: ['いかく'], defaultAbility: 'いかく'
    },
    // 8位
    {
        id: 'urshifuR', name: 'ウーラオス(連撃)', types: ['かくとう', 'みず'], bs: [100, 130, 100, 63, 60, 97],
        abilities: ['ふかしのこぶし'], defaultAbility: 'ふかしのこぶし'
    },
    // 9位
    {
        id: 'hooh', name: 'ホウオウ', types: ['ほのお', 'ひこう'], bs: [106, 130, 90, 110, 154, 90],
        abilities: ['さいせいりょく', 'プレッシャー'], defaultAbility: 'さいせいりょく'
    },
    // 10位
    {
        id: 'glimmora', name: 'キラフロル', types: ['いわ', 'どく'], bs: [83, 55, 90, 130, 81, 86],
        abilities: ['どくげしょう', 'ふしょく'], defaultAbility: 'どくげしょう'
    },
    // 11位
    {
        id: 'dondozo', name: 'ヘイラッシャ', types: ['みず'], bs: [150, 100, 115, 65, 65, 35],
        abilities: ['てんねん', 'どんかん'], defaultAbility: 'てんねん'
    },
    // 12位
    {
        id: 'zacian', name: 'ザシアン(けんのおう)', types: ['フェアリー', 'はがね'], bs: [92, 170, 115, 80, 115, 148],
        abilities: ['ふとうのけん'], defaultAbility: 'ふとうのけん'
    },
    // 13位
    {
        id: 'kyogre', name: 'カイオーガ', types: ['みず'], bs: [100, 100, 90, 150, 140, 90],
        abilities: ['あめふらし'], defaultAbility: 'あめふらし'
    },
    // 14位
    {
        id: 'gliscor', name: 'グライオン', types: ['じめん', 'ひこう'], bs: [75, 95, 125, 45, 75, 95],
        abilities: ['ポイズンヒール', 'かいりきバサミ', 'すながくれ'], defaultAbility: 'ポイズンヒール'
    },
    // 15位
    {
        id: 'garganacl', name: 'キョジオーン', types: ['いわ'], bs: [100, 100, 130, 45, 90, 35],
        abilities: ['きよめのしお', 'がんじょう'], defaultAbility: 'きよめのしお'
    },
    // 16位
    {
        id: 'dragonite', name: 'カイリュー', types: ['ドラゴン', 'ひこう'], bs: [91, 134, 95, 100, 100, 80],
        abilities: ['マルチスケイル', 'せいしんりょく'], defaultAbility: 'マルチスケイル'
    },
    // 17位
    {
        id: 'lunala', name: 'ルナアーラ', types: ['エスパー', 'ゴースト'], bs: [137, 113, 89, 137, 107, 97],
        abilities: ['ファントムガード'], defaultAbility: 'ファントムガード'
    },
    // 18位
    {
        id: 'mimikyu', name: 'ミミッキュ', types: ['ゴースト', 'フェアリー'], bs: [55, 90, 80, 50, 105, 96],
        abilities: ['ばけのかわ'], defaultAbility: 'ばけのかわ'
    },
    // 19位
    {
        id: 'grimmsnarl', name: 'オーロンゲ', types: ['あく', 'フェアリー'], bs: [95, 120, 65, 95, 75, 60],
        abilities: ['いたずらごころ', 'おみとおし', 'わるいてぐせ'], defaultAbility: 'いたずらごころ'
    },
    // 20位
    {
        id: 'irontreads', name: 'テツノワダチ', types: ['じめん', 'はがね'], bs: [90, 112, 120, 72, 70, 106],
        abilities: ['クォークチャージ'], defaultAbility: 'クォークチャージ'
    },
    // 21位
    {
        id: 'ursalunaB', name: 'ガチグマ(アカツキ)', types: ['じめん', 'ノーマル'], bs: [113, 70, 120, 135, 65, 52],
        abilities: ['しんがん'], defaultAbility: 'しんがん'
    },
    // 22位
    {
        id: 'calyrexI', name: 'バドレックス(白馬)', types: ['エスパー', 'こおり'], bs: [100, 165, 150, 85, 130, 50],
        abilities: ['じんばいったい'], defaultAbility: 'じんばいったい'
    },
    // 23位
    {
        id: 'clodsire', name: 'ドオー', types: ['どく', 'じめん'], bs: [130, 75, 60, 45, 100, 20],
        abilities: ['どくのトゲ', 'ちょすい', 'てんねん'], defaultAbility: 'てんねん'
    },
    // 24位
    {
        id: 'archaludon', name: 'ブリジュラス', types: ['はがね', 'ドラゴン'], bs: [90, 105, 130, 125, 65, 85],
        abilities: ['じきゅうりょく', 'がんじょう'], defaultAbility: 'がんじょう'
    },
    // 25位
    {
        id: 'ogerpon', name: 'オーガポン', types: ['くさ'], bs: [80, 120, 84, 60, 96, 110],
        abilities: ['まけんき'], defaultAbility: 'まけんき'
    },
    // 26位
    {
        id: 'chiyu', name: 'イーユイ', types: ['あく', 'ほのお'], bs: [55, 80, 65, 135, 120, 100],
        abilities: ['わざわいのたま'], defaultAbility: 'わざわいのたま'
    },
    // 27位
    {
        id: 'sneasler', name: 'オオニューラ', types: ['かくとう', 'どく'], bs: [80, 130, 60, 40, 80, 120],
        abilities: ['プレッシャー', 'かるわざ', 'どくしゅ'], defaultAbility: 'どくしゅ'
    },
    // 28位
    {
        id: 'alomomola', name: 'ママンボウ', types: ['みず'], bs: [165, 75, 80, 40, 45, 65],
        abilities: ['いやしのこころ', 'うるおいボディ', 'さいせいりょく'], defaultAbility: 'さいせいりょく'
    },
    // 29位
    {
        id: 'eternatus', name: 'ムゲンダイナ', types: ['どく', 'ドラゴン'], bs: [140, 85, 95, 145, 95, 130],
        abilities: ['プレッシャー'], defaultAbility: 'プレッシャー'
    },
    // 30位
    {
        id: 'terapagos', name: 'テラパゴス', types: ['ノーマル'], bs: [90, 65, 85, 135, 110, 85],
        abilities: ['テラスシェル'], defaultAbility: 'テラスシェル'
    },
    // 31位
    {
        id: 'ursaluna', name: 'ガチグマ', types: ['じめん', 'ノーマル'], bs: [130, 140, 105, 45, 80, 50],
        abilities: ['こんじょう', 'ぼうだん', 'どんかん'], defaultAbility: 'こんじょう'
    },
    // 32位
    {
        id: 'ditto', name: 'メタモン', types: ['ノーマル'], bs: [48, 48, 48, 48, 48, 48],
        abilities: ['じゅうなん', 'かわりもの'], defaultAbility: 'かわりもの'
    },
    // 33位
    {
        id: 'scizor', name: 'ハッサム', types: ['むし', 'はがね'], bs: [70, 130, 100, 55, 80, 65],
        abilities: ['むしのしらせ', 'テクニシャン', 'ライトメタル'], defaultAbility: 'テクニシャン'
    },
    // 34位
    {
        id: 'lugia', name: 'ルギア', types: ['エスパー', 'ひこう'], bs: [106, 90, 130, 90, 154, 110],
        abilities: ['プレッシャー', 'マルチスケイル'], defaultAbility: 'マルチスケイル'
    },
    // 35位
    {
        id: 'kingambit', name: 'ドドゲザン', types: ['あく', 'はがね'], bs: [100, 135, 120, 60, 85, 50],
        abilities: ['まけんき', 'そうだいしょう', 'プレッシャー'], defaultAbility: 'そうだいしょう'
    },
    // 36位
    {
        id: 'primarina', name: 'アシレーヌ', types: ['みず', 'フェアリー'], bs: [80, 74, 74, 126, 116, 60],
        abilities: ['げきりゅう', 'うるおいボイス'], defaultAbility: 'げきりゅう'
    },
    // 37位
    {
        id: 'mukAlola', name: 'ベトベトン(アローラ)', types: ['どく', 'あく'], bs: [105, 105, 75, 65, 100, 50],
        abilities: ['どくしゅ', 'くいしんぼう', 'かがくのちから'], defaultAbility: 'どくしゅ'
    },
    // 38位
    {
        id: 'wochien', name: 'チオンジェン', types: ['あく', 'くさ'], bs: [85, 85, 100, 95, 135, 70],
        abilities: ['わざわいのおふだ'], defaultAbility: 'わざわいのおふだ'
    },
    // 39位
    {
        id: 'incineroar', name: 'ガオガエン', types: ['ほのお', 'あく'], bs: [95, 115, 90, 80, 90, 60],
        abilities: ['もうか', 'いかく'], defaultAbility: 'いかく'
    },
    // 40位
    {
        id: 'weezingGalar', name: 'マタドガス(ガラル)', types: ['どく', 'フェアリー'], bs: [65, 90, 120, 85, 70, 60],
        abilities: ['ふゆう', 'かがくへんかガス', 'ミストメイカー'], defaultAbility: 'かがくへんかガス'
    },
    // 41位
    {
        id: 'tyranitar', name: 'バンギラス', types: ['いわ', 'あく'], bs: [100, 134, 110, 95, 100, 61],
        abilities: ['すなおこし', 'きんちょうかん'], defaultAbility: 'すなおこし'
    },
    // 42位
    {
        id: 'rayquaza', name: 'レックウザ', types: ['ドラゴン', 'ひこう'], bs: [105, 150, 90, 150, 90, 95],
        abilities: ['エアロック'], defaultAbility: 'エアロック'
    },
    // 43位
    {
        id: 'necrozma', name: 'ネクロズマ', types: ['エスパー'], bs: [97, 107, 101, 127, 89, 79],
        abilities: ['プリズムアーマー'], defaultAbility: 'プリズムアーマー'
    },
    // 44位
    {
        id: 'rillaboom', name: 'ゴリランダー', types: ['くさ'], bs: [100, 125, 90, 60, 70, 85],
        abilities: ['しんりょく', 'グラスメイカー'], defaultAbility: 'グラスメイカー'
    },
    // 45位
    {
        id: 'breloom', name: 'キノガッサ', types: ['くさ', 'かくとう'], bs: [60, 130, 80, 60, 60, 70],
        abilities: ['ほうし', 'ポイズンヒール', 'テクニシャン'], defaultAbility: 'テクニシャン'
    },
    // 46位
    {
        id: 'skeledirge', name: 'ラウドボーン', types: ['ほのお', 'ゴースト'], bs: [104, 75, 100, 110, 75, 66],
        abilities: ['もうか', 'てんねん'], defaultAbility: 'てんねん'
    },
    // 47位
    {
        id: 'whimsicott', name: 'エルフーン', types: ['くさ', 'フェアリー'], bs: [60, 67, 85, 77, 75, 116],
        abilities: ['いたずらごころ', 'すりぬけ', 'ようりょくそ'], defaultAbility: 'いたずらごころ'
    },
    // 48位
    {
        id: 'gholdengo', name: 'サーフゴー', types: ['はがね', 'ゴースト'], bs: [87, 60, 95, 133, 91, 84],
        abilities: ['おうごんのからだ'], defaultAbility: 'おうごんのからだ'
    },
    // 49位
    {
        id: 'ironvaliant', name: 'テツノブジン', types: ['フェアリー', 'かくとう'], bs: [74, 130, 90, 120, 60, 116],
        abilities: ['クォークチャージ'], defaultAbility: 'クォークチャージ'
    },
    // 50位
    {
        id: 'chansey', name: 'ラッキー', types: ['ノーマル'], bs: [250, 5, 5, 35, 105, 50],
        abilities: ['しぜんかいふく', 'てんのめぐみ', 'いやしのこころ'], defaultAbility: 'しぜんかいふく'
    },
    // 51位
    {
        id: 'kyurem', name: 'キュレム', types: ['ドラゴン', 'こおり'], bs: [125, 130, 90, 130, 90, 95],
        abilities: ['プレッシャー'], defaultAbility: 'プレッシャー'
    },
    // 52位
    {
        id: 'zamazenta', name: 'ザマゼンタ(たてのおう)', types: ['かくとう', 'はがね'], bs: [92, 130, 145, 80, 145, 128],
        abilities: ['ふくつのたて'], defaultAbility: 'ふくつのたて'
    },
    // 53位
    {
        id: 'smeargle', name: 'ドーブル', types: ['ノーマル'], bs: [55, 20, 35, 20, 45, 75],
        abilities: ['マイペース', 'テクニシャン', 'ムラっけ'], defaultAbility: 'テクニシャン'
    },
    // 54位
    {
        id: 'toxapex', name: 'ドヒドイデ', types: ['どく', 'みず'], bs: [50, 63, 152, 53, 142, 35],
        abilities: ['ひとでなし', 'じゅうなん', 'さいせいりょく'], defaultAbility: 'さいせいりょく'
    },
    // 55位
    {
        id: 'ironbundle', name: 'テツノツツミ', types: ['こおり', 'みず'], bs: [56, 80, 114, 124, 60, 136],
        abilities: ['クォークチャージ'], defaultAbility: 'クォークチャージ'
    },
    // 56位
    {
        id: 'meowscarada', name: 'マスカーニャ', types: ['くさ', 'あく'], bs: [76, 110, 70, 81, 70, 123],
        abilities: ['しんりょく', 'へんげんじざい'], defaultAbility: 'しんりょく'
    },
    // 57位
    {
        id: 'porygon2', name: 'ポリゴン２', types: ['ノーマル'], bs: [85, 80, 90, 105, 95, 60],
        abilities: ['トレース', 'ダウンロード', 'アナライズ'], defaultAbility: 'ダウンロード'
    },
    // 58位
    {
        id: 'azumarill', name: 'マリルリ', types: ['みず', 'フェアリー'], bs: [100, 50, 80, 60, 80, 50],
        abilities: ['あついしぼう', 'ちからもち', 'そうしょく'], defaultAbility: 'ちからもち'
    },
    // 59位
    {
        id: 'ceruledge', name: 'ソウブレイズ', types: ['ほのお', 'ゴースト'], bs: [75, 125, 80, 60, 100, 85],
        abilities: ['もらいび', 'もうか', 'くだけるよろい'], defaultAbility: 'もらいび'
    },
    // 60位
    {
        id: 'heatran', name: 'ヒードラン', types: ['ほのお', 'はがね'], bs: [91, 90, 106, 130, 106, 77],
        abilities: ['もらいび', 'ほのおのからだ'], defaultAbility: 'もらいび'
    },
    // 61位
    {
        id: 'groudon', name: 'グラードン', types: ['じめん'], bs: [100, 150, 140, 100, 90, 90],
        abilities: ['ひでり', 'おわりのだいち'], defaultAbility: 'ひでり'
    },
    // 62位
    {
        id: 'corviknight', name: 'アーマーガア', types: ['ひこう', 'はがね'], bs: [98, 87, 105, 53, 85, 67],
        abilities: ['プレッシャー', 'きんちょうかん', 'ミラーアーマー'], defaultAbility: 'ミラーアーマー'
    },
    // 63位
    {
        id: 'walkingwake', name: 'ウネルミナモ', types: ['みず', 'ドラゴン'], bs: [99, 83, 91, 125, 83, 109],
        abilities: ['こだいかっせい'], defaultAbility: 'こだいかっせい'
    },
    // 64位
    {
        id: 'brutebonnet', name: 'アラブルタケ', types: ['くさ', 'あく'], bs: [111, 127, 99, 79, 99, 55],
        abilities: ['こだいかっせい'], defaultAbility: 'こだいかっせい'
    },
    // 65位
    {
        id: 'hippowdon', name: 'カバルドン', types: ['じめん'], bs: [108, 112, 118, 68, 72, 47],
        abilities: ['すなおこし', 'すなのちから'], defaultAbility: 'すなおこし'
    },
    // 66位
    {
        id: 'hatterene', name: 'ブリムオン', types: ['エスパー', 'フェアリー'], bs: [57, 90, 95, 136, 103, 29],
        abilities: ['いやしのこころ', 'きけんよち', 'マジックミラー'], defaultAbility: 'マジックミラー'
    },
    // 67位
    {
        id: 'roaringmoon', name: 'トドロクツキ', types: ['ドラゴン', 'あく'], bs: [105, 139, 71, 55, 101, 119],
        abilities: ['こだいかっせい'], defaultAbility: 'こだいかっせい'
    },
    // 68位
    {
        id: 'overqwil', name: 'ハリーマン', types: ['あく', 'どく'], bs: [85, 115, 95, 65, 65, 85],
        abilities: ['どくのトゲ', 'すいすい', 'いかく'], defaultAbility: 'いかく'
    },
    // 69位
    {
        id: 'dragapult', name: 'ドラパルト', types: ['ドラゴン', 'ゴースト'], bs: [88, 120, 75, 100, 75, 142],
        abilities: ['クリアボディ', 'すりぬけ', 'のろわれボディ'], defaultAbility: 'クリアボディ'
    },
    // 70位
    {
        id: 'ninetalesAlola', name: 'キュウコン(アローラ)', types: ['こおり', 'フェアリー'], bs: [73, 67, 75, 81, 100, 109],
        abilities: ['ゆきふらし', 'ゆきがくれ'], defaultAbility: 'ゆきふらし'
    },
    // 71位
    {
        id: 'umbreon', name: 'ブラッキー', types: ['あく'], bs: [95, 65, 110, 60, 130, 65],
        abilities: ['シンクロ', 'せいしんりょく'], defaultAbility: 'シンクロ'
    },
    // 72位
    {
        id: 'arboliva', name: 'オリーヴァ', types: ['くさ', 'ノーマル'], bs: [78, 69, 90, 125, 109, 39],
        abilities: ['たいねつ', 'ノーてんき', 'しゅうかく'], defaultAbility: 'しゅうかく'
    },
    // 73位
    {
        id: 'blaziken', name: 'バシャーモ', types: ['ほのお', 'かくとう'], bs: [80, 120, 70, 110, 70, 80],
        abilities: ['もうか', 'かそく'], defaultAbility: 'かそく'
    },
    // 74位
    {
        id: 'goodra', name: 'ヌメルゴン', types: ['ドラゴン'], bs: [90, 100, 70, 110, 150, 80],
        abilities: ['そうしょく', 'うるおいボディ', 'ぬめぬめ'], defaultAbility: 'ぬめぬめ'
    },
    // 75位
    {
        id: 'mamoswine', name: 'マンムー', types: ['こおり', 'じめん'], bs: [110, 130, 80, 70, 60, 80],
        abilities: ['どんかん', 'ゆきがくれ', 'あついしぼう'], defaultAbility: 'あついしぼう'
    },
    // 76位
    {
        id: 'ironhands', name: 'テツノカイナ', types: ['かくとう', 'でんき'], bs: [154, 140, 108, 50, 68, 50],
        abilities: ['クォークチャージ'], defaultAbility: 'クォークチャージ'
    },
    // 77位
    {
        id: 'baxcalibur', name: 'セグレイブ', types: ['ドラゴン', 'こおり'], bs: [115, 145, 92, 75, 86, 87],
        abilities: ['ねつこうかん', 'アイスボディ'], defaultAbility: 'ねつこうかん'
    },
    // 78位
    {
        id: 'gothitelle', name: 'ゴチルゼル', types: ['エスパー'], bs: [70, 55, 95, 95, 110, 65],
        abilities: ['おみとおし', 'かちき', 'かげふみ'], defaultAbility: 'かげふみ'
    },
    // 79位
    {
        id: 'giratina', name: 'ギラティナ', types: ['ゴースト', 'ドラゴン'], bs: [150, 100, 120, 100, 120, 90],
        abilities: ['プレッシャー', 'テレパシー'], defaultAbility: 'プレッシャー'
    },
    // 80位
    {
        id: 'garchomp', name: 'ガブリアス', types: ['ドラゴン', 'じめん'], bs: [108, 130, 95, 80, 85, 102],
        abilities: ['すながくれ', 'さめはだ'], defaultAbility: 'さめはだ'
    },
    // 81位 (フォーム違い含む)
    {
        id: 'ironcrown', name: 'テツノカシラ', types: ['はがね', 'エスパー'], bs: [90, 72, 100, 122, 108, 98],
        abilities: ['クォークチャージ'], defaultAbility: 'クォークチャージ'
    },
    // 82位
    {
        id: 'cloyster', name: 'パルシェン', types: ['みず', 'こおり'], bs: [50, 95, 180, 85, 45, 70],
        abilities: ['シェルアーマー', 'スキルリンク', 'ぼうじん'], defaultAbility: 'スキルリンク'
    },
    // ウーラオス一撃も追加
    {
        id: 'urshifuS', name: 'ウーラオス(一撃)', types: ['かくとう', 'あく'], bs: [100, 130, 100, 63, 60, 97],
        abilities: ['ふかしのこぶし'], defaultAbility: 'ふかしのこぶし'
    },
];
