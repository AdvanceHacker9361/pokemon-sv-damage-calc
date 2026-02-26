// ==========================================
// ポケモンSV ダメージ計算ツール - アプリケーション
// ==========================================

// ダメージ加算ストレージ (最大5件)
const accumulatedResults = [];
const ACC_MAX = 5;

document.addEventListener('DOMContentLoaded', () => {
    // --- 初期化 ---
    initPokemonSelectors();
    initNatureSelectors();
    initItemSelectors();
    initTeraSelectors();
    initMoveSelectors();
    initRankSelectors();
    setupEventListeners();

    // --- 検索可能ドロップダウン化 ---
    initSearchableSelects();

    // 初期表示
    onPokemonChange('atk');
    onPokemonChange('def');
    renderAccumulator();
});

// ============================
// セレクタ初期化
// ============================

function initPokemonSelectors() {
    const atkSel = document.getElementById('atk-pokemon');
    const defSel = document.getElementById('def-pokemon');
    POKEMON.forEach((p, i) => {
        const opt1 = new Option(p.name, i);
        const opt2 = new Option(p.name, i);
        atkSel.add(opt1);
        defSel.add(opt2);
    });
    // デフォルト選択
    atkSel.value = 0;
    defSel.value = 0;
}

function initNatureSelectors() {
    ['atk-nature', 'def-nature'].forEach(id => {
        const sel = document.getElementById(id);
        Object.keys(NATURES).forEach(name => {
            const n = NATURES[name];
            let label = name;
            if (n.up && n.down) {
                const statNames = ['', 'A', 'B', 'C', 'D', 'S'];
                label += ` (${statNames[n.up]}↑${statNames[n.down]}↓)`;
            }
            sel.add(new Option(label, name));
        });
        // デフォルト
        if (id === 'atk-nature') sel.value = 'いじっぱり';
        else sel.value = 'わんぱく';
    });
}

function initItemSelectors() {
    ['atk-item', 'def-item'].forEach(id => {
        const sel = document.getElementById(id);
        sel.add(new Option('なし', 'なし'));
        Object.keys(ITEMS).forEach(name => {
            if (name === 'なし') return;
            sel.add(new Option(name, name));
        });
    });
}

function initTeraSelectors() {
    ['atk-tera-type', 'def-tera-type'].forEach(id => {
        const sel = document.getElementById(id);
        TYPES.forEach(t => sel.add(new Option(t, t)));
    });
}

function initMoveSelectors() {
    for (let i = 1; i <= 4; i++) {
        const sel = document.getElementById(`move-${i}`);
        sel.add(new Option('--- 選択 ---', ''));
        MOVES.forEach((m, idx) => {
            const label = `${m.name} (${m.type}/${m.category}/威力${m.power})`;
            sel.add(new Option(label, idx));
        });
    }
}

function initRankSelectors() {
    const rankIds = ['atk-rank-a', 'atk-rank-c', 'def-rank-b', 'def-rank-d'];
    rankIds.forEach(id => {
        const sel = document.getElementById(id);
        sel.innerHTML = '';
        for (let r = -6; r <= 6; r++) {
            const label = r > 0 ? `+${r}` : r === 0 ? '±0' : String(r);
            sel.add(new Option(label, r));
        }
        sel.value = '0';
    });
}

function initSearchableSelects() {
    console.log("initSearchableSelects executing...");
    // ポケモン選択 (攻撃側・防御側)
    ['atk-pokemon', 'def-pokemon'].forEach(id => {
        new SearchableSelect(document.getElementById(id), {
            placeholder: 'ポケモン名で検索...',
        });
    });

    // 技選択 (4スロット)
    for (let i = 1; i <= 4; i++) {
        new SearchableSelect(document.getElementById(`move-${i}`), {
            placeholder: '技名で検索...',
            formatOption: (item, isDisplay) => {
                // MoveデータからタイプとカテゴリEを取得
                const moveIdx = parseInt(item.value);
                if (isNaN(moveIdx) || !MOVES[moveIdx]) return item.text;
                const move = MOVES[moveIdx];
                const typeColor = getTypeColor(move.type);
                if (isDisplay) {
                    // 表示欄用 (コンパクト)
                    return `<span class="ss-type-badge" style="background:${typeColor}">${move.type}</span> ${move.name} <span style="color:var(--text-muted);font-size:0.7rem">${move.category} 威力${move.power}</span>`;
                }
                // ドロップダウンリスト用
                return `<span class="ss-type-badge" style="background:${typeColor}">${move.type}</span><span class="ss-name">${move.name}</span><span class="ss-cat">${move.category}</span><span class="ss-power">威力${move.power}</span>`;
            }
        });
    }

    // 持ち物も検索可能に
    ['atk-item', 'def-item'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            new SearchableSelect(el, {
                placeholder: '持ち物を検索...',
            });
        }
    });

    // 特性も検索可能に
    ['atk-ability', 'def-ability'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            new SearchableSelect(el, {
                placeholder: '特性を検索...',
            });
        }
    });
}

