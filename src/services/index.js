import movieData from '@/data/movie.json';
import { computed, nextTick, reactive, ref } from 'vue';
import { gsap, Power1 } from 'gsap';

const isTouchDevice = 'ontouchstart' in document.documentElement;
const isSmallSize = document.body.getBoundingClientRect().width < 768;
const movies = reactive({ data: movieData });
const cart = reactive({ data: [] });
const currentMovieCover = ref('');
const isCartOpen = ref(false);
const isArrowLeftVisible = ref(false);
let timer = null;
let isAddingToCart = false;
let isRemovingFromCart = false;
const totalPrice = computed(() =>
  cart.data
    .map((movie) => movie.price)
    .reduce((total, current) => total + current, 0)
);

function findInCart() {
  for (const i in movies.data) {
    for (const j in cart.data) {
      if (movies.data[i].name === cart.data[j].name)
        movies.data[i].isInCart = true;
    }
  }
}

function getCoverStyle(url) {
  return {
    'background-image': `url(${url})`,
    'background-position': 'center center',
    'background-size': 'cover',
  };
}

function horizontalScroll(e) {
  const cardsEl = document.querySelector('.cards');
  if (cardsEl.classList.contains('demo')) return;

  if (!isTouchDevice) {
    gsap.to('.cards', {
      duration: 0.6,
      left: `+=${e.deltaY * 1.5}px`,
    });

    toggleLeftArrow();
    adjustCardsPos();

    setTimeout(() => {
      adjustCardsPos();
      setTimeout(adjustCardsPos, 200);
    }, 200);
  }
}

function adjustCardsPos() {
  const cardsEl = document.querySelector('.cards');
  const cardsLeft = cardsEl.getBoundingClientRect().left;
  const cardWidth = document.querySelector('.card').getBoundingClientRect()
    .width;
  // const progress = Math.round(-cardsElLeft / cardsEl.scrollWidth * 100) / 100 * 100 + '%';
  const [begining, end] = [0, -cardsEl.scrollWidth + cardWidth * 2.5];
  // console.log(`${begining} | ${cardsLeft} | ${end}`);
  if (begining > cardsLeft && cardsLeft > end) return;

  if (cardsLeft > begining) {
    gsap.to('.cards', {
      duration: 0.6,
      left: begining,
    });
  }

  if (cardsLeft < end) {
    gsap.to('.cards', {
      duration: 0.6,
      left: end,
    });
  }
}

function toggleLeftArrow() {
  if (isCartOpen.value) return (isArrowLeftVisible.value = false);

  const cardsLeft = document.querySelector('.cards').getBoundingClientRect()
    .left;

  if (cardsLeft < -800) return (isArrowLeftVisible.value = true);
  return (isArrowLeftVisible.value = false);
}

function moveToTop() {
  gsap.to('.cards', {
    duration: 0.6,
    left: 0,
  });

  setTimeout(() => (isArrowLeftVisible.value = false), 600);
}

function toggleCartPage() {
  if (timer) clearTimeout(timer);
  isCartOpen.value = !isCartOpen.value;
  toggleLeftArrow();
  closeCartPageIfNothingInCart(1.6);
}

function closeCartPageIfNothingInCart(sec) {
  if (!cart.data.length) {
    timer = setTimeout(() => {
      isCartOpen.value = false;
      toggleLeftArrow();
    }, sec * 1000);
  }
}

function addToCart(movie, idx, e) {
  if (isAddingToCart || movies.data[idx].isInCart) return;
  isAddingToCart = true;
  currentMovieCover.value = movie.cover;

  // Do after DOM element refreshing
  nextTick(() => {
    const coverEl = e.target
      .closest('.card-right')
      .previousSibling.querySelector('.cover');

    gsap.from('.moving-cover', {
      duration: 0.8,
      // getBoundingClientRect() vs offset:
      // In case of transforms, the offsetWidth and offsetHeight returns the element's layout width and height, while getBoundingClientRect() returns the rendering width and height. As an example, if the element has width: 100px; and transform: scale(0.5); the getBoundingClientRect() will return 50 as the width, while offsetWidth will return 100.
      left: coverEl.getBoundingClientRect().left,
      top: coverEl.getBoundingClientRect().top,
      width: coverEl.getBoundingClientRect().width * 0.6,
      height: coverEl.getBoundingClientRect().height * 0.6,
      opacity: 1,
      ease: Power1.easeOut,
    });

    setTimeout(() => {
      if (timer) clearTimeout(timer);
      cart.data.push(movie);
      movies.data[idx].isInCart = true;
      setTimeout(() => (isAddingToCart = false), 500);
    }, 800);
  });
}

function removeFromCart(idx) {
  if (isRemovingFromCart) return;
  isRemovingFromCart = true;

  movies.data.find(
    (movie) => movie.name === cart.data[idx].name
  ).isInCart = false;

  cart.data.splice(idx, 1);
  setTimeout(() => (isRemovingFromCart = false), 300);
  closeCartPageIfNothingInCart(1.6);
}

function truncate(str, maxLength) {
  return str.length > maxLength ? `${str.slice(0, maxLength - 1)}...` : str;
}

function thousandFormat(num) {
  const parts = num.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

export {
  isTouchDevice,
  isSmallSize,
  movies,
  cart,
  currentMovieCover,
  isCartOpen,
  isArrowLeftVisible,
  totalPrice,
  findInCart,
  getCoverStyle,
  horizontalScroll,
  moveToTop,
  toggleCartPage,
  addToCart,
  removeFromCart,
  truncate,
  thousandFormat,
};