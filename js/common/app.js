const App = {
  lang: localStorage.getItem(CONFIG.LANG_KEY),
  cat: "pour_over",
  sub: "all",
  data: {},

  async init() {
    if (!this.lang) {
      Utils.$("#langGate").classList.remove("hidden");
      Utils.$("#app").style.display = "none";
    } else {
      Utils.$("#langGate").classList.add("hidden");
      Utils.$("#app").style.display = "block";
      UI.updateText(this.lang, this.cat);
      await this.loadCat("pour_over");
    }

    this.bindEvents();
  },

  bindEvents() {
    Utils.$("#langGate").addEventListener("click", (e) => {
      const btn = e.target.closest("[data-lang]");
      if (btn) {
        this.setLang(btn.dataset.lang);
        Utils.$("#langGate").classList.add("hidden");
        Utils.$("#app").style.display = "block";
      }
    });

    Utils.$("#langBtn").addEventListener("click", () => {
      Utils.$("#langGate").classList.remove("hidden");
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

    Utils.$("#search").addEventListener("input", () => this.render());
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
    Utils.$("#subTabs").classList.toggle("hidden", cat !== "pour_over");

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

    items.forEach((it) => {
      const card = PourOver.render(it, this.lang);
      if (card) list.appendChild(card);
    });
  },
};

document.addEventListener("DOMContentLoaded", () => App.init());
