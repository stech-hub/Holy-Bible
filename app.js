/* ============================================================
   OFFLINE HOLY BIBLE APPLICATION – CORE ENGINE
   Created by: Akin S. Sokpah
   Country: Liberia 🇱🇷
   ============================================================ */

/* ============================================================
   GLOBAL APPLICATION STATE
   ============================================================ */

const AppState = {
  currentBook: null,
  currentChapter: null,
  currentVerse: null,
  theme: "dark"
};

/* ============================================================
   DOM REFERENCES
   ============================================================ */

const DOM = {
  bookGrid: document.querySelector(".book-grid"),
  reader: document.querySelector(".reader"),
  searchInput: document.querySelector(".search-area input"),
  modeToggle: document.querySelector(".mode-toggle")
};

/* ============================================================
   APPLICATION INIT
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  initializeTheme();
  renderAllBooks();
  restoreLastSession();
  attachSearch();
});

/* ============================================================
   THEME SYSTEM (DARK / LIGHT)
   ============================================================ */

function initializeTheme() {
  const saved = localStorage.getItem("bible_theme");
  if (saved === "light") {
    document.body.classList.add("light");
    AppState.theme = "light";
  }
}

function toggleTheme() {
  document.body.classList.toggle("light");
  AppState.theme = document.body.classList.contains("light")
    ? "light"
    : "dark";
  localStorage.setItem("bible_theme", AppState.theme);
}

/* ============================================================
   BOOK RENDERING
   ============================================================ */

function renderAllBooks() {
  if (!DOM.bookGrid) return;

  DOM.bookGrid.innerHTML = "";

  const oldTestament = BIBLE_BOOKS.filter(b => b.testament === "OT");
  const newTestament = BIBLE_BOOKS.filter(b => b.testament === "NT");

  renderTestament("Old Testament", oldTestament);
  renderTestament("New Testament", newTestament);
}

function renderTestament(title, books) {
  const header = document.createElement("div");
  header.style.gridColumn = "1 / -1";
  header.innerHTML = `
    <h2 style="
      text-align:center;
      color:#d4af37;
      letter-spacing:2px;
      margin:20px 0 10px;
    ">${title}</h2>
  `;
  DOM.bookGrid.appendChild(header);

  books.forEach(book => {
    const card = document.createElement("div");
    card.className = "book";
    card.innerHTML = `
      <h3>${book.name}</h3>
      <span>${book.chapters} chapters</span>
    `;
    card.onclick = () => selectBook(book);
    DOM.bookGrid.appendChild(card);
  });
}

/* ============================================================
   BOOK & CHAPTER FLOW
   ============================================================ */

function selectBook(book) {
  AppState.currentBook = book;
  AppState.currentChapter = 1;
  saveSession();
  renderChapterSelector(book);
}

function renderChapterSelector(book) {
  DOM.reader.innerHTML = `
    <h2>${book.name}</h2>
    <p style="opacity:0.7">Select a chapter</p>
    <div class="chapter-grid"></div>
  `;

  const grid = DOM.reader.querySelector(".chapter-grid");
  grid.style.display = "grid";
  grid.style.gridTemplateColumns = "repeat(auto-fit, minmax(60px, 1fr))";
  grid.style.gap = "10px";
  grid.style.marginTop = "15px";

  for (let i = 1; i <= book.chapters; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.style.padding = "10px";
    btn.style.borderRadius = "10px";
    btn.style.border = "1px solid rgba(212,175,55,0.5)";
    btn.style.background = "transparent";
    btn.style.color = "#d4af37";
    btn.onclick = () => selectChapter(i);
    grid.appendChild(btn);
  }
}

function selectChapter(chapter) {
  AppState.currentChapter = chapter;
  saveSession();
  renderChapterVerses(
    AppState.currentBook.name,
    AppState.currentChapter
  );
}

/* ============================================================
   SEARCH SYSTEM
   ============================================================ */

function attachSearch() {
  if (!DOM.searchInput) return;

  DOM.searchInput.addEventListener("input", e => {
    const q = e.target.value.toLowerCase();
    document.querySelectorAll(".book").forEach(card => {
      card.style.display = card.innerText.toLowerCase().includes(q)
        ? "block"
        : "none";
    });
  });
}

/* ============================================================
   OFFLINE SESSION STORAGE
   ============================================================ */

function saveSession() {
  const data = {
    book: AppState.currentBook?.name || null,
    chapter: AppState.currentChapter
  };
  localStorage.setItem("bible_session", JSON.stringify(data));
}

function restoreLastSession() {
  const raw = localStorage.getItem("bible_session");
  if (!raw) return;

  try {
    const data = JSON.parse(raw);
    const book = BIBLE_BOOKS.find(b => b.name === data.book);
    if (book) {
      AppState.currentBook = book;
      AppState.currentChapter = data.chapter || 1;
      renderChapterVerses(book.name, AppState.currentChapter);
    }
  } catch {
    console.warn("Session restore failed");
  }
}

/* ============================================================
   GLOBAL CONTROLS (EXPOSED)
   ============================================================ */

window.toggleTheme = toggleTheme;

/* ============================================================
   END OF FILE
   ============================================================ */