function setupEventListeners() {
    // ポケモン変更
    document.getElementById('atk-pokemon').addEventListener('change', () => onPokemonChange('atk'));
    document.getElementById('def-pokemon').addEventListener('change', () => onPokemonChange('def'));

    // 性格・EV・IV 変更時に実数値再計算
    ['atk', 'def'].forEach(side => {
        document.getElementById(`${side}-nature`).addEventListener('change', () => updateActualStats(side));
        document.getElementById(`${side}-level`).addEventListener('input', () => updateActualStats(side));
        const grid = document.getElementById(`${side}-evs`);
        grid.querySelectorAll('input[type="number"]').forEach(input => {
            input.addEventListener('input', () => updateActualStats(side));
        });
    });

    // 計算ボタン
    document.querySelectorAll('.calc-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const moveIdx = btn.dataset.move;
            calcSingleMove(parseInt(moveIdx));
        });
    });

    // 全計算ボタン
    document.getElementById('calc-all-btn').addEventListener('click', calcAllMoves);

    // EVプリセット
    document.querySelectorAll('.ev-preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            applyEVPreset(btn.dataset.side, btn.dataset.preset);
        });
    });

    // 加算クリアボタン
    document.getElementById('acc-clear-btn').addEventListener('click', clearAccumulator);

    // 定数ダメージプリセット追加
    document.getElementById('acc-add-preset').addEventListener('click', addConstantPreset);
    document.getElementById('acc-add-custom').addEventListener('click', addConstantCustom);

    // 攻撃側・防御側の入れ替えボタン
    const swapBtn = document.getElementById('swap-btn');
    if (swapBtn) {
        swapBtn.addEventListener('click', swapSides);
    }
}

// ============================
// ポケモン変更ハンドラ
// ============================

function onPokemonChange(side) {
    const sel = document.getElementById(`${side}-pokemon`);
    const pokemon = POKEMON[sel.value];
    if (!pokemon) return;

    // 種族値表示
    updateBaseStats(side, pokemon);

    // 特性リスト更新
    updateAbilityList(side, pokemon);

    // テラタイプデフォルト
    document.getElementById(`${side}-tera-type`).value = pokemon.types[0];

    // 実数値更新
    updateActualStats(side);
}

function updateBaseStats(side, pokemon) {
    const container = document.getElementById(`${side}-base-stats`);
    const labels = ['H', 'A', 'B', 'C', 'D', 'S'];
    container.innerHTML = pokemon.bs.map((val, i) => `
    <div class="base-stat-item">
      <div class="label">${labels[i]}</div>
      <div class="value">${val}</div>
    </div>
  `).join('');
}

function updateAbilityList(side, pokemon) {
    const sel = document.getElementById(`${side}-ability`);
    sel.innerHTML = '';
    pokemon.abilities.forEach(a => sel.add(new Option(a, a)));
    if (pokemon.defaultAbility) sel.value = pokemon.defaultAbility;
    if (sel._searchableSelect) sel._searchableSelect.refresh();
}

