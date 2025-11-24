const SelectedExp = {
  render(item, lang) {
    const card = document.createElement("div");
    card.className = "exp-card";

    // 取得多語系欄位
    const name = Utils.pick(item, "name", lang);
    const description = Utils.pick(item, "description", lang);

    // 套組內容（用 | 分隔）
    const itemsList = (item.items || "").split("|").filter(Boolean);

    // 圖片
    const imgSrc = item.image_name
      ? `${CONFIG.IMG_BASE_PATH}${item.image_name}`
      : "";

    // 人氣推薦徽章
    const featuredBadge =
      item.is_featured === "TRUE" || item.is_featured === true
        ? '<div class="featured-badge">🔥 人氣推薦</div>'
        : "";

    // 組合圖片區域
    let imageSection = "";
    if (imgSrc) {
      imageSection = `
        <div class="exp-image-section">
          <img src="${imgSrc}" alt="${name}" class="exp-image" />
          ${featuredBadge}
        </div>
      `;
    }

    // 組合內容區域
    const contentSection = `
      <div class="exp-content-section">
        <h3 class="exp-title">${name}</h3>
        ${item.exp_sets ? `<div class="exp-sets">${item.exp_sets}</div>` : ""}
        
        ${description ? `<p class="exp-description">${description}</p>` : ""}
        
        ${
          itemsList.length > 0
            ? `
          <div class="exp-items">
            <div class="exp-items-title">📋 套組內容</div>
            <ul class="exp-items-list">
              ${itemsList.map((i) => `<li>✓ ${i.trim()}</li>`).join("")}
            </ul>
          </div>
        `
            : ""
        }
        
        <div class="exp-price">NT$ ${item.price || "---"}</div>
      </div>
    `;

    card.innerHTML = imageSection + contentSection;

    return card;
  },
};
