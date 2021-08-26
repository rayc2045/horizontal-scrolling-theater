# Horizontal Scrolling Theater

<!-- [![Photo](https://cdn.dribbble.com/users/3800131/screenshots/15248388/media/f16a9eeb6cf47b6c49cd5bf0af2150c2.png)](https://dribbble.com/raychangdesign) -->
![Photo](https://cdn.dribbble.com/users/3800131/screenshots/15248422/media/0c99f9e93cfb27b6d6c3bde349bd81df.png)
![Photo](https://cdn.dribbble.com/users/3800131/screenshots/15248445/media/ae8d01470a0c24e09cd7c2fb58bc1289.png)

[> Horizontal Scrolling Theater](https://vuejs-theater.netlify.app/)

### 簡介
以前就想過要做一個展示電影的頁面，這次使用 Vue 3 搭配 GSAP，並結合自己收藏的 46 部藍光電影所做成的 API 做串接，達成能夠橫向捲動的電影購物頁面。實作上，除了藉由 CSS 屬性 `relative` 搭配 GSAP 來調整元素的 `left` 值來實現橫向捲動的功能，另外在點擊「加入購物車」按鈕時，透過抓取當下電影封面位置和設計移動軌跡，做出漂亮的放入購物車動畫，以及使用 Vue 的 `watch` API 監視購物車資料，從購物車新增或移除電影時，加上購物車圖示縮小 20% 的反饋；這些在開發過程中不斷優化的互動效果，在最後整合到一起時，產生了驚艷的使用體驗。

### 外觀與互動設計
- 加入水平捲動功能，並在載入網頁時以動畫展示作為操作提示
- 使用淺灰色作為電影卡片底色，持久凝視不眩光
- 對電影標題、分類和敘述分別套用不同的文字大小、字重 (font weight) 和顏色，做出視覺層次 (visual hierarchy)
- 在電影卡片封面外加上微陰影，並在鼠標碰觸卡片時，對卡片本身和卡片封面做出不同的上移距離，達到微 3D 效果
- 將電影加入到購物車時呈現過場動畫，以及對按鈕套用「已加入購物車」的內容和樣式，讓使用體驗更加直覺順暢
- 使用 [ionicons](https://ionicons.com/) 的購物車 icon，並且在開、關購物車頁面時，切換線條或填充的版本；以及在購物車加入或移除電影時，觸發購物車 icon 縮小 20% 的互動效果
- 從購物車加入或移除電影時，對總金額數字做實時加總的跳動效果
- 開啟購物車時，虛化、暗化背景，添加層次和立體感；而在購物車為空時，另外加上倒數計時器，1.6 秒後自動回到主畫面

### 開發紀錄
- 將自己收藏的 46 部藍光電影製作成 JSON [API](https://raw.githubusercontent.com/rayc2045/horizontal-scrolling-theater/master/src/data/movie.json)
- 使用更安全的套件管理系統 [pnpm](https://pnpm.io/) 取代 npm，避免套件依賴所造成的安全漏洞 (security vulnerabilities)
- 使用基於 Webpack 的 [Vue CLI](https://cli.vuejs.org/) 做零配置原型建構，以更加優雅的 [Composition API](https://v3.vuejs.org/guide/composition-api-introduction.html#why-composition-api) 作為程式撰寫方式；以及透過分拆 Components 進行模組化開發，並使用 `props` 達成跨組件資料傳遞與 `emits` 達成跨組件溝通
- 引入 [normalize.css](https://github.com/necolas/normalize.css/) 達到跨瀏覽器的樣式重置、使用預處理器 Sass 開發外觀，以及透過 [Scoped CSS](https://vue-loader.vuejs.org/guide/scoped-css.html#mixing-local-and-global-styles) 達到互不干擾的樣式封裝
- 將鼠標碰觸互動效果以觸控設備為條件做分離，優化不同裝置上的使用體驗
- 使用 Vue 的 `watch` API 監視金額加總，和結合 [`window.requestAnimationFrame()`](https://developer.mozilla.org/zh-TW/docs/Web/API/window/requestAnimationFrame) 方法，達成在新增或移除電影時，做出實時金額加總的功能 (跳動數字)
- 借助 [GSAP](https://greensock.com/gsap/) 之力
  - 加上綁定捲動事件和設定元素 `relative` 定位，透過改變 `left` 值實現橫向捲動功能
  - 透過點擊「加入購物車」按鈕後，取得當下電影封面位置和設計移動軌跡，達成漂亮的加入購物車動畫
  - 使用 Vue 的 `watch` API 監視購物車資料，從購物車新增或移除電影、導致資料更新時，觸發購物車 icon 縮小 20% 的互動效果
- 在加入電影到購物車、從購物車移除電影時，使用變數作為開關，阻擋 GSAP 動畫期間的複數操作，確保互動效果始終如期運行
- 使用 [Netlify](https://www.netlify.com/) 部署網站