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
      // Синяя активна: жёлтая под красной, синяя сдвигается вправо
      document.querySelector('.card-one').classList.add('under');
      document.querySelector('.card-two').classList.add('middle');
    } else if (card.classList.contains('card-two')) {
      // Красная активна: жёлтая и синяя под
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