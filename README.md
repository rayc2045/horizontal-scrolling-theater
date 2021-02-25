# Horizontal Scrolling Theater with Vue.js

[![Photo](https://raw.githubusercontent.com/rayc2045/f2e-portfolio/master/13%20-%20%E7%94%A8%20Vue%20%E5%92%8C%20API%20%E5%81%9A%E4%B8%80%E5%80%8B%E6%A9%AB%E5%90%91%E6%8D%B2%E5%8B%95%E9%9B%BB%E5%BD%B1%E8%B3%BC%E7%89%A9%E9%A0%81%E9%9D%A2/img/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%202020-03-27%20%E4%B8%8B%E5%8D%888.35.08.png)](https://dribbble.com/raychangdesign)
[![Photo](https://raw.githubusercontent.com/rayc2045/f2e-portfolio/master/13%20-%20%E7%94%A8%20Vue%20%E5%92%8C%20API%20%E5%81%9A%E4%B8%80%E5%80%8B%E6%A9%AB%E5%90%91%E6%8D%B2%E5%8B%95%E9%9B%BB%E5%BD%B1%E8%B3%BC%E7%89%A9%E9%A0%81%E9%9D%A2/img/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%202020-03-27%20%E4%B8%8B%E5%8D%888.36.11.png)](https://dribbble.com/raychangdesign)
[![Photo](https://raw.githubusercontent.com/rayc2045/f2e-portfolio/master/13%20-%20%E7%94%A8%20Vue%20%E5%92%8C%20API%20%E5%81%9A%E4%B8%80%E5%80%8B%E6%A9%AB%E5%90%91%E6%8D%B2%E5%8B%95%E9%9B%BB%E5%BD%B1%E8%B3%BC%E7%89%A9%E9%A0%81%E9%9D%A2/img/%E8%9E%A2%E5%B9%95%E5%BF%AB%E7%85%A7%202020-03-29%20%E4%B8%8B%E5%8D%884.42.17.png)](https://dribbble.com/raychangdesign)

> 以前就想過要做一個電影購物頁面，這次使用 Vue、TweenMax，並結合將自己收藏的 40 部藍光電影所做成的 API，做出不同以往的橫向捲動頁面。值得分享的是，為了做出購物車在沒有商品的情況下撐滿頁面並置中、另外可在多個商品高度超過可見頁面時再變為可捲動的排版，過程中使用了各種排版方法，也查了許多資料，花了兩個小時都沒有成功，最後才發現 CSS 的 `min-height` 拼錯了字...

- 使用預處理器 Sass 撰寫 CSS，使用 Vue 做網頁架構
- 將自己收藏的 40 部藍光電影製作成 API json 檔，並透過 axios 做非同步資料請求
- 使用 JS `str.slice()` 縮減電影描述至 95 字
- 電影卡片使用淺灰底色，持久凝視不眩光
- 開頭加入 CSS `@keyframes` 捲動提示動畫，並使用 `transform` 屬性做出滑鼠碰觸電影卡片時的上移互動效果，讓使用體驗更加順暢
- 使用 Vue `@wheel` 事件，及借助 [GSAP TweenMax](https://greensock.com/tweenmax/) 之力，實現橫向捲軸電影頁面，以及將商品加入購物車的動畫
- 使用 Vue `watch` 偵測購物車元素，當加入商品至購物車時，觸發 icon 縮小 20% 的互動效果
- 抓取頁面位置並利用增減 HTML 元素的 Class，做出「回到最前」互動按鈕
- [線上版](https://rayc2045.github.io/horizontal-scrolling-theater/) / [CodePen 連結](https://codepen.io/rayc2045/full/OJVrMqJ)