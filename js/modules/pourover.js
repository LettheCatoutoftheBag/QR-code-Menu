const PourOver = {
  render(item, lang) {
    // 多語言支援
    let name, subName;
    if (lang === "zh") {
      name = item.name_zh;
      subName = item.name_en;
    } else if (lang === "en") {
      name = item.name_en;
      subName = item.name_zh;
    } else {
      name = item.name_en;
      subName = item[`name_${lang}`] || item.name_zh;
    }

    const tags = (lang === "zh" ? item.tags_zh : item.tags_en) || [];
    const roast = CONFIG.ROAST_MAP[item.roast] || item.roast;
    const feat = item.is_featured === true;
    const star = feat ? '<span class="star">⭐</span>' : "";
    const roastCls = (item.roast || "").toLowerCase().replace("-", "");

    // 價格（抓取 price 欄位）
    const priceHtml = item.price
      ? `<div class="price-right">$${item.price}</div>`
      : "";

    const card = document.createElement("div");
    card.className = `card card-clickable ${feat ? "featured" : ""}`;

    card.innerHTML = `
      <div class="card-wrapper" style="padding: 1rem; cursor: pointer;">
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
            <span class="chev">▶</span>
          </div>
        </div>
      </div>
      ${priceHtml}
    `;

    return card;
  },
};
