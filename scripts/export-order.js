const table = document.querySelector("table[id^=ArticleTable]");

class OrderRowDataset {
  #dataset;

  get articleId() {
    return this.#dataset.articleId;
  }
  get productId() {
    return this.#dataset.productId;
  }
  get amount() {
    return this.#dataset.amount;
  }
  get name() {
    return this.#dataset.name;
  }
  get expansion() {
    return this.#dataset.expansion;
  }
  get expansionName() {
    return this.#dataset.expansionName;
  }
  get number() {
    return this.#dataset.number;
  }
  get rarity() {
    return this.#dataset.rarity;
  }
  get condition() {
    return this.#dataset.condition;
  }
  get language() {
    return this.#dataset.language;
  }
  get price() {
    return this.#dataset.price;
  }
  get comment() {
    return this.#dataset.comment;
  }

  constructor(dataset) {
    this.#dataset = dataset;
  }
}

class AdapterCardMarketToManaBox {
  static #rarity = {
    20: "common",
    30: "uncommon",
    40: "special",
    60: "rare",
    70: "mythic",
  };

  static #condition = {
    2: "near_mint",
    3: "excellent",
    4: "good",
  };

  static #language = {
    1: "en",
    5: "it",
    7: "ja",
  };

  // Bunch of adjustment between sets name, it would be ideal to have the sets ID
  static expansionName(expansionName) {
    let reducedExpansionName = expansionName.replace(
      /:?\s(Extras|Promos)/i,
      ""
    );
    // Core Set?
    if (reducedExpansionName.match(/core [0-9]+/i)) {
      const year = reducedExpansionName.match(/(?<year>[0-9]+)/)?.groups?.year;
      reducedExpansionName = `Core Set ${year}`;
    }
    // Commander?
    if (reducedExpansionName.match(/Commander: /i)) {
      reducedExpansionName = `${reducedExpansionName.replace(
        "Commander: ",
        ""
      )} Commander`;
    }
    // Retro Frame Artifacts?
    if (reducedExpansionName === "Retro Frame Artifacts") {
      reducedExpansionName = "The Brothers' War Retro Artifacts";
    }
    return `"${reducedExpansionName}"`;
  }

  static number(number, cardName, expansionName) {
    // Promos?
    if (expansionName.match(/:?\sPromos/i)) {
      if (cardName.includes("V.1")) return `${number}s`;
      if (cardName.includes("V.2")) return `${number}p`;
    }
    return number;
  }

  static rarity(rarity) {
    return AdapterCardMarketToManaBox.#rarity[rarity] ?? "";
  }

  static condition(condition) {
    return AdapterCardMarketToManaBox.#condition[condition] ?? "near_mint";
  }

  static language(language) {
    return AdapterCardMarketToManaBox.#language[language] ?? "en";
  }
}

function getCsvUri() {
  let content = "data:text/csv;charset=utf-8,";
  columnHeader = [
    "Name",
    "Set name",
    "Collector number",
    "Foil",
    "Rarity",
    "Quantity",
    "Purchase price",
    "Condition",
    "Language",
  ];
  content += `${columnHeader.join(",")}\r\n`;
  let selectedRows = table.querySelectorAll(
    "tbody tr:has(input[type=checkbox]:checked)"
  );
  if (selectedRows.length === 0) {
    // No checkbox checked, export all by deafult
    selectedRows = table.querySelectorAll("tbody tr:has(input[type=checkbox])");
  }
  selectedRows.forEach((row) => {
    const dataset = new OrderRowDataset(row.dataset);
    const isFoil = !!row.querySelector("*[aria-label=Foil]");
    const rowContent = [
      `"${dataset.name.replaceAll(/(\s\(V\.[0-9]+\))/g, "")}"`,
      AdapterCardMarketToManaBox.expansionName(dataset.expansionName),
      AdapterCardMarketToManaBox.number(
        dataset.number,
        dataset.name,
        dataset.expansionName
      ),
      isFoil,
      AdapterCardMarketToManaBox.rarity(dataset.rarity),
      dataset.amount,
      dataset.price,
      AdapterCardMarketToManaBox.condition(dataset.condition),
      AdapterCardMarketToManaBox.language(dataset.language),
    ];
    content += rowContent.join(",") + "\r\n";
  });
  return encodeURI(content);
}

if (table) {
  const firstTh = table.querySelector("thead > tr > th");
  if (firstTh) {
    const checkboxHeader = document.createElement("input");
    checkboxHeader.type = "checkbox";
    checkboxHeader.style.float = "left";
    checkboxHeader.onchange = (e) => {
      const checkboxes = table.querySelectorAll("tbody input[type=checkbox]");
      Array.from(checkboxes).forEach((c) => (c.checked = e.target.checked));
    };

    firstTh.appendChild(checkboxHeader);
  }

  const exportButton = document.createElement("a");
  exportButton.onmouseenter = () => {
    exportButton.href = getCsvUri();
  };
  exportButton.onmouseleave = () => {
    delete exportButton.href;
  };
  exportButton.download = document
    .querySelector("h1")
    .textContent.replaceAll(/\s/g, "_");
  exportButton.className = "btn btn-success";
  const text = document.createElement("span");
  text.textContent = "Export ManaBox";
  const icon = document.createElement("span");
  icon.className = "fonticon-download me-2";
  exportButton.appendChild(icon);
  exportButton.appendChild(text);

  table.parentNode.insertBefore(exportButton, table);
}
