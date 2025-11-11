const App = {
  lang: localStorage.getItem(CONFIG.LANG_KEY),
  cat: "pour_over",
  sub: "all",
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

    // 搜尋
    Utils.$("#search").addEventListener("input", () => this.render());

    // --- ⭐ 新增：圖片 Modal 事件 ---

    const modal = Utils.$("#imageModal");
    const modalImg = modal.querySelector(".image-modal-content");
    const modalClose = modal.querySelector(".image-modal-close");

    // 使用事件委派 (Event Delegation) 監聽 #list
    Utils.$("#list").addEventListener("click", (e) => {
      // --- 優先權 1：點擊 放大鏡 ---
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
        // 檢查是否已在關閉中，避免重複觸發
        if (detailsCard && !detailsCard.classList.contains("is-closing")) {
          detailsCard.classList.add("is-closing");
          setTimeout(() => {
            detailsCard.removeAttribute("open");
            detailsCard.classList.remove("is-closing");
          }, 350); // 0.35s = 350ms
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
          // (和上面遮蓋層的邏輯一樣)
          if (!detailsCard.classList.contains("is-closing")) {
            detailsCard.classList.add("is-closing");
            setTimeout(() => {
              detailsCard.removeAttribute("open");
              detailsCard.classList.remove("is-closing");
            }, 350);
          }
        } else {
          // --- ⭐ 執行開啟 (最終修正 2.0) ---

          detailsCard.classList.remove("is-closing");

          // ⭐ 關鍵修正：使用 setTimeout(0)
          // 這會將 "setAttribute" 推遲到下一個事件循環
          // 確保瀏覽器 100% 完成了當前元素的繪製
          setTimeout(() => {
            detailsCard.setAttribute("open", "");
          }, 0); // 0 毫秒延遲
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
    Utils.$$(".main-tabs .tab").forEach((t) =>
      t.classList.toggle("active", t.dataset.cat === cat)
    );

    // --- 修正 1 & 2：根據頁籤切換 UI ---
    const isPourOver = cat === "pour_over";

    // 1. 顯示/隱藏 次標籤
    Utils.$("#subTabs").classList.toggle("hidden", !isPourOver);
    // 1. 顯示/隱藏 搜尋列 (它在 index.html 中的 class 是 .search)
    Utils.$(".search").classList.toggle("hidden", !isPourOver);
    // 2. 切換 單/雙 欄版面 (在 #app 加上 class)
    Utils.$("#app").classList.toggle("layout-single-column", isPourOver);
    // --- 結束 ---

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
