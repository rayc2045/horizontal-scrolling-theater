<script>
import { onMounted, ref } from 'vue';
export default {
  props: {
    isTouchDevice: {
      type: Boolean,
      default: false,
    },
    movies: {
      type: Object,
      default: () => [],
    },
    currentMovieCover: {
      type: String,
      default: '',
    },
    isCartOpen: {
      type: Boolean,
      default: false,
    },
    getCoverStyle: {
      type: Function,
      default: () => {},
    },
    horizontalScroll: {
      type: Function,
      default: () => {},
    },
    adjustCardsPos: {
      type: Function,
      default: () => {},
    },
    moveToTop: {
      type: Function,
      default: () => {},
    },
    addToCart: {
      type: Function,
      default: () => {},
    },
    truncate: {
      type: Function,
      default: () => {},
    },
    thousandFormat: {
      type: Function,
      default: () => {},
    },
  },
  setup(props) {
    const cardsElement = ref(null);

    onMounted(() => {
      const cardsEl = cardsElement.value;
      cardsEl.classList.add('demo');
      setTimeout(() => cardsEl.classList.remove('demo'), 2500);
    });

    return {
      props,
      cardsElement,
    };
  },
};
</script>

<template>
  <section class="movie" @wheel.prevent="props.horizontalScroll($event)">
    <section
      :class="['cards', { cartOpen: props.isCartOpen }]"
      ref="cardsElement"
    >
      <article
        :class="['card', { hoverInteraction: !props.isTouchDevice }]"
        v-for="(movie, idx) in props.movies.data"
        :key="movie.name"
      >
        <div class="card-left">
          <div class="cover" :style="props.getCoverStyle(movie.cover)"></div>
        </div>
        <div class="card-right">
          <h2 class="name">{{ movie.name }}</h2>
          <h4 class="genre">{{ movie.genre }}</h4>
          <p class="description">{{ props.truncate(movie.description, 95) }}</p>
          <div class="price">$ {{ props.thousandFormat(movie.price) }}</div>
          <button
            :class="['add', { inCart: movie.isInCart }]"
            @click="props.addToCart(movie, idx, $event)"
          >
            {{ movie.isInCart ? '已在購物車' : '加入購物車' }}
          </button>
        </div>
      </article>
    </section>
  </section>

  <div
    class="moving-cover"
    :style="props.getCoverStyle(currentMovieCover)"
    v-show="props.currentMovieCover"
  ></div>
</template>

<style lang="sass" scoped>
$orange: #f95e5e
$mediumGrey: #bbb
$grey: #888
$darkGrey: #444
$black: #111
$coverShadow: 0 5px 25px 5px rgba(black, 0.2) // x, y, blur-radius, spread-radius, color
$transitionTime: 0.5s

.movie
  height: 100%

.cards
  padding: 0 20%
  height: 100%
  display: flex
  align-items: center
  transition: $transitionTime, left 0s
  position: relative // Change left to horizontally scroll
  &.demo
    animation: demoScroll 2.5s ease-out
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
  &.hoverInteraction
    &:hover
      transform: translateY(5px)
      .cover
        transform: translateY(-15px)
    button
      &:hover
        color: white
        background-color: $orange
      &.inCart
        background-color: $grey
        cursor: default
  @media screen and (max-width: 767px) and (orientation: landscape) // < 768
    margin: 0
    transform: translateY(15%) scale(0.8)
    &.hoverInteraction:hover
      transform: translateY(5px) scale(0.8)
  @media screen and (min-width: 1281px) // > 1280
    margin: 0 110px
    transform: translateY(15%) scale(1.1)
    &.hoverInteraction:hover
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
    // &:hover // .card.hoverInteraction button:hover
    &.inCart
      background-color: $grey
      cursor: default

.moving-cover
  position: fixed
  right: 50px
  top: 50px
  width: 50px
  height: 70px
  opacity: 0
</style>