function updateActualStats(side) {
    const pokemonIdx = document.getElementById(`${side}-pokemon`).value;
    const pokemon = POKEMON[pokemonIdx];
    if (!pokemon) return;

    const level = parseInt(document.getElementById(`${side}-level`).value) || 50;
    const nature = document.getElementById(`${side}-nature`).value;
    const grid = document.getElementById(`${side}-evs`);

    const evInputs = grid.querySelectorAll('input[type="number"]:not(.iv)');
    const ivInputs = grid.querySelectorAll('input.iv');
    const actualInputs = grid.querySelectorAll('input.actual-stat');

    let totalEV = 0;
    const evVals = [];

    // First pass: collect EVs and cap individual at 252
    for (let i = 0; i < 6; i++) {
        let ev = parseInt(evInputs[i].value) || 0;
        if (ev > 252) ev = 252;
        if (ev < 0) ev = 0;
        evVals.push(ev);
        totalEV += ev;
    }

    // Second pass: if total > 508, reduce the currently focused input or the last modified one
    if (totalEV > 508) {
        const excess = totalEV - 508;
        // Find the input that caused the overflow (likely the active element)
        let activeIdx = -1;
        for (let i = 0; i < 6; i++) {
            if (document.activeElement === evInputs[i]) {
                activeIdx = i;
                break;
            }
        }

        if (activeIdx !== -1) {
            evVals[activeIdx] -= excess;
            if (evVals[activeIdx] < 0) evVals[activeIdx] = 0;
        } else {
            // Fallback (e.g. preset applied incorrectly), just reduce from the end
            let remainingExcess = excess;
            for (let i = 5; i >= 0 && remainingExcess > 0; i--) {
                const reduce = Math.min(evVals[i], remainingExcess);
                evVals[i] -= reduce;
                remainingExcess -= reduce;
            }
        }
    }

    // Third pass: apply validated EVs and calculate stats
    let finalTotalEV = 0;
    for (let i = 0; i < 6; i++) {
        evInputs[i].value = evVals[i];
        finalTotalEV += evVals[i];

        const iv = parseInt(ivInputs[i].value) || 0;
        const stat = calcStat(pokemon.bs[i], iv, evVals[i], level, nature, i);
        actualInputs[i].value = stat;
    }

    // Update Remaining EV display
    const remainingEl = document.getElementById(`${side}-ev-remaining`);
    if (remainingEl) {
        remainingEl.textContent = `残り: ${508 - finalTotalEV}`;
    }
}

// ============================
// 入れ替え機能 (Swap)
// ============================

function swapSides() {
    const fields = [
        'pokemon', 'level', 'nature', 'item', 'tera-active', 'tera-type'
    ];

    // 1. 基本設定の入れ替え
    fields.forEach(field => {
        const atkEl = document.getElementById(`atk-${field}`);
        const defEl = document.getElementById(`def-${field}`);
        if (!atkEl || !defEl) return;

        if (atkEl.type === 'checkbox') {
            const temp = atkEl.checked;
            atkEl.checked = defEl.checked;
            defEl.checked = temp;
        } else {
            const temp = atkEl.value;
            atkEl.value = defEl.value;
            defEl.value = temp;
        }
    });

    // 2. 特性の入れ替えとドロップダウンの再構築
    const atkPokemon = POKEMON[document.getElementById('atk-pokemon').value];
    const defPokemon = POKEMON[document.getElementById('def-pokemon').value];

    // Save current ability values before they are reset by updateAbilityList
    const atkAbilityVal = document.getElementById('atk-ability').value;
    const defAbilityVal = document.getElementById('def-ability').value;

    if (atkPokemon) updateAbilityList('atk', atkPokemon);
    if (defPokemon) updateAbilityList('def', defPokemon);

    // Swap abilities
    document.getElementById('atk-ability').value = defAbilityVal;
    document.getElementById('def-ability').value = atkAbilityVal;

    // 3. 個体値(IV)と努力値(EV)の入れ替え
    const atkGrid = document.getElementById('atk-evs');
    const defGrid = document.getElementById('def-evs');
    const atkEvs = atkGrid.querySelectorAll('input[type="number"]:not(.iv)');
    const atkIvs = atkGrid.querySelectorAll('input.iv');
    const defEvs = defGrid.querySelectorAll('input[type="number"]:not(.iv)');
    const defIvs = defGrid.querySelectorAll('input.iv');

    for (let i = 0; i < 6; i++) {
        const tempEv = atkEvs[i].value;
        atkEvs[i].value = defEvs[i].value;
        defEvs[i].value = tempEv;

        const tempIv = atkIvs[i].value;
        atkIvs[i].value = defIvs[i].value;
        defIvs[i].value = tempIv;
    }

    // 4. ランク補正のリセット (仕様通り)
    document.getElementById('atk-rank-a').value = '0';
    document.getElementById('atk-rank-c').value = '0';
    document.getElementById('def-rank-b').value = '0';
    document.getElementById('def-rank-d').value = '0';

    // 5. Searchable Select の表示更新
    const atkSel = document.getElementById('atk-pokemon');
    const defSel = document.getElementById('def-pokemon');
    if (atkSel._searchableSelect) atkSel._searchableSelect.refresh();
    if (defSel._searchableSelect) defSel._searchableSelect.refresh();

    const atkItemSel = document.getElementById('atk-item');
    const defItemSel = document.getElementById('def-item');
    if (atkItemSel._searchableSelect) atkItemSel._searchableSelect.refresh();
    if (defItemSel._searchableSelect) defItemSel._searchableSelect.refresh();

    // 6. 実数値の再描画
    updateActualStats('atk');
    updateActualStats('def');
}

