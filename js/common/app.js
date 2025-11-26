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

      await this.setCat(this.cat);
    }

    this.bindEvents();
  },

  bindEvents() {
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

    Utils.$("#langBtn").addEventListener("click", () => {
      Utils.$("#langGate").style.display = "flex";
      Utils.$("#app").style.display = "none";
    });

    Utils.$$(".main-tabs .tab:not(.disabled)").forEach((t) =>
      t.addEventListener("click", () => {
        this.setCat(t.dataset.cat);
      })
    );

    Utils.$$(".sub-tabs .tab").forEach((t) =>
      t.addEventListener("click", () => {
        this.setSub(t.dataset.sub);
      })
    );

    Utils.$$("#subTabsBeverages .tab").forEach((t) =>
      t.addEventListener("click", () => {
        this.setSubBev(t.dataset.sub);
      })
    );

    Utils.$$("#subTabsExp .tab").forEach((t) =>
      t.addEventListener("click", () => {
        this.setSubExp(t.dataset.subExp);
      })
    );

    Utils.$("#search").addEventListener("input", () => this.render());

    const modal = Utils.$("#imageModal");
    const modalImg = modal.querySelector(".image-modal-content");
    const modalClose = modal.querySelector(".image-modal-close");

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

    // ⭐ TOP 按鈕
    const backToTop = Utils.$("#backToTop");

    // 滾動時顯示/隱藏
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        backToTop.classList.remove("hidden");
      } else {
        backToTop.classList.add("hidden");
      }
    });

    // 點擊返回頂部
    backToTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
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

    Utils.$("#list").innerHTML = "";

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

    Utils.$("#app").classList.toggle(
      "layout-single-column",
      isPourOver || isSelectedExp
    );

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

    items = items.filter((it) => it.is_sold_out !== true);

    if (this.cat === "pour_over" && this.sub !== "all") {
      items = items.filter(
        (it) => (it.category || "").toLowerCase() === this.sub
      );
    }

    if (this.cat === "beverages" && this.sub_bev !== "all") {
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

    // ⭐ 特選套組使用走馬燈
    if (this.cat === "selected_exp") {
      this.renderCarousel(items, Renderer);
    } else {
      items.forEach((it) => {
        const card = Renderer.render(it, this.lang);
        if (card) list.appendChild(card);
      });
    }
  },

  // ⭐ 走馬燈渲染邏輯
  renderCarousel(items, Renderer) {
    const list = Utils.$("#list");

    // 建立走馬燈容器
    const carousel = document.createElement("div");
    carousel.className = "exp-carousel";
    carousel.id = "expCarousel";

    const track = document.createElement("div");
    track.className = "exp-carousel-track";

    // 渲染所有卡片
    items.forEach((item, index) => {
      const carouselItem = document.createElement("div");
      carouselItem.className = "exp-carousel-item";
      carouselItem.dataset.index = index;

      const card = Renderer.render(item, this.lang);
      if (card) {
        carouselItem.appendChild(card);
        track.appendChild(carouselItem);
      }
    });

    carousel.appendChild(track);

    // 加入箭頭
    carousel.innerHTML += `
      <button class="exp-carousel-arrow exp-carousel-arrow-left">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </button>
      <button class="exp-carousel-arrow exp-carousel-arrow-right">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 18l6-6-6-6"/>
        </svg>
      </button>
    `;

    // 加入指示點
    const dots = document.createElement("div");
    dots.className = "exp-carousel-dots";
    items.forEach((_, index) => {
      const dot = document.createElement("div");
      dot.className = "exp-carousel-dot" + (index === 0 ? " active" : "");
      dot.dataset.index = index;
      dots.appendChild(dot);
    });
    carousel.appendChild(dots);

    list.appendChild(carousel);

    // 初始化走馬燈
    this.initCarousel(items.length);
  },

  // ⭐ 走馬燈控制邏輯
  // ⭐ 走馬燈控制邏輯
  initCarousel(totalItems) {
    let currentIndex = 0;
    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    const carousel = Utils.$("#expCarousel");
    const track = Utils.$(".exp-carousel-track");
    const leftArrow = Utils.$(".exp-carousel-arrow-left");
    const rightArrow = Utils.$(".exp-carousel-arrow-right");
    const dots = Utils.$$(".exp-carousel-dot");

    const updateCarousel = () => {
      track.style.transform = `translateX(-${currentIndex * 100}%)`;

      // 更新指示點
      dots.forEach((dot, index) => {
        dot.classList.toggle("active", index === currentIndex);
      });

      // 更新箭頭狀態
      leftArrow.classList.toggle("disabled", currentIndex === 0);
      rightArrow.classList.toggle("disabled", currentIndex === totalItems - 1);
    };

    const goToPrev = () => {
      if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
      }
    };

    const goToNext = () => {
      if (currentIndex < totalItems - 1) {
        currentIndex++;
        updateCarousel();
      }
    };

    // ⭐ 滑動開始
    const handleStart = (e) => {
      isDragging = true;
      startX = e.type.includes("mouse") ? e.pageX : e.touches[0].pageX;
      track.style.transition = "none";
    };

    // ⭐ 滑動中
    const handleMove = (e) => {
      if (!isDragging) return;

      e.preventDefault();
      currentX = e.type.includes("mouse") ? e.pageX : e.touches[0].pageX;
      const diff = currentX - startX;

      // ⭐ 邊界限制：在第一張時不能繼續往右滑，最後一張時不能繼續往左滑
      if (
        (currentIndex === 0 && diff > 0) ||
        (currentIndex === totalItems - 1 && diff < 0)
      ) {
        return; // 直接返回，不更新位置
      }

      const offset = -currentIndex * 100 + (diff / carousel.offsetWidth) * 100;
      track.style.transform = `translateX(${offset}%)`;
    };

    // ⭐ 滑動結束
    const handleEnd = () => {
      if (!isDragging) return;

      isDragging = false;
      track.style.transition = "transform 0.4s ease-in-out";

      const diff = currentX - startX;
      const threshold = 50; // 滑動超過 50px 才切換

      if (Math.abs(diff) > threshold) {
        if (diff > 0) {
          goToPrev();
        } else {
          goToNext();
        }
      } else {
        updateCarousel(); // 回到原位
      }

      startX = 0;
      currentX = 0;
    };

    // 左箭頭
    leftArrow.addEventListener("click", goToPrev);

    // 右箭頭
    rightArrow.addEventListener("click", goToNext);

    // 指示點
    dots.forEach((dot) => {
      dot.addEventListener("click", () => {
        currentIndex = parseInt(dot.dataset.index);
        updateCarousel();
      });
    });

    // ⭐ 滑鼠事件
    track.addEventListener("mousedown", handleStart);
    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleEnd);

    // ⭐ 觸控事件
    track.addEventListener("touchstart", handleStart, { passive: false });
    track.addEventListener("touchmove", handleMove, { passive: false });
    track.addEventListener("touchend", handleEnd);

    // 初始化
    updateCarousel();
  },
};

document.addEventListener("DOMContentLoaded", () => App.init());
