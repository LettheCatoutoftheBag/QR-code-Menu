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

  // ⭐ --- 修正後的 GSheet 讀取器（完全重寫）---
  loadGSheet: async (url) => {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to fetch GSheet: ${res.status}`);
      const text = await res.text();

      // CSV 解析函式（處理引號、逗號、換行）
      function parseCSVLine(line) {
        const result = [];
        let current = "";
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          const nextChar = line[i + 1];

          if (char === '"') {
            if (inQuotes && nextChar === '"') {
              // 兩個連續引號 = 一個引號字元
              current += '"';
              i++; // 跳過下一個引號
            } else {
              // 切換引號狀態
              inQuotes = !inQuotes;
            }
          } else if (char === "," && !inQuotes) {
            // 不在引號內的逗號 = 欄位分隔符
            result.push(current.trim());
            current = "";
          } else {
            current += char;
          }
        }

        // 加入最後一個欄位
        result.push(current.trim());
        return result;
      }

      // (1) 清理並分割行
      const lines = text.trim().replace(/\r/g, "").split("\n");
      if (lines.length < 2) return [];

      // (2) 解析標頭
      const headers = parseCSVLine(lines[0]);
      if (headers.length === 0) {
        console.error("No headers found in CSV");
        return [];
      }

      console.log("📋 Headers found:", headers);

      const result = [];

      // (3) 逐行解析資料
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;

        const values = parseCSVLine(lines[i]);
        const obj = {};

        // 將值對應到標頭
        for (let j = 0; j < headers.length; j++) {
          const key = headers[j];
          let value = values[j] || "";

          // 自動轉換資料格式
          if (key.startsWith("tags_")) {
            obj[key] = value ? value.split("|") : [];
          } else if (
            key === "is_sold_out" ||
            key === "is_featured" ||
            key === "caffeine_free"
          ) {
            obj[key] = (value || "").toLowerCase() === "true";
          } else {
            obj[key] = value;
          }
        }

        // 確保這行資料有效
        if (obj.id) {
          result.push(obj);
        }
      }

      console.log(`✅ Loaded ${result.length} items from GSheet`);
      if (result.length > 0) {
        console.log("🔍 First item:", result[0]);
      }

      return result;
    } catch (err) {
      console.error("❌ Error loading GSheet:", err);
      return [];
    }
  },
  // --- GSheet 讀取器結束 ---
};
