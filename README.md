before-after-image-compare
==========================

compare 2 images in a box (with javascript &amp; scss).

goal: support to IE8+

[Demo page](http://rplus.github.io/before-after-image-compare/assets/)

0. pure html:  
    需要兩張圖皆出現
    .box > figure*2 > img

1. +css:  
    需要兩張圖皆完全出現 > img

2. +base-js:  
    兩張圖疊合，以滑鼠位置決定(水平或垂直)分割檢視的位置
    水平或垂直由 class: -h -v 決定
    (圖片疊合的 class 需由 js 加入)

3. 尚未確定要用哪一種方式處理斜角，兩個方式都是 IE9+ 才看的懂  
    分割檢視可使用角度，角度在 SASS 決定，JS再撈出角度/邊長比
    + **SVG**: (最後實作)  
        以 js 偵測到支援 SVG 後，動態置換原本 DIV 內容，  
        以滑鼠位置決定(水平或垂直)分割檢視的位置

    + css transform: (最一開始試作的方案)  
        以 js 偵測到支援 cssTransform 後，  
        以滑鼠位置決定(水平或垂直)分割檢視的位置

    + canvas:  
        與 SVG 作法差不多，也是偵測後置換

---
how to use:

--html

    .comparebox > figure * 2 > img

--scss

    /* here are some properties in scss to control the box style. */

--js

    var option = { // here tha values are the default values of option

            // required, get dom element[0]
            target: document.querySelector( '.comparebox' ),

            // custom box size,
            //           default: xxx.offsetWidth / xxx.offsetHeight
            box2d: null,

            // degrees: +90 ~ -90, angle between with vertical line, {left: -, right: +}
            deg: 0,

            // initial postion at top(h) or left(v)
            initPosX: 55,

            // controlBar color, it will be overrided by scss $ctrl-bgc, $ctrl-bgc_hover
            ctrlbarColor: 'rgba(100,100,100,.3)',

            // controlBar width, it will be overrided by scss $ctrlW, $ctrlW_hover
            ctrlbarWidth: 10,

            // if mode isn't 'svg', it'll always fallback to 'normal' mode.
            mode: 'svg'  // 'normal' | 'svg'
        },
        xxx = new Comparebox(option);

    xxx.init();

---

### 心得：

最後在實作過 [css transfrom](https://github.com/Rplus/before-after-image-compare/tree/cssTransformDONE) / [canvas](https://github.com/Rplus/before-after-image-compare/tree/canvasDONE) / [SVG](https://github.com/Rplus/before-after-image-compare/tree/svgDONE) / [normal-js](https://github.com/Rplus/before-after-image-compare/tree/normalCompare) 後，  
決定以 SVG 作主要傾斜化呈現的效果，以 normal-js 做退化方案  
偵測 SVG 支援方面本來是採用外連的 [Modernizr full pack js](http://cdnjs.cloudflare.com/ajax/libs/modernizr/2.7.1/modernizr.min.js)  
(後來覺得應該手刻一下，不然嵌進頁面時要是沒load 就比較麻煩，且不是每頁都寫成require的 XD)

其實一開始是[用 css transfrom-skew 硬刻](http://codepen.io/Rplus/pen/isvDK)，  
記得當時用 css skew 刻完時超爽的，一副 css 吃遍天下的樣子 XD  
只是當時就發現 skew 我再怎調，還是會有幾塊空白不能顯示 ( 我太弱了 orz  
而後在本機把 SCSS 修了一些寫法，只是還是會有三角空白區， /__\  
用 canvas 刻其實也沒說太難，稍微看了下相關的 path 寫法，意快地快速就完成了，  
[其中的將區塊畫出來的 code](https://github.com/Rplus/before-after-image-compare/blob/canvasDONE/assets/script/app.js#L74) 也不並太冗長  
只有六個點的取法有稍微試了些不同的方法去踹 XD

最後決定用 SVG 是因為 SVG 部份屬性可以由 css 來控制，  
這對於一個 css 控來說，誘因實在是太大了 XD  
能用 SCSS 處理部份 SVG 樣式，豈不美妙！
PS： 有些設定其實不太確定該放 css 還是 js 參數 = = 屆時有需要調整時再改吧~

另外，其實中途有想過改用 [svg.js](http://svgjs.com/) / [snap.svg](http://snapsvg.io/start/) 之類的 SVG 專案來套用 (套件簡直強大 O_O! )  
但還是想說先瞭解一下原生寫法好了，而且對 SVG 的語法瞭解並不深入呀~~~ = ="

這是第一次使用 Class function 來兜東西  
Class function 寫起來還有些些趣味，不過還沒體會怎麼把它寫得更強撼些  
像是 this.XXX 傳出來的東西 感覺好像可以跟外界有更多的動態影響~
只是 coder 還是我，寫出來的東西看起來還是跟以前的寫法差不多破爛就是了 XDD
