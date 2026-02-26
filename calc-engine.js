// ==========================================
// ポケモンSV ダメージ計算ツール - 計算エンジン
// ==========================================

/**
 * 実数値を計算する
 */
function calcStat(base, iv, ev, level, nature, statIndex) {
    // HP
    if (statIndex === 0) {
        if (base === 1) return 1; // ヌケニン
        return Math.floor((2 * base + iv + Math.floor(ev / 4)) * level / 100) + level + 10;
    }
    // その他
    let stat = Math.floor((2 * base + iv + Math.floor(ev / 4)) * level / 100) + 5;
    const natureData = NATURES[nature];
    if (natureData && natureData.up === statIndex) stat = Math.floor(stat * 1.1);
    if (natureData && natureData.down === statIndex) stat = Math.floor(stat * 0.9);
    return stat;
}

/**
 * 全ステータスの実数値を計算する
 */
function calcAllStats(pokemon, level, nature, ivs, evs) {
    const stats = [];
    for (let i = 0; i < 6; i++) {
        stats.push(calcStat(pokemon.bs[i], ivs[i], evs[i], level, nature, i));
    }
    return stats;
}

/**
 * 五捨五超入 (ポケモン独自の丸め)
 */
function pokeRound(n) {
    return (n % 1 > 0.5) ? Math.ceil(n) : Math.floor(n);
}

/**
 * ダメージ計算 メイン関数
 * @returns {Object} { damages: number[16], min, max, minPercent, maxPercent, hitsToKO }
 */