// ============================
// EVプリセット
// ============================

function applyEVPreset(side, preset) {
    const grid = document.getElementById(`${side}-evs`);
    const evInputs = grid.querySelectorAll('input[type="number"]:not(.iv)');

    // リセット
    evInputs.forEach(input => input.value = 0);

    const presets = {
        'ha': [252, 252, 0, 0, 0, 4],
        'hc': [252, 0, 0, 252, 0, 4],
        'as': [0, 252, 0, 0, 4, 252],
        'cs': [0, 0, 0, 252, 4, 252],
        'hb': [252, 0, 252, 0, 4, 0],
        'hd': [252, 0, 0, 0, 252, 4],
        'hbs': [252, 0, 252, 0, 0, 4],
        'reset': [0, 0, 0, 0, 0, 0],
    };
    const vals = presets[preset];
    if (vals) {
        vals.forEach((v, i) => evInputs[i].value = v);
    }
    updateActualStats(side);
}

// ============================
// ダメージ計算
// ============================

function getCalcParams(moveObj) {
    const atkIdx = document.getElementById('atk-pokemon').value;
    const defIdx = document.getElementById('def-pokemon').value;
    const attacker = POKEMON[atkIdx];
    const defender = POKEMON[defIdx];

    const atkLevel = parseInt(document.getElementById('atk-level').value) || 50;
    const defLevel = parseInt(document.getElementById('def-level').value) || 50;

    const atkNature = document.getElementById('atk-nature').value;
    const defNature = document.getElementById('def-nature').value;

    // EV/IV
    const atkGrid = document.getElementById('atk-evs');
    const defGrid = document.getElementById('def-evs');
    const atkEVs = Array.from(atkGrid.querySelectorAll('input[type="number"]:not(.iv)')).map(i => parseInt(i.value) || 0);
    const atkIVs = Array.from(atkGrid.querySelectorAll('input.iv')).map(i => parseInt(i.value) || 0);
    const defEVs = Array.from(defGrid.querySelectorAll('input[type="number"]:not(.iv)')).map(i => parseInt(i.value) || 0);
    const defIVs = Array.from(defGrid.querySelectorAll('input.iv')).map(i => parseInt(i.value) || 0);

    const atkAbility = document.getElementById('atk-ability').value;
    const defAbility = document.getElementById('def-ability').value;
    const atkItem = document.getElementById('atk-item').value;
    const defItem = document.getElementById('def-item').value;

    const weather = document.getElementById('weather').value;
    const field = document.getElementById('field').value;
    const isCritical = document.getElementById('is-critical').checked;
    const isBurned = document.getElementById('is-burned').checked;
    const isReflect = document.getElementById('is-reflect').checked;
    const isLightScreen = document.getElementById('is-lightscreen').checked;
    const isAuroraVeil = document.getElementById('is-auroraveil').checked;

    const isTerastallized = document.getElementById('atk-tera-active').checked;
    const attackerTera = document.getElementById('atk-tera-type').value;
    const isDefenderTera = document.getElementById('def-tera-active').checked;
    const defenderTera = document.getElementById('def-tera-type').value;

    const isMultiscaleActive = document.getElementById('def-fullhp').checked;

    // ランク
    const attackerRank = {
        '1': parseInt(document.getElementById('atk-rank-a').value) || 0,
        '3': parseInt(document.getElementById('atk-rank-c').value) || 0,
    };
    const defenderRank = {
        '2': parseInt(document.getElementById('def-rank-b').value) || 0,
        '4': parseInt(document.getElementById('def-rank-d').value) || 0,
    };

    // テラバースト のタイプ変更
    let move = { ...moveObj };
    if (move.flags && move.flags.includes('terablast') && isTerastallized) {
        move = { ...move, type: attackerTera };
    }

    return {
        attacker, defender,
        attackerLevel: atkLevel, defenderLevel: defLevel,
        attackerNature: atkNature, defenderNature: defNature,
        attackerIVs: atkIVs, defenderIVs: defIVs,
        attackerEVs: atkEVs, defenderEVs: defEVs,
        attackerAbility: atkAbility, defenderAbility: defAbility,
        attackerItem: atkItem, defenderItem: defItem,
        move,
        weather, field,
        isCritical, isBurned,
        attackerRank, defenderRank,
        attackerTera, defenderTera,
        isTerastallized, isDefenderTera: isDefenderTera,
        isReflect, isLightScreen, isAuroraVeil,
        isMultiscaleActive,
        isDisguiseActive: false,
    };
}

