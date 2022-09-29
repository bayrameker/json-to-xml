/* -------------------------------------------------------------------
 * Author Name           : Bbfpl
 * Author URI            : https://codecanyon.net/user/bbfpl
 * Version               : 1.0.0
 * File Name             : main.js
------------------------------------------------------------------- */

(function() {
    "use strict";

    const STEP_LENGTH = 1;
    const CELL_SIZE = 10;
    const BORDER_WIDTH = 2;
    const MAX_ELECTRONS = 100;
    const CELL_DISTANCE = CELL_SIZE + BORDER_WIDTH;

    // shorter for brighter paint
    // be careful of performance issue
    const CELL_REPAINT_INTERVAL = [
        300, // from
        500, // to
    ];

    const BG_COLOR = '#222';
    const BORDER_COLOR = '#13191f';
    const CELL_HIGHLIGHT = '#328bf6';
    const ELECTRON_COLOR = '#FC7864';
    const FONT_COLOR = '#ff5353';

    const DPR = window.devicePixelRatio || 1;

    const ACTIVE_ELECTRONS = [];
    const PINNED_CELLS = [];

    const MOVE_TRAILS = [
        [0, 1], // down
        [0, -1], // up
        [1, 0], // right
        [-1, 0], // left
    ].map(([x, y]) => [x * CELL_DISTANCE, y * CELL_DISTANCE]);

    const END_POINTS_OFFSET = [
        [0, 0], // left top
        [0, 1], // left bottom
        [1, 0], // right top
        [1, 1], // right bottom
    ].map(([x, y]) => [
        x * CELL_DISTANCE - BORDER_WIDTH / 2,
        y * CELL_DISTANCE - BORDER_WIDTH / 2,
    ]);

    class FullscreenCanvas {
        constructor(disableScale = false) {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');

            this.canvas = canvas;
            this.context = context;
            this.disableScale = disableScale;

            this.resizeHandlers = [];
            this.handleResize = _.debounce(this.handleResize.bind(this), 100);

            this.adjust();

            window.addEventListener('resize', this.handleResize);
        }

        adjust() {
            const {
                canvas,
                context,
                disableScale,
            } = this;

            const {
                innerWidth,
                innerHeight,
            } = window;

            this.width = innerWidth;
            this.height = innerHeight;

            const scale = disableScale ? 1 : DPR;

            this.realWidth = canvas.width = innerWidth * scale;
            this.realHeight = canvas.height = innerHeight * scale;
            canvas.style.width = `${innerWidth}px`;
            canvas.style.height = `${innerHeight}px`;

            context.scale(scale, scale);
        }

        clear() {
            const { context } = this;

            context.clearRect(0, 0, this.width, this.height);
        }

        makeCallback(fn) {
            fn(this.context, this);
        }

        blendBackground(background, opacity = 0.05) {
            return this.paint((ctx, { realWidth, realHeight, width, height }) => {
                ctx.globalCompositeOperation = 'source-over';
                ctx.globalAlpha = opacity;

                ctx.drawImage(background, 0, 0, realWidth, realHeight, 0, 0, width, height);
            });
        }

        paint(fn) {
            if (!_.isFunction(fn)) return;

            const { context } = this;

            context.save();

            this.makeCallback(fn);

            context.restore();

            return this;
        }

        repaint(fn) {
            if (!_.isFunction(fn)) return;

            this.clear();

            return this.paint(fn);
        }

        onResize(fn) {
            if (!_.isFunction(fn)) return;

            this.resizeHandlers.push(fn);
        }

        handleResize() {
            const { resizeHandlers } = this;

            if (!resizeHandlers.length) return;

            this.adjust();

            resizeHandlers.forEach(this.makeCallback.bind(this));
        }

        renderIntoView(target = document.body) {
            const { canvas } = this;

            this.container = target;

            canvas.style.position = 'absolute';
            canvas.style.left = '0px';
            canvas.style.top = '0px';

            target.appendChild(canvas);
        }

        remove() {
            if (!this.container) return;

            try {
                window.removeEventListener('resize', this.handleResize);
                this.container.removeChild(this.canvas);
            } catch (e) {}
        }
    }

    class Electron {
        constructor(
            x = 0,
            y = 0, {
                lifeTime = 3 * 1e3,
                speed = STEP_LENGTH,
                color = ELECTRON_COLOR,
            } = {}
        ) {
            this.lifeTime = lifeTime;
            this.expireAt = Date.now() + lifeTime;

            this.speed = speed;
            this.color = color;

            this.radius = BORDER_WIDTH / 2;
            this.current = [x, y];
            this.visited = {};
            this.setDest(this.randomPath());
        }

        randomPath() {
            const {
                current: [x, y],
            } = this;

            const { length } = MOVE_TRAILS;

            const [deltaX, deltaY] = MOVE_TRAILS[_.random(length - 1)];

            return [
                x + deltaX,
                y + deltaY,
            ];
        }

        composeCoord(coord) {
            return coord.join(',');
        }

        hasVisited(dest) {
            const key = this.composeCoord(dest);

            return this.visited[key];
        }

        setDest(dest) {
            this.destination = dest;
            this.visited[this.composeCoord(dest)] = true;
        }

        next() {
            let {
                speed,
                current,
                destination,
            } = this;

            if (Math.abs(current[0] - destination[0]) <= speed / 2 &&
                Math.abs(current[1] - destination[1]) <= speed / 2
            ) {
                destination = this.randomPath();

                let tryCnt = 1;
                const maxAttempt = 4;

                while (this.hasVisited(destination) && tryCnt <= maxAttempt) {
                    tryCnt++;
                    destination = this.randomPath();
                }

                this.setDest(destination);
            }

            const deltaX = destination[0] - current[0];
            const deltaY = destination[1] - current[1];

            if (deltaX) {
                current[0] += (deltaX / Math.abs(deltaX) * speed);
            }

            if (deltaY) {
                current[1] += (deltaY / Math.abs(deltaY) * speed);
            }

            return [...this.current];
        }

        paintNextTo(layer = new FullscreenCanvas()) {
            const {
                radius,
                color,
                expireAt,
                lifeTime,
            } = this;

            const [x, y] = this.next();

            layer.paint(ctx => {
                ctx.globalAlpha = Math.max(0, expireAt - Date.now()) / lifeTime;
                ctx.fillStyle = color;
                ctx.shadowColor = color;
                ctx.shadowBlur = radius * 5;
                ctx.globalCompositeOperation = 'lighter';

                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.closePath();

                ctx.fill();
            });
        }
    }

    class Cell {
        constructor(
            row = 0,
            col = 0, {
                electronCount = _.random(1, 4),
                background = ELECTRON_COLOR,
                forceElectrons = false,
                electronOptions = {},
            } = {},
        ) {
            this.background = background;
            this.electronOptions = electronOptions;
            this.forceElectrons = forceElectrons;
            this.electronCount = Math.min(electronCount, 4);

            this.startY = row * CELL_DISTANCE;
            this.startX = col * CELL_DISTANCE;
        }

        delay(ms = 0) {
            this.pin(ms * 1.5);
            this.nextUpdate = Date.now() + ms;
        }

        pin(lifeTime = -1 >>> 1) {
            this.expireAt = Date.now() + lifeTime;

            PINNED_CELLS.push(this);
        }

        scheduleUpdate(
            t1 = CELL_REPAINT_INTERVAL[0],
            t2 = CELL_REPAINT_INTERVAL[1],
        ) {
            this.nextUpdate = Date.now() + _.random(t1, t2);
        }

        paintNextTo(layer = new FullscreenCanvas()) {
            const {
                startX,
                startY,
                background,
                nextUpdate,
            } = this;

            if (nextUpdate && Date.now() < nextUpdate) return;

            this.scheduleUpdate();
            this.createElectrons();

            layer.paint(ctx => {
                ctx.globalCompositeOperation = 'lighter';
                ctx.fillStyle = background;
                ctx.fillRect(startX, startY, CELL_SIZE, CELL_SIZE);
            });
        }

        popRandom(arr = []) {
            const ramIdx = _.random(arr.length - 1);

            return arr.splice(ramIdx, 1)[0];
        }

        createElectrons() {
            const {
                startX,
                startY,
                electronCount,
                electronOptions,
                forceElectrons,
            } = this;

            if (!electronCount) return;

            const endpoints = [...END_POINTS_OFFSET];

            const max = forceElectrons ? electronCount : Math.min(electronCount, MAX_ELECTRONS - ACTIVE_ELECTRONS.length);

            for (let i = 0; i < max; i++) {
                const [offsetX, offsetY] = this.popRandom(endpoints);

                ACTIVE_ELECTRONS.push(new Electron(
                    startX + offsetX,
                    startY + offsetY,
                    electronOptions,
                ));
            }
        }
    }

    const bgLayer = new FullscreenCanvas();
    const mainLayer = new FullscreenCanvas();
    const shapeLayer = new FullscreenCanvas(true);

    function createRandomCell(options = {}) {
        if (ACTIVE_ELECTRONS.length >= MAX_ELECTRONS) return;

        const { width, height } = mainLayer;

        const cell = new Cell(
            _.random(height / CELL_DISTANCE),
            _.random(width / CELL_DISTANCE),
            options,
        );

        cell.paintNextTo(mainLayer);
    }

    function drawGrid() {
        bgLayer.paint((ctx, { width, height }) => {
            ctx.fillStyle = BG_COLOR;
            ctx.fillRect(0, 0, width, height);

            ctx.fillStyle = BORDER_COLOR;

            // horizontal lines
            for (let h = CELL_SIZE; h < height; h += CELL_DISTANCE) {
                ctx.fillRect(0, h, width, BORDER_WIDTH);
            }

            // vertical lines
            for (let w = CELL_SIZE; w < width; w += CELL_DISTANCE) {
                ctx.fillRect(w, 0, BORDER_WIDTH, height);
            }
        });
    }

    function iterateItemsIn(list) {
        const now = Date.now();

        for (let i = 0, max = list.length; i < max; i++) {
            const item = list[i];

            if (now >= item.expireAt) {
                list.splice(i, 1);
                i--;
                max--;
            } else {
                item.paintNextTo(mainLayer);
            }
        }
    }

    function drawItems() {
        iterateItemsIn(PINNED_CELLS);
        iterateItemsIn(ACTIVE_ELECTRONS);
    }

    let nextRandomAt;

    function activateRandom() {
        const now = Date.now();

        if (now < nextRandomAt) {
            return;
        }

        nextRandomAt = now + _.random(300, 1000);

        createRandomCell();
    }

    function handlePointer() {
        let lastCell = [];
        let touchRecords = {};

        function isSameCell(i, j) {
            const [li, lj] = lastCell;

            lastCell = [i, j];

            return i === li && j === lj;
        };

        function print(isMove, { clientX, clientY }) {
            const i = Math.floor(clientY / CELL_DISTANCE);
            const j = Math.floor(clientX / CELL_DISTANCE);

            if (isMove && isSameCell(i, j)) {
                return;
            }

            const cell = new Cell(i, j, {
                background: CELL_HIGHLIGHT,
                forceElectrons: true,
                electronCount: isMove ? 2 : 4,
                electronOptions: {
                    speed: 3,
                    lifeTime: isMove ? 500 : 1000,
                    color: CELL_HIGHLIGHT,
                },
            });

            cell.paintNextTo(mainLayer);
        }

        const handlers = {
            touchend({ changedTouches }) {
                if (changedTouches) {
                    Array.from(changedTouches).forEach(({ identifier }) => {
                        delete touchRecords[identifier];
                    });
                } else {
                    touchRecords = {};
                }
            },
        };

        function filterTouches(touchList) {
            return Array.from(touchList).filter(({ identifier, clientX, clientY }) => {
                const rec = touchRecords[identifier];
                touchRecords[identifier] = { clientX, clientY };

                return !rec || clientX !== rec.clientX || clientY !== rec.clientY;
            });
        }

        [
            'mousedown',
            'touchstart',
            'mousemove',
            'touchmove',
        ].forEach(name => {
            const isMove = /move/.test(name);
            const isTouch = /touch/.test(name);

            const fn = print.bind(null, isMove);

            handlers[name] = function handler(evt) {
                if (isTouch) {
                    filterTouches(evt.touches).forEach(fn);
                } else {
                    fn(evt);
                }
            };
        });

        const events = Object.keys(handlers);

        events.forEach(name => {
            document.addEventListener(name, handlers[name]);
        });

        return function unbind() {
            events.forEach(name => {
                document.removeEventListener(name, handlers[name]);
            });
        };
    }

    function prepaint() {
        drawGrid();

        mainLayer.paint((ctx, { width, height }) => {
            // composite with rgba(255,255,255,255) to clear trails
            ctx.fillStyle = '#fff';
            ctx.fillRect(0, 0, width, height);
        });

        mainLayer.blendBackground(bgLayer.canvas, 0.9);
    }

    function render() {
        mainLayer.blendBackground(bgLayer.canvas);

        drawItems();
        activateRandom();

        shape.renderID = requestAnimationFrame(render);
    }

    const shape = {
        lastText: '',
        lastMatrix: null,
        renderID: undefined,
        isAlive: false,

        get electronOptions() {
            return {
                speed: 2,
                color: FONT_COLOR,
                lifeTime: _.random(300, 500),
            };
        },

        get cellOptions() {
            return {
                background: FONT_COLOR,
                electronCount: _.random(1, 4),
                electronOptions: this.electronOptions,
            };
        },

        get explodeOptions() {
            return Object.assign(this.cellOptions, {
                electronOptions: Object.assign(this.electronOptions, {
                    lifeTime: _.random(500, 1500),
                }),
            });
        },

        init(container = document.body) {
            if (this.isAlive) {
                return;
            }

            bgLayer.onResize(drawGrid);
            mainLayer.onResize(prepaint);

            mainLayer.renderIntoView(container);

            shapeLayer.onResize(() => {
                if (this.lastText) {
                    this.print(this.lastText);
                }
            });

            prepaint();
            render();

            this.unbindEvents = handlePointer();
            this.isAlive = true;
        },

    };



    let bg = jQuery(".main-area").attr("data-bg")
    if (bg == "") {
        if (window.innerWidth > 600) {
            shape.init();
            // prevent zoom
            document.addEventListener('touchmove', e => e.preventDefault());
        }
    } else {
        let suffix = bg.substr(bg.lastIndexOf(".") + 1);
        if (suffix == "mp4") {
            new vidbg('body', {
                mp4: bg, // URL or relative path to MP4 video
                overlay: false, // Boolean to display the overlay or not
                overlayColor: '#000', // The overlay color as a HEX
                overlayAlpha: 0.3 // The overlay alpha. Think of this as the last integer in RGBA()
            }, {
                // Attributes
            })
        } else {
            jQuery(".main-area").css({
                "background-image": `url(${bg})`,
                "background-size": " 100% 120%",
                "background-position": "0px -100px",
            });
        }
    }
})();