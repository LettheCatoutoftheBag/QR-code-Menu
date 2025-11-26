const CONFIG = {
  LANG_KEY: "orsir_lang",
  LANGS: ["zh", "en", "yue", "ko", "ja"],

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
    selected_exp:
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vQnd0JWS45gYrWxcVQMkacAzikRmNOQHnglkpi4SE4bTjV-aloPPRF86k1Wi3__1XebbvQeruK6E8a4/pub?gid=1118953982&single=true&output=csv",
  },

  IMG_BASE_PATH: "images/",
};
