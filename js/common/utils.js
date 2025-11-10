const Utils = {
  $: (s, r = document) => r.querySelector(s),
  $$: (s, r = document) => Array.from(r.querySelectorAll(s)),

  pick(obj, base, lang) {
    const keys = [`${base}_${lang}`, `${base}_en`, `${base}_zh`];
    for (const k of keys) if (obj[k]?.trim()) return obj[k].trim();
    return "";
  },

  async loadJSON(url) {
    try {
      const res = await fetch(url, { cache: "no-store" });
      return await res.json();
    } catch (e) {
      console.error("Load fail:", url, e);
      return [];
    }
  },
};
