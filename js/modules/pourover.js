const PourOver = {
  render(item, lang) {
    const feat = (item.is_featured || "").toLowerCase() === "true";
    const tags = Utils.pick(item, "flavor_tags", lang)
      .split("|")
      .map((s) => s.trim())
      .filter(Boolean);
    const roastZh = CONFIG.ROAST_MAP[item.roast] || item.roast;
    const roastTxt = `${roastZh}焙 ${item.roast}`;
    const taste = (item.taste || "").replace(/\\n|\n/g, "<br>");
    const star = feat ? '<span class="star">⭐</span>' : "";
    const roastCls = (item.roast || "").toLowerCase().replace("-", "");
    const priceHtml = item.price
      ? `<div class="price-right">$${item.price}</div>`
      : "";

    const d = document.createElement("details");
    d.className = `card ${feat ? "featured" : ""}`;

    d.innerHTML = `
      <summary>
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div style="flex:1;min-width:0;">
            <div class="card-head">
              <div>
                <div class="card-title">${star}${item.name_zh}</div>
                <div class="card-sub">${item.name_en}</div>
              </div>
              <div class="roast roast-${roastCls}">${roastTxt}</div>
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
