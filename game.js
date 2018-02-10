
var root = document.body;


var map0 = [
    'tttttttt      tttttttttttttttttt',
    '########      ###########d######',
    '========      ===========D======',
    '.pbbf...|####|ttttttttt|....|...',
    '.PBBF...|####|#d###d###|....|...',
    '........|====|=D===D===|---.|   ',
    '........|..............|---.|   ',
    '.........d|tt|.........|---.|   ',
    '         D|##|.........|---.|   ',
    '         .|()|.........|---.|   ',
    '         ...[|.........|---     ',
   '              \\......../---     ',
   '               \\......//---     ',
   '                \\..../ /....    ',
    '                     / .....    ',
    '                     /......    ',
    '                     ....d..    ',
    '                     ....D..    '
];

var sprites0 = {
    '#': [1, 0],
    '=': [1, 1],
    '.': [0, 1],
    'd': [3, 0],
    'D': [3, 1],
    'p': [1, 6],
    'P': [1, 7],
    'b': [2, 6],
    'B': [2, 7],
    'f': [3, 6],
    'F': [3, 7],
    't': [2, 0],
    '(': [5, 1],
    ')': [6, 1]
};


class Game {
    constructor() {
        this.image = null;
        this.tileW = 16;
        this.tileH = 16;

        this.px = 80;
        this.py = 80;

        // Logical canvas dimensions
        this.screenW = 300;
        this.screenH = 200;

        this.nTilesX = Math.ceil(this.screenW / this.tileW);
        this.nTilesY = Math.ceil(this.screenH / this.tileH);
    }

    loadMap(mapArray, spriteMapping) {
        this.mapdata = [];
        
        var defaultSprite = [0, 0];
        var mapArrayLength = mapArray.length;
        for(var y = 0; y < mapArrayLength; y++) {
        //for(var _, mapRow in mapArray) {
            var mapRow = mapArray[y];
            var row = [];
            var mapRowLength = mapRow.length;
            for(var x = 0; x < mapRowLength; x++) {
                var mapChar = mapRow[x];
            //for(var mapChar in mapRow) {
                if(mapChar in spriteMapping) {
                    row.push(spriteMapping[mapChar]);
                } else {
                    row.push(defaultSprite);
                }
            }

            this.mapdata.push(row);
        }
        console.log(this);
    }

    drawMap(ctx, x, y) {
        
        ctx.imageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false;
        ctx.mozImageSmoothingEnabled = false;

        if(!this.image)
            return;

        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, this.screenW, this.screenH);

        var offsX = x % this.tileW,
            offsY = y % this.tileH,
            x0 = Math.floor((x - Math.round(this.screenW / 2)) / this.tileW),
            y0 = Math.floor((y - Math.round(this.screenH / 2)) / this.tileH);

        var mapX, mapY, mapRow, tile, drawX, drawY;
        for(var yy = 0; yy < this.nTilesY; yy++) {
            mapY = y0 + yy;
            if(mapY >= 0 && mapY < this.mapdata.length) {
                mapRow = this.mapdata[mapY];
                for(var xx = 0; xx < this.nTilesX; xx++) {
                    mapX = x0 + xx;

                    if(mapX >= 0 && mapX < mapRow.length) {
                        tile = mapRow[mapX];

                        drawX = xx * this.tileW - offsX;
                        drawY = yy * this.tileH - offsY;

                        // Draw tile
                        ctx.drawImage(this.image,
                            tile[0] * this.tileW,
                            tile[1] * this.tileH,
                            this.tileW,
                            this.tileH,
                            drawX,
                            drawY,
                            this.tileW,
                            this.tileH
                        );
                    } else {
                        ctx.fillStyle = 'black';
                        ctx.fillRect(drawX, drawY, this.tileW, this.tileH);
                    }
                }
            }
        }
    }
}

var game = new Game();
game.loadMap(map0, sprites0);


var GameCanvas = {
    oninit: function(vnode) {
    },
    oncreate: function(vnode) {    
        // Game initialization here!
        var lastTime;
        var canvas = vnode.dom;
        var ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;

        console.log('here');

        // Start game!
        function drawFrame(timestamp) {
            var elapsed = timestamp - lastTime;

            // Don't worry about timing for now
            var ctx = canvas.getContext('2d');
            game.drawMap(ctx, game.px, game.py);
            
            lastTime = timestamp;
            window.requestAnimationFrame(drawFrame);
        };

        window.requestAnimationFrame(drawFrame);
    },
    onbeforeremove: function(vnode) {
        window.cancelAnimationFrame(vnode.state.animID);
    },
    view: function(vnode) {
        return m('canvas.game-canvas', {
            width: game.screenW,
            height: game.screenH
        });
    }
};


var HiddenImage = {
    view: function(vnode) {
        return m('img#tiles', {
            style: 'display: none',
            src: 'tiles.png',
            onload: function(ev) {
                game.image = vnode.dom;
                console.log(vnode.dom);
            }
        });
    }
};


var Wrapper = {
    view: function() {
            return m('div', {
            },
                m(GameCanvas),
                m(HiddenImage)
            );
    }
};

window.addEventListener('keydown', function(ev) {
    switch(ev.key) {
        case 'd':
            game.px += game.tileW;
            break;
        case 'w':
            game.py -= game.tileH;
            break;
        case 'a':
            game.px -= game.tileW;
            break;
        case 's':
            game.py += game.tileH;
            break;
    }
});

m.render(root, m(Wrapper));