function calculateDamage(params) {
    const {
        attacker, defender,
        attackerLevel, defenderLevel,
        attackerNature, defenderNature,
        attackerIVs, defenderIVs,
        attackerEVs, defenderEVs,
        attackerAbility, defenderAbility,
        attackerItem, defenderItem,
        move,
        weather, field,
        isCritical, isBurned,
        attackerRank, defenderRank,
        attackerTera, defenderTera,
        isTerastallized, isDefenderTera,
        isReflect, isLightScreen, isAuroraVeil,
        isMultiscaleActive, isDisguiseActive,
    } = params;

    // 実数値計算
    const atkStats = calcAllStats(attacker, attackerLevel, attackerNature, attackerIVs, attackerEVs);
    const defStats = calcAllStats(defender, defenderLevel, defenderNature, defenderIVs, defenderEVs);
    const defHP = defStats[0];

    // 技の分類
    const isPhysical = move.category === '物理';
    const isSpecial = move.category === '特殊';
    if (!isPhysical && !isSpecial) return null;

    // ---- 技の威力 ----
    let power = move.power;
    if (power === 0) return null;

    // テラスタル時の威力補正: テラタイプ一致の威力60以下の技は威力60に引き上げ
    if (isTerastallized && attackerTera && move.type === attackerTera && power <= 60) {
        power = 60;
    }

    // ノックオフ (はたきおとす) 持ち物ありなら 1.5倍
    if (move.flags && move.flags.includes('knockOff') && defenderItem && defenderItem !== 'なし') {
        power = Math.floor(power * 1.5);
    }
    // からげんき (状態異常時 140)
    if (move.flags && move.flags.includes('facade') && isBurned) {
        power = 140;
    }

    // テクニシャン (60以下の技 → 1.5倍)
    const atkAbilityData = ABILITIES[attackerAbility];
    if (atkAbilityData && atkAbilityData.type === 'technician' && power <= 60) {
        power = Math.floor(power * 1.5);
    }
    // がんじょうあご (bite技 → 1.5倍)
    if (atkAbilityData && atkAbilityData.type === 'strongJaw' && move.flags && move.flags.includes('bite')) {
        power = Math.floor(power * 1.5);
    }
    // てつのこぶし (パンチ技 → 1.2倍)
    if (atkAbilityData && atkAbilityData.type === 'ironFist' && move.flags && move.flags.includes('punch')) {
        power = Math.floor(power * 1.2);
    }
    // すてみ (反動技 → 1.2倍)
    if (atkAbilityData && atkAbilityData.type === 'reckless' && move.flags && move.flags.includes('recoil')) {
        power = Math.floor(power * 1.2);
    }
    // メガランチャー (はどう技 → 1.5倍)
    if (atkAbilityData && atkAbilityData.type === 'megaLauncher' && move.flags && move.flags.includes('pulse')) {
        power = Math.floor(power * 1.5);
    }
    // タイプ強化特性
    if (atkAbilityData && atkAbilityData.type === 'typePower' && move.type === atkAbilityData.moveType) {
        power = pokeRound(power * atkAbilityData.value);
    }
    // タイプ強化特性 (オーラ系)
    if (atkAbilityData && atkAbilityData.type === 'aura' && move.type === atkAbilityData.moveType) {
        power = pokeRound(power * atkAbilityData.value);
    }

    // 持ち物による威力補正
    const atkItemData = ITEMS[attackerItem];
    if (atkItemData && atkItemData.type === 'typePower' && move.type === atkItemData.moveType) {
        power = pokeRound(power * atkItemData.value);
    }

    // ---- 攻撃側ステータス ----
    let A;
    if (move.flags && move.flags.includes('foulPlay')) {
        // イカサマは相手のAを使用
        A = defStats[1];
    } else if (move.flags && move.flags.includes('bodyPress')) {
        // ボディプレスは自分のBを使用
        A = atkStats[2];
    } else {
        A = isPhysical ? atkStats[1] : atkStats[3];
    }

    // ランク補正 (攻撃側)
    const atkRankIdx = isPhysical ? 1 : 3;
    let effectiveAtkRank = (move.flags && move.flags.includes('foulPlay'))
        ? (defenderRank || {})['1'] || 0
        : (attackerRank || {})[String(atkRankIdx)] || 0;
    if (isCritical && effectiveAtkRank < 0) effectiveAtkRank = 0;
    A = Math.floor(A * RANK_MODIFIERS[String(effectiveAtkRank)]);

    // 特性による攻撃補正
    if (atkAbilityData) {
        if (atkAbilityData.type === 'atkMod' && isPhysical) {
            if (atkAbilityData.condition === 'physical') A = Math.floor(A * atkAbilityData.value);
            if (atkAbilityData.condition === 'physicalStatus' && isBurned) A = Math.floor(A * atkAbilityData.value);
        }
        if (atkAbilityData.type === 'spaMod' && isSpecial) {
            if (!atkAbilityData.condition || atkAbilityData.condition === 'sun' && weather === 'はれ') {
                A = Math.floor(A * atkAbilityData.value);
            }
        }
        // ひひいろのこどう (はれ時 A 1.3倍)
        if (atkAbilityData.type === 'atkBoostSun' && weather === 'はれ' && isPhysical) {
            A = pokeRound(A * atkAbilityData.value);
        }
        // ハドロンエンジン (エレキフィールド時 C 1.3倍)
        if (atkAbilityData.type === 'spaBoostField' && field === 'エレキフィールド' && isSpecial) {
            A = pokeRound(A * atkAbilityData.value);
        }
    }

    // 持ち物による攻撃補正
    if (atkItemData) {
        if (atkItemData.type === 'atkItem' && isPhysical) A = pokeRound(A * atkItemData.value);
        if (atkItemData.type === 'spaItem' && isSpecial) A = pokeRound(A * atkItemData.value);
    }

    // ---- 防御側ステータス ----
    let D;
    // サイコショック → 特殊技だが相手の物理防御を使用
    if (move.flags && move.flags.includes('psyshock')) {
        D = defStats[2];
    } else {
        D = isPhysical ? defStats[2] : defStats[4];
    }

    // ランク補正 (防御側)
    const defRankIdx = (isPhysical && !(move.flags && move.flags.includes('psyshock'))) ? 2 : 4;
    let effectiveDefRank = (defenderRank || {})[String(defRankIdx)] || 0;
    if (isCritical && effectiveDefRank > 0) effectiveDefRank = 0;
    D = Math.floor(D * RANK_MODIFIERS[String(effectiveDefRank)]);

    // 防御側特性
    const defAbilityData = ABILITIES[defenderAbility];
    if (defAbilityData) {
        if (defAbilityData.type === 'defMod' && isPhysical && defAbilityData.condition === 'physical') {
            D = Math.floor(D * defAbilityData.value);
        }
        // 災厄系 (攻撃側が災厄持ちの場合、相手の防御を下げる)
    }
    // 攻撃側の災厄特性
    if (atkAbilityData) {
        if (atkAbilityData.type === 'ruinSword' && isPhysical) D = pokeRound(D * 0.75);
        if (atkAbilityData.type === 'ruinBeads' && isSpecial) D = pokeRound(D * 0.75);
        if (atkAbilityData.type === 'ruinTablet' && isSpecial) D = pokeRound(D * 0.75);
    }

    // すなあらしによる岩タイプの特防1.5倍
    if (weather === 'すなあらし' && defender.types.includes('いわ') && isSpecial) {
        D = pokeRound(D * 1.5);
    }
    // ゆきによる氷タイプの防御1.5倍
    if (weather === 'ゆき' && defender.types.includes('こおり') && isPhysical) {
        D = pokeRound(D * 1.5);
    }

    // 持ち物による防御補正
    const defItemData = ITEMS[defenderItem];
    if (defItemData) {
        if (defItemData.type === 'spdItem' && isSpecial) {
            D = pokeRound(D * defItemData.value);
        }
        if (defItemData.type === 'eviolite') {
            D = pokeRound(D * defItemData.value);
        }
    }

    // ---- 基礎ダメージ ----
    const levelCalc = Math.floor(attackerLevel * 2 / 5) + 2;
    let baseDmg = Math.floor(Math.floor(levelCalc * power * A / D) / 50) + 2;

    // ---- 天候補正 ----
    if (weather === 'はれ') {
        if (move.type === 'ほのお') baseDmg = pokeRound(baseDmg * 1.5);
        if (move.type === 'みず') baseDmg = pokeRound(baseDmg * 0.5);
    }
    if (weather === 'あめ') {
        if (move.type === 'みず') baseDmg = pokeRound(baseDmg * 1.5);
        if (move.type === 'ほのお') baseDmg = pokeRound(baseDmg * 0.5);
    }

    // ---- 急所補正 ----
    if (isCritical) {
        baseDmg = pokeRound(baseDmg * 1.5);
    }

    // ---- 乱数 (16段階: 0.85 ~ 1.00) ----
    const damages = [];
    for (let i = 0; i < 16; i++) {
        let dmg = Math.floor(baseDmg * (85 + i) / 100);

        // ---- STAB (タイプ一致補正) ----
        let stab = 1.0;
        const moveType = move.type;
        const isOriginalSTAB = attacker.types.includes(moveType);
        const isAdaptability = atkAbilityData && atkAbilityData.type === 'adaptability';

        if (isTerastallized && attackerTera) {
            const isTeraMoveMatch = (moveType === attackerTera);
            if (isTeraMoveMatch && isOriginalSTAB) {
                stab = isAdaptability ? 2.25 : 2.0;
            } else if (isTeraMoveMatch) {
                stab = isAdaptability ? 2.0 : 1.5;
            } else if (isOriginalSTAB) {
                stab = isAdaptability ? 2.0 : 1.5;
            }
        } else {
            if (isOriginalSTAB) {
                stab = isAdaptability ? 2.0 : 1.5;
            }
        }
        dmg = pokeRound(dmg * stab);

        // ---- タイプ相性 ----
        let effectiveness = 1.0;
        const moveTypeIdx = TYPES.indexOf(moveType);
        // 防御側タイプ (テラスタル時はテラタイプのみ)
        const defTypes = (isDefenderTera && defenderTera) ? [defenderTera] : defender.types;
        for (const defType of defTypes) {
            const defTypeIdx = TYPES.indexOf(defType);
            if (moveTypeIdx >= 0 && defTypeIdx >= 0) {
                effectiveness *= TYPE_CHART[moveTypeIdx][defTypeIdx];
            }
        }
        // フリーズドライ: 水タイプに抜群
        if (move.flags && move.flags.includes('freezeDry')) {
            for (const defType of defTypes) {
                if (defType === 'みず') {
                    // 通常のこおり→みず(等倍)を抜群に変更
                    effectiveness *= 2;
                }
            }
        }
        if (effectiveness === 0) return { damages: new Array(16).fill(0), min: 0, max: 0, minPercent: 0, maxPercent: 0, hitsToKO: '---', effectiveness: 0 };
        dmg = Math.floor(dmg * effectiveness);

        // いろめがね (半減以下を2倍)
        if (atkAbilityData && atkAbilityData.type === 'tintedLens' && effectiveness < 1) {
            dmg = Math.floor(dmg * 2);
        }

        // ---- やけど補正 ----
        if (isBurned && isPhysical && !(move.flags && move.flags.includes('facade'))) {
            if (!(atkAbilityData && atkAbilityData.type === 'atkMod' && atkAbilityData.condition === 'physicalStatus')) {
                dmg = Math.floor(dmg * 0.5);
            }
        }

        // ---- 壁補正 ----
        if (!isCritical) {
            if (isPhysical && (isReflect || isAuroraVeil)) dmg = pokeRound(dmg * 0.5);
            if (isSpecial && (isLightScreen || isAuroraVeil)) dmg = pokeRound(dmg * 0.5);
        }

        // ---- いのちのたま 等火力アップアイテム ----
        if (atkItemData) {
            if (atkItemData.type === 'lifeOrb') dmg = pokeRound(dmg * atkItemData.value);
            if (atkItemData.type === 'expertBelt' && effectiveness > 1) dmg = pokeRound(dmg * atkItemData.value);
            if (atkItemData.type === 'typeBoostItem' && moveType === atkItemData.boostType) dmg = pokeRound(dmg * atkItemData.value);
            if (atkItemData.type === 'muscleBand' && isPhysical) dmg = pokeRound(dmg * atkItemData.value);
            if (atkItemData.type === 'wiseGlasses' && isSpecial) dmg = pokeRound(dmg * atkItemData.value);
            if (atkItemData.type === 'normalGem' && moveType === 'ノーマル') dmg = pokeRound(dmg * atkItemData.value);
            if (atkItemData.type === 'punchingGlove' && move.name.includes('パンチ')) dmg = pokeRound(dmg * atkItemData.value);
            if (atkItemData.type === 'metronomeMax') dmg = pokeRound(dmg * atkItemData.value);
            if (atkItemData.type === 'metronomeMid') dmg = pokeRound(dmg * atkItemData.value);
            if (atkItemData.type === 'soulDew' && (moveType === 'エスパー' || moveType === 'ドラゴン')) dmg = pokeRound(dmg * atkItemData.value);
        }

        // 半減実
        if (defItemData && defItemData.type === 'resistBerry') {
            if (defItemData.resistType === moveType && (effectiveness > 1 || moveType === 'ノーマル')) {
                dmg = pokeRound(dmg * 0.5);
            }
        }

        // マルチスケイル / ファントムガード (HP満タン時)
        if (defAbilityData && defAbilityData.type === 'multiscale' && isMultiscaleActive) {
            dmg = pokeRound(dmg * 0.5);
        }

        // スナイパー (急所時 1.5倍 → 合計で2.25倍相当)
        if (atkAbilityData && atkAbilityData.type === 'sniper' && isCritical) {
            dmg = pokeRound(dmg * 1.5);
        }

        // あついしぼう (炎・氷半減)
        if (defAbilityData && defAbilityData.type === 'thickFat' && (moveType === 'ほのお' || moveType === 'こおり')) {
            dmg = pokeRound(dmg * 0.5);
        }

        // きよめのしお (ゴースト半減)
        if (defAbilityData && defAbilityData.type === 'purifyingSalt' && moveType === 'ゴースト') {
            dmg = pokeRound(dmg * 0.5);
        }

        // フィールド補正
        if (field === 'エレキフィールド' && moveType === 'でんき') dmg = pokeRound(dmg * 1.3);
        if (field === 'グラスフィールド' && moveType === 'くさ') dmg = pokeRound(dmg * 1.3);
        if (field === 'サイコフィールド' && moveType === 'エスパー') dmg = pokeRound(dmg * 1.3);
        if (field === 'ミストフィールド' && moveType === 'ドラゴン') dmg = pokeRound(dmg * 0.5);

        // グラスフィールド HP回復ではなく じしん威力半減
        if (field === 'グラスフィールド' && (move.name === 'じしん' || move.name === 'じならし')) {
            dmg = pokeRound(dmg * 0.5);
        }

        dmg = Math.max(1, dmg);
        damages.push(dmg);
    }

    const min = Math.min(...damages);
    const max = Math.max(...damages);
    const minPercent = Math.floor(min / defHP * 1000) / 10;
    const maxPercent = Math.floor(max / defHP * 1000) / 10;

    // 確定数計算 (厳密な乱数確率付き)
    let hitsToKO = '---';
    let koChance = 0;
    if (max > 0) {
        for (let n = 1; n <= 10; n++) {
            const chance = calcKOChance(damages, defHP, n);
            if (chance >= 100) {
                hitsToKO = `確${n}`;
                koChance = 100;
                break;
            }
            if (chance > 0) {
                hitsToKO = `乱${n} (${chance}%)`;
                koChance = chance;
                break;
            }
        }
    }

    return {
        damages, min, max,
        minPercent, maxPercent,
        hitsToKO, koChance,
        effectiveness: calcEffectiveness(move, defender, isDefenderTera, defenderTera),
        defHP,
    };
}

