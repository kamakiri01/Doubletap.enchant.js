// setter.setDoubleTapHandler(enchant.Core.instance.rootScene)
var setter = (function(){
        enchant.annex = {
            _env: {
                HOLDTIME: 300,
                DBLLIMIT: 300,
                FLINGVEL: 3
            },
            Event: {}
        };
        enchant.annex.Event.DOUBLETAP = 'doubletap';
        var NOTOUCH = 0;
        var WAITDBL = 1;
        var NOMOVE = 2;
        var NOMOVEDBL = 3;
        var MOVED = 4;
        var HOLD = 5;
        enchant.annex.DoubhleTapDetector = enchant.Class.create(enchant.EventTarget, {
                initialize: function(){
                    var core = enchant.Core.instance;
                    enchant.EventTarget.call(this);
                    this._target;
                    this._startX = 0;
                    this._startY = 0;
                    this._lastX = 0;
                    this._lastY = 0;
                    this._touchElapsed = 0;
                    this._releaseElapsed = 0;
                    this._state = NOTOUCH;
                },
                ontouchstart: function(e) {
                    var core = enchant.Core.instance;
                    // this._startFrame = core.frame;
                    this._startX = this._lastX = e.x;
                    this._startY = this._lastY = e.y;
                    if (this._state == WAITDBL) {
                        this._state = NOMOVEDBL;
                    } else if (this._state == NOTOUCH) {
                        this._state = NOMOVE;
                    }
                },
                ontouchmove: function(e) {
                    var dx = e.x - this._lastX;
                    var dy = e.y - this._lastY;
                    this._lastX = e.x;
                    this._lastY = e.y;
                    switch (this._state) {
                        case NOMOVE:
                        case NOMOVEDBL:
                        this._state = MOVED;
                         case MOVED:
                        // var evt = new enchant.Event(enchant.Event.SLIP);
                        // evt.x = this._lastX;
                        // evt.y = this._lastY;
                        // evt.dx = dx;
                        // evt.dy = dy;
                        // this._target.dispatchEvent(evt);
                        break;
                        case HOLD:
                        // var evt = new enchant.Event(enchant.Event.DRAG);
                        // evt.x = this._lastX;
                        // evt.y = this._lastY;
                        // evt.dx = dx;
                        // evt.dy = dy;
                        // this._target.dispatchEvent(evt);
                        break;
                        default:
                        break;
                    }
                },
                ontouchend: function(e) {
                    console.log("touchend");
                    var core = enchant.Core.instance;
                    switch (this._state) {
                        case MOVED:
                        velocityX = (this._lastX - this._startX) / this._velobase / this._touchElapsed * 1000;
                        velocityY = (this._lastY - this._startY) / this._velobase / this._touchElapsed * 1000;
                        if (velocityX > enchant.annex._env.FLINGVEL || velocityY > enchant.annex._env.FLINGVEL) {
                            // var evt = new enchant.Event(enchant.Event.FLING);
                            // evt.x = this._startX;
                            // evt.y = this._startY;
                            // evt.ex = this._lastX;
                            // evt.ey = this._lastY;
                            // evt.velocityX = velocityX;
                            // evt.velocityY = velocityY;
                            // this._target.dispatchEvent(evt);
                        }
                        this._state = NOTOUCH;
                        break;
                        case HOLD:
                        // var evt = new enchant.Event(enchant.Event.RELEASE);
                        // evt.x = this._lastX;
                        // evt.y = this._lastY;
                        // this._target.dispatchEvent(evt);
                        this._state = NOTOUCH;
                        break;
                        case NOMOVEDBL:
                        console.log("DOUBLETAP");
                        // var evt = new enchant.Event(enchant.Event.DOUBLETAP);
                        // evt.x = this._lastX;
                        // evt.y = this._lastY;
                        // this._target.dispatchEvent(evt);
                        this._state = NOTOUCH;
                        this._releaseElapsed = 0;
                        break;
                        case NOMOVE:
                        this._state = WAITDBL;
                        break;
                        default:
                        this._state = NOTOUCH;
                        break;
                    }
                    this._touchElapsed = 0;
                    this._startX = 0;
                    this._startY = 0;
                },
                onenterframe: function(e) {
                    var elapsed = e.elapsed;
                    switch (this._state) {
                        case WAITDBL:
                        this._releaseElapsed += elapsed;
                        if (this._releaseElapsed >= enchant.annex._env.DBLLIMIT) {
                            // var evt = new enchant.Event(enchant.Event.TAP);
                            // evt.x = this._lastX;
                            // evt.y = this._lastY;
                            this._lastX = 0;
                            this._lastY = 0;
                            // this._target.dispatchEvent(evt);
                            this._state = NOTOUCH;
                            this._releaseElapsed = 0;
                        }
                        break;
                        case NOMOVEDBL:
                        this._releaseElapsed += elapsed;
                        if (this._releaseElapsed >= enchant.annex._env.DBLLIMIT) {
                            this._state = NOMOVE;
                            this._releaseElapsed = 0;
                        }
                        case NOMOVE:
                        this._touchElapsed += elapsed;
                        if (this._touchElapsed >= enchant.annex._env.HOLDTIME) {
                            // var evt = new enchant.Event(enchant.Event.HOLD);
                            // evt.x = this._lastX;
                            // evt.y = this._lastY;
                            // this._target.dispatchEvent(evt);
                            this._state = HOLD;
                            this._touchElapsed = 0;
                        }
                        break;
                        case MOVED:
                        this._touchElapsed += elapsed;
                        break;
                        case NOTOUCH:
                        case HOLD:
                        default:
                        break;
                    }
                }
        });
        var setDoubleTapHandler = function(scene){
            //拾いたいイベントごとに全部リスナーを列挙？
            var hander = new enchant.annex.DoubhleTapDetector();
            scene.addEventListener('enterframe', function(e){
                hander.dispatchEvent(e);
            });
            scene.addEventListener('touchstart', function(e){
                hander.dispatchEvent(e);
            });
            scene.addEventListener('touchmove', function(e){
                hander.dispatchEvent(e);
            });
            scene.addEventListener('touchend', function(e){
                hander.dispatchEvent(e);
            });
        };
        return {setDoubleTapHandler: setDoubleTapHandler};
})();