function calcSingleMove(slotIdx) {
    const sel = document.getElementById(`move-${slotIdx}`);
    const moveIdx = sel.value;
    if (moveIdx === '') return;

    const moveObj = MOVES[parseInt(moveIdx)];
    if (!moveObj || moveObj.power === 0) return;

    const params = getCalcParams(moveObj);
    const result = calculateDamage(params);
    if (!result) return;

    displayResults([{ move: moveObj, result }]);
}

function calcAllMoves() {
    const results = [];
    for (let i = 1; i <= 4; i++) {
        const sel = document.getElementById(`move-${i}`);
        const moveIdx = sel.value;
        if (moveIdx === '') continue;

        const moveObj = MOVES[parseInt(moveIdx)];
        if (!moveObj || moveObj.power === 0) continue;

        const params = getCalcParams(moveObj);
        const result = calculateDamage(params);
        if (result) results.push({ move: moveObj, result });
    }

    if (results.length === 0) {
        document.getElementById('results-container').innerHTML =
            '<div class="no-result">技を選択してください</div>';
        return;
    }
    displayResults(results);
}

// ============================
// 結果表示
// ============================

function displayResults(results) {
    const container = document.getElementById('results-container');
    const atkName = POKEMON[document.getElementById('atk-pokemon').value].name;
    const defName = POKEMON[document.getElementById('def-pokemon').value].name;
    const isFull = accumulatedResults.length >= ACC_MAX;

    container.innerHTML = results.map(({ move, result }, idx) => {
        const { min, max, minPercent, maxPercent, hitsToKO, effectiveness, defHP } = result;

        // 相性バッジ
        let effLabel = '', effClass = '';
        if (effectiveness === 0) { effLabel = '無効'; effClass = 'eff-immune'; }
        else if (effectiveness >= 4) { effLabel = '4倍弱点'; effClass = 'eff-super'; }
        else if (effectiveness >= 2) { effLabel = '効果抜群'; effClass = 'eff-super'; }
        else if (effectiveness < 1) { effLabel = 'いまひとつ'; effClass = 'eff-resist'; }

        // 確定数カラー
        let koClass = 'ko-other';
        if (hitsToKO.startsWith('確1') || hitsToKO.startsWith('乱1')) koClass = 'ko-1';
        else if (hitsToKO.includes('2')) koClass = 'ko-2';
        else if (hitsToKO.includes('3')) koClass = 'ko-3';

        // HPバー
        const remainPercent = Math.max(0, 100 - maxPercent);
        let hpBarClass = 'hp-green';
        if (remainPercent < 25) hpBarClass = 'hp-red';
        else if (remainPercent < 50) hpBarClass = 'hp-yellow';

        // タイプバッジ
        const typeColor = getTypeColor(move.type);

        return `
      <div class="result-card">
        <div class="result-move-name">
          <span class="type-badge" style="background:${typeColor}">${move.type}</span>
          ${move.name} (${move.category})
          ${effLabel ? `<span class="result-effectiveness ${effClass}">${effLabel}</span>` : ''}
          <button class="add-to-acc-btn" data-result-idx="${idx}" ${isFull ? 'disabled' : ''}>＋加算</button>
        </div>
        <div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:0.3rem">
          ${atkName} → ${defName}
        </div>
        <div class="result-damage">
          ${min} ~ ${max} <span style="font-size:0.8rem;color:var(--text-secondary)">/ ${defHP} HP</span>
        </div>
        <div class="result-percent">
          ${minPercent}% ~ ${maxPercent}%
        </div>
        <span class="result-ko ${koClass}">${hitsToKO}</span>
        ${move.drainRate ? `
          <div class="drain-info">
            <span class="drain-icon">💚</span>
            回復量: ${Math.floor(min * move.drainRate)} ~ ${Math.floor(max * move.drainRate)} HP
            (${Math.round(move.drainRate * 100)}%吸収)
            <button class="add-drain-btn" data-result-idx="${idx}">回復量を加算</button>
          </div>
        ` : ''}
        <div class="damage-rolls">
          <div class="damage-rolls-label">乱数: 16パターン</div>
          <div class="damage-rolls-grid">
            ${result.damages.map(d => {
            const pct = Math.floor(d / defHP * 1000) / 10;
            const isKO = d >= defHP;
            return `<span class="roll-cell ${isKO ? 'roll-ko' : ''}" title="${pct}%">${d}</span>`;
        }).join('')}
          </div>
        </div>
        <div class="hp-bar-container">
          <div class="hp-bar ${hpBarClass}" style="width:${remainPercent}%"></div>
        </div>
      </div>
    `;
    }).join('');

    // 加算ボタンにイベント紐付け (結果データを保持)
    container.querySelectorAll('.add-to-acc-btn').forEach(btn => {
        const rIdx = parseInt(btn.dataset.resultIdx);
        const { move, result } = results[rIdx];
        btn.addEventListener('click', () => {
            addToAccumulator(move, result, atkName, defName);
        });
    });

    // ドレイン回復加算ボタン
    container.querySelectorAll('.add-drain-btn').forEach(btn => {
        const rIdx = parseInt(btn.dataset.resultIdx);
        const { move, result } = results[rIdx];
        btn.addEventListener('click', () => {
            addDrainRecovery(move, result, atkName, defName);
        });
    });
}

