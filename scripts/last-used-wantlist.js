const form = document.getElementById("AddWantsForm");
// example: /en/Magic/... -> ['', 'en', 'Magic', ...]
const selectedCardgame = location.pathname.split("/")[2];

if (form) {
  // SAVE
  form.addEventListener("submit", (e) => {
    window.localStorage.setItem(
      selectedCardgame,
      e.target.elements["idWantsList"].value
    );
  });
  // READ ON LOAD
  form.elements["idWantsList"].value =
    window.localStorage.getItem(selectedCardgame);
}
