
  //  ГЛАВНАЯ СТРАНИЦА
const cards = document.querySelectorAll(".card-one, .card-two, .card-three");
const container = document.querySelector(".main-content");
const isMobile = window.matchMedia("(max-width: 600px)");
function resetCards() {
  cards.forEach((card) => {
    card.classList.remove("active", "under", "middle", "mobile-open");
  });

  if (container) {
    container.classList.remove("has-hover", "mobile-active");
  }
}
function activateCard(card) {
  if (!container) return;

  const cardOne = document.querySelector(".card-one");
  const cardTwo = document.querySelector(".card-two");
  const cardThree = document.querySelector(".card-three");
  if (!cardOne || !cardTwo || !cardThree) return;
  resetCards();
  card.classList.add("active");
  container.classList.add("has-hover");
  if (card.classList.contains("card-three")) {
    cardOne.classList.add("under");
    cardTwo.classList.add("middle");
  } else if (card.classList.contains("card-two")) {
    cardOne.classList.add("under");
    cardThree.classList.add("under");
  } else if (card.classList.contains("card-one")) {
    cardTwo.classList.add("under");
    cardThree.classList.add("under");
  }
}
function openMobileCard(card) {
  if (!container) return;
  container.classList.add("mobile-active");
  cards.forEach((item) => {
    item.classList.remove("mobile-open");
  });
  card.classList.add("mobile-open");
}

if (cards.length && container) {
  cards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      if (isMobile.matches) return;
      activateCard(card);
    });

    card.addEventListener("mouseleave", () => {
      if (isMobile.matches) return;
      resetCards();
    });

    card.addEventListener("click", () => {
      if (!isMobile.matches) return;
      openMobileCard(card);
    });
  });

  isMobile.addEventListener("change", resetCards);
}

// рисование в поддержке
const drawCanvas = document.querySelector(".draw-canvas");
if (drawCanvas) {
  const ctx = drawCanvas.getContext("2d");
  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;
  let lastTapTime = 0;

  function resizeCanvas() {
    const rect = drawCanvas.getBoundingClientRect();

    drawCanvas.width = rect.width * window.devicePixelRatio;
    drawCanvas.height = rect.height * window.devicePixelRatio;

    ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
  }
    function getPoint(event) {
    const rect = drawCanvas.getBoundingClientRect();
    const touch = event.touches ? event.touches[0] : event;

    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    };
  }
  function startDrawing(event) {
    event.preventDefault();

    const point = getPoint(event);
    isDrawing = true;
    lastX = point.x;
    lastY = point.y;
  }
  function draw(event) {
    if (!isDrawing) return;

    event.preventDefault();

    const point = getPoint(event);

    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "black";

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);

    const middleX = (lastX + point.x) / 2;
    const middleY = (lastY + point.y) / 2;

    ctx.quadraticCurveTo(lastX, lastY, middleX, middleY);
    ctx.stroke();

    lastX = point.x;
    lastY = point.y;
  }

  function stopDrawing() {
    isDrawing = false;
  }
  function clearCanvas() {
    ctx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
 drawCanvas.addEventListener("mousedown", startDrawing);
  drawCanvas.addEventListener("mousemove", draw);
  window.addEventListener("mouseup", stopDrawing);
  drawCanvas.addEventListener("touchstart", startDrawing);
  drawCanvas.addEventListener("touchmove", draw);
  drawCanvas.addEventListener("touchend", (event) => {
    stopDrawing();
    const currentTime = Date.now();
    if (currentTime - lastTapTime < 300) {
      event.preventDefault();
      clearCanvas();
    }
    lastTapTime = currentTime;
  });

  drawCanvas.addEventListener("dblclick", clearCanvas);
}

// отзыв

const reviewForm = document.querySelector(".review-form");
const reviewTextarea = document.querySelector(".review-form textarea");
const reviewButton = document.querySelector(".review-submit");
const reviewsGrid = document.querySelector(".reviews-grid");
const ratingButtons = document.querySelectorAll(".rating-input button");
let selectedRating = 0;
function renderRatingInput() {
  ratingButtons.forEach((button) => {
    const rating = Number(button.dataset.rating);

    if (rating <= selectedRating) {
      button.textContent = "★";
    } else {
      button.textContent = "☆";
    }
  });
}
function getStars(rating) {
  return "★".repeat(rating) + "☆".repeat(5 - rating);
}
function updateReviewButton() {
  if (!reviewTextarea || !reviewButton) return;
  const hasText = reviewTextarea.value.trim().length > 0;
  const hasRating = selectedRating > 0;
  if (hasText && hasRating) {
    reviewButton.classList.add("is-active");
  } else {
    reviewButton.classList.remove("is-active");
  }
}
if (ratingButtons.length) {
  ratingButtons.forEach((button) => {
    button.addEventListener("click", () => {
      selectedRating = Number(button.dataset.rating);
      renderRatingInput();
      updateReviewButton();
    });
  });

  renderRatingInput();
}

