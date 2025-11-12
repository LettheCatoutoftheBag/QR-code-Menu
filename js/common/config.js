const CONFIG = {
  LANG_KEY: "orsir_lang",
  LANGS: ["zh", "en", "yue", "ko", "ja"],

  // --- ⭐ 修正：更新資料來源 ---
  DATA_SOURCES: {
    // (更新為 GSheet URL)
    pour_over:
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vQnd0JWS45gYrWxcVQMkacAzikRmNOQHnglkpi4SE4bTjV-aloPPRF86k1Wi3__1XebbvQeruK6E8a4/pub?gid=0&single=true&output=csv",
    espresso:
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vQnd0JWS45gYrWxcVQMkacAzikRmNOQHnglkpi4SE4bTjV-aloPPRF86k1Wi3__1XebbvQeruK6E8a4/pub?gid=1984863031&single=true&output=csv",
    signature:
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vQnd0JWS45gYrWxcVQMkacAzikRmNOQHnglkpi4SE4bTjV-aloPPRF86k1Wi3__1XebbvQeruK6E8a4/pub?gid=1074560113&single=true&output=csv",
    beverages:
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vQnd0JWS45gYrWxcVQMkacAzikRmNOQHnglkpi4SE4bTjV-aloPPRF86k1Wi3__1XebbvQeruK6E8a4/pub?gid=1895061740&single=true&output=csv",
    desserts:
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vQnd0JWS45gYrWxcVQMkacAzikRmNOQHnglkpi4SE4bTjV-aloPPRF86k1Wi3__1XebbvQeruK6E8a4/pub?gid=1040598005&single=true&output=csv",
  },
  // --- 修正結束 ---

  IMG_BASE_PATH: "images/",

  ROAST_MAP: {
    Light: "淺焙",
    Medium: "中焙",
    "Medium-Dark": "中深中焙",
    Dark: "深中焙",
  },
};