// ============================
// ダメージ加算
// ============================

function addToAccumulator(move, result, atkName, defName) {
    if (accumulatedResults.length >= ACC_MAX) return;
    accumulatedResults.push({ type: 'damage', move, result, atkName, defName });
    renderAccumulator();
    updateAccButtonStates();
}

function removeFromAccumulator(index) {
    accumulatedResults.splice(index, 1);
    renderAccumulator();
    updateAccButtonStates();
}

function clearAccumulator() {
    accumulatedResults.length = 0;
    renderAccumulator();
    updateAccButtonStates();
}

function updateAccButtonStates() {
    const dmgCount = accumulatedResults.filter(e => e.type === 'damage').length;
    document.querySelectorAll('.add-to-acc-btn').forEach(btn => {
        btn.disabled = dmgCount >= ACC_MAX;
    });
}

function addDrainRecovery(move, result, atkName, defName) {
    const rate = move.drainRate || 0;
    if (!rate) return;
    // 16パターンの回復量を負のダメージ配列として保存
    const recoveryDamages = result.damages.map(d => -Math.floor(d * rate));
    accumulatedResults.push({
        type: 'drain_recovery',
        move,
        result,
        atkName,
        defName,
        damages: recoveryDamages,
        minRecovery: Math.floor(result.min * rate),
        maxRecovery: Math.floor(result.max * rate),
    });
    renderAccumulator();
}

// ==== 定数ダメージ/回復 ====

function getDefenderHP() {
    const defIdx = document.getElementById('def-pokemon').value;
    const defender = POKEMON[defIdx];
    if (!defender) return 0;
    const level = parseInt(document.getElementById('def-level').value) || 50;
    const nature = document.getElementById('def-nature').value;
    const grid = document.getElementById('def-evs');
    const ev = parseInt(grid.querySelectorAll('input[type="number"]:not(.iv)')[0].value) || 0;
    const iv = parseInt(grid.querySelectorAll('input.iv')[0].value) || 0;
    return calcStat(defender.bs[0], iv, ev, level, nature, 0);
}

const CONSTANT_PRESETS = {
    'sr4': { label: 'ステロ (×4)', fraction: 1 / 2 },
    'sr2': { label: 'ステロ (×2)', fraction: 1 / 4 },
    'sr1': { label: 'ステロ (×1)', fraction: 1 / 8 },
    'sr05': { label: 'ステロ (×0.5)', fraction: 1 / 16 },
    'sr025': { label: 'ステロ (×0.25)', fraction: 1 / 32 },
    'sp1': { label: 'まきびし1層', fraction: 1 / 8 },
    'sp2': { label: 'まきびし2層', fraction: 1 / 6 },
    'sp3': { label: 'まきびし3層', fraction: 1 / 4 },
    'poison': { label: 'どく', fraction: 1 / 8 },
    'toxic1': { label: 'もうどく1T', fraction: 1 / 16 },
    'toxic2': { label: 'もうどく2T', fraction: 2 / 16 },
    'toxic3': { label: 'もうどく3T', fraction: 3 / 16 },
    'toxic4': { label: 'もうどく4T', fraction: 4 / 16 },
    'burn': { label: 'やけどダメ', fraction: 1 / 16 },
    'weather': { label: '天候ダメ', fraction: 1 / 16 },
    'leftovers': { label: 'たべのこし', fraction: -1 / 16 },
    'bsludge': { label: 'くろいヘドロ', fraction: -1 / 16 },
    'sitrus': { label: 'オボンのみ', fraction: -1 / 4 },
    'grassy': { label: 'グラスフィールド', fraction: -1 / 16 },
    'rockyhelmet': { label: 'ゴツゴツメット', fraction: 1 / 6 },
};

