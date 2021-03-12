<script>
import Cards from '@/components/Cards';
import CartPage from '@/components/CartPage';
import axios from 'axios';
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue';
import { gsap, Power1 } from 'gsap';

export default {
  name: 'App',
  components: {
    Cards,
    CartPage,
  },
  setup() {
    const isTouchDevice = ref('ontouchstart' in document.documentElement);
    const isSmallSize = ref(document.body.getBoundingClientRect().width < 768);
    const movies = reactive({ data: [] });
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

    // () => cart.data.length
    watch(cart.data, () => {
      gsap.from('.cart', {
        duration: 0.3,
        scale: 0.8,
      });
    });

    onMounted(() => {
      if (!isTouchDevice.value)
        document.querySelector('#app').classList.add('touch-device');

      axios
        .get(
          'https://raw.githubusercontent.com/rayc2045/horizontal-scrolling-theater/master/src/assets/data/movie.json'
        )
        .then((res) => {
          movies.data = res.data;
          // console.log(`電影總計 ${movies.data.length} 部`);
          findInCart();
        })
        .catch((err) => console.log(err));
    });

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

      if (!isTouchDevice.value) {
        gsap.to('.cards', {
          duration: 0.6,
          left: `+=${e.deltaY * 1.5}px`,
        });

        toggleLeftArrow();
        adjustCardsPos();
      }
    }

    function adjustCardsPos() {
      const cardsEl = document.querySelector('.cards');
      const cardsLeft = cardsEl.getBoundingClientRect().left;
      const cardWidth = document.querySelector('.card').getBoundingClientRect()
        .width;
      // const progress = Math.round(-cardsElLeft / cardsEl.scrollWidth * 100) / 100 * 100 + '%';

      if (cardsLeft > 0) {
        gsap.to('.cards', {
          duration: 0.6,
          left: 0,
        });
      }

      if (cardsLeft < -cardsEl.scrollWidth + cardWidth * 2.5) {
        gsap.to('.cards', {
          duration: 0.6,
          left: -cardsEl.scrollWidth + cardWidth * 2.5,
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

    return {
      isTouchDevice,
      isSmallSize,
      movies,
      cart,
      currentMovieCover,
      isCartOpen,
      isArrowLeftVisible,
      totalPrice,
      getCoverStyle,
      horizontalScroll,
      adjustCardsPos,
      moveToTop,
      toggleCartPage,
      addToCart,
      removeFromCart,
      truncate,
      thousandFormat,
    };
  },
};
</script>

<template>
  <h1 class="title">Vue.js Theater</h1>

  <div class="cart" @click="toggleCartPage">
    <svg
      v-show="!isCartOpen"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
    >
      <title>Cart</title>
      <circle
        cx="176"
        cy="416"
        r="16"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="32"
      />
      <circle
        cx="400"
        cy="416"
        r="16"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="32"
      />
      <path
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="32"
        d="M48 80h64l48 272h256"
      />
      <path
        d="M160 288h249.44a8 8 0 007.85-6.43l28.8-144a8 8 0 00-7.85-9.57H128"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="32"
      />
    </svg>
    <svg
      v-show="isCartOpen"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
    >
      <title>Cart</title>
      <circle cx="176" cy="416" r="32" />
      <circle cx="400" cy="416" r="32" />
      <path
        d="M456.8 120.78a23.92 23.92 0 00-18.56-8.78H133.89l-6.13-34.78A16 16 0 00112 64H48a16 16 0 000 32h50.58l45.66 258.78A16 16 0 00160 368h256a16 16 0 000-32H173.42l-5.64-32h241.66A24.07 24.07 0 00433 284.71l28.8-144a24 24 0 00-5-19.93z"
      />
    </svg>
    <span>{{ cart.data.length }}</span>
  </div>

  <button v-show="isArrowLeftVisible" class="arrow-left" @click="moveToTop">
    ←
  </button>

  <cards
    :isTouchDevice="isTouchDevice"
    :movies="movies"
    :currentMovieCover="currentMovieCover"
    :isCartOpen="isCartOpen"
    :getCoverStyle="getCoverStyle"
    :horizontalScroll="horizontalScroll"
    :adjustCardsPos="adjustCardsPos"
    :moveToTop="moveToTop"
    :addToCart="addToCart"
    :truncate="truncate"
    :thousandFormat="thousandFormat"
  />

  <cartPage
    :isTouchDevice="isTouchDevice"
    :isSmallSize="isSmallSize"
    :cart="cart"
    :isCartOpen="isCartOpen"
    :totalPrice="totalPrice"
    :getCoverStyle="getCoverStyle"
    :removeFromCart="removeFromCart"
    :thousandFormat="thousandFormat"
  />
</template>

<style lang="sass">
@import url('https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css')
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap')

$orange: #f95e5e
$lightGrey: #eee
$mediumGrey: #bbb
$grey: #888
$darkGrey: #444
$black: #111
$transitionTime: 0.5s

@keyframes demoScroll
  0%
    left: -250px
  100%
    left: 0

::-webkit-scrollbar
  width: 8px
::-webkit-scrollbar-track // Track
  background-color: transparent
::-webkit-scrollbar-thumb // Handle
  background-color: $darkGrey

*
  margin: 0
  padding: 0
  box-sizing: border-box
  outline: none
  appearance: none
  user-select: none

html, body
  height: 100vh
  font-family: 'Roboto', sans-serif
  scroll-behavior: smooth

#app
  height: 100%
  overflow-y: hidden
  background-color: $black
  position: relative
  &.touch-device
    overflow: hidden

.title
  margin: 0
  position: fixed
  left: 50px
  top: 50px
  color: white
  font-size: 32px
  font-weight: bold
  pointer-events: none
  @media screen and (max-width: 767px) // < 768
    font-size: 28px

.cart
  position: fixed
  right: 50px
  top: 50px
  display: flex
  align-items: center
  z-index: 999
  color: white
  opacity: 0.7
  cursor: pointer
  transition: opacity $transitionTime
  &:hover
    opacity: 1
  svg
    margin-right: 10px
    width: 35px
    fill: white
  span
    font-size: 20px

.arrow-left
  width: 45px
  height: 45px
  position: fixed
  right: 50px
  bottom: 50px
  font-size: 26px
  color: $mediumGrey
  background-color: transparent
  border-radius: 50%
  border: none
  cursor: pointer
  transition: color $transitionTime, background-color $transitionTime
  &:hover
    color: $black
    background-color: $mediumGrey
</style>
