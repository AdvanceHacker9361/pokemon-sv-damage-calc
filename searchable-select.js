// ==========================================
// 検索可能ドロップダウン コンポーネント
// ==========================================

class SearchableSelect {
    constructor(selectElement, options = {}) {
        this.select = selectElement;
        this.placeholder = options.placeholder || '検索...';
        this.formatOption = options.formatOption || null;
        this.maxVisible = options.maxVisible || 80;
        this.items = [];
        this.filteredItems = [];
        this.highlightedIndex = -1;
        this.isOpen = false;
        this.select._searchableSelect = this; // バインドして外部から操作可能に
        this.build();
        this.syncItems();
        // 初期値を表示
        this.updateDisplay();
    }

    build() {
        // ラッパー
        this.wrapper = document.createElement('div');
        this.wrapper.className = 'ss-wrapper';
        this.select.parentNode.insertBefore(this.wrapper, this.select);
        this.select.style.display = 'none';
        this.wrapper.appendChild(this.select);

        // 表示用ボタン
        this.display = document.createElement('div');
        this.display.className = 'ss-display';
        this.display.innerHTML = `<span class="ss-display-text">${this.placeholder}</span><span class="ss-arrow">▾</span>`;
        this.wrapper.appendChild(this.display);

        // ドロップダウン
        this.dropdown = document.createElement('div');
        this.dropdown.className = 'ss-dropdown';
        this.dropdown.innerHTML = `
            <div class="ss-search-box">
                <input type="text" class="ss-search-input" placeholder="${this.placeholder}" autocomplete="off" spellcheck="false">
            </div>
            <div class="ss-list"></div>
        `;
        this.wrapper.appendChild(this.dropdown);

        this.searchInput = this.dropdown.querySelector('.ss-search-input');
        this.list = this.dropdown.querySelector('.ss-list');

        // イベント
        this.display.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggle();
        });

        this.searchInput.addEventListener('input', () => {
            this.filter(this.searchInput.value);
        });

        this.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.moveHighlight(1);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.moveHighlight(-1);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (this.highlightedIndex >= 0 && this.filteredItems[this.highlightedIndex]) {
                    this.selectItem(this.filteredItems[this.highlightedIndex]);
                }
            } else if (e.key === 'Escape') {
                this.close();
            }
        });

        // 外クリックで閉じる
        document.addEventListener('click', (e) => {
            if (!this.wrapper.contains(e.target)) {
                this.close();
            }
        });

        // select変更時に表示更新
        this.select.addEventListener('change', () => {
            this.updateDisplay();
        });
    }

    syncItems() {
        this.items = [];
        Array.from(this.select.options).forEach((opt, i) => {
            if (opt.value === '') return; // skip placeholder
            this.items.push({
                value: opt.value,
                text: opt.text,
                index: i,
                searchText: opt.text.toLowerCase(),
            });
        });
        this.filteredItems = this.items;
    }

    updateDisplay() {
        const sel = this.select;
        const opt = sel.options[sel.selectedIndex];
        const displayText = this.display.querySelector('.ss-display-text');
        if (opt && opt.value !== '') {
            const item = this.items.find(it => it.value === opt.value);
            if (item && this.formatOption) {
                displayText.innerHTML = this.formatOption(item, true);
            } else {
                displayText.textContent = opt.text;
            }
        } else {
            displayText.textContent = this.placeholder;
        }
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        this.isOpen = true;
        this.dropdown.classList.add('ss-open');
        this.display.classList.add('ss-active');
        this.searchInput.value = '';
        this.filter('');
        this.highlightedIndex = -1;
        // フォーカス
        setTimeout(() => this.searchInput.focus(), 10);
    }

    close() {
        this.isOpen = false;
        this.dropdown.classList.remove('ss-open');
        this.display.classList.remove('ss-active');
    }

    filter(query) {
        const q = query.toLowerCase().trim();

        if (!q) {
            this.filteredItems = this.items;
        } else {
            this.filteredItems = this.items.filter(item =>
                item.searchText.includes(q)
            );
        }

        this.highlightedIndex = -1;
        this.renderList();
    }

    renderList() {
        const visible = this.filteredItems.slice(0, this.maxVisible);
        const remaining = this.filteredItems.length - visible.length;

        if (visible.length === 0) {
            this.list.innerHTML = '<div class="ss-no-result">該当なし</div>';
            return;
        }

        this.list.innerHTML = visible.map((item, idx) => {
            const content = this.formatOption
                ? this.formatOption(item, false)
                : this.escapeHtml(item.text);
            const activeClass = item.value === this.select.value ? ' ss-item-active' : '';
            return `<div class="ss-item${activeClass}" data-idx="${idx}">${content}</div>`;
        }).join('');

        if (remaining > 0) {
            this.list.innerHTML += `<div class="ss-more">他 ${remaining} 件 ― 検索で絞り込み</div>`;
        }

        // クリックイベント
        this.list.querySelectorAll('.ss-item').forEach(el => {
            el.addEventListener('click', (e) => {
                e.stopPropagation();
                const idx = parseInt(el.dataset.idx);
                this.selectItem(this.filteredItems[idx]);
            });
        });
    }

    moveHighlight(dir) {
        const max = Math.min(this.filteredItems.length, this.maxVisible);
        if (max === 0) return;

        this.highlightedIndex += dir;
        if (this.highlightedIndex < 0) this.highlightedIndex = max - 1;
        if (this.highlightedIndex >= max) this.highlightedIndex = 0;

        // UI更新
        this.list.querySelectorAll('.ss-item').forEach((el, i) => {
            el.classList.toggle('ss-item-highlight', i === this.highlightedIndex);
        });

        // スクロール
        const el = this.list.querySelectorAll('.ss-item')[this.highlightedIndex];
        if (el) el.scrollIntoView({ block: 'nearest' });
    }

    selectItem(item) {
        this.select.value = item.value;
        this.select.dispatchEvent(new Event('change'));
        this.updateDisplay();
        this.close();
    }

    escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // 外部からアイテム再同期
    refresh() {
        this.syncItems();
        this.updateDisplay();
    }
}
