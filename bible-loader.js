/* ============================================================
   OFFLINE HOLY BIBLE – DATA LOADER ENGINE
   Created by: Akin S. Sokpah
   Country: Liberia 🇱🇷
   ============================================================ */

/* ============================================================
   GLOBAL CACHE
   ============================================================ */

const BibleCache = {
  books: {},       // Loaded Bible books JSON
  currentBook: "",
  currentChapter: 1
};

/* ============================================================
   CONFIGURATION
   ============================================================ */

const BIBLE_DATA_PATH = "./bible-data/"; // folder containing JSON files
const DEFAULT_VERSION = "KJV";

/* ============================================================
   LOAD BOOK JSON FILE
   ============================================================ */

async function loadBibleBook(bookName) {
  if (BibleCache.books[bookName]) {
    return BibleCache.books[bookName];
  }

  try {
    const response = await fetch(`${BIBLE_DATA_PATH}${bookName}.json`);
    if (!response.ok) throw new Error("Book not found");

    const data = await response.json();
    BibleCache.books[bookName] = data;
    return data;

  } catch (error) {
    console.error("Error loading Bible book:", error);
    return null;
  }
}

/* ============================================================
   RENDER CHAPTER VERSES
   ============================================================ */

async function renderChapterVerses(bookName, chapterNumber) {
  const reader = document.querySelector(".reader");
  if (!reader) return;

  const bookData = await loadBibleBook(bookName);
  if (!bookData) {
    reader.innerHTML = `<p>Failed to load ${bookName}</p>`;
    return;
  }

  const chapter = bookData.chapters[String(chapterNumber)];
  if (!chapter) {
    reader.innerHTML = `<p>Chapter not found.</p>`;
    return;
  }

  BibleCache.currentBook = bookName;
  BibleCache.currentChapter = chapterNumber;

  reader.innerHTML = `
    <h2>${bookName} ${chapterNumber}</h2>
    <div class="verse-container"></div>
  `;

  const container = reader.querySelector(".verse-container");

  Object.keys(chapter).forEach(verseNum => {
    const verseText = chapter[verseNum];

    const verseEl = document.createElement("div");
    verseEl.className = "verse";

    verseEl.innerHTML = `
      <span class="verse-number">${verseNum}</span>
      <span class="verse-text">${verseText}</span>
    `;

    verseEl.addEventListener("click", () => {
      highlightVerse(verseEl);
      saveLastReadPosition(bookName, chapterNumber, verseNum);
    });

    container.appendChild(verseEl);
  });
}

/* ============================================================
   VERSE HIGHLIGHTING
   ============================================================ */

function highlightVerse(verseEl) {
  document.querySelectorAll(".verse").forEach(v => {
    v.classList.remove("active-verse");
  });

  verseEl.classList.add("active-verse");
}

/* ============================================================
   SAVE LAST READ POSITION
   ============================================================ */

function saveLastReadPosition(book, chapter, verse) {
  const data = {
    book,
    chapter,
    verse
  };

  localStorage.setItem("bible_last_position", JSON.stringify(data));
}

/* ============================================================
   RESTORE LAST READ POSITION
   ============================================================ */

async function restoreLastReadPosition() {
  const raw = localStorage.getItem("bible_last_position");
  if (!raw) return;

  try {
    const data = JSON.parse(raw);
    await renderChapterVerses(data.book, data.chapter);

    setTimeout(() => {
      const verse = document.querySelector(
        `.verse-number:nth-child(${data.verse})`
      );
      if (verse) verse.scrollIntoView({ behavior: "smooth" });
    }, 300);

  } catch (e) {
    console.warn("Failed to restore reading position.");
  }
}

/* ============================================================
   CONNECT WITH app.js
   ============================================================ */

/*
  app.js should call:
  renderChapterVerses(book.name, chapterNumber)
  instead of placeholder verse rendering
*/

/* ============================================================
   NAVIGATION HELPERS
   ============================================================ */

async function nextChapter() {
  const book = BibleCache.currentBook;
  const chapter = BibleCache.currentChapter + 1;
  await renderChapterVerses(book, chapter);
}

async function previousChapter() {
  const book = BibleCache.currentBook;
  const chapter = Math.max(1, BibleCache.currentChapter - 1);
  await renderChapterVerses(book, chapter);
}

/* ============================================================
   FUTURE EXPANSION ZONE (BIG)
   ============================================================ */

/*
  Planned features (will add MANY lines later):

  - verse bookmarking
  - verse notes
  - font size control
  - reading modes (scroll / page)
  - audio Bible sync
  - daily verse system
  - cross references
  - strong concordance
  - multiple translations
  - offline search indexing
  - highlight colors
  - share verse image
  - PWA caching strategies
*/

/* ============================================================
   END OF BIBLE LOADER ENGINE
   ============================================================ */
