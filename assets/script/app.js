'use strict';

var comparebox2 = {
    ele_box: document.querySelectorAll('.comparebox')[0],
    init: function () {
        var _this = this,
            _box = _this.ele_box,
            _dir = _box.getAttribute('data-dir');

            _box.className += ' comparebox-' + _dir;
            _box.innerHTML += '<span></span>';

            // save config to parent object
            this.dir = _dir;

            _this.bind();
    },
    bind: function() {
        var _this = this,
            _dir = _this.dir,

            choise = {
                v: {
                    hw: 'height',
                    osXY: 'clientY',
                    tl: 'top',
                    box2d: 'offsetTop'
                },
                h: {
                    hw: 'width',
                    osXY: 'clientX',
                    tl: 'left',
                    box2d: 'offsetLeft'
                }
            },

            _box  = _this.ele_box,
            _boxW = _box.offsetWidth,
            _boxH = _box.offsetHeight,

            _config = choise[_dir],

            _imgBoxs = _box.getElementsByTagName('figure'),
            _ctrl = _box.getElementsByTagName('span')[0];

        _box.addEventListener('mousemove', function (event) {
            var pos = event[_config.osXY] - _box[_config.box2d];

            // left image
            _imgBoxs[1].style[_config.hw] = pos + 'px';

            // right image
            _imgBoxs[0].style[_config.hw] = (_boxW - pos) + 'px';
            _ctrl.style[_config.tl] = pos + 'px';
        });
    }
};


comparebox2.init();


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

// comparebox.init();
