/*
 * this plugin provide doubletap event, for any scene class. 
 * enchant.annex is extention container.
 * example usage.
 *      enchant.annex.Doubletap.setDoubleTapHandler(enchant.Core.instance.rootScene);
 */
if(enchant.annex === undefined){
    enchant.annex = {};
}
enchant.annex.DoubleTap = (function(){
        var _env = {
            HOLDTIME: 300,
            DBLLIMIT: 300,
            FLINGVEL: 3
        };
        var Event = {
            DOUBLETAPSTART: 'doubletapstart',
            DOUBLETAPEND: 'doubletapend'
        };
        var NOTOUCH = 0;
        var WAITDBL = 1;
        var NOMOVE = 2;
        var NOMOVEDBL = 3;
        var MOVED = 4;
        var HOLD = 5;
        var DoubhleTapDetector = enchant.Class.create(enchant.EventTarget, {
                initialize: function(target){
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
                    if(target){
                        this.attach(target);
                    }
                },
                attach: function(target) {
                    this._target = target;
                    //this._types.forEach(function(event) {
                    //        this._target.addEventListener(event, this._handler);
                    //}, this);
                },
                ontouchstart: function(e) {
                    this._startX = this._lastX = e.x;
                    this._startY = this._lastY = e.y;
                    if (this._state == WAITDBL) {
                        this._state = NOMOVEDBL;
                        var evt = new enchant.Event('doubletapstart');
                        evt.x = this._lastX;
                        evt.y = this._lastY;
                        this._target.dispatchEvent(evt);
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
                    var core = enchant.Core.instance;
                    switch (this._state) {
                        case MOVED:
                        velocityX = (this._lastX - this._startX) / this._velobase / this._touchElapsed * 1000;
                        velocityY = (this._lastY - this._startY) / this._velobase / this._touchElapsed * 1000;
                        if (velocityX > enchant.annex.DoubleTap._env.FLINGVEL || velocityY > enchant.annex.DoubleTap._env.FLINGVEL) {
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
                        // var evt = new enchant.Event(enchant.Event.DOUBLETAP);
                        // evt.x = this._lastX;
                        // evt.y = this._lastY;
                        // this._target.dispatchEvent(evt);
                        var evt = new enchant.Event('doubletapend');
                        //TODO
                        //doubletapstartが発行されてもdoubletapendが発行される保障が現バージョンではありません
                        evt.x = this._lastX;
                        evt.y = this._lastY;
                        this._target.dispatchEvent(evt);

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
                        if (this._releaseElapsed >= enchant.annex.DoubleTap._env.DBLLIMIT) {
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
                        if (this._releaseElapsed >= enchant.annex.DoubleTap._env.DBLLIMIT) {
                            this._state = NOMOVE;
                            this._releaseElapsed = 0;
                        }
                        case NOMOVE:
                        this._touchElapsed += elapsed;
                        if (this._touchElapsed >= enchant.annex.DoubleTap._env.HOLDTIME) {
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
        /*
         * 引数にダブルタップのリスナーを付与します。
         * 戻り値は返しません。
         * @param {enchant.EventTarget} eventTarget
         */
        var setDoubleTapHandler = function(eventTarget){
            /*
             * リスナー個別に発行されるハンドラ
             */
            var hander = new DoubhleTapDetector(eventTarget);
            /*
             * タッチ開始時のイベントリスナー
             */
            eventTarget.addEventListener('doubletapstart', function(e){
                    var evt = new enchant.Event('doubletapstart');
                    var nodes = eventTarget.childNodes.slice();
                    var push = Array.prototype.push;
                    while (nodes.length) {
                        var node = nodes.pop();
                        node.dispatchEvent(e);
                        if (node.childNodes) {
                            push.apply(nodes, node.childNodes);
                        }
                    }
            });
            /*
             * タッチ終了時のイベントリスナー
             * doubletapstartが発行されていても、doubletapendが発行される保証はありません
             * タッチエンドまでの間隔が規定値を下回る場合のみイベントが発行されます
             */
            eventTarget.addEventListener('doubletapend', function(e){
                    var evt = new enchant.Event('doubletapend');
                    var nodes = eventTarget.childNodes.slice();
                    var push = Array.prototype.push;
                    while (nodes.length) {
                        var node = nodes.pop();
                        node.dispatchEvent(e);
                        if (node.childNodes) {
                            push.apply(nodes, node.childNodes);
                        }
                    }
            });
            /*
             * ハンドラに状態を送るためのリスナ
             */
            eventTarget.addEventListener('enterframe', function(e){
                hander.dispatchEvent(e);
            });
            eventTarget.addEventListener('touchstart', function(e){
                hander.dispatchEvent(e);
            });
            eventTarget.addEventListener('touchmove', function(e){
                hander.dispatchEvent(e);
            });
            eventTarget.addEventListener('touchend', function(e){
                hander.dispatchEvent(e);
            });
        };
        return {
            setDoubleTapHandler: setDoubleTapHandler,
            _env: _env,
            Event, Event
        };
})();