if (reviewForm && reviewTextarea && reviewButton && reviewsGrid) {
  reviewTextarea.addEventListener("input", updateReviewButton);
  reviewForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = reviewTextarea.value.trim();
    if (text.length === 0 || selectedRating === 0) return;
    reviewButton.textContent = "отправка...";
    reviewButton.disabled = true;
    setTimeout(() => {
      const newReview = document.createElement("article");
      newReview.className = "review-card new-review";

      newReview.innerHTML = `
        <p class="review-text"></p>
        <div class="stars">${getStars(selectedRating)}</div>
        <div class="review-name purple">@Новый чел</div>
      `;
      newReview.querySelector(".review-text").textContent = text;
      reviewsGrid.prepend(newReview);
      reviewsGrid.scrollTo({
        left: 0,
        behavior: "smooth",
      });
      reviewTextarea.value = "";
      selectedRating = 0;
      renderRatingInput();
      reviewButton.classList.remove("is-active");
      reviewButton.textContent = "отправить";
      reviewButton.disabled = false;
    }, 700);
  });
}

// фиолетовая карточка открывается
const designerCard = document.querySelector(".designer-card");
if (designerCard) {
  designerCard.addEventListener("click", (event) => {
    if (event.target.closest("a")) return;

    designerCard.classList.toggle("is-open");
  });
}

// волна при наведении
const eventsRow = document.querySelector(".events-row");
const eventCards = document.querySelectorAll(".events-row .event-card");
function resetEventWave() {
  if (!eventsRow) return;

  eventsRow.classList.remove("is-waving");
  eventCards.forEach((item) => {
    item.classList.remove(
      "wave-active",
      "wave-left",
      "wave-right",
      "wave-left-2",
      "wave-right-2",
      "wave-far"
    );
  });
}
if (eventsRow && eventCards.length) {
  eventCards.forEach((card, activeIndex) => {
    card.addEventListener("mouseenter", () => {
      eventsRow.classList.add("is-waving");
      eventCards.forEach((item, index) => {
        item.classList.remove(
          "wave-active",
          "wave-left",
          "wave-right",
          "wave-left-2",
          "wave-right-2",
          "wave-far"
        );
       const distance = index - activeIndex;
        if (distance === 0) {
          item.classList.add("wave-active");
        } else if (distance === -1) {
          item.classList.add("wave-left");
        } else if (distance === 1) {
          item.classList.add("wave-right");
        } else if (distance === -2) {
          item.classList.add("wave-left-2");
        } else if (distance === 2) {
          item.classList.add("wave-right-2");
        } else {
          item.classList.add("wave-far");
        }
      });
    });
    card.addEventListener("mouseleave", resetEventWave);
  });
}

// карточки в каталоге
const catalogCards = document.querySelectorAll(
  ".catalog-card-one, .catalog-card-two, .catalog-card-three"
);
const catalogContainer = document.querySelector(".catalog-content");
function resetCatalogCards() {
  catalogCards.forEach((card) => {
    card.classList.remove("active", "under", "middle", "mobile-open");
  });
  if (catalogContainer) {
    catalogContainer.classList.remove("has-hover", "mobile-active");
  }
}
function activateCatalogCard(card) {
  if (!catalogContainer) return;
  const cardOne = document.querySelector(".catalog-card-one");
  const cardTwo = document.querySelector(".catalog-card-two");
  const cardThree = document.querySelector(".catalog-card-three");
  if (!cardOne || !cardTwo || !cardThree) return;
  resetCatalogCards();
  card.classList.add("active");
  catalogContainer.classList.add("has-hover");
  if (card.classList.contains("catalog-card-three")) {
    cardOne.classList.add("under");
    cardTwo.classList.add("middle");
  } else if (card.classList.contains("catalog-card-two")) {
    cardOne.classList.add("under");
    cardThree.classList.add("under");
  } else if (card.classList.contains("catalog-card-one")) {
    cardTwo.classList.add("under");
    cardThree.classList.add("under");
  }
}
function openMobileCatalogCard(card) {
  if (!catalogContainer) return;
  catalogContainer.classList.add("mobile-active");
  catalogCards.forEach((item) => {
    item.classList.remove("mobile-open");
  });
  card.classList.add("mobile-open");
}
if (catalogCards.length && catalogContainer) {
  catalogCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      if (isMobile.matches) return;
      activateCatalogCard(card);
    });
    card.addEventListener("mouseleave", () => {
      if (isMobile.matches) return;
      resetCatalogCards();
    });
    card.addEventListener("click", () => {
      if (!isMobile.matches) return;
      openMobileCatalogCard(card);
    });
  });
  isMobile.addEventListener("change", resetCatalogCards);
}

