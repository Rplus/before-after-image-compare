before-after-image-compare
==========================

compare 2 images in a box (with javascript &amp; scss).

goal: support to IE8+

0. pure html:  
    需要兩張圖皆出現
    .box > figure*2 > img

1. +css:  
    需要兩張圖皆完全出現
    (圖片疊合的 class 需由 js 加入)

2. +base-js:  
    兩張圖疊合，以滑鼠位置決定(水平或垂直)分割檢視的位置
    水平或垂直由 class: -h -v 決定

3. 尚未確定要用哪一種方式處理斜角，兩個方式都是 IE9+ 才看的懂  
    分割檢視可使用角度，角度在 SASS 決定，JS再撈出角度/邊長比
    + SVG:  
        以 js 偵測到支援 SVG 後，動態置換原本 DIV 內容，  
        以滑鼠位置決定(水平或垂直)分割檢視的位置

    + css transform:
        以 js 偵測到支援 cssTransform 後，  
        以滑鼠位置決定(水平或垂直)分割檢視的位置

本來是有點想用 SVG 做斜角啦(方便多了！！)
但是 SVG 在 IE8 就死翹翹了...
且沒想到該怎麼處理 SVG 的 fallback
