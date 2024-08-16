const wantSection = document.getElementById("WantsListTable");

function getCsvUri() {
  let content = "data:text/csv;charset=utf-8,";
  content += "card_name,\r\n";
  wantSection.querySelectorAll("tr td > a").forEach((row) => {
    content +=
      row.text.replaceAll(",", "").replaceAll(/(\s\(V\.[0-9]+\))/g, "") +
      ",\r\n";
  });
  return encodeURI(content);
}

function getCardList() {
  return (
    Array.from(wantSection.querySelectorAll("tr td > a"))
      .map((a) => `${a.text}@`)
      .toString()
      .replaceAll(/@,?/g, "\n")
      // specific to magic, IDK the other games
      .replaceAll(/(\s\(V\.[0-9]+\))/g, "")
  );
}

if (wantSection) {
  const buttonContainer = document.createElement("div");
  buttonContainer.style.display = "flex";
  buttonContainer.style.gap = "1rem";
  buttonContainer.style.margin = "1rem 0";

  const exportButton = document.createElement("a");
  exportButton.href = getCsvUri();
  exportButton.download = document
    .querySelector("h1")
    .textContent.replaceAll(/\s/g, "_");
  exportButton.className = "btn btn-success";
  const text = document.createElement("span");
  text.textContent = "Export CSV";
  const icon = document.createElement("span");
  icon.className = "fonticon-download me-2";
  exportButton.appendChild(icon);
  exportButton.appendChild(text);

  const copyToClipboardButton = document.createElement("button");
  copyToClipboardButton.className = "btn btn-success";
  copyToClipboardButton.onclick = () => {
    navigator.clipboard.writeText(getCardList());
    copyToClipboardButtonText.textContent = "Copied!";
    copyToClipboardButton.disabled = true;
    setTimeout(() => {
      copyToClipboardButtonText.textContent = "Copy to Clipboard";
      copyToClipboardButton.disabled = false;
    }, 1000);
  };
  const copyToClipboardButtonText = document.createElement("span");
  copyToClipboardButtonText.textContent = "Copy to Clipboard";
  const copyToClipboardButtonIcon = document.createElement("span");
  copyToClipboardButtonIcon.className = "fonticon-clipboard me-2";
  copyToClipboardButton.appendChild(copyToClipboardButtonIcon);
  copyToClipboardButton.appendChild(copyToClipboardButtonText);

  buttonContainer.appendChild(exportButton);
  buttonContainer.appendChild(copyToClipboardButton);
  wantSection.insertBefore(buttonContainer, wantSection.firstChild);
}
