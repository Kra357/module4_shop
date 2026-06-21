const cards = document.querySelectorAll('.card-one, .card-two, .card-three');
const container = document.querySelector('.main-content');
cards.forEach(card => {
  card.addEventListener('mouseenter', () => {
    cards.forEach(c => {
      c.classList.remove('active', 'under', 'middle');
    });
    card.classList.add('active');
    container.classList.add('has-hover');
    if (card.classList.contains('card-three')) {
      document.querySelector('.card-one').classList.add('under');
      document.querySelector('.card-two').classList.add('middle');
    } else if (card.classList.contains('card-two')) {
      document.querySelector('.card-one').classList.add('under');
      document.querySelector('.card-three').classList.add('under');
    } else if (card.classList.contains('card-one')) {
      // Жёлтая активна: красная и синяя под
      document.querySelector('.card-two').classList.add('under');
      document.querySelector('.card-three').classList.add('under');
    }
  });
  card.addEventListener('mouseleave', () => {
    cards.forEach(c => {
      c.classList.remove('active', 'under', 'middle');
    });
    container.classList.remove('has-hover');
  });
});

const reviewTextarea = document.querySelector(".review-form textarea");
const reviewButton = document.querySelector(".review-form button");
if (reviewTextarea && reviewButton) {
  reviewTextarea.addEventListener("input", () => {
    if (reviewTextarea.value.trim().length > 0) {
      reviewButton.classList.add("is-active");
    } else {
      reviewButton.classList.remove("is-active");
    }
  });
}
const drawCanvas = document.querySelector(".draw-canvas");
if (drawCanvas) {
  const ctx = drawCanvas.getContext("2d");

  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;
function resizeCanvas() {
    const rect = drawCanvas.getBoundingClientRect();
    const imageData = ctx.getImageData(0, 0, drawCanvas.width, drawCanvas.height);

    drawCanvas.width = rect.width * window.devicePixelRatio;
    drawCanvas.height = rect.height * window.devicePixelRatio;

    ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
    ctx.putImageData(imageData, 0, 0);
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
function clearCanvas() {
  ctx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
}
  function stopDrawing() {
    isDrawing = false;
  }

  resizeCanvas();

  window.addEventListener("resize", resizeCanvas);

  drawCanvas.addEventListener("mousedown", startDrawing);
  drawCanvas.addEventListener("mousemove", draw);
  window.addEventListener("mouseup", stopDrawing);

  drawCanvas.addEventListener("touchstart", startDrawing);
  drawCanvas.addEventListener("touchmove", draw);
  window.addEventListener("touchend", stopDrawing);

  drawCanvas.addEventListener("mousedown", startDrawing);
drawCanvas.addEventListener("mousemove", draw);
window.addEventListener("mouseup", stopDrawing);

drawCanvas.addEventListener("touchstart", startDrawing);
drawCanvas.addEventListener("touchmove", draw);
window.addEventListener("touchend", stopDrawing);

drawCanvas.addEventListener("dblclick", clearCanvas);
}

let lastTapTime = 0;

drawCanvas.addEventListener("touchend", () => {
  const currentTime = Date.now();

  if (currentTime - lastTapTime < 300) {
    clearCanvas();
  }

  lastTapTime = currentTime;
});