<script>
import axios from 'axios';
import { gsap, Power1 } from 'gsap';
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue';
export default {
  setup() {
    const isTouchDevice = ref('ontouchstart' in document.documentElement);
    const movies = reactive({ data: [] });
    const cart = reactive({ data: [] });
    const currentMovieCover = ref('');
    const isCartOpen = ref(false);
    let timer = null;
    const isArrowLeftVisible = ref(false);
    const isAddingToCart = ref(false);
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
      axios
        .get(
          'https://raw.githubusercontent.com/rayc2045/horizontal-scrolling-theater/master/src/assets/data/movie.json'
        )
        .then((res) => {
          movies.data = res.data;
          movies.data.forEach((movie) => (movie.isInCart = false));
          // console.log(`電影總計 ${movies.data.length} 部`);
        })
        .catch((err) => console.log(err));
    });

    function getCoverStyle(url) {
      return {
        'background-image': `url(${url})`,
        'background-position': 'center center',
        'background-size': 'cover',
      };
    }

    function horizontalScroll(e) {
      gsap.to('.cards', {
        duration: 0.6,
        left: `+=${e.deltaY * 1.5}px`,
      });

      toggleLeftArrow();
      adjustCardsPos();
    }

    function adjustCardsPos() {
      const cardsEl = document.querySelector('.cards');
      const cardsLeft = cardsEl.style.left.replace('px', '');
      const cardWidth = document.querySelector('.card').getBoundingClientRect()
        .width;
      // const progress = Math.round(-cardsElLeft / cardsEl.scrollWidth * 100) / 100 * 100 + '%';

      if (cardsLeft > 0) {
        gsap.to('.cards', {
          duration: 0.6,
          left: 0,
        });
      }

      if (cardsLeft < -cardsEl.scrollWidth + cardWidth * 1.8) {
        gsap.to('.cards', {
          duration: 0.6,
          left: -cardsEl.scrollWidth + cardWidth * 1.8,
        });
      }
    }

    function toggleLeftArrow() {
      if (isCartOpen.value) return (isArrowLeftVisible.value = false);

      const cardsLeft = document
        .querySelector('.cards')
        .style.left.replace('px', '');

      if (cardsLeft < -800) return (isArrowLeftVisible.value = true);
      return (isArrowLeftVisible.value = false);
    }

    function moveToTop() {
      gsap.to('.cards', {
        duration: 0.6,
        left: 0,
      });

      setTimeout(() => toggleLeftArrow(), 500);
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
      if (isAddingToCart.value || movies.data[idx].isInCart) return;
      isAddingToCart.value = true;
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
          setTimeout(() => (isAddingToCart.value = false), 500);
        }, 800);
      });
    }

    function removeFromCart(idx) {
      movies.data.find(
        (movie) => movie.name === cart.data[idx].name
      ).isInCart = false;

      cart.data.splice(idx, 1);
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
      movies,
      cart,
      currentMovieCover,
      isCartOpen,
      isArrowLeftVisible,
      isAddingToCart,
      totalPrice,
      getCoverStyle,
      horizontalScroll,
      adjustCardsPos,
      toggleLeftArrow,
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
  <section
    v-if="isTouchDevice"
    style="width: 100vw; height: 100vh; position: fixed; z-index: 9999; display: flex; justify-content: center; align-items: center; color: #eee; background-color: #222"
  >
    網頁不適合透過行動裝置瀏覽喔 : (
  </section>
  <h1 class="title">Vue.js Theater</h1>
  <section class="movie" @wheel.prevent="horizontalScroll">
    <section class="cards" :class="{ cartOpen: isCartOpen }">
      <article
        class="card"
        v-for="(movie, idx) in movies.data"
        :key="movie.name"
      >
        <div class="card-left">
          <div class="cover" :style="getCoverStyle(movie.cover)"></div>
        </div>
        <div class="card-right">
          <h2 class="name">{{ movie.name }}</h2>
          <h4 class="genre">{{ movie.genre }}</h4>
          <p class="description">{{ truncate(movie.description, 95) }}</p>
          <div class="price">$ {{ thousandFormat(movie.price) }}</div>
          <button
            :class="['add', { inCart: movie.isInCart }]"
            @click="addToCart(movie, idx, $event)"
          >
            {{ movie.isInCart ? '已在購物車' : '加入購物車' }}
          </button>
        </div>
      </article>
    </section>
  </section>

  <button class="arrow-left" v-show="isArrowLeftVisible" @click="moveToTop">
    ←
  </button>

  <div
    class="moving-cover"
    :style="getCoverStyle(currentMovieCover)"
    v-show="currentMovieCover"
  ></div>

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

  <section class="cart-page" :class="{ cartOpen: isCartOpen }">
    <h3 class="message" v-if="!cart.data.length">
      你還沒將任何電影加入購物車喔 : (
    </h3>
    <section v-if="cart.data.length" class="panel">
      <h2>電影購物車</h2>
      <ul>
        <li v-for="(movie, idx) in cart.data" :key="movie.name">
          <div class="remove" @click="removeFromCart(idx)">✕</div>
          <div class="thumbnail" :style="getCoverStyle(movie.cover)"></div>
          <h3 class="name">
            {{ movie.name }}（{{ movie.genre.replaceAll('、', ' / ') }}）
          </h3>
          <h3 class="price">$ {{ thousandFormat(movie.price) }}</h3>
        </li>
      </ul>
      <hr v-if="cart.data.length" />
      <h2 class="total-price" v-if="cart.data.length">
        總計 $ {{ thousandFormat(totalPrice) }}
      </h2>
    </section>
  </section>
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
$coverShadow: 0 5px 25px 5px rgba(black, 0.2) // x, y, blur-radius, spread-radius, color
$transitionTime: 0.5s

@keyframes demoScrolling
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
  height: 100%
  font-family: 'Roboto', sans-serif
  scroll-behavior: smooth
  overflow: hidden

#app
  width: 100%
  height: 100%
  background: $black
  position: relative

.title
  margin: 0
  position: fixed
  left: 50px
  top: 50px
  color: white
  font-size: 32px
  font-weight: bold
  pointer-events: none

.movie
  width: 100%
  height: 100%
  position: fixed
  left: 50%
  top: 50%
  transform: translate(-50%, -50%)

.cards
  margin-left: 20%
  height: 100%
  display: flex
  align-items: center
  transition: $transitionTime, left 0s
  animation: demoScrolling 2s ease-out
  animation-delay: 0.5s
  position: relative
  &.cartOpen
    filter: blur(10px)

.card
  margin: 0 80px
  padding: 20px 20px
  width: 484px
  display: inline-flex
  flex-shrink: 0
  background-color: rgba(white, 0.9)
  border-radius: 5px
  transform: translateY(15%)
  transition: $transitionTime
  &:hover
    transform: translateY(5px)
    .cover
      transform: translateY(-15px)
  @media screen and (min-width: 1281px)
    margin: 0 110px
    transform: translateY(15%) scale(1.1)
    &:hover
      transform: translateY(5px) scale(1.1)

.card-left
  // flex: 1
  .cover
    margin-top: -50px
    width: 198px
    height: 264px
    border-radius: 5px
    box-shadow: $coverShadow
    transition: $transitionTime

.card-right
  // flex: 2
  margin-left: 10px
  padding: 10px
  .name
    color: $darkGrey
  .genre
    margin: 14px 0
    font-weight: normal
    opacity: 0.8
  .description
    margin: 10px 0
    font-size: 13px
    letter-spacing: 0.2px
    line-height: 1.3
    color: $grey
    opacity: 0.8
  .price
    display: inline-block
    font-weight: 500
  button
    margin-left: 23px
    padding: 7px 10px
    font-size: 13px
    color: rgba(white, 0.9)
    background-color: $mediumGrey
    border: none
    border-radius: 50px
    cursor: pointer
    transition: background-color 0.8s
    &:hover
      color: white
      background-color: $orange
    &.inCart
      background-color: $grey
      cursor: default

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

.moving-cover, .cart
  position: fixed
  right: 50px
  top: 50px
.moving-cover
  width: 50px
  height: 70px
  background-color: #fff
  opacity: 0
.cart
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

.cart-page
  width: 100%
  height: 100%
  position: absolute
  display: flex
  justify-content: center
  align-items: center
  color: $lightGrey
  // background-image: linear-gradient(10deg, $black 0%, $black 50%, transparent 100%)
  background-color: rgba($black, 0.9)
  opacity: 0
  pointer-events: none
  transition: opacity $transitionTime
  &.cartOpen
    opacity: 1
    pointer-events: initial

.message
  color: $mediumGrey
  letter-spacing: 0.5px
  @media screen and (min-width: 1281px)
    transform: scale(1.1)

.panel
  width: 65%
  max-width: 1100px
  h2
    margin-bottom: 30px
  ul
    // Scrollable window
    max-height: 490px
    overflow: hidden auto
    li
      padding: 15px 0
      padding-right: 25px
      display: flex
      align-items: center
      opacity: 0.8
      border-radius: 5px
      transition: $transitionTime
      &:hover
        background-color: rgba(white, 0.1)
        transform: translateY(-5px)
        .remove
          opacity: 1
          cursor: pointer
      .remove
        margin: 0 10px
        display: flex
        justify-content: center
        align-items: center
        width: 25px
        height: 70px
        opacity: 0
        transition: $transitionTime
      .thumbnail
        margin-right: 20px
        width: 50px
        height: 70px
      .name
        font-size: 17px
        font-weight: normal
      .price
        margin-left: auto
  hr
    margin: 20px 0
  .total-price
    margin: 0
    padding-right: 25px
    text-align: right
  @media screen and (min-width: 1281px)
    transform: scale(1.1)
</style>
