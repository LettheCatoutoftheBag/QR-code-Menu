const Espresso = {
  render(item, lang) {
    // 語言切換
    const name = lang === "zh" ? item.name_zh : item.name_en;
    const subName = lang === "zh" ? item.name_en : item.name_zh;
    const tags = lang === "zh" ? item.tags_zh : item.tags_en;
    const description =
      lang === "zh" ? item.description_zh : item.description_en;

    // 建立卡片 <details> 元素
    const card = document.createElement("details");
    card.className = "card";

    // 建立 <summary> 包含卡片主要內容
    const summary = document.createElement("summary");

    // 建立標籤
    let tagsHTML = "";
    if (tags && tags.length) {
      tagsHTML = `
        <div class="tags">
          ${tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
        </div>`;
    }

    // --- ⭐ 修正點在這裡 ---
    // 從 "寫死路徑"
    // const imagePath = `images/${item.image_name}`;

    // 改為 "讀取 CONFIG 變數"
    // (CONFIG.IMG_BASE_PATH 來自 config.js)
    const imagePath = (CONFIG.IMG_BASE_PATH || "images/") + item.image_name;
    // --- 修正結束 ---

    summary.innerHTML = `
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
    `;

    // 建立卡片開啟後的 80/20 覆蓋層
    const overlay = document.createElement("div");
    overlay.className = "content-overlay";
    overlay.innerHTML = `
      <div class="desc">
        ${description || ""}
      </div>
      <div class="price">
        $${item.price}
      </div>
    `;

    card.appendChild(summary);
    card.appendChild(overlay);

    return card;
  },
};
