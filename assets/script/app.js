'use strict';

if ( Modernizr.svgclippaths ) {

    var Comparebox = function( opt_obj ) {

        var _config = {
                target: document.querySelector( '.comparebox' ),
                box2d: {w: 300, h: 150},
                deg: -30, // +90 ~ -90: angle between with vertical line, {left: -, right: +}
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

        _config.tan = Math.tan( _config.deg * Math.PI / 180 );
        _config.deltaX = Math.round(_config.box2d.h * _config.tan);

        var
        box     = _config.target,
        figures = box.getElementsByTagName('figure'),
        imgs    = box.getElementsByTagName('img'),

        svg_w = _config.box2d.w,
        svg_h = _config.box2d.h,

        sixPoint = [
            0, svg_h,
            0, 0,
            _config.initPosX, 0,
            _config.initPosX - _config.deltaX, svg_h,
            svg_w, svg_h,
            svg_w, 0
        ],

        svgElem, polygon = [],

        createSVG = function () {

            var xmlns = 'http://www.w3.org/2000/svg',
                xlinkns = "http://www.w3.org/1999/xlink";

            svgElem = document.createElementNS(xmlns, 'svg');
            svgElem.setAttributeNS(null, 'viewBox', '0 0 ' + svg_w + ' ' + svg_h);
            svgElem.setAttributeNS(null, 'width', svg_w);
            svgElem.setAttributeNS(null, 'height', svg_h);
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
                pattern[i].setAttributeNS(null, 'width', svg_w );
                pattern[i].setAttributeNS(null, 'height', svg_h );
                image[i].setAttributeNS(null, 'width', svg_w );
                image[i].setAttributeNS(null, 'height', svg_h );
                image[i].setAttributeNS(xlinkns, 'xlink:href', imgs[i].getAttribute('src') );

                polygon[i] = document.createElementNS(xmlns, 'polygon');
                svgElem.appendChild(polygon[i]);
                polygon[i].setAttributeNS(null, 'points',  getPoints( sixPoint.slice(i*4, 8+i*4) ) );
                polygon[i].setAttributeNS(null, 'fill', 'url(#img'+ i+')' );
            }

            svgElem.addEventListener('mousemove', function(event) {
                drawIMG( getMousePos(event) );
            });

            return svgElem;
        },

        getMousePos = function(event) {
            // will ignore border-width, if need a border, try 'outline'
            return {
                x: event.offsetX,
                y: event.offsetY
            };
        },

        getPoints = function(point4){
            return point4.join().replace(/(\d+,\d+),/g, '$1 ');
        },

        drawIMG = function(pos) {

            sixPoint[4] = Math.round(pos.x + pos.y * _config.tan);
            sixPoint[6] = sixPoint[4] - _config.deltaX;

            for (var i = imgs.length - 1; i >= 0; i--) {
                polygon[i].setAttributeNS(null, 'points', getPoints(  sixPoint.slice( 0 + i*4 , 8 + i*4 ) )  );
            }

        };

        this.init = function() {
            for (var i = figures.length - 1; i >= 0; i--) {
                figures[i].style.display = 'none';
            }

            box.appendChild ( createSVG() );

        };

        this.config = _config;

    };

} else { // for no-support canvas

    var Comparebox = function( opt_obj ) {
        var _config = {
                target: document.querySelector( '.comparebox' )
            };

        opt_obj =  opt_obj || {};

        for ( var i in _config ) {
            if ( opt_obj[i] !== undefined ) {
                _config[i] = opt_obj[i];
            }
        }

        var
        box = _config.target,

        imgBoxs = box.getElementsByTagName('figure'),
        ctrlbar,

        dir = box.getAttribute('data-dir'),

        choise = {
            v: {
                hw: 'height',
                osXY: 'clientY',
                tl: 'top',
                boxBC: box.offsetTop,
                ahw: box.offsetHeight
            },
            h: {
                hw: 'width',
                osXY: 'clientX',
                tl: 'left',
                boxBC: box.offsetLeft,
                ahw: box.offsetWidth
            }
        },

        splitIMG = function(event) {
            var _opt = choise[dir],
                pos = event[_opt.osXY] - _opt.boxBC;

            // left image
            imgBoxs[1].style[_opt.hw] = pos + 'px';

            // right image
            imgBoxs[0].style[_opt.hw] = (_opt.ahw - pos) + 'px';
            ctrlbar.style[_opt.tl] = pos + 'px';
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