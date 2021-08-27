<script>
import Cards from '@/components/Cards';
import CartPage from '@/components/CartPage';
import { onMounted, watch } from 'vue';
import { gsap } from 'gsap';
import {
  isTouchDevice,
  cart,
  isCartOpen,
  isArrowLeftVisible,
  totalPrice,
  findInCart,
  moveToTop,
  toggleCartPage,
} from '@/services/index';

export default {
  name: 'App',
  components: {
    Cards,
    CartPage,
  },
  setup() {
    onMounted(() => {
      if (!isTouchDevice)
        document.querySelector('#app').classList.add('touch-device');
        // console.log(`電影總計 ${movies.data.length} 部`);
        findInCart();
    });

    watch(cart.data, () => {
      gsap.from('.cart', {
        duration: 0.3,
        scale: 0.8,
      });
    });

    return {
      cart,
      isCartOpen,
      isArrowLeftVisible,
      totalPrice,
      moveToTop,
      toggleCartPage,
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

  <button
    v-show="isArrowLeftVisible"
    class="arrow-left"
    @click="moveToTop"
  >
    ←
  </button>

  <Cards />

  <CartPage :totalPrice="totalPrice" />
</template>

<style lang="sass">
@import '@/assets/style.sass'

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