function addConstantPreset() {
    const sel = document.getElementById('acc-constant-preset');
    if (!sel.value) return;
    const preset = CONSTANT_PRESETS[sel.value];
    if (!preset) return;
    const defHP = getDefenderHP();
    const value = Math.floor(defHP * preset.fraction);
    if (value === 0 && preset.fraction !== 0) return;
    accumulatedResults.push({
        type: 'constant',
        label: preset.label,
        value: value,
        icon: value >= 0 ? '💥' : '💚',
    });
    sel.value = '';
    renderAccumulator();
}

function addConstantCustom() {
    const valInput = document.getElementById('acc-custom-value');
    const labelInput = document.getElementById('acc-custom-label');
    const value = parseInt(valInput.value);
    if (isNaN(value) || value === 0) return;
    const label = labelInput.value.trim() || (value > 0 ? 'カスタムダメ' : 'カスタム回復');
    accumulatedResults.push({
        type: 'constant',
        label: label,
        value: value,
        icon: value >= 0 ? '💥' : '💚',
    });
    valInput.value = '';
    labelInput.value = '';
    renderAccumulator();
}

function renderAccumulator() {
    const slotsEl = document.getElementById('acc-slots');
    const totalEl = document.getElementById('acc-total');
    const hintEl = document.getElementById('acc-hint');
    const countEl = document.getElementById('acc-count');

    const allEntries = accumulatedResults;
    const damageEntries = allEntries.filter(e => e.type === 'damage');
    const constantEntries = allEntries.filter(e => e.type === 'constant');
    countEl.textContent = `(${damageEntries.length}/${ACC_MAX})`;

    if (allEntries.length === 0) {
        slotsEl.innerHTML = '';
        totalEl.style.display = 'none';
        hintEl.style.display = 'block';
        return;
    }
    hintEl.style.display = 'none';

    // スロット描画
    slotsEl.innerHTML = allEntries.map((item, idx) => {
        if (item.type === 'damage') {
            const { move, result, atkName, defName } = item;
            const typeColor = getTypeColor(move.type);
            const drainInfo = move.drainRate
                ? `<div class="acc-slot-context">💚 回復: ${Math.floor(result.min * move.drainRate)}~${Math.floor(result.max * move.drainRate)}</div>`
                : '';
            return `
          <div class="acc-slot">
            <div class="acc-slot-number">${idx + 1}</div>
            <div class="acc-slot-info">
              <div class="acc-slot-move">
                <span class="type-badge" style="background:${typeColor};font-size:0.6rem;padding:0.05rem 0.3rem">${move.type}</span>
                ${move.name}
              </div>
              <div class="acc-slot-context">${atkName} → ${defName}</div>
              ${drainInfo}
            </div>
            <div class="acc-slot-damage">${result.min}~${result.max}</div>
            <button class="acc-slot-remove" data-acc-idx="${idx}" title="削除">✕</button>
          </div>
        `;
        } else if (item.type === 'drain_recovery') {
            // ドレイン回復エントリ (16パターンの変動値)
            const { move, atkName, defName, minRecovery, maxRecovery } = item;
            const typeColor = getTypeColor(move.type);
            return `
          <div class="acc-slot acc-slot-recovery">
            <div class="acc-slot-number" style="background:#55efc430;color:var(--green)">💚</div>
            <div class="acc-slot-info">
              <div class="acc-slot-move">
                <span class="type-badge" style="background:${typeColor};font-size:0.6rem;padding:0.05rem 0.3rem">${move.type}</span>
                ${move.name} 回復
              </div>
              <div class="acc-slot-context">${atkName}のHP回復 (16パターン)</div>
            </div>
            <div class="acc-slot-damage acc-const-value-negative">-${minRecovery}~-${maxRecovery}</div>
            <button class="acc-slot-remove" data-acc-idx="${idx}" title="削除">✕</button>
          </div>
        `;
        } else {
            // 定数エントリ
            const isRecovery = item.value < 0;
            const slotClass = isRecovery ? 'acc-slot-recovery' : 'acc-slot-constant';
            const valueClass = isRecovery ? 'acc-const-value-negative' : 'acc-const-value-positive';
            return `
          <div class="acc-slot ${slotClass}">
            <div class="acc-slot-number" style="background:${isRecovery ? '#55efc430' : '#ffeaa730'};color:${isRecovery ? 'var(--green)' : 'var(--yellow)'}">${item.icon}</div>
            <div class="acc-slot-info">
              <div class="acc-slot-move">${item.label}</div>
              <div class="acc-slot-context">定数${isRecovery ? '回復' : 'ダメージ'}</div>
            </div>
            <div class="acc-slot-damage ${valueClass}">${isRecovery ? '' : '+'}${item.value}</div>
            <button class="acc-slot-remove" data-acc-idx="${idx}" title="削除">✕</button>
          </div>
        `;
        }
    }).join('');

    // 削除ボタン
    slotsEl.querySelectorAll('.acc-slot-remove').forEach(btn => {
        btn.addEventListener('click', () => {
            removeFromAccumulator(parseInt(btn.dataset.accIdx));
        });
    });

    // 合計計算
    let totalMin = 0, totalMax = 0, totalConstants = 0;
    const allDamagesArrays = [];
    // HPは防御側から取得 (ダメージエントリがなければ防御側の現在のHP)
    const defHP = damageEntries.length > 0 ? damageEntries[0].result.defHP : getDefenderHP();

    allEntries.forEach(item => {
        if (item.type === 'damage') {
            totalMin += item.result.min;
            totalMax += item.result.max;
            allDamagesArrays.push(item.result.damages);
        } else if (item.type === 'drain_recovery') {
            // ドレイン回復は負のダメージ配列 (16パターン)
            totalMin += Math.min(...item.damages); // 最小回復 = 最も大きい負値
            totalMax += Math.max(...item.damages); // 最大回復 = 最も小さい負値
            allDamagesArrays.push(item.damages);
        } else {
            totalConstants += item.value;
            totalMin += item.value;
            totalMax += item.value;
        }
    });

    // マイナスにならないように
    totalMin = Math.max(0, totalMin);
    totalMax = Math.max(0, totalMax);

    const totalMinPercent = Math.floor(totalMin / defHP * 1000) / 10;
    const totalMaxPercent = Math.floor(totalMax / defHP * 1000) / 10;

    document.getElementById('acc-total-damage').textContent = `${totalMin} ~ ${totalMax} / ${defHP} HP`;
    document.getElementById('acc-total-percent').textContent = `${totalMinPercent}% ~ ${totalMaxPercent}%`;

    // HP残量
    const remainMin = Math.max(0, defHP - totalMax);
    const remainMax = Math.max(0, defHP - totalMin);
    document.getElementById('acc-total-hp').textContent = `${remainMin} ~ ${remainMax} HP`;

    // HPバー
    const barPercent = Math.max(0, 100 - totalMaxPercent);
    const hpBar = document.getElementById('acc-hp-bar');
    hpBar.style.width = `${barPercent}%`;
    hpBar.className = 'hp-bar ' + (barPercent < 25 ? 'hp-red' : barPercent < 50 ? 'hp-yellow' : 'hp-green');

    // 正確なKO確率をDPで計算 (定数オフセット＋ドレイン回復を考慮)
    let koProb = 0;
    if (allDamagesArrays.length > 0) {
        // 定数分をHPから差し引いて調整
        const adjustedHP = defHP - totalConstants;
        if (adjustedHP <= 0) {
            koProb = 100; // 定数ダメだけで撃破
        } else {
            koProb = calcAccumulatedKOProbability(allDamagesArrays, adjustedHP);
        }
    } else if (totalConstants > 0) {
        // 定数エントリのみ
        koProb = totalConstants >= defHP ? 100 : 0;
    }

    // KO判定
    const koEl = document.getElementById('acc-total-ko');
    if (koProb >= 100) {
        koEl.textContent = `🔥 確定で倒せる (100%)`;
        koEl.className = 'acc-total-ko acc-ko-yes';
    } else if (koProb > 0) {
        koEl.textContent = `⚡ 撃破率: ${koProb}%`;
        koEl.className = 'acc-total-ko acc-ko-yes';
    } else {
        koEl.textContent = `🛡️ 耐えられる (0%)`;
        koEl.className = 'acc-total-ko acc-ko-no';
    }

    totalEl.style.display = 'block';
}

function getTypeColor(type) {
    const colors = {
        'ノーマル': '#a8a878', 'ほのお': '#f08030', 'みず': '#6890f0', 'でんき': '#f8d030',
        'くさ': '#78c850', 'こおり': '#98d8d8', 'かくとう': '#c03028', 'どく': '#a040a0',
        'じめん': '#e0c068', 'ひこう': '#a890f0', 'エスパー': '#f85888', 'むし': '#a8b820',
        'いわ': '#b8a038', 'ゴースト': '#705898', 'ドラゴン': '#7038f8', 'あく': '#705848',
        'はがね': '#b8b8d0', 'フェアリー': '#ee99ac',
    };
    return colors[type] || '#888';
}
