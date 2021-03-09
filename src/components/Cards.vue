<script>
export default {
  props: {
    movies: {
      type: Object,
      default: () => ([]),
    },
    currentMovieCover: {
      type: String,
      default: '',
    },
    isCartOpen: {
      type: Boolean,
      default: false,
    },
    isArrowLeftVisible: {
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
    toggleLeftArrow: {
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
    return {
      props,
    };
  },
};
</script>

<template>
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

  <div
    class="moving-cover"
    :style="getCoverStyle(currentMovieCover)"
    v-show="currentMovieCover"
  ></div>

  <button class="arrow-left" v-show="isArrowLeftVisible" @click="moveToTop">
    ←
  </button>
</template>

<style lang="sass" scoped>
$orange: #f95e5e
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
  // animation-delay: 0.5s // TODO:
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

.moving-cover
  position: fixed
  right: 50px
  top: 50px
  width: 50px
  height: 70px
  background-color: #fff
  opacity: 0

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
