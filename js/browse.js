// === SAMPLE BOOK DATA ===
const books = [
  { title: "This is Our Story", author: "Ashley Elston", price: 1800, category: "Fiction", img: "this-is-our-story.jpg", stock: true },
  { title: "It Ends With Us", author: "Colleen Hoover", price: 2400, category: "Romance", img: "it-ends-with-us.jpg", stock: true },
  { title: "Black Hearts", author: "Jenna Wood", price: 2200, category: "Fantasy", img: "black-hearts.jpg", stock: false },
  { title: "Atomic Habits", author: "James Clear", price: 3400, category: "Self Help", img: "atomic-habits.jpg", stock: true },
  // you can add more books here
];

let currentPage = 1;
const booksPerPage = 4;
let cartCount = 0;

// === DOM ELEMENTS ===
const bookGrid = document.querySelector(".book-grid");
const searchInput = document.querySelector(".search-bar input[type='text']");
const categorySelect = document.querySelector(".search-bar select");
const priceRange = document.querySelector(".search-bar input[type='range']");
const paginationDiv = document.querySelector(".pagination");
const cartDisplay = document.createElement("span");

// show cart count in header
const nav = document.querySelector("header nav");
cartDisplay.innerHTML = `🛒 Cart (0)`;
cartDisplay.style.marginLeft = "20px";
nav.appendChild(cartDisplay);

// === RENDER BOOKS ===
function renderBooks() {
  bookGrid.innerHTML = "";

  const filteredBooks = books.filter(book => {
    const searchMatch = book.title.toLowerCase().includes(searchInput.value.toLowerCase()) ||
                        book.author.toLowerCase().includes(searchInput.value.toLowerCase());

    const categoryMatch = categorySelect.value === "Category" || categorySelect.value === book.category;
    const priceMatch = book.price <= priceRange.value;

    return searchMatch && categoryMatch && priceMatch;
  });

  const start = (currentPage - 1) * booksPerPage;
  const end = start + booksPerPage;
  const paginatedBooks = filteredBooks.slice(start, end);

  paginatedBooks.forEach(book => {
    const div = document.createElement("div");
    div.classList.add("book-card");
    if (!book.stock) div.classList.add("out");

    div.innerHTML = `
      <img src="${book.img}" alt="${book.title}">
      <span class="cart"><i class="fa fa-shopping-cart"></i></span>
      ${!book.stock ? '<span class="out-text">OUT OF STOCK</span>' : ""}
      <p><b>Book:</b> ${book.title}<br><b>Author:</b> ${book.author}<br><b>Price:</b> ${book.price} LKR</p>
    `;

    // add to cart functionality
    if (book.stock) {
      div.querySelector(".cart").addEventListener("click", () => {
        cartCount++;
        cartDisplay.innerHTML = `🛒 Cart (${cartCount})`;
        alert(`${book.title} added to cart!`);
      });
    }

    bookGrid.appendChild(div);
  });

  renderPagination(filteredBooks.length);
}

// === PAGINATION ===
function renderPagination(totalBooks) {
  paginationDiv.innerHTML = "";

  const totalPages = Math.ceil(totalBooks / booksPerPage);

  if (totalPages > 1) {
    const prev = document.createElement("button");
    prev.textContent = "<";
    prev.disabled = currentPage === 1;
    prev.addEventListener("click", () => {
      currentPage--;
      renderBooks();
    });

    const next = document.createElement("button");
    next.textContent = ">";
    next.disabled = currentPage === totalPages;
    next.addEventListener("click", () => {
      currentPage++;
      renderBooks();
    });

    paginationDiv.appendChild(prev);
    paginationDiv.appendChild(next);
  }
}

// === EVENT LISTENERS ===
searchInput.addEventListener("input", () => {
  currentPage = 1;
  renderBooks();
});

categorySelect.addEventListener("change", () => {
  currentPage = 1;
  renderBooks();
});

priceRange.addEventListener("input", () => {
  currentPage = 1;
  renderBooks();
});

// === INIT ===
renderBooks();
