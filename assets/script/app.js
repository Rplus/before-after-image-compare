'use strict';

if ( !!document.createElement('canvas').getContext ) {

    var Comparebox = function( opt_obj ) {

        var _config = {
                _class: '.comparebox',
                box2d: {w: 300, h: 150},
                deg: -20, // +90 ~ -90: angle between with vertical line, {left: -, right: +}
                initPosX: 55,
                ctrlbarColor: 'rgba(255,0,0,.3)',
                ctrlbarWidth: 10
            };

        opt_obj =  opt_obj || {};

        for ( var i in _config ) {
            if ( opt_obj[i] !== undefined ) {
                _config[i] = opt_obj[i];
            }
        }

        this.config = _config;

        var
        box = document.querySelector( _config._class ),
        figures = box.getElementsByTagName('figure'),
        imgs = box.getElementsByTagName('img'),
        ctx, can,

        createCanvas = function () {
            can = document.createElement('canvas');
            can.setAttribute('width', _config.box2d.w);
            can.setAttribute('height', _config.box2d.h);

            can.addEventListener('mousemove', function (event) {
                drawIMG( getMousePos(event) );
            });

            ctx = can.getContext('2d');

            return can;
        },

        getMousePos = function(event) {
            // will ignore border-width,
            // if need a border, try 'outline'
            return {
                x: event.offsetX,
                y: event.offsetY
            };
        },

        drawIMG = function(pos) {
            var
            can_w = _config.box2d.w,
            can_h = _config.box2d.h,
            x1 = Math.round(pos.x + pos.y * _config.tan),
            x2 = Math.round(pos.x - (can_h - pos.y) * _config.tan),
            path = [

                [   0, 0,
                    0, can_h,
                    x2, can_h,
                    x1, 0],

                [   x2, can_h,
                    x1, 0,
                    can_w, 0,
                    can_w, can_h]
            ],

            drawPath = function(xys){
                ctx.moveTo(xys[0], xys[1]);
                ctx.lineTo(xys[2], xys[3]);
                ctx.lineTo(xys[4], xys[5]);
                ctx.lineTo(xys[6], xys[7]);
            };

            ctx.clearRect(0, 0, can_w, can_h);

            for (var i = path.length - 1; i >= 0; i--) {
                ctx.save();
                    ctx.beginPath();
                    drawPath(path[i]);
                    ctx.closePath();
                    ctx.clip();
                    ctx.drawImage(imgs[i],0,0, can_w, can_h);
                ctx.restore();
            }

            ctx.save();
                ctx.beginPath();
                    ctx.moveTo(x1, 0);
                    ctx.lineTo(x2, can_h);
                ctx.strokeStyle = _config.ctrlbarColor;
                ctx.lineWidth = _config.ctrlbarWidth;
                ctx.lineCap = 'round';
                ctx.stroke();
            ctx.restore();
        };

        this.init = function() {
            for (var i = figures.length - 1; i >= 0; i--) {
                figures[i].style.display = 'none';
            }

            box.appendChild( createCanvas() );

            var count = 0,
                readyDraw = function() {
                    count += 1;
                    if ( count === 2) {
                        drawIMG( {x: _config.initPosX, y: 0} );
                    }
                };

            if ( _config.deg !== 90 && _config.deg !== -90) {
                _config.deg %= 90;
            }
            _config.tan = Math.tan( _config.deg * Math.PI / 180 );

                // so strange cache...
                var i1 = new Image(),
                    i2 = new Image();
                i1.src = imgs[0].src;
                i2.src = imgs[0].src;
                i1.onload = readyDraw;
                i2.onload = readyDraw;

            imgs[0].onload = readyDraw;
            imgs[1].onload = readyDraw;

        };

    };

} else { // for no-support canvas

    var Comparebox = function( opt_obj ) {
        var _config = {
                _class: '.comparebox'
            };

        opt_obj =  opt_obj || {};

        for ( var i in _config ) {
            if ( opt_obj[i] !== undefined ) {
                _config[i] = opt_obj[i];
            }
        }

        var
        box = document.querySelector(_config._class),
        box_w = box.offsetWidth,

        imgBoxs = box.getElementsByTagName('figure'),
        ctrlbar,

        dir = box.getAttribute('data-dir'),

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

        splitIMG = function(event) {
            var pos = event[choise[dir].osXY] - box[choise[dir].box2d];

                // left image
                imgBoxs[1].style[choise[dir].hw] = pos + 'px';

                // right image
                imgBoxs[0].style[choise[dir].hw] = (box_w - pos) + 'px';
                ctrlbar.style[choise[dir].tl] = pos + 'px';
        };

        this.init = function () {

            box.className += ' comparebox-' + dir;
            box.innerHTML += '<span></span>';
            ctrlbar = box.getElementsByTagName('span')[0];

            box.addEventListener('mousemove', splitIMG);

        };

    };
}

var compare_1 = new Comparebox();
    compare_1.init();