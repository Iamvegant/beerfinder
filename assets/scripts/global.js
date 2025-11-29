const body = document.body;
const langMenu = document.getElementById("langMenu");
const overlay = document.getElementById("overlay")
const langMenuBtn = document.getElementById("langMenuBtn")

function openLangMenu() {
    overlay.style.display = 'block';
    langMenu.style.display = 'flex';
    langMenu.style.visibility = 'visible';
    body.addEventListener("click", outsideClickLangMenu);
};

function closeLangMenu() {
    overlay.style.display = 'none';
    langMenu.style.display = 'none';
    langMenu.style.visibility = 'hidden';
    body.removeEventListener("click", outsideClickLangMenu);
};

function outsideClickLangMenu(e) {
    if (!langMenu.contains(e.target) && e.target !== langMenuBtn) closeLangMenu();
}