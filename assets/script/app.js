'use strict';

var Comparebox = function( opt_obj ) {

    (function(html) {
        html.className = html.className.replace(/\bno-js\b/, 'js');
    })(document.documentElement);

    var _config = { // default settings
            target: document.querySelector( '.comparebox' ),
            box2d: null,
            deg: 0, // +90 ~ -90: angle between with vertical line, {left: -, right: +}
            initPosX: 55,
            ctrlbarColor: 'rgba(100,100,100,.3)',
            ctrlbarWidth: 10,
            mode: 'svg'  // 'normal' | 'svg'
        };

    opt_obj =  opt_obj || {};

    // extend settings
    for ( var i in _config ) {
        if ( opt_obj[i] !== undefined ) {
            _config[i] = opt_obj[i];
        }
    }

    _config.box2d = _config.box2d || {
            w: _config.target.offsetWidth,
            h: _config.target.offsetHeight
        };

    var box = _config.target,
        figures = box.getElementsByTagName('figure'),
        imgs    = box.getElementsByTagName('img'),

        box_w = _config.box2d.w,
        box_h = _config.box2d.h,

        xmlns = 'http://www.w3.org/2000/svg',
        xlinkns = 'http://www.w3.org/1999/xlink',

        isSupportSVG = (function(){
            // ref https://github.com/Modernizr/Modernizr/blob/master/feature-detects/svg.js
            return document.createElementNS && !!document.createElementNS(xmlns, 'svg').createSVGRect;
        })(),

        getMousePos;

    if ( _config.mode === 'svg' && (_config.deg % 90) !== 0 && isSupportSVG ) {

        // svg time

        _config.tan = Math.tan( (_config.deg % 90) * Math.PI / 180 );
        _config.deltaX = Math.round(_config.box2d.h * _config.tan);

        var
        // 在大角度時，溢出過多的部份不曉得會不會有效能衝擊...
        sixPoint = [
            0, box_h,
            0, 0,
            _config.initPosX, 0,
            _config.initPosX - _config.deltaX, box_h,
            box_w, box_h,
            box_w, 0
        ],

        svgElem, polygon = [], line, createSVG, getPoints, drawIMG;

        createSVG = function () {

            svgElem = document.createElementNS(xmlns, 'svg');
            svgElem.setAttributeNS(null, 'viewBox', '0 0 ' + box_w + ' ' + box_h);
            svgElem.setAttributeNS(null, 'width', box_w);
            svgElem.setAttributeNS(null, 'height', box_h);
            svgElem.style.display = 'block';

            var defs = [], pattern = [], image = [];

            for (var i = imgs.length - 1; i >= 0; i--) {
                defs[i] = document.createElementNS(xmlns, 'defs');
                pattern[i] = document.createElementNS(xmlns, 'pattern');
                image[i] = document.createElementNS(xmlns, 'image');

                    pattern[i].appendChild(image[i]);
                    defs[i].appendChild(pattern[i]);
                    svgElem.appendChild(defs[i]);

                pattern[i].id = 'img'+i;
                pattern[i].setAttributeNS(null, 'patternUnits', 'userSpaceOnUse' );
                pattern[i].setAttributeNS(null, 'width', box_w );
                pattern[i].setAttributeNS(null, 'height', box_h );

                image[i].setAttributeNS(null, 'width', box_w );
                image[i].setAttributeNS(null, 'height', box_h );
                image[i].setAttributeNS(xlinkns, 'xlink:href', imgs[i].getAttribute('src') );

                polygon[i] = document.createElementNS(xmlns, 'polygon');
                svgElem.appendChild(polygon[i]);
                polygon[i].setAttributeNS(null, 'points',  getPoints( sixPoint.slice(i*4, 8+i*4) ) );
                polygon[i].setAttributeNS(null, 'fill', 'url(#img'+ i+')' );
            }

            // ctrlbar
            line = document.createElementNS(xmlns, 'line');
            svgElem.appendChild(line);
            line.setAttributeNS(null, 'x1', sixPoint[4]);
            line.setAttributeNS(null, 'y1', 0);
            line.setAttributeNS(null, 'x2', sixPoint[6]);
            line.setAttributeNS(null, 'y2', box_h);
            line.setAttributeNS(null, 'stroke', _config.ctrlbarColor );
            line.setAttributeNS(null, 'stroke-width', _config.ctrlbarWidth );
            line.setAttributeNS(null, 'stroke-linecap', 'square' );

            svgElem.addEventListener('mousemove', function(event) {
                drawIMG( getMousePos(event) );
            });

            return svgElem;
        };

        getMousePos = function(event) {
            // will ignore border-width, if need a border, try 'outline'
            return {
                x: event.offsetX,
                y: event.offsetY
            };
        };

        getPoints = function(points){
            return points.join().replace(/(\d+,\d+),/g, '$1 ');
        };

        drawIMG = function(pos) {

            sixPoint[4] = Math.round(pos.x + pos.y * _config.tan);
            sixPoint[6] = sixPoint[4] - _config.deltaX;

            for (var i = imgs.length - 1; i >= 0; i--) {
                polygon[i].setAttributeNS(null, 'points', getPoints(  sixPoint.slice( 0 + i*4 , 8 + i*4 ) )  );
            }

            line.setAttributeNS(null, 'x1', sixPoint[4]);
            line.setAttributeNS(null, 'x2', sixPoint[6]);

        };

        this.init = function() {
            for (var i = figures.length - 1; i >= 0; i--) {
                figures[i].style.display = 'none';
            }

            box.appendChild ( createSVG() );

        };

        this.config = _config;

    } else {

        // normal js

        var dir, ctrlbar, choise, _opt, splitIMG;

        // has deg : %180 => h
        //           %90  => v
        //           %??  => get dir || h
        // non deg : get dir || h

        if ( opt_obj.deg % 90 === 0 ) {
            dir = ( opt_obj.deg % 180 === 0 ) ? 'h' : 'v';
        } else {
            dir = box.getAttribute('data-dir') || 'h';
        }

        choise = {
            v: {
                hw: 'height',
                osXY: 'clientY',
                tl: 'top',
                boxBC: box.offsetTop,
                ahw: box_h
            },
            h: {
                hw: 'width',
                osXY: 'clientX',
                tl: 'left',
                boxBC: box.offsetLeft,
                ahw: box_w
            }
        };
        _opt = choise[dir];

        getMousePos = function(event) {
            // pos
            return event[_opt.osXY] - _opt.boxBC;
        };

        splitIMG = function(pos) {
            figures[1].style[_opt.hw] = pos + 'px';
            figures[0].style[_opt.hw] = (_opt.ahw - pos) + 'px';
            ctrlbar.style[_opt.tl] = pos + 'px';
        };

        this.init = function () {

            box.className += ' comparebox-' + dir;
            box.innerHTML += '<span class="ctrlbar"></span>';

            ctrlbar = box.getElementsByTagName('span')[0];

            splitIMG(_config.initPosX);

            box.addEventListener('mousemove', function(event) {
                splitIMG( getMousePos(event) );
            });

        };

        this.config = _config;
    }
};
