const App = {
  lang: localStorage.getItem(CONFIG.LANG_KEY),
  cat: "pour_over",
  sub: "all",
  sub_bev: "all",
  sub_exp: "choco",
  data: {},

  async init() {
    if (!this.lang) {
      Utils.$("#langGate").style.display = "flex";
      Utils.$("#app").style.display = "none";
    } else {
      Utils.$("#langGate").style.display = "none";
      Utils.$("#app").style.display = "block";

      // 叫用 setCat 來設定初始UI (sub-tabs, search, layout)
      await this.setCat(this.cat);
    }

    this.bindEvents();
  },

  bindEvents() {
    // 語言切換 (彈窗)
    Utils.$("#langGate").addEventListener("click", async (e) => {
      const btn = e.target.closest("[data-lang]");
      if (btn) {
        const lang = btn.dataset.lang;
        Utils.$("#langGate").style.display = "none";
        Utils.$("#app").style.display = "block";

        this.setLang(lang);
        await this.setCat(this.cat);
      }
    });

    // 語言切換 (按鈕)
    Utils.$("#langBtn").addEventListener("click", () => {
      Utils.$("#langGate").style.display = "flex";
      Utils.$("#app").style.display = "none";
    });

    // 主頁籤
    Utils.$$(".main-tabs .tab:not(.disabled)").forEach((t) =>
      t.addEventListener("click", () => {
        this.setCat(t.dataset.cat);
      })
    );

    // 子頁籤
    Utils.$$(".sub-tabs .tab").forEach((t) =>
      t.addEventListener("click", () => {
        this.setSub(t.dataset.sub);
      })
    );

    // 其他飲品篩選
    Utils.$$("#subTabsBeverages .tab").forEach((t) =>
      t.addEventListener("click", () => {
        this.setSubBev(t.dataset.sub);
      })
    );

    // 特選套組篩選
    Utils.$$("#subTabsExp .tab").forEach((t) =>
      t.addEventListener("click", () => {
        this.setSubExp(t.dataset.subExp);
      })
    );

    // 搜尋
    Utils.$("#search").addEventListener("input", () => this.render());

    // --- ⭐ 圖片 Modal 事件 ---
    const modal = Utils.$("#imageModal");
    const modalImg = modal.querySelector(".image-modal-content");
    const modalClose = modal.querySelector(".image-modal-close");

    // 使用事件委派監聽 #list
    Utils.$("#list").addEventListener("click", (e) => {
      // 優先權 1：點擊放大鏡（所有類別通用）
      const zoomBtn = e.target.closest(".zoom-icon");
      if (zoomBtn) {
        e.preventDefault();
        e.stopPropagation();
        const imgSrc = zoomBtn.dataset.imgSrc;
        if (imgSrc) {
          modalImg.src = imgSrc;
          modal.classList.remove("hidden");
        }
        return;
      }

      // 優先權 2：點擊卡片（所有類別都切換 open class 顯示價格）
      // 只要點擊 .card-clickable 內的任何地方都可以
      const card = e.target.closest(".card-clickable");
      if (card) {
        card.classList.toggle("open");
        return;
      }
    });

    // 關閉 Modal
    const closeModal = () => modal.classList.add("hidden");
    modalClose.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  },

  setLang(lang) {
    if (!CONFIG.LANGS.includes(lang)) return;
    this.lang = lang;
    localStorage.setItem(CONFIG.LANG_KEY, lang);
    UI.updateText(lang, this.cat);
    this.render();
  },

  async setCat(cat) {
    this.cat = cat;

    // ⭐ 修正 1：立即清空列表，避免殘影
    Utils.$("#list").innerHTML = "";

    // ⭐ 修正 2：重置子頁籤狀態和搜尋框
    // 當切換主頁籤時，將手沖和飲品的子頁籤都重置為 "all"
    this.sub = "all";
    this.sub_bev = "all";
    this.sub_exp = "choco";

    // 清空搜尋框
    Utils.$("#search").value = "";

    // 重置手沖子頁籤的 active class
    Utils.$$(".sub-tabs .tab").forEach((t) =>
      t.classList.toggle("active", t.dataset.sub === "all")
    );

    // 重置飲品子頁籤的 active class
    Utils.$$("#subTabsBeverages .tab").forEach((t) =>
      t.classList.toggle("active", t.dataset.sub === "all")
    );

    // 重置特選套組子頁籤的 active class
    Utils.$$("#subTabsExp .tab").forEach((t) =>
      t.classList.toggle("active", t.dataset.subExp === "choco")
    );

    // --- 動態顏色地圖 ---
    const COLOR_MAP = {
      pour_over: ["#c7a77f", "#f7f1eb", "#fff"], // 琥珀色
      espresso: ["#503629", "#eae7e5", "#fff"], // 棕色
      signature: ["#d90429", "#fde6ea", "#fff"], // 亮紅色
      beverages: ["#0077b6", "#e6f2f8", "#fff"], // 藍色
      desserts: ["#ffc629", "#fff9e9", "#3d2f27"], // 黃色
      selected_exp: ["#9b59b6", "#f4ecf7", "#fff"], // 紫色
    };

    const colors = COLOR_MAP[cat] || ["#85a817", "#f3f6ec", "#fff"];

    const root = document.documentElement;
    root.style.setProperty("--brand-active", colors[0]);
    root.style.setProperty("--brand-active-tint", colors[1]);
    root.style.setProperty("--brand-active-text", colors[2]);

    // 更新頁籤的 'active' class
    Utils.$$(".main-tabs .tab").forEach((t) =>
      t.classList.toggle("active", t.dataset.cat === cat)
    );

    // 顯示/隱藏次標籤
    const isPourOver = cat === "pour_over";
    const isBeverages = cat === "beverages";
    const isSelectedExp = cat === "selected_exp";

    Utils.$("#subTabs").classList.toggle("hidden", !isPourOver);
    Utils.$("#subTabsBeverages").classList.toggle("hidden", !isBeverages);
    Utils.$("#subTabsExp").classList.toggle("hidden", !isSelectedExp);
    Utils.$(".search").classList.toggle("hidden", !isPourOver);

    Utils.$("#app").classList.toggle("layout-single-column", isPourOver);

    // ⭐ 修正 3：顯示載入中提示
    if (!this.data[cat]) {
      Utils.$("#list").innerHTML = `
        <p style="text-align:center;color:var(--text2);grid-column:1/-1;">
          載入中... Loading...
        </p>`;
      await this.loadCat(cat);
    }

    UI.updateText(this.lang, cat);
    this.render();
  },

  setSub(sub) {
    this.sub = sub;
    Utils.$$(".sub-tabs .tab").forEach((t) =>
      t.classList.toggle("active", t.dataset.sub === sub)
    );
    this.render();
  },

  setSubBev(sub) {
    this.sub_bev = sub;
    Utils.$$("#subTabsBeverages .tab").forEach((t) =>
      t.classList.toggle("active", t.dataset.sub === sub)
    );
    this.render();
  },

  setSubExp(subExp) {
    this.sub_exp = subExp;
    Utils.$$("#subTabsExp .tab").forEach((t) =>
      t.classList.toggle("active", t.dataset.subExp === subExp)
    );
    this.render();
  },

  async loadCat(cat) {
    // ⭐ 顯示 Loading
    const loading = Utils.$("#loadingOverlay");
    if (loading) loading.classList.remove("hidden");

    const src = CONFIG.DATA_SOURCES[cat];

    try {
      if (src.startsWith("http")) {
        this.data[cat] = await Utils.loadGSheet(src);
      } else {
        this.data[cat] = await Utils.loadJSON(src);
      }
    } finally {
      // ⭐ 隱藏 Loading
      if (loading) loading.classList.add("hidden");
    }
  },

  render() {
    const list = Utils.$("#list");
    list.innerHTML = "";

    // 渲染器地圖
    const RENDERERS = {
      pour_over: PourOver,
      espresso: Espresso,
      signature: Signature,
      beverages: Beverages,
      desserts: Desserts,
      selected_exp: SelectedExp,
    };

    let items = this.data[this.cat] || [];
    // ⭐ 修正：is_sold_out 已經是布林值
    items = items.filter((it) => it.is_sold_out !== true);

    if (this.cat === "pour_over" && this.sub !== "all") {
      items = items.filter(
        (it) => (it.category || "").toLowerCase() === this.sub
      );
    }

    if (this.cat === "beverages" && this.sub_bev !== "all") {
      // ⭐ 修正：caffeine_free 已經是布林值
      items = items.filter((it) => it.caffeine_free === true);
    }

    if (this.cat === "selected_exp" && this.sub_exp !== "all") {
      items = items.filter(
        (it) => (it.category || "").toLowerCase() === this.sub_exp
      );
    }

    const q = (Utils.$("#search").value || "").trim().toLowerCase();
    if (q) {
      items = items.filter((it) => {
        const txt = Object.values(it).join(" ").toLowerCase();
        return txt.includes(q);
      });
    }

    if (!items.length) {
      UI.showEmpty(this.lang);
      return;
    }

    const Renderer = RENDERERS[this.cat];

    if (!Renderer || typeof Renderer.render !== "function") {
      console.error(`找不到類別 ${this.cat} 的渲染器 (Renderer)`);
      UI.showEmpty(this.lang);
      return;
    }

    items.forEach((it) => {
      const card = Renderer.render(it, this.lang);
      if (card) list.appendChild(card);
    });
  },
};

document.addEventListener("DOMContentLoaded", () => App.init());
