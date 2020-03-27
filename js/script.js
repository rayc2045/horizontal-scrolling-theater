let vm = new Vue({
	el: '#app',
	data: {
		movies: [],
		cart: [],
		currentMovie: null,
		cartOpen: false,
		arrowLeftShow: false
	},
	created() {
		axios
			.get('https://raw.githubusercontent.com/raychang2017/f2e-portfolio/master/13%20-%20%E7%94%A8%20Vue%20%E5%92%8C%20API%20%E5%81%9A%E4%B8%80%E5%80%8B%E6%A9%AB%E5%90%91%E6%8D%B2%E5%8B%95%E9%9B%BB%E5%BD%B1%E8%B3%BC%E7%89%A9%E9%A0%81%E9%9D%A2/data/movie.json')
			.then((res) => {
				this.movies = res.data;
				console.log(`電影總計 ${this.movies.length} 部`);
			})
			.catch();
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
			// console.log(e.delta);
			// document.querySelector('.movie').scrollLeft -= e.delta * 30;
			
			// 將滑鼠滾動距離作為卡片偏移
			TweenMax.to('.cards', 0.6, {
				left: '+=' + e.deltaY * 1.5 + 'px'
			});

			this.showOrHideLeftArrow();
		},
		showOrHideLeftArrow() {
			const cardsElLeft = document.querySelector('.cards').style.left.replace('px', '');
			// console.log(cardsElLeft);
			if (cardsElLeft < -800) return this.arrowLeftShow = true;
			this.arrowLeftShow = false ;
		},
		moveToTop() {
			// window.scrollTo(0,0);
			// return false;
			
			TweenMax.to('.cards', 0.6, {
				left: 0
			});

			setTimeout(() => {
				this.showOrHideLeftArrow();
			}, 500)
		},
		// 縮短文本
		truncate(str, maxLength) {
			return (str.length > maxLength) ? str.slice(0, maxLength - 1) + ' ...' : str;
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
		addToCart(movie, e) {
			this.currentMovie = movie;

			// After Vue's component being updated, then begin Vue animation
			this.$nextTick(() => {
				TweenMax.from('.moving-cover', 0.8, {
					left: $(e.target).offset().left,
					top: $(e.target).offset().top,
					opacity: 1,
					ease: Power1.easeOut
				})
				
				setTimeout(() => {
					this.cart.push(movie);
				}, 600)
			})
		}
	},
	computed: {
		totalPrice() {
			return this.cart
				.map(movie => movie.price)
				.reduce((total, current) => total + current, 0)
		}
	},
	watch: {
		cart() {
			TweenMax.from('.cart', 0.3, {
				scale: 0.8
			})
		}
	}
});
