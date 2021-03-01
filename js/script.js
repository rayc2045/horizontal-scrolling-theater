let vm = new Vue({
	el: '#app',
	data: {
		movies: [],
		cart: [],
		currentMovie: null,
		cartOpen: false,
		cartIcon: 'cart-outline',
		addingToCartBlock: false,
		arrowLeftShow: false
	},
	created() {
		axios
			.get(
				'https://raw.githubusercontent.com/rayc2045/horizontal-scrolling-theater/master/src/assets/data/movie.json'
			)
			.then((res) => {
				this.movies = res.data;
				console.log(`電影總計 ${this.movies.length} 部`);
			})
			.catch((err) => {
				console.log(err);
			});
	},
	methods: {
		getBackgroundSetting(url) {
			return {
				'background-image': `url(${url})`,
				'background-position': 'center center',
				'background-size': 'cover'
			};
		},
		scroll(e) {
			// console.log(e)
			// console.log(e.deltaY);
			// document.querySelector('.movie').scrollLeft -= e.delta * 30;

			// 將滑鼠滾動距離作為卡片偏移
			TweenMax.to('.cards', 0.6, {
				left: '+=' + e.deltaY * 1.5 + 'px'
			});

			this.showOrHideLeftArrow();
			this.backToTopOrLast();
		},
		showOrHideLeftArrow() {
			const cardsElLeft = document.querySelector('.cards').style.left.replace('px', '');
			// console.log(cardsElLeft);
			if (cardsElLeft < -800) return (this.arrowLeftShow = true);
			this.arrowLeftShow = false;
		},
		backToTopOrLast() {
			const cardsEl = document.querySelector('.cards');
			const cardsElLeft = cardsEl.style.left.replace('px', '');
			const scrollProgress = Math.round(-cardsElLeft / cardsEl.scrollWidth * 100) / 100 * 100 + '%';

			if (cardsElLeft > 0) {
				TweenMax.to('.cards', 0.6, {
					left: 0
				});
			}

			// console.log(cardsEl.scrollWidth - -cardsElLeft);
			// console.log(scrollProgress);

			if (cardsElLeft < -cardsEl.scrollWidth + 585) {
				TweenMax.to('.cards', 0.6, {
					left: -cardsEl.scrollWidth + 585
				});
			}
		},
		moveToTop() {
			// window.scrollTo(0,0);
			// return false;

			TweenMax.to('.cards', 0.6, {
				left: 0
			});

			setTimeout(() => {
				this.showOrHideLeftArrow();
			}, 500);
		},
		cartToggle() {
			this.cartOpen = !this.cartOpen;
			
			if (this.cartOpen) {
				this.cartIcon = 'cart';
				this.arrowLeftShow = false;
			} else {
				this.cartIcon = 'cart-outline';
				this.arrowLeftShow = true;
			}
		},
		addToCart(movie, e) {
			if (this.addingToCartBlock) return;

			this.addingToCartBlock = true;
			this.currentMovie = movie;

			// After Vue's component being updated, then start Vue animation
			this.$nextTick(() => {
				TweenMax.from('.moving-cover', 0.8, {
					left: $(e.target).offset().left,
					top: $(e.target).offset().top,
					opacity: 1,
					ease: Power1.easeOut
				});

				setTimeout(() => {
					this.cart.push(movie);
				}, 600);

				setTimeout(() => {
					this.addingToCartBlock = false;
				}, 1000);
			});
		},
		// 縮短文本
		truncate(str, maxLength) {
			return str.length > maxLength ? str.slice(0, maxLength - 1) + ' ...' : str;
		},
		thousandFormat(num) {
			num += '';
			if (!num.includes('.')) num += '.';
			return num
				.replace(/(\d)(?=(\d{3})+\.)/g, function($0, $1) {
					return $1 + ',';
				})
				.replace(/\.$/, '');
			// return (num).toLocaleString('en-US'); // 導致小數點後只被保留三位
		},
		organizeDataDuplicatedObject() {
			
		}
	},
	computed: {
		totalPrice() {
			return this.cart.map((movie) => movie.price).reduce((total, current) => total + current, 0);
		}
	},
	watch: {
		cart() {
			TweenMax.from('.cart-icon', 0.3, {
				scale: 0.8
			});
		}
	}
});
