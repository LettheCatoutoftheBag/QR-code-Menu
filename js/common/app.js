const App = {
  lang: localStorage.getItem(CONFIG.LANG_KEY),
  cat: "pour_over",
  sub: "all",
  sub_bev: "all",
  data: {},

  async init() {
    if (!this.lang) {
      // 修正 1: 直接設定 style.display (使用 'flex' 來符合 CSS)
      Utils.$("#langGate").style.display = "flex";
      Utils.$("#app").style.display = "none";
    } else {
      // 修正 2: 直接設定 style.display
      Utils.$("#langGate").style.display = "none";
      Utils.$("#app").style.display = "block";

      // 叫用 setCat 來設定初始UI (sub-tabs, search, layout)
      // this.cat 預設為 "pour_over"，所以會套用手沖的UI
      await this.setCat(this.cat);

      // (setCat 內部已包含 loadCat, updateText 和 render, 無需重複)
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

        this.setLang(lang); // setLang 會呼叫 render

        // 叫用 setCat 來設定初始UI
        // this.cat 預設為 "pour_over"
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

    // ⭐ 監聽 '其他飲品' 篩選
    Utils.$$("#subTabsBeverages .tab").forEach((t) =>
      t.addEventListener("click", () => {
        this.setSubBev(t.dataset.sub);
      })
    );

    // 搜尋
    Utils.$("#search").addEventListener("input", () => this.render());

    // --- ⭐ 新增：圖片 Modal 事件 ---

    const modal = Utils.$("#imageModal");
    const modalImg = modal.querySelector(".image-modal-content");
    const modalClose = modal.querySelector(".image-modal-close");

    // 使用事件委派 (Event Delegation) 監聽 #list
    Utils.$("#list").addEventListener("click", (e) => {
      // --- ⭐ 優先權 1A：點擊 點心圖片 (Phase 5 新增) ---
      const imgPreview = e.target.closest(".card-image-preview");
      if (imgPreview) {
        e.preventDefault(); // 阻止 <details> 標籤被觸發

        const imgSrc = imgPreview.dataset.imgSrc;
        if (imgSrc) {
          modalImg.src = imgSrc;
          modal.classList.remove("hidden");
        }
        return; // 處理完畢
      }

      // --- 優先權 1B：點擊 放大鏡 (Phase 2-4) ---
      const zoomBtn = e.target.closest(".zoom-icon");
      if (zoomBtn) {
        e.preventDefault(); // 阻止 <details> 標籤被觸發

        const imgSrc = zoomBtn.dataset.imgSrc;
        if (imgSrc) {
          modalImg.src = imgSrc;
          modal.classList.remove("hidden");
        }
        return; // 處理完畢
      }

      // --- 優先權 2：點擊 遮蓋層 (關閉) ---
      const overlay = e.target.closest(".content-overlay");
      if (overlay) {
        e.preventDefault(); // 阻止事件穿透

        const detailsCard = overlay.closest("details");
        if (detailsCard && !detailsCard.classList.contains("is-closing")) {
          detailsCard.classList.add("is-closing");
          setTimeout(() => {
            detailsCard.removeAttribute("open");
            detailsCard.classList.remove("is-closing");
          }, 350);
        }
        return; // 處理完畢
      }

      // --- 優先權 3：點擊 Summary (開啟/關閉) ---
      const summary = e.target.closest("details > summary");
      if (summary) {
        e.preventDefault(); // 關鍵：全面接管

        const detailsCard = summary.closest("details");
        if (!detailsCard) return;

        if (detailsCard.hasAttribute("open")) {
          // --- 執行關閉 ---
          if (!detailsCard.classList.contains("is-closing")) {
            detailsCard.classList.add("is-closing");
            setTimeout(() => {
              detailsCard.removeAttribute("open");
              detailsCard.classList.remove("is-closing");
            }, 350);
          }
        } else {
          // --- 執行開啟 ---
          detailsCard.classList.remove("is-closing");
          setTimeout(() => {
            detailsCard.setAttribute("open", "");
          }, 0);
        }
        return; // 處理完畢
      }
    });

    // 關閉 Modal
    const closeModal = () => modal.classList.add("hidden");
    modalClose.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => {
      // 點擊背景 (非圖片) 區域時關閉
      if (e.target === modal) {
        closeModal();
      }
    });
    // --- Modal 事件結束 ---
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

    // --- ⭐ 修正 1：動態顏色地圖 ---
    const COLOR_MAP = {
      // 顏色: [主色 (按鈕), 漸層色 (遮蓋層), 文字色]
      pour_over: ["#c7a77f", "#f7f1eb", "#fff"], // 琥珀色
      espresso: ["#503629", "#eae7e5", "#fff"], // 棕色
      signature: ["#d90429", "#fde6ea", "#fff"], // 亮紅色
      beverages: ["#0077b6", "#e6f2f8", "#fff"], // 藍色
      desserts: ["#ffc629", "#fff9e9", "#3d2f27"], // 黃色 (配深色文字)
    };

    // 取得當前顏色，若無則預設
    const colors = COLOR_MAP[cat] || ["#85a817", "#f3f6ec", "#fff"];

    // 將顏色設定為 CSS 變數
    const root = document.documentElement;
    root.style.setProperty("--brand-active", colors[0]);
    root.style.setProperty("--brand-active-tint", colors[1]);
    root.style.setProperty("--brand-active-text", colors[2]);
    // --- 顏色修正結束 ---

    // 更新頁籤的 'active' class
    Utils.$$(".main-tabs .tab").forEach((t) =>
      t.classList.toggle("active", t.dataset.cat === cat)
    );

    // --- ⭐ 修正 3：顯示/隱藏 "手沖" 或 "飲品" 的次標籤 ---
    const isPourOver = cat === "pour_over";
    const isBeverages = cat === "beverages";

    Utils.$("#subTabs").classList.toggle("hidden", !isPourOver);
    Utils.$("#subTabsBeverages").classList.toggle("hidden", !isBeverages); // 新增
    Utils.$(".search").classList.toggle("hidden", !isPourOver); // 搜尋只給手沖

    Utils.$("#app").classList.toggle("layout-single-column", isPourOver);

    if (!this.data[cat]) await this.loadCat(cat);

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

  // 新增 '其他飲品' 篩選的函式
  setSubBev(sub) {
    this.sub_bev = sub;
    Utils.$$("#subTabsBeverages .tab").forEach((t) =>
      t.classList.toggle("active", t.dataset.sub === sub)
    );
    this.render();
  },

  async loadCat(cat) {
    const src = CONFIG.DATA_SOURCES[cat];
    this.data[cat] = await Utils.loadJSON(src);
  },

  render() {
    const list = Utils.$("#list");
    list.innerHTML = "";

    // --- 建立一個渲染器地圖 ---
    // 這裡假設你已經載入了 PourOver 和 Espresso 物件
    const RENDERERS = {
      pour_over: PourOver,
      espresso: Espresso,
      signature: Specials,
      beverages: Beverages,
      desserts: Desserts,
    };
    // -------------------------

    let items = this.data[this.cat] || [];
    items = items.filter(
      (it) => (it.is_sold_out || "").toLowerCase() !== "true"
    );

    if (this.cat === "pour_over" && this.sub !== "all") {
      items = items.filter(
        (it) => (it.category || "").toLowerCase() === this.sub
      );
    }

    // 加入 '其他飲品' 篩選邏輯
    if (this.cat === "beverages" && this.sub_bev !== "all") {
      // (假設 all 是預設, 'caffeine_free' 是 data-sub)
      items = items.filter(
        (it) => (it.caffeine_free || "").toLowerCase() === "true"
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

    // --- 動態選擇渲染器 ---
    const Renderer = RENDERERS[this.cat]; // 根據 "pour_over" 或 "espresso" 取得物件

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
