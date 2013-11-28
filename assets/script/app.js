'use strict';

var comparebox = {
    init: function () {

        var _this = this,
            _box = document.querySelectorAll('.comparebox')[0],
            _dir = _box.getAttribute('data-dir');

            _box.className += ' comparebox-' + _dir;
            _box.innerHTML += '<span></span>';

            // save config to parent object
            this.ele_box = _box;
            this.dir = _dir;
            this.ctrl = _box.getElementsByTagName('span')[0];

            _this.bind();
    },
    bind: function() {
        var _this = this,
            _dir = _this.dir,

            _box  = _this.ele_box,
            _boxW = _box.offsetWidth,
            _boxH = _box.offsetHeight,

            choise = {
                v: {
                    hw: 'height',
                    osXY: 'clientY',
                    tl: 'top',
                    box2d: 'offsetTop',
                    lenBase: _boxH
                },
                h: {
                    hw: 'width',
                    osXY: 'clientX',
                    tl: 'left',
                    box2d: 'offsetLeft',
                    lenBase: _boxW
                }
            },

            _config = choise[_dir],
            _antiDir = (_dir === 'h') ? 'v' : 'h',

            _imgBoxs = _box.getElementsByTagName('figure'),
            _ctrl = _box.getElementsByTagName('span')[0],
            findClassInHtml = function(_class) {
                var allCalss = document.documentElement.className.trim().split(/\s+/),
                    i = allCalss.length - 1;

                for ( ; i >= 0 ; i -= 1 ) {
                    if ( _class === allCalss[i] ) { return true; }
                    if ( 0 === i )                { return false; }
                }

            },
            isTouch = findClassInHtml('touch'),
            isTransforms = findClassInHtml('csstransforms'),
            splitIMGs;

        if (isTransforms) {

            var _ctrl = _this.ctrl,
                _xyRatio = (function() {

                    var allStyle = window.getComputedStyle(_ctrl, null),
                        transformStyle = allStyle.getPropertyValue('-webkit-transform') ||
                                        allStyle.getPropertyValue('-moz-transform') ||
                                        allStyle.getPropertyValue('-ms-transform') ||
                                        allStyle.getPropertyValue('-o-transform') ||
                                        allStyle.getPropertyValue('transform');

                        // tan(x): x:y radio
                        if ( /^matrix/.test(transformStyle) ) {
                            return { h: transformStyle.split(',')[2] * 1, v: transformStyle.split(',')[1] * 1}
                        } else {
                            return 0;
                        }
                })();

        }

        splitIMGs = function(event) {
            var pos = event[_config.osXY] - _box[_config.box2d];

            if (isTransforms && _xyRatio !== 0) {
                var deltaLength = ( event[choise[_antiDir].osXY] - _box[choise[_antiDir].box2d] - choise[_antiDir].lenBase / 2 ) * _xyRatio[_dir];

                pos -= deltaLength;
            }

            // left image
            _imgBoxs[1].style[_config.hw] = pos + 'px';

            // right image
            _imgBoxs[0].style[_config.hw] = (_config.lenBase - pos) + 'px';
            _ctrl.style[_config.tl] = pos + 'px';
        }

        if ( isTouch ) {
            _box.addEventListener('touchmove', splitIMGs );
            _box.addEventListener('touchstart', splitIMGs );
        } else {
            _box.addEventListener('mousemove', splitIMGs );
        }
    }
};

comparebox.init();
