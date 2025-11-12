const PourOver = {
  render(item, lang) {
    // --- ⬇︎ 合併自 V2 (Req 1: 多語言支援) ---
    let name, subName;
    if (lang === "zh") {
      name = item.name_zh;
      subName = item.name_en;
    } else if (lang === "en") {
      name = item.name_en;
      subName = item.name_zh;
    } else {
      // 適用於 ja, ko, yue
      name = item.name_en; // 主標題(中文)欄位顯示英文
      subName = item[`name_${lang}`] || item.name_zh; // 子標題顯示該語系 (若GSheet無資料則備用中文)
    }
    // --- ⬆︎ 合併自 V2 ---

    // --- ⬇︎ 合併自 V2 (Req 2: 標籤處理) ---
    // 確保 tags 是一個陣列，以避免 .map 錯誤
    const tags = (lang === "zh" ? item.tags_zh : item.tags_en) || [];
    // --- ⬆︎ 合併自 V2 ---

    // --- ⬇︎ 合併自 V2 (Req 3: 烘焙度顯示) ---
    const roast = CONFIG.ROAST_MAP[item.roast] || item.roast;
    // --- ⬆︎ 合併自 V2 ---

    // --- ⬇︎ 保留自 V1 (Req 4, 7) ---
    const feat = item.is_featured === true;
    const taste = (item.taste || "").replace(/\\n|\n/g, "<br>"); // (Req 4: 保留換行處理)
    const star = feat ? '<span class="star">⭐</span>' : ""; // (Req 7: 保留 V1 圖示)
    const roastCls = (item.roast || "").toLowerCase().replace("-", "");
    // --- ⬆︎ 保留自 V1 ---

    // --- ⬇︎ 保留自 V1 (Req 6: 價格位置) ---
    const priceHtml = item.price
      ? `<div class="price-right">$${item.price}</div>`
      : "";
    // --- ⬆︎ 保留自 V1 ---

    const d = document.createElement("details");
    d.className = `card ${feat ? "featured" : ""}`;

    d.innerHTML = `
      <summary>
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div style="flex:1;min-width:0;">
            <div class="card-head">
              <div>
                <div class="card-title">${star}${name}</div>
                <div class="card-sub">${subName}</div>
              </div>
              <div class="roast roast-${roastCls}">${roast}</div>
            </div>
            <div class="tags">${tags
              .map((t) => `<span class="tag">${t}</span>`)
              .join("")}</div>
          </div>
          <div class="actions">
            <div class="chev">▶</div>
          </div>
          ${priceHtml}
        </div>
      </summary>
      <div class="content">
        <div style="margin-bottom:1rem;"><strong>風味 / Taste:</strong><br>${taste}</div>
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:0.5rem;font-size:0.85rem;padding-top:0.75rem;border-top:1px solid #ddd;">
          <div><strong>產區 / Origin</strong><div>${
            item.origin || "N/A"
          }</div></div>
          <div><strong>品種 / Variety</strong><div>${
            item.variety || "N/A"
          }</div></div>
          <div><strong>海拔 / Altitude</strong><div>${
            item.altitude || "N/A"
          }</div></div>
        </div>
      </div>
    `;

    return d;
  },
};
