before-after-image-compare
==========================

compare 2 images in a box (with javascript &amp; scss).

goal: support to IE8+

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
    + SVG:  
        以 js 偵測到支援 SVG 後，動態置換原本 DIV 內容，  
        以滑鼠位置決定(水平或垂直)分割檢視的位置

    + css transform:  
        以 js 偵測到支援 cssTransform 後，  
        以滑鼠位置決定(水平或垂直)分割檢視的位置
    
    + canvas:
        與 SVG 作法差不多

4. 心得：  
    最後在實作過 css transfrom / canvas / SVG / normal-js 後，  
    決定以 SVG 作主要傾斜化呈現的效果，以 normal-js 做退化方案  
    偵測 SVG 支援方面本來是採用外連的 Modernizr full pack js  
    (後來覺得應該手刻一下，不然嵌進頁面時要是沒load 就比較麻煩，且不是每頁都寫成require的 XD)
    
    另外，其實中途有想過改用 [svg.js](http://svgjs.com/) / [snap.svg](http://snapsvg.io/start/) 之類的 SVG 專案來套用 (套件簡直強大 O_O! )  
    但還是想說先瞭解一下原生寫法好了，而且對 SVG 的語法瞭解並不深入呀~~~ = ="