// карточки в мужском и женском
const genderCards = document.querySelectorAll(".goods-women, .goods-men");
const genderGrid = document.querySelector(".goods-gender-grid");
function resetGenderCards() {
  genderCards.forEach((card) => {
    card.classList.remove("active", "under", "mobile-open");
  });
  if (genderGrid) {
    genderGrid.classList.remove("has-hover", "mobile-active");
  }
}

function activateGenderCard(card) {
  if (!genderGrid) return;
  const womenCard = document.querySelector(".goods-women");
  const menCard = document.querySelector(".goods-men");
  if (!womenCard || !menCard) return;
  resetGenderCards();
  card.classList.add("active");
  genderGrid.classList.add("has-hover");
  if (card.classList.contains("goods-women")) {
    menCard.classList.add("under");
  }
  if (card.classList.contains("goods-men")) {
    womenCard.classList.add("under");
  }
}
function openMobileGenderCard(card) {
  if (!genderGrid) return;
  genderGrid.classList.add("mobile-active");
  genderCards.forEach((item) => {
    item.classList.remove("mobile-open");
  });
  card.classList.add("mobile-open");
}

if (genderCards.length && genderGrid) {
  genderCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      if (isMobile.matches) return;
      activateGenderCard(card);
    });
    card.addEventListener("mouseleave", () => {
      if (isMobile.matches) return;
      resetGenderCards();
    });
    card.addEventListener("click", () => {
      if (!isMobile.matches) return;
      openMobileGenderCard(card);
    });
  });
  isMobile.addEventListener("change", resetGenderCards);
}

// рисование на карточках сотрудников
const teamCanvases = document.querySelectorAll(".team-draw-canvas");
teamCanvases.forEach((canvas) => {
  const ctx = canvas.getContext("2d");
  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;
  let lastTapTime = 0;
  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
  }

  function getPoint(event) {
    const rect = canvas.getBoundingClientRect();
    const touch = event.touches ? event.touches[0] : event;
    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    };
  }
  function startDrawing(event) {
    event.preventDefault();
    const point = getPoint(event);
    isDrawing = true;
    lastX = point.x;
    lastY = point.y;
  }

  function draw(event) {
    if (!isDrawing) return;
    event.preventDefault();
    const point = getPoint(event);
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    const middleX = (lastX + point.x) / 2;
    const middleY = (lastY + point.y) / 2;
    ctx.quadraticCurveTo(lastX, lastY, middleX, middleY);
    ctx.stroke();
    lastX = point.x;
    lastY = point.y;
  }
  function stopDrawing() {
    isDrawing = false;
  }
  function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
  canvas.addEventListener("mousedown", startDrawing);
  canvas.addEventListener("mousemove", draw);
  window.addEventListener("mouseup", stopDrawing);
  canvas.addEventListener("touchstart", startDrawing);
  canvas.addEventListener("touchmove", draw);
  canvas.addEventListener("touchend", (event) => {
    stopDrawing();
    const currentTime = Date.now();
    if (currentTime - lastTapTime < 300) {
      event.preventDefault();
      clearCanvas();
    }
    lastTapTime = currentTime;
  });
  canvas.addEventListener("dblclick", clearCanvas);
});

const salesCards = document.querySelectorAll(
  ".sales-card-one, .sales-card-two, .sales-card-three"
);

const salesContainer = document.querySelector(".sales-content");

function resetSalesCards() {
  salesCards.forEach((card) => {
    card.classList.remove("active", "under", "middle", "mobile-open");
  });

  if (salesContainer) {
    salesContainer.classList.remove("has-hover", "mobile-active");
  }
}

function activateSalesCard(card) {
  if (!salesContainer) return;

  const cardOne = document.querySelector(".sales-card-one");
  const cardTwo = document.querySelector(".sales-card-two");
  const cardThree = document.querySelector(".sales-card-three");

  if (!cardOne || !cardTwo || !cardThree) return;

  resetSalesCards();

  card.classList.add("active");
  salesContainer.classList.add("has-hover");

  if (card.classList.contains("sales-card-three")) {
    cardOne.classList.add("under");
    cardTwo.classList.add("middle");
  } else if (card.classList.contains("sales-card-two")) {
    cardOne.classList.add("under");
    cardThree.classList.add("under");
  } else if (card.classList.contains("sales-card-one")) {
    cardTwo.classList.add("under");
    cardThree.classList.add("under");
  }
}
// акции
function openMobileSalesCard(card) {
  if (!salesContainer) return;
  salesContainer.classList.add("mobile-active");
  salesCards.forEach((item) => {
    item.classList.remove("mobile-open");
  });
  card.classList.add("mobile-open");
}
if (salesCards.length && salesContainer) {
  salesCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      if (isMobile.matches) return;
      activateSalesCard(card);
    });
    card.addEventListener("mouseleave", () => {
      if (isMobile.matches) return;
      resetSalesCards();
    });
    card.addEventListener("click", () => {
      if (!isMobile.matches) return;
      openMobileSalesCard(card);
    });
  });
  isMobile.addEventListener("change", resetSalesCards);
}

