'use strict'

var comparebox = {
    ele_box: document.querySelectorAll('.comparebox')[0],

    imgBox: ['img-box-r', 'img-box-l'],

    init: function() {
        var _this = this,
            _box = _this.ele_box;

        // init elements
        _box.innerHTML = '<div class="' + _this.imgBox[0] + '"></div><div class="' + _this.imgBox[1] + '"></div><span></span>';

        // add eles to comparebox
        _this.imgLeft = _box.getElementsByTagName('div')[1];
        _this.ctrl = _box.getElementsByTagName('span')[0];

        _this.bind();
    },
    bind: function() {
        var _this = this,
            _box  = _this.ele_box,
            _boxHh = _box.offsetHeight / 2,
            _ctrl = _this.ctrl,
            _xyRatio = (function() {
                var allStyle = window.getComputedStyle(_ctrl, null),
                    transformStyle = allStyle.getPropertyValue('-webkit-transform') ||
                                    allStyle.getPropertyValue('-moz-transform') ||
                                    allStyle.getPropertyValue('-ms-transform') ||
                                    allStyle.getPropertyValue('-o-transform') ||
                                    allStyle.getPropertyValue('transform');
                    return transformStyle ? transformStyle.split(',')[2] * 1 : 0; // tan(x): x:y radio
            })();

        _this.ele_box.addEventListener('mousemove', function (event) {
            var pos_x = event.clientX - _box.offsetLeft,
                pos_y = event.clientY - _box.offsetTop - _boxHh,
                op_x;

                op_x  = pos_x - Math.round(pos_y * _xyRatio) + 'px';

            _this.imgLeft.style.width = op_x;
            _this.ctrl.style.left = op_x;

        })
    }
};

comparebox.init();