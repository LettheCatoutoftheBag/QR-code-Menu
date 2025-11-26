const SelectedExp = {
  render(item, lang) {
    const card = document.createElement("div");
    card.className = "exp-card";

    let name, subName, description, items;

    if (lang === "zh") {
      name = item.name_zh;
      subName = item.name_en;
      description = item.description_zh;
      items = item.items_zh || item.items;
    } else if (lang === "en") {
      name = item.name_en;
      subName = item.name_zh;
      description = item.description_en;
      items = item.items_en || item.items;
    } else {
      name = item[`name_${lang}`] || item.name_en;
      subName = item.name_zh;
      description = item[`description_${lang}`] || item.description_en;
      items = item[`items_${lang}`] || item.items_en || item.items;
    }

    const itemsList = (items || "").split("|").filter(Boolean);

    const imgSrc = item.image_name
      ? `${CONFIG.IMG_BASE_PATH}${item.image_name}`
      : "";

    const feat = item.is_featured === true;
    const star = feat ? '<span class="star">⭐</span>' : "";

    let imageSection = "";
    if (imgSrc) {
      imageSection = `
        <div class="exp-image-section">
          <img src="${imgSrc}" alt="${name}" class="exp-image" />
          ${featuredBadge}
        </div>
      `;
    }

    const contentSection = `
      <div class="exp-content-section">
        <h3 class="exp-title">${star}${name}</h3>
        ${subName ? `<div class="exp-subtitle">${subName}</div>` : ""}
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