/**
 * 相性倍率の計算
 */
function calcEffectiveness(move, defender, isDefenderTera, defenderTera) {
    const moveTypeIdx = TYPES.indexOf(move.type);
    const defTypes = (isDefenderTera && defenderTera) ? [defenderTera] : defender.types;
    let eff = 1;
    for (const t of defTypes) {
        const idx = TYPES.indexOf(t);
        if (moveTypeIdx >= 0 && idx >= 0) eff *= TYPE_CHART[moveTypeIdx][idx];
    }
    return eff;
}

/**
 * 乱数KO確率計算 (厳密: 動的計画法)
 * 同じ技をN回使用した場合の撃破確率を計算
 */
function calcKOChance(damages, hp, hits) {
    if (hits === 1) {
        const koCount = damages.filter(d => d >= hp).length;
        return Math.round(koCount / 16 * 1000) / 10;
    }
    // DP: 頻度マップで全組み合わせを厳密に計算
    let freq = new Map();
    freq.set(0, 1);
    for (let h = 0; h < hits; h++) {
        const next = new Map();
        for (const [sum, count] of freq) {
            for (const dmg of damages) {
                const ns = sum + dmg;
                next.set(ns, (next.get(ns) || 0) + count);
            }
        }
        freq = next;
    }
    let koCount = 0, total = 0;
    for (const [sum, count] of freq) {
        total += count;
        if (sum >= hp) koCount += count;
    }
    return Math.round(koCount / total * 1000) / 10;
}

