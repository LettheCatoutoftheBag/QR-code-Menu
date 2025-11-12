const Signature = {
  render(item, lang) {
    // 語言切換 (依照新規則)
    let name, subName, tags, description;

    if (lang === "zh") {
      // 1. 中文 (zh) -> 中文大標 / 英文次標
      name = item.name_zh;
      subName = item.name_en;
      tags = item.tags_zh;
      description = item.description_zh;
    } else if (lang === "en") {
      // 2. 英文 (en) -> 英文大標 / 中文次標
      name = item.name_en;
      subName = item.name_zh;
      tags = item.tags_en;
      description = item.description_en;
    } else {
      // 3. 其他語系 (e.g., ja, ko, yue)
      // 規則： "該語系文字大標 / 英文次標"

      // 大標：嘗試該語系 (e.g., item.name_ja), 若無則 fall back 到英文
      name = item[`name_${lang}`] || item.name_en;

      // 次標：固定為英文
      subName = item.name_en;

      // 標籤和描述：同上
      tags = item[`tags_${lang}`] || item.tags_en;
      description = item[`description_${lang}`] || item.description_en;
    }

    // 建立卡片 <details> 元素
    const card = document.createElement("details");
    card.className = "card";

    // 建立標籤
    let tagsHTML = "";
    if (tags && tags.length) {
      tagsHTML = `
        <div class="tags">
          ${tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
        </div>`;
    }

    // 從 CONFIG 讀取圖片基礎路徑
    const imagePath = (CONFIG.IMG_BASE_PATH || "images/") + item.image_name;

    // 建立 V1 模式的 priceHtml (價格變數)
    const priceHtml = item.price
      ? `<div class="price-right">$${item.price}</div>`
      : "";

    // 使用 V1 的 "單一 innerHTML" 模式
    card.innerHTML = `
      <summary>
        <div style="display:flex;justify-content:space-between;align-items:center;">
          
          <div style="flex:1;min-width:0;">
            
            <div class="card-head">
              <div>
                <div class="card-title">${name}</div>
                <div class="card-sub">${subName}</div>
              </div>
              <div class="actions">
                <span class="chev">►</span>
                <span class="zoom-icon" data-img-src="${imagePath}">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M10 18a7.952 7.952 0 0 0 4.897-1.688l4.396 4.396 1.414-1.414-4.396-4.396A7.952 7.952 0 0 0 18 10c0-4.411-3.589-8-8-8s-8 3.589-8 8 3.589 8 8 8zm0-14c3.309 0 6 2.691 6 6s-2.691 6-6 6-6-2.691-6-6 2.691-6 6-6z"></path>
                    <path d="M11.5 9.5H10v-2h1.5v2zm0 2H10v2h1.5v-2z"></path>
                  </svg>
                </span>
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

    return card;
  },
};
