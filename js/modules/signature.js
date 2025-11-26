const Signature = {
  render(item, lang) {
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
      subName = item.name_zh;
      tags = item[`tags_${lang}`] || item.tags_en;
      description = item[`description_${lang}`] || item.description_en;
    }

    const feat = item.is_featured === true;
    const star = feat ? '<span class="star">⭐</span>' : "";

    const card = document.createElement("div");
    card.className = `card card-clickable ${feat ? "featured" : ""}`;

    let tagsHTML = "";
    if (tags && tags.length) {
      tagsHTML = `
        <div class="tags">
          ${tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
        </div>`;
    }

    const imagePath = (CONFIG.IMG_BASE_PATH || "images/") + item.image_name;
    const hasImage = item.image_name && item.image_name.trim();
    const zoomIconHTML = hasImage
      ? `<span class="zoom-icon" data-img-src="${imagePath}">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 18a7.952 7.952 0 0 0 4.897-1.688l4.396 4.396 1.414-1.414-4.396-4.396A7.952 7.952 0 0 0 18 10c0-4.411-3.589-8-8-8s-8 3.589-8 8 3.589 8 8 8zm0-14c3.309 0 6 2.691 6 6s-2.691 6-6 6-6-2.691-6-6 2.691-6 6-6z"></path>
            <path d="M11.5 9.5H10v-2h1.5v2zm0 2H10v2h1.5v-2z"></path>
          </svg>
        </span>`
      : "";

    let priceHtml = "";
    const hasHot = item.price_hot && item.price_hot.trim();
    const hasIce = item.price_ice && item.price_ice.trim();
    const hasPrice = item.price && item.price.trim();

    if (hasHot || hasIce) {
      let priceContent = "";
      if (hasIce) {
        priceContent += `<div class="price-ice">🧊 $${item.price_ice}</div>`;
      }
      if (hasHot) {
        priceContent += `<div class="price-hot">♨️ $${item.price_hot}</div>`;
      }
      priceHtml = `<div class="price-right">${priceContent}</div>`;
    } else if (hasPrice) {
      priceHtml = `<div class="price-right">$${item.price}</div>`;
    }

    card.innerHTML = `
      <div class="card-wrapper" style="padding: 1rem; cursor: pointer;">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          
          <div style="flex:1;min-width:0;">
            
            <div class="card-head">
              <div>
                <div class="card-title">${star}${name}</div>
                <div class="card-sub">${subName}</div>
              </div>
              <div class="actions">
                ${zoomIconHTML}
                <span class="chev">▶</span>
              </div>
            </div>

            ${tagsHTML}

            <div class="desc" style="padding: 1rem 0.5rem 0.5rem 0;">
              ${description || ""}
            </div>

          </div>

        </div>
      </div>
      ${priceHtml}
    `;

    return card;
  },
};
