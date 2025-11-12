const Desserts = {
  render(item, lang) {
    // 語言切換 (依照新規則)
    let name, subName, tags, description;

    if (lang === "zh") {
      name = item.name_zh;
      subName = item.name_en;
      tags = item.tags_zh;
      description = item.description_zh;
    } else if (lang === "en") {
      name = item.name_en;
      subName = item.name_zh;
      tags = item.tags_en;
      description = item.description_en;
    } else {
      name = item[`name_${lang}`] || item.name_en;
      subName = item.name_en;
      tags = item[`tags_${lang}`] || item.tags_en;
      description = item[`description_${lang}`] || item.description_en;
    }

    // 建立卡片 <details> 元素
    const card = document.createElement("details");
    card.className = "card card-dessert";

    // --- ⬇︎ 修正 1：建立 tagsHTML (加上 "tags-dessert" class) ---
    let tagsHTML = "";
    if (tags && tags.length) {
      tagsHTML = `
        <div class="tags tags-dessert">
          ${tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
        </div>`;
    }
    // --- ⬆︎ 修正 1 ---

    // 從 CONFIG 讀取圖片基礎路徑
    const imagePath = (CONFIG.IMG_BASE_PATH || "images/") + item.image_name;

    // --- ⬇︎ 修正 2：建立 V1 模式的 priceHtml (價格變數) ---
    const priceHtml = item.price
      ? `<div class="price-right">$${item.price}</div>`
      : "";

    // --- ⬇︎ 修正 3：改用 "單一 innerHTML" 模式 ---
    // (不再分開建立 summary 和 overlay)
    card.innerHTML = `
      <summary>
        <div style="display:flex;justify-content:space-between;align-items:center;">
          
          <div style="flex:1;min-width:0;">
            
            <div class="card-dessert-top">
              
              <div class="card-image-preview" data-img-src="${imagePath}">
                <img src="${imagePath}" alt="${name}">
              </div>
              
              <div class="card-content-dessert">
                <div class="card-head">
                  <div>
                    <div class="card-title">${name}</div>
                    <div class="card-sub">${subName}</div>
                  </div>
                </div>
              </div>

              <div class="actions">
                <span class="chev">►</span>
                </div>
            </div>

            ${tagsHTML}

            <div class="desc" style="padding: 1rem 0.5rem 0.5rem 0;">
              ${description || ""}
            </div>

          </div>

          ${priceHtml}

        </div>
      </summary>

      <div class="content">
      </div>
    `;
    // --- ⬆︎ 修正結束 ---

    return card;
  },
};
