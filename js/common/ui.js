const UI = {
  updateText(lang, cat) {
    const t = I18N[lang] || I18N.zh;
    Utils.$("#title").textContent = t.title;
    Utils.$("#subtitle").textContent = t.subtitle[cat] || "";
    Utils.$("#search").placeholder = t.search;

    Utils.$("#t1").textContent = t.tabs.pour_over;
    Utils.$("#t2").textContent = t.tabs.espresso;
    Utils.$("#t3").textContent = t.tabs.signature;
    Utils.$("#t4").textContent = t.tabs.beverages;
    Utils.$("#t5").textContent = t.tabs.desserts;

    Utils.$("#s1").textContent = t.subs.all;
    Utils.$("#s2").textContent = t.subs.estate;
    Utils.$("#s3").textContent = t.subs.competition;
    Utils.$("#s4").textContent = t.subs.geisha;
    Utils.$("#s5").textContent = t.subs.limited;

    Utils.$("#b1").textContent = t.subs.b1;
    Utils.$("#b2").textContent = t.subs.b2;
  },

  showEmpty(lang) {
    const t = I18N[lang] || I18N.zh;
    Utils.$(
      "#list"
    ).innerHTML = `<p style="text-align:center;color:var(--text2);grid-column:1/-1;">${t.empty}</p>`;
  },
};
