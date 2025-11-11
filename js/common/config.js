const CONFIG = {
  LANG_KEY: "orsir_lang",
  LANGS: ["zh", "en", "yue", "ko", "ja"],
  DATA_SOURCES: {
    pour_over: "data/pourover.json",
    espresso: "data/espresso.json",
    signature: "data/specials.json",
    beverages: "data/beverages.json",
  },

  // --- 新增 ---
  // 圖片的基礎路徑 (給 espresso.js, specials.js 等使用)
  IMG_BASE_PATH: "images/",
  // -----------

  ROAST_MAP: {
    Light: "淺",
    Medium: "中",
    "Medium-Dark": "中深",
    Dark: "深",
  },
};
