/* ============================================================
   OFFLINE HOLY BIBLE APPLICATION – CORE ENGINE
   Created by: Akin S. Sokpah
   Country: Liberia 🇱🇷
   ============================================================ */

/* ============================================================
   GLOBAL STATE
   ============================================================ */

const AppState = {
  currentBook: null,
  currentChapter: null,
  currentVerse: null,
  theme: "dark", // dark | light
  lastRead: null
};

/* ============================================================
   DOM ELEMENT REFERENCES
   ============================================================ */

const DOM = {
  bookGrid: document.querySelector(".book-grid"),
  reader: document.querySelector(".reader"),
  searchInput: document.querySelector(".search-area input"),
  header: document.querySelector("header"),
};

/* ============================================================
   INITIALIZATION
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  loadThemeFromStorage();
  renderBooks();
  restoreLastRead();
  attachSearchHandler();
});

/* ============================================================
   THEME MANAGEMENT
   ============================================================ */

function toggleTheme() {
  if (document.body.classList.contains("light")) {
    document.body.classList.remove("light");
    AppState.theme = "dark";
  } else {
    document.body.classList.add("light");
    AppState.theme = "light";
  }
  saveThemeToStorage();
}

function saveThemeToStorage() {
  localStorage.setItem("bible_theme", AppState.theme);
}

function loadThemeFromStorage() {
  const savedTheme = localStorage.getItem("bible_theme");
  if (savedTheme === "light") {
    document.body.classList.add("light");
    AppState.theme = "light";
  }
}

/* ============================================================
   BOOK RENDERING
   ============================================================ */

function renderBooks() {
  if (!DOM.bookGrid) return;

  DOM.bookGrid.innerHTML = "";

  const oldTestament = BIBLE_BOOKS.filter(b => b.testament === "OT");
  const newTestament = BIBLE_BOOKS.filter(b => b.testament === "NT");

  renderTestamentHeader("Old Testament");
  oldTestament.forEach(book => renderBookCard(book));

  renderTestamentHeader("New Testament");
  newTestament.forEach(book => renderBookCard(book));
}

function renderTestamentHeader(title) {
  const header = document.createElement("div");
  header.className = "testament-header";
  header.innerHTML = `
    <h2 style="
      grid-column: 1 / -1;
      margin: 20px 0 10px;
      color: #d4af37;
      text-align: center;
      letter-spacing: 2px;
    ">${title}</h2>
  `;
  DOM.bookGrid.appendChild(header);
}

function renderBookCard(book) {
  const card = document.createElement("div");
  card.className = "book";

  card.innerHTML = `
    <h3>${book.name}</h3>
    <span>${book.testament === "OT" ? "Old Testament" : "New Testament"}</span>
  `;

  card.addEventListener("click", () => {
    selectBook(book);
  });

  DOM.bookGrid.appendChild(card);
}

/* ============================================================
   BOOK SELECTION
   ============================================================ */

function selectBook(book) {
  AppState.currentBook = book;
  AppState.currentChapter = 1;
  AppState.currentVerse = null;

  saveLastRead();
  renderChapterView(book);
}

/* ============================================================
   CHAPTER VIEW
   ============================================================ */

function renderChapterView(book) {
  if (!DOM.reader) return;

  DOM.reader.innerHTML = `
    <h2>${book.name}</h2>
    <p style="opacity:0.7;">Select a chapter</p>
    <div class="chapter-grid"></div>
  `;

  const grid = DOM.reader.querySelector(".chapter-grid");
  grid.style.display = "grid";
  grid.style.gridTemplateColumns = "repeat(auto-fit, minmax(60px, 1fr))";
  grid.style.gap = "10px";
  grid.style.marginTop = "14px";

  for (let i = 1; i <= book.chapters; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.style.padding = "10px";
    btn.style.borderRadius = "10px";
    btn.style.border = "1px solid rgba(212,175,55,0.4)";
    btn.style.background = "transparent";
    btn.style.color = "#d4af37";
    btn.style.cursor = "pointer";

    btn.addEventListener("click", () => {
      selectChapter(i);
    });

    grid.appendChild(btn);
  }
}

/* ============================================================
   CHAPTER SELECTION
   ============================================================ */

function selectChapter(chapter) {
  AppState.currentChapter = chapter;
  AppState.currentVerse = null;

  saveLastRead();
  renderVerseView();
}

/* ============================================================
   VERSE VIEW (PLACEHOLDER – DATA COMING NEXT)
   ============================================================ */

function renderVerseView() {
  if (!DOM.reader) return;

  const book = AppState.currentBook;
  const chapter = AppState.currentChapter;

  DOM.reader.innerHTML = `
    <h2>${book.name} ${chapter}</h2>
    <p style="opacity:0.8;">
      Verse content will load here.<br><br>
      📌 Next step: attach full offline verse data (JSON per book).
    </p>
  `;
}

/* ============================================================
   SEARCH (BOOK LEVEL FOR NOW)
   ============================================================ */

function attachSearchHandler() {
  if (!DOM.searchInput) return;

  DOM.searchInput.addEventListener("input", (e) => {
    const value = e.target.value.toLowerCase();
    filterBooks(value);
  });
}

function filterBooks(query) {
  const cards = document.querySelectorAll(".book");
  cards.forEach(card => {
    const text = card.innerText.toLowerCase();
    card.style.display = text.includes(query) ? "block" : "none";
  });
}

/* ============================================================
   OFFLINE LAST READ STORAGE
   ============================================================ */

function saveLastRead() {
  const data = {
    book: AppState.currentBook?.name || null,
    chapter: AppState.currentChapter,
    verse: AppState.currentVerse
  };
  localStorage.setItem("bible_last_read", JSON.stringify(data));
}

function restoreLastRead() {
  const raw = localStorage.getItem("bible_last_read");
  if (!raw) return;

  try {
    const data = JSON.parse(raw);
    const book = BIBLE_BOOKS.find(b => b.name === data.book);
    if (book) {
      AppState.currentBook = book;
      AppState.currentChapter = data.chapter || 1;
      renderVerseView();
    }
  } catch (e) {
    console.warn("Failed to restore last read position.");
  }
}

/* ============================================================
   UTILITIES (EXPANDABLE SECTION)
   ============================================================ */

// Future:
// - highlightVerse()
// - bookmarkVerse()
// - addNotes()
// - fontSizeControl()
// - audioBible()
// - PWA support
// - verse sharing
// - daily verse

/* ============================================================
   END OF CORE ENGINE
   ============================================================ */