/**
 * 複数の異なる技のダメージ配列を受け取り、合算で撃破する確率を厳密計算
 * 配列には正値(ダメージ)と負値(ドレイン回復)が混在可能
 * @param {number[][]} damagesArrays - 各技のダメージ配列(各16要素, 負値も可)
 * @param {number} hp - 防御側の最大HP (定数オフセット調整済み)
 * @returns {number} 撃破確率 (0~100, 小数1桁)
 */
function calcAccumulatedKOProbability(damagesArrays, hp) {
    if (damagesArrays.length === 0) return 0;
    if (hp <= 0) return 100;
    // DP: 頻度マップで全組み合わせを厳密計算
    // 負の値(回復)も含まれるため、下限を設定してマップ肥大化を防止
    const minBound = -hp; // 回復がHP以上の意味はない
    let freq = new Map();
    freq.set(0, 1);
    for (const damages of damagesArrays) {
        const next = new Map();
        for (const [sum, count] of freq) {
            for (const dmg of damages) {
                let ns = sum + dmg;
                // 上限cap: KO確定ならそれ以上は区別不要
                if (ns >= hp) ns = hp;
                // 下限cap: 回復でマイナスが大きくなりすぎないように
                if (ns < minBound) ns = minBound;
                next.set(ns, (next.get(ns) || 0) + count);
            }
        }
        freq = next;
    }
    let koCount = 0, total = 0;
    for (const [sum, count] of freq) {
        total += count;
        if (sum >= hp) koCount += count;
    }
    return Math.round(koCount / total * 1000) / 10;
}
