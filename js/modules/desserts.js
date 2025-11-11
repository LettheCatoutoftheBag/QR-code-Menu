const Desserts = {
  render(item, lang) {
    // 語言切換
    const name = lang === "zh" ? item.name_zh : item.name_en;
    const subName = lang === "zh" ? item.name_en : item.name_zh;
    const tags = lang === "zh" ? item.tags_zh : item.tags_en;
    const description =
      lang === "zh" ? item.description_zh : item.description_en;

    // 建立卡片 <details> 元素
    const card = document.createElement("details");
    card.className = "card card-dessert";

    // 建立 <summary>
    const summary = document.createElement("summary");

    // 從 CONFIG 讀取圖片基礎路徑
    const imagePath = (CONFIG.IMG_BASE_PATH || "images/") + item.image_name;

    // --- ⭐ 修正：建立 "上排" (圖 + 內容 + 箭頭) ---
    const topRow = document.createElement("div");
    topRow.className = "card-dessert-top"; // (我們將用 CSS 讓 "它" 變 flex)

    // 1. 左側圖片
    const imagePreview = document.createElement("div");
    imagePreview.className = "card-image-preview";
    imagePreview.dataset.imgSrc = imagePath;
    imagePreview.innerHTML = `<img src="${imagePath}" alt="${name}">`;

    // 2. 中間內容 (只有標題/副標)
    const content = document.createElement("div");
    content.className = "card-content-dessert";
    content.innerHTML = `
      <div class="card-head">
        <div>
          <div class="card-title">${name}</div>
          <div class="card-sub">${subName}</div>
        </div>
      </div>
    `;

    // 3. 右側動作 (箭頭)
    const actions = document.createElement("div");
    actions.className = "actions";
    actions.innerHTML = `<span class="chev">►</span>`;

    // 組合 "上排"
    topRow.appendChild(imagePreview);
    topRow.appendChild(content);
    topRow.appendChild(actions);

    // --- 組合 Summary ---
    // 1. 先附加 "上排"
    summary.appendChild(topRow);

    // 2. 接著附加 "標籤" (如果有的話)
    if (tags && tags.length) {
      const tagsDiv = document.createElement("div");
      // ⭐ 標籤現在位於 summary 內部，但不在 topRow 內
      tagsDiv.className = "tags tags-dessert";
      tagsDiv.innerHTML = tags
        .map((tag) => `<span class="tag">${tag}</span>`)
        .join("");
      summary.appendChild(tagsDiv);
    }

    // --- 建立遮蓋層 (同 B, C, D) ---
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

    // 依序附加 Summary 和 遮蓋層
    card.appendChild(summary);
    card.appendChild(overlay);

    return card;
  },
};
