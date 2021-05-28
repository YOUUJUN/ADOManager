// JavaScript Document
/**
 * Created by yong on 2016/1/5 0005.
 */

if (!String.prototype.trim) {
    String.prototype.trim = function () {
        return this.replace(/^\s+|\s+$/gm, '');
    };
}
if (!String.prototype.trimLeft) {
    String.prototype.trimLeft = function () {
        var i = 0;
        while (i < this.length) {
            if (this[i] != ' ') {
                return this.substring(i);
            }
            i++;
        }
        return '';
    };
}

if (!String.prototype.trimRight) {
    String.prototype.trimRight = function () {
        var i = this.length - 1;
        while (i >= 0) {
            if (this[i] != ' ') {
                return this.substring(0, i + 1);
            }
            i++;
        }
        return '';
    };
}

//为什么必须在空字符串后面添加呢，
//可以是padEnd方法来替换
if (!String.prototype.fillText) {
    String.prototype.fillText = function (n) {
        var s1 = this;
        for (var i = 1; i < n; i++) {
            s1 += this;
        }
        return s1;
    };
}
//JS 使用UCS-2存储，所有的都是占两个字节的，该方法只能是判断是否是ASCII 编码
//解释：http://www.ruanyifeng.com/blog/2014/12/unicode.html

// if (!String.prototype.getTextByCharLen) {
//     String.prototype.getTextByCharLen = function (len, doublechar) {
//         if (len > 0 && !!doublechar) {
//             var count = 0;
//             for (var i = 0; i < this.length; i++) {
//                 count += (this.charCodeAt(i) > 255 ? 2 : 1);
//                 if (count > len) {
//                     return this.substring(0, i);
//                 }
//             }
//         }
//         return this;
//     };
// }

if (!String.prototype.startsWith) {
    String.prototype.startsWith = function (str) {
        if (str.length > this.length) {
            return false;
        } else {
            for (var i = 0; i < str.length; i++) {
                if (this.charAt(i) != str.charAt(i)) {
                    return false;
                }
            }
            return true;
        }
    };
}

if (!String.prototype.endsWith) {
    String.prototype.endsWith = function (str) {
        if (str.length > this.length) {
            return false;
        } else {
            var start = this.length - str.length;
            for (var i = 0; i < str.length; i++) {
                if (this.charAt(start) != str.charAt(i)) {
                    return false;
                }
            }
            return true;
        }
    };
}

/**

 */
if (!Array.prototype.exchange) {
    Array.prototype.exchange = function (x, y) {
        var a = this[x];
        this[x] = this[y];
        this[y] = a;
    };
}
//fill() 方法用一个固定值填充一个数组中从起始索引到终止索引内的全部元素
if (!Array.prototype.fill) {
    Array.prototype.fill = function (c) {
        for (var i = 0; i < this.length; i++) {
            this[i] = c;
        }
    };
}
if (!Array.prototype.search) {
    /**
     * 对元素使用制定的method或属性值进行查找
     * @param method 应用的方法体或属性名
     * @param value 属性值
     * @returns {number}
     */
    Array.prototype.search = function (method, value) {
        for (var i = 0; i < this.length; i++) {
            if ($e.fn.test(this[i], method, value)) {
                return i;
            }
        }
        return -1;
    };
}
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (elem, fromindex) {
        var f = fromindex ? fromindex : 0;
        for (var i = f; i < this.length; i++) {
            if (this[i] == elem) {
                return i;
            }
        }
        return -1;
    };
}
if (!Array.prototype.lastIndexOf) {
    Array.prototype.lastIndexOf = function (elem, lastindex) {
        lastindex = lastindex || 0;
        lastindex = (lastindex < 0 || lastindex >= this.length) ? this.length - 1 : lastindex;
        for (var i = lastindex; i >= 0; i--) {
            if (this[i] == elem) {
                return i;
            }
        }
        return -1;
    };
}
if (!Array.prototype.rangeCheck) {
    Array.prototype.rangeCheck = function (i) {
        if ((this.length > 0) && (i >= 0 && i < this.length)) {
            return true;
        }
        return false;
    };
}
/**
 *
 * @param key
 * 将数组元素的每个类型为plainObject的元素键值转为小写
 */
if (!Array.prototype.elementToLowerCase) {
    Array.prototype.elementToLowerCase = function (key) {
        for (var i = 0; i < this.length; i++) {
            if (key) {
                if (this[i] && this[i][key]) {
                    this[i][key] = (this[i][key] + '').toLowerCase();
                }
            } else if ((typeof this[i]) == 'string') {
                this[i] = this[i].toLowerCase();
            }
        }
    };
}
/**
 * 返回移到指定行的index
 */
if (!Array.prototype.move) {
    Array.prototype.move = function (from, to) {
        if (this.rangeCheck(from) && (to < 0 || this.rangeCheck(to))) {
            if (from != to) {
                var v1 = this[from];
                this.splice(from, 1);
                if (to < 0) {
                    this.push(v1);
                    return this.length - 1;
                    // } else if (from<to){
                    //     this.splice(to, 0, v1);
                    //     return to;
                } else {
                    this.splice(to, 0, v1);
                    return to;
                }
            }
        }
        return -1;
    };
}
(function () {
    var slice = Array.prototype.slice;
    try {
        slice.call(document.documentElement);
    } catch (e) {
        Array.prototype.slice = function (start, end) {
            start = start || 0;
            end = (typeof end !== 'undefined') ? end : this.length;
            if (Object.prototype.toString.call(this) === '[object Array]') {
                return slice.call(this, start, end);
            }
            start = Math.max(0, start);
            end = Math.min(end, this.length);
            var size = end - start;
            if (size > 0) {
                var arr = new Array(size);
                if (this.charAt) {
                    for (i = 0; i < size; arr[i] = this.charAt(start + i++)) ;
                } else {
                    for (i = 0; i < size; arr[i] = this[start + i++]) ;
                }
                return arr;
            }
            return [];
        };
    }
}());


var $e = $e || {};
//var ee=$e;
+function ($e) {
    $e.os = {
        ie: (!!window.ActiveXObject || "ActiveXObject" in window),
        android: false,
        ios: true
    };

    /**
     * 对注册事件集中管理的对象
     * @constructor
     */
    function EventCell() {
        this._evts = {};
    }

    EventCell.prototype = {
        /**
         * 添加注册的事件对象
         */
        add: function (eventobj) {
            if (!eventobj['handle']) {
                eventobj.handle = $e.events.nextHandle();
            }
            this._evts[eventobj.handle] = eventobj;
            return eventobj.handle;
        },
        done: function () {
            var arg1, cell,r1=true;
            var arg = [].slice.apply(arguments);
            for (var i in this._evts) {
                cell = this._evts[i];
                arg1 = arg.concat(cell.args || []);
                r1=cell.method.apply(cell.context, arg1);
                if (r1 === false) {
                    break;
                }
            }
            return r1;
        },

        /**
         * 卸载所有的注册事件
         */
        release: function () {
            if (this._evts) {
                for (var i in this._evts) {
                    this.remove(i);
                }
            }
            this._evts = null;
        },
        /**
         * 根据handle,移除某个注册事件
         */
        remove: function (handle) {
            var listen = this._evts[handle];
            if (listen) {
                if (listen.source) {
                    $e.events.removeEvent(listen.source, listen.eventType, handle);
                }
                delete this._evts[handle];
            }
        }
    };

    $e.events = {
        _handle: 0,
        nextHandle: function () {
            var h = ++this._handle;
            return "e" + h;
        },
        /**
         *
         * @param obj 事件所在的对象 如某个 element
         * @param eventtype 事件类型 如click
         * @param context 方法/函数运行所在的对象
         * @param func 运行的方法/函数
         * @returns
         */
        regEvent: function (obj, eventtype, context, method) {
            if (method && eventtype) {
                if (!obj._evts) {
                    obj._evts = {};
                }
                eventtype = this.realName(eventtype);
                if (!obj._evts[eventtype]) {
                    obj._evts[eventtype] = {};
                    obj[eventtype] = new Function('e_', "return ($e.events.doEvent(this,'" + eventtype + "',(e_ || window.event))) !==false;");
                }
                var handle = this.nextHandle();
                var eventobj = {
                    source: obj,
                    context: context,
                    handle: handle,
                    eventType: eventtype,
                    method: method,
                    args: [].slice.apply(arguments, [4]) || []
                };
                obj._evts[eventtype][handle] = eventobj;
                return eventobj;
            }
        },
        // regBindEvent: function (obj, eventtype,context,method) {
        //     var m1=this.bindAsEventListener(context,method,[].slice.call(arguments,4));
        //     return this.regEvent(obj,eventtype,context,m1);
        // },
        call: function (obj) {
            var arg = [].slice.apply(arguments, [1]) || [];
            if ((typeof  obj) == 'function') {
                obj.apply($e, arg);
            } else {
                arg = arg.concat(obj.args || []);
                obj.method.apply(obj.context || $e, arg);
            }
        },
        /**
         * 执行事件
         *
         * @param obj
         * @param etype
         * @param p...此处虚拟了4个参数
         */
        doEvent: function (obj, eventtype, event) {
            if (obj._evts) {
                eventtype = this.realName(eventtype);
                var fs = obj._evts[eventtype];
                if (fs) {
                    var result = true;
                    var arg = arguments.length > 2 ? [].slice.apply(arguments, [2]) : [];
                    for (var i in fs) {
                        result = (fs[i].method.apply(fs[i].context || $e, arg.concat(fs[i].args || [])) !== false);
                        if (!result && event) {
                            this.cancelEvent(event, true);
                        }
                    }
                    return result;
                }
            }
            return true;
        },

        /**
         * 删除某对象上注册的一个事件或某类型事件
         *
         * @param obj
         * @param etype
         *            类型
         * @param hdln
         *            方法
         * @returns
         */
        removeEvent: function (obj, eventtype, handle) {
            eventtype = this.realName(eventtype);
            if (obj && obj._evts && obj._evts[eventtype]) {
                if (handle) {
                    delete obj._evts[eventtype][handle];
                } else {
                    delete obj._evts[eventtype];
                }
            }
        },
        realName: function (eventtype) {
            return eventtype.startsWith('on') ? eventtype : ("on" + eventtype);
        },

        /**
         * 删除某对象上注册的所有事件
         *
         * @param obj
         * @returns
         */
        removeEvents: function (obj) {
            if (obj._evts) {
                // var i;
                for (var i in obj._evts) {
                    delete obj._evts[i];
                }
            }
        },

        /**
         * 停止事件的冒泡
         *
         * @param e
         * @param c
         */
        cancelEvent: function (e, c) {
            if (e) {
                e.returnValue = false;
                if (e.preventDefault)
                    e.preventDefault();
                if (c) {
                    e.cancelBubble = true;
                    if (e.stopPropagation)
                        e.stopPropagation();
                }
            }
        },

        /**
         *
         * @param {Object}
         *            object
         * @param {Function}
         *            fun
         * @param {Array}
         *            args
         * @return
         */
        bindAsEventListener: function (context, method, args) {
            if (arguments.length > 2) {
                if (!(args instanceof Array)) {
                    args = [].slice.apply(arguments, [2]);
                }
            } else {
                args = [];
            }
            return function () {
                var args1 = (arguments.length == 0) ? [] : [].slice.apply(arguments);
                args1 = args1.concat(args);
                return method.apply(context || $e, args1);
            };
        },
        createEventCell: function () {
            return new EventCell();
        }
    };

    $e.fn = {
        _maxID: 1000,
        _maxIndex: 1000,
        _FIELD_ENABLE: true,
        _menu: [],
        nextID: function () {
            return ++this._maxID;
        },
        nextIndex: function () {//modal
            return ++this._maxIndex;//+(modal?this._basicIndex:0);
        },
        // getBody:function(){
        //     return document.body || document.documentElement;
        // },
        getScrollBody: function () {
            return (document.body.scrollTop || document.body.scrollLeft) ? document.body : document.documentElement;
        },
        getInt: function (s, defa) {
            s = parseInt(s);
            s = isNaN(s) ? (arguments.length > 1 ? defa : 0) : s;
            return s;
        },
        getFloat: function (s, defa) {
            s = parseFloat(s);
            s = isNaN(s) ? (arguments.length > 1 ? defa : 0.0) : s;
            return s;
        },
        //为什么只有'1'， 返回true，
        getBoolean: function (s1, defa) {
            if (s1 == null || s1 == undefined) {
                s1 = (defa == null || defa == undefined) ? false : defa;
            }
            return ((s1 == 1) || (s1 == '1') || (s1 == 'true') || (s1 === true)) ? true : false;
        },
        /**
         * 统计text包含的c1个数
         * @param text
         * @param c1
         */
        countChar: function (text, c1) {
            var c = 0;
            if (text) {
                for (var i = 0; i < text.length; i++) {
                    if (text.charAt(i) == c1) {
                        c++;
                    }
                }
            }
            return c;
        },
        /**
         * 获取实际匹配类型的值,有待扩展
         *
         * @param type
         *            类型
         * @param prec
         *            精度
         * @param value
         *            值
         * @returns
         */
        parseValue: function (value, type, prec) {
            if (value + '') {
                prec = prec || 0;
                switch (type) {
                    case 'boolean':
                        value = this.getBoolean(value, false);
                        break;
                    case 'string':
                        value = (prec > 0 && value.length > prec) ? value.substring(0, prec) : value;
                        break;
                    case 'decimal':
                    case 'number':
                        if (typeof value == 'string') {
                            value = value.replace(/,/g, "");
                        }
                        if (isNaN(value)) {
                            value = null;
                        } else if ((typeof value) != 'number') {
                            value = parseFloat(value);
                        }
                        if (arguments.length > 2 && value) {
                            value = value.toFixed(prec) - 0;
                        }
                        break;
                    case 'date':
                    case 'datetime':
                    case 'time':
                        if (!(value instanceof Date)) {
                            if (typeof value == 'number' || !isNaN(value)) {
                                value = new Date(parseFloat(value));
                            } else {
                                var mils=0;
                                if (typeof(value)=='string'){
                                    var p=value.indexOf('.');
                                    if (p>0){
                                        mils=parseInt(value.substring(p+1));
                                        value=value.substring(0,p);
                                    }
                                    if (value.indexOf('-')>0){
                                        value=value.replace(new RegExp(/-/gm) ,"/");
                                    }
                                }
                                value = new Date(value);
                                if (mils>0){
                                    value.setMilliseconds(mils);
                                }
                            }
                        }
                        if (value && (type == "date")) {
                            value.setHours(0, 0, 0, 0);
                        }
                        break;
                    case 'int':
                    case 'integer':
                    case 'long':
                        if (isNaN(value)) {
                            value = null;
                        } else {
                            value = parseFloat(value).toFixed(0) - 0;
                        }
                        break;
                    default:
                        break;
                }
            }
            return value;
        },

        parseVars: function (array) {
            var vars = {};
            if (array && array.length > 0) {
                var v1;
                for (var i = 0; i < array.length; i++) {
                    v1 = array[i];
                    vars[v1.name] = this.parseValue(v1.value, v1.type);
                }
            }
            return vars;
        },

        /**
         * 使用函数或属性比较,是否匹配
         * @param elem
         * @param obj
         * @returns {*}
         */
        test: function (elem, method, value) {
            if (typeof method == 'function') {
                return method(elem, value);
            } else if (method) {
                var key;
                if (this.isPlainObject(method)) {
                    value = method['value'];
                    key = method['key'];
                } else {
                    key = method;
                }
                var r = false;
                if (elem.nodeType == 1 && key) {
                    if (key.startsWith(".")) {
                        r = $e.fn.hasClass(elem, key.substring(1));
                    } else if (value !== undefined) {
                        r = (elem.getAttribute(key) == value) || (elem[key] == value);
                    } else {
                        r = (!!elem.getAttribute(key)) || (elem[key] != undefined);
                    }
                } else if (key) {
                    r = (value == undefined) ? (elem[key] !== undefined) : (elem[key] == value);
                }
                return r;
            }
            return false;
        },
        plainobj: {
            string: {}.hasOwnProperty.toString.call(Object)
        },
        isPlainObject: function (obj) {
            if (!obj || {}.toString.call(obj) !== "[object Object]") {
                return false;
            }
            if (!Object.getPrototypeOf) {
                return true;
            }
            var proto = Object.getPrototypeOf(obj);
            if (this.plainobj.hasOwnProperty.call(proto, "constructor")) {
                return this.plainobj.hasOwnProperty.toString.call(proto.constructor) === this.plainobj.string;
            }
            return false;
        },
        clearObject: function (obj) {
            for (var i in obj) {
                delete obj[i];
            }
        },
        // js获取url传递参数，js获取url？号后面的参数window.location
        getQueryParameter: function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            return r ? decodeURIComponent(r[2]) : '';//unescape(r[2]) : '';
        },
        getE: function (id) {
            return document.getElementById(id);
        },
        isEmptyObject: function (e) {
            for (var t in e)
                return false;
            return true;
        },
        /**
         * createElement(tagName)函数，同时赋予其class
         *
         * @param {String}
         *            tagName
         * @param {String}
         *            className 可以忽略
         * @return {Element}
         */
        create: function (tag, cls, attrs) {
            var c1 = document.createElement(tag.toUpperCase());
            if (cls) {
                c1.className = cls;
            }
            if (attrs) {
                for (var a in attrs) {
                    c1.setAttribute(a, attrs[a]);
                }
            }
            return c1;
        },

        /**
         * @version 3.1 增加了参数isdeeep,表示是否深度继承
         */
        extend: function (source, target, overwrite,isdeep) {
            if (source && target) {
                overwrite = !!overwrite;
                for (var f in source) {
                    //目标对象没有该属性，或overwrite为true
                    if ((target[f] == undefined)) {
                    	if (this.isPlainObject(source[f])){
                    		target[f]={};
                    		this.extend(source[f],target[f],overwrite,isdeep);
                    	}else{
                    		target[f] = source[f];
                    	}
                    }else if (isdeep){
                    	if (this.isPlainObject(source[f])){
                    		if (target[f]==null || !this.isPlainObject(target[f])){
                    			target[f]={};
                    		}
                    		this.extend(source[f],target[f],overwrite,isdeep);
                    	}else if (overwrite){
                    		target[f] = source[f];
                    	}
                    }else if (overwrite){
                    	target[f] = source[f];
                    }
                }
            }
            return target;
        },
        /**
         * 根据字符串创建对象
         * @param s
         * @returns {*}
         */
        createObject: function (s) {
            if (s) {
                if (this.isPlainObject(s)) {
                    return s;
                } else if ((typeof s) == 'string') {
                    var i = 0;
                    while (i < s.length && s.charAt(i) <= ' ') {
                        i++;
                    }
                    if (i > 0) {
                        s = s.substring(i);
                    }
                    if (s.startsWith("{") && !s.startsWith('return')) {
                        s = "return " + s;
                    }
                    var obj = {};
                    if (s.startsWith("return")) {
                        try {
                            var f = new Function(s);
                            obj = f();
                        } catch (err) {
                            throw err + "\n" + s;
                        }
                    }
                    return obj;
                }
            }
            return {};
        },

        /**
         * 查询满足条件的第一个父节点
         */
        closest: function (node, method, includecurrent) {
            if (node) {
                node = node.target || node.srcElement || node;
                var e1, r;
                if (includecurrent) {
                    r = this.test(node, method);
                    if (r === 1 || r === true) {
                        return node;
                    } else if (r === -1) {
                        return null;
                    } else if (method['end']) {
                        e1 = method['end'];
                        //是截至的节点，或tagName为该值、或节点就有end的变量属性
                        if ((e1 == node) || (e1 == node.tagName) || (node[e1] !== undefined)) {
                            return null;
                        }
                    }
                }
                node = node.parentNode;
                while (node) {
                    r = this.test(node, method);
                    if (r === true || r === 1) {
                        return node;
                    } else if (r == -1) {
                        //停止搜索
                        break;
                    } else if (method['end']) {
                        e1 = method['end'];
                        //是截至的节点，或tagName为该值、或节点就有end的变量属性
                        if ((e1 == node) || (e1 == node.tagName) || (node[e1] !== undefined)) {
                            break;
                        }
                    }
                    node = node.parentNode;
                }
            }
            return null;
        },

        isParent: function (child, parent) {
            while (child && child != parent) {
                child = child.parentNode;
            }
            return child == parent;
        },

        queryOwner: function (node, notview) {
            var shell = this.closest(node, '$owner', true);
            var r = shell ? shell['$owner'] : null;
            if (r && notview && (r['_owner_type'] == "view")) {
                return null;
            }
            return r;
        },
        queryOwnerView: function (node) {
            var shell = this.closest(node['shell'] || node, function (n1) {
                if (n1['$owner'] && (n1['$owner']['_owner_type'] == 'view')) {
                    return 1;
                }
            }, true);
            return shell ? shell['$owner'] : null;
        },

        /**
         * 移除指定shell的所有子节点,设置为child
         *
         * @param parent
         * @param child
         */
        setChild: function (parent, child) {
            if (!!parent) {
                while (parent.lastChild) {
                    parent.removeChild(parent.lastChild);
                }
                if (child) {
                    this.addChild(parent, child);
                }
            }
        },
        /**
         * 为指定shell添加child
         *
         * @param parent
         * @param child
         */
        addChild: function (parent, child) {
            if (parent && child) {
                parent.appendChild(child);
            }
        },

        /**
         * 获取元素所在的绝对位置(在元素ref中，从border开始)
         * @param shell
         * @returns {*}
         */
        getLocation: function (shell, root) {
            if (shell) {
                var top = shell.offsetTop;
                var left = shell.offsetLeft;
                var elem = shell;
                var st, b = false;
                var gi = $e.fn.getFloat;
                while (elem.offsetParent) {
                    elem = elem.offsetParent;
                    top += elem.offsetTop;
                    left += elem.offsetLeft;
                    //st = $e.fn.getStyle(elem);
                    // if (st['position'] == 'fixed') {
                    //     var body=$e.fn.getBody();
                    //     left += body.scrollLeft;
                    //     top += body.scrollTop;
                    //     break;
                    // }
                    if (elem.tagName == 'BODY') {
                        if (!!root) {
                            left -= document.documentElement.scrollLeft || document.body.scrollLeft;
                            top -= document.documentElement.scrollTop || document.body.scrollTop
                        }
                        break;
                    }
                    // if (elem.offsetParent!=elem.parentNode) {
                    left -= gi(elem.parentNode.scrollLeft, 0);
                    top -= gi(elem.parentNode.scrollTop, 0);
                    // }
                    // if (elem.offsetParent!=elem.parentNode) {
                    //     left -= gi(elem.scrollLeft, 0);
                    //     top -= gi(elem.scrollTop, 0);
                    // }
                }
                st = $e.fn.getStyle(shell);
                var tmp = {
                    top: top,// - gi(st.marginTop, 0) - gi(st.boderTop, 0),
                    left: left,// - gi(st.marginLeft, 0) - gi(st.boderLeft, 0),
                    width: shell.offsetWidth,
                    height: shell.offsetHeight,
                    zIndex: st.zIndex || 0
                };
                return tmp;
            }
            return null;
        },
        getRelativeOffset: function (e, node) {
            var left = e.pageX || (e.clientX + document.body.scrollLeft);
            var top = e.pageY || (e.clientY + document.body.scrollTop);
            if (node) {
                var pos = this.getLocation(node);
                left -= pos.left;
                top -= pos.top;
            }
            return {
                offsetX: left,
                offsetY: top
            };
        },
        realSize: function (node, onlystyle) {
            if (node) {
                var st = $e.fn.getStyle(node);
                var gi = $e.fn.getFloat;
                var w, h, wo, ho;
                wo = !((st.width + '').endsWith('px') || onlystyle);
                ho = !((st.height + '').endsWith('px') || onlystyle);
                w = wo ? node.offsetWidth : gi(st.width);
                h = ho ? node.offsetHeight : gi(st.height);
                // var w = ((st.width + '').endsWith('px') || onlystyle) ? gi(st.width) : node.offsetWidth;
                // var h = ((st.height + '').endsWith('px') || onlystyle)? gi(st.height) : node.offsetHeight;
                var s = {
                    blankWidth: gi(st.paddingLeft, 0) + gi(st.borderLeftWidth, 0) + gi(st.paddingRight, 0) + gi(st.borderRightWidth, 0),
                    blankHeight: gi(st.paddingTop, 0) + gi(st.borderTopWidth, 0) + gi(st.paddingBottom, 0) + gi(st.borderBottomWidth, 0),
                    marginWidth: gi(st.marginLeft, 0) + gi(st.marginRight, 0),
                    marginHeight: gi(st.marginTop, 0) + gi(st.marginBottom, 0),
                    marginTop: gi(st.marginTop, 0),
                    marginBottom: gi(st.marginBottom, 0)
                };
                s.width = w - s.blankWidth;
                s.height = h - s.blankHeight;
                return s;
            }
            return null;
        },
        /**
         *
         * @param shell
         * @param isshow
         * @param option {side:left/down/right/top/center,ref:element,move:{top:10,left:10}}
         */
        showElement: function (shell, isshow, option) {
            var shell = shell['shell'] || shell;
            if (isshow) {
                this.removeClass(shell, 'hide');
                if (option) {
                    var side = option['side'];
                    var ref = option['ref'];
                    var top = -1000, left = -1000;
                    var fi = $e.fn.getInt;
                    if (side == 'point') {
                        top = option.top;
                        left = option.left;
                    } else if (ref) {
                        var rs = this.getLocation(ref, $e.fn.getStyle(shell)['position'] == 'fixed');
                        if (side == 'top') {
                            left = rs.left;
                            top = rs.top - shell.offsetHeight;
                            left=left<0?0:left;
                            top=top<0?0:top;
                        } else if (side == 'down') {
                            left = rs.left;
                            top = rs.top + rs.height;
                            if (top+shell.offsetHeight>document.body.clientHeight){
                                top = rs.top - shell.offsetHeight-4;
                                left=left<0?0:left;
                                top=top<0?0:top;
                            }
                        } else if (side == 'left') {
                            top = rs.top;
                            left = rs.left - shell.offsetWidth;
                        } else if (side == 'right') {
                            top = rs.top;
                            left = rs.left + rs.width;
                        } else {
                            //center
                            left = rs.left + parseInt((rs.width - shell.offsetWidth) / 2);
                            top = rs.top + parseInt((rs.height - shell.offsetHeight) / 2);
                        }
                    } else if (side == 'center' || !side) {
                        var body = document.body;
                        var st0 = $e.fn.getStyle(shell);
                        var w1 = (st0.width == 'auto' || st0.width == '' || (st0.width + '').endsWith("%")) ? shell.offsetWidth : st0.width;
                        var h1 = (st0.height == 'auto' || st0.height == '' || (st0.height + '').endsWith("%")) ? shell.offsetHeight : st0.height;
                        left = parseInt((body.clientWidth - fi(w1, 0)) / 2);
                        top = parseInt((body.clientHeight - fi(h1, 0)) / 2);
                        left = (left < 0 ? 0 : left) + fi(body.scrollLeft || window.scrollX);
                        top = (top < 0 ? 0 : top) + fi(body.scrollTop || window.scrollY);
                    }
                    if (option['move']) {
                        top += option.move.top || 0;
                        left += option.move.left || 0;
                    }
                    if (!option['deviating']) {
                        left = left < 0 ? 0 : left;
                        top = top < 0 ? 0 : top;
                    }
                    this.setStyle(shell, "top:" + top + "px;left:" + left + "px");
                }
            } else {
                this.addClass(shell, 'hide');
            }
        },

        isElementShow: function (shell) {
            var show = $e.fn.getStyle(shell, 'display');
            return show != 'none';
        },

        setLabelText: function (label, text) {
            if (label) {
                text = text + '';
                if ('textContent' in label) {
                    label.textContent = text;
                } else {
                    label.innerText = text;
                }
            }
        },

        getLabelText: function (label) {
            return label ? (label.innerText || label.textContent) : "";
        },

        enableField: function (field, able) {
            if (field) {
                if (able) {
                    field.removeAttribute("disabled");
                } else {
                    field.setAttribute("disabled", "true");
                }
            }
        },
        enableFields: function (fields, able) {
            if (fields) {
                for (var i = 0; i < fields.length; i++) {
                    this.enableField(fields[i], able);
                }
            }
        },
        editableField: function (field, able) {
            if (able) {
                field.removeAttribute("readonly");
            } else {
                field.setAttribute("readonly", "true");
            }
        },

        regMenu: function (menu) {
            this.showMenu(menu);
        },

        /**
         *
         * @param menu {shell:element,locate:"",reference:view,flash:"",level:0}
         */
        showMenu: function (menu) {
            var level = menu['level'] || 0;
            this.hideMenu(level);
            this.showElement(menu['shell'], true, menu);
            this._menu.push(menu);
        },

        hideMenu: function (level) {
            level = !isNaN(level) ? level : 0;
            var m1;
            while (this._menu.length > level) {
                m1 = this._menu.pop();
                this.showElement(m1['shell'], false);
            }
        },
        syncMovingMenu: function () {
            if (this._menu.length > 0) {
                var menu;
                for (var i = 0; i < this._menu.length; i++) {
                    menu = this._menu[i];
                    if (this.isElementShow(menu['shell'])) {
                        $e.fn.showElement(menu['shell'], true, menu);
                    }
                }
            }
        },
        bindMovingMenu: function (view) {
            var shell = view.getShell();
            var s = shell.querySelectorAll('[scrollmenu="1"]');
            if (s && s.length > 0) {
                for (var i = 0; i < s.length; i++) {
                    view.bindListen($e.events.regEvent(s[i], 'scroll', $e.fn, $e.fn.syncMovingMenu));
                    s[i].setAttribute("scrollmenu", "0");
                }
            }
        },

        /**
         *
         * @param title
         * @param msg
         * @param option {type:info,error,warn,question,context:xxx,button:[{name:yes,text:确认,method:function(){}],[yes,no],[yes,cancel],[yes,no,cancel],method:{}}
         */
        // showMessage: function (text, options) {
        //     options = options ? options : {};
        //     options.text = text;
        //     var msg = this.message(options && options['isnew']);
        //     msg.show(text, options);
        // },

        /**
         * 解决IE和FF获取对象当前属性的hack，实现统一，
         *
         * @param oElement
         * @return
         */
        getStyle: function (e1, key1) {
            if (e1 && e1.nodeType == 1) {
                if (e1.currentStyle) {
                    return key1 ? e1.currentStyle[key1] : e1.currentStyle;
                } else {
                    var st = getComputedStyle(e1, false);
                    return key1 ? st.getPropertyValue(key1) : st;
                }
            }
            return {};
        },

        setStyle: function (e1, exp) {
            if (e1 && exp) {
                if (!e1.style) {
                    e1.setAttribute('style', exp);
                } else if ($e.os.ie) {
                    e1.style.cssText = e1.style.cssText ? (e1.style.cssText + ";" + exp) : exp;
                } else if (exp) {
                    var p, s = exp.split(";");
                    for (var i = 0; i < s.length; i++) {
                        if (s[i].length > 0) {
                            p = s[i].indexOf(":");
                            if (p > 0) {
                                e1.style.setProperty(s[i].substring(0, p).trim(), s[i].substring(p + 1).trim());
                            }
                        }
                    }
                }
            }
        },

        // opacity 设置透明度
        setOpacity: function (elem, value) {
            elem.filters ? elem.style.filter = 'alpha(opacity=' + value + ')'
                : elem.style.opacity = value / 100;
        },

        /**
         * 判断样式是否存在
         *
         * @param elem
         * @param cls
         * @returns {*}
         */
        hasClass: function (elem, cls) {
            // if (elem.classList) {
            //     return elem.classList.contains(cls);
            // } else {
            return new RegExp('(^| )' + cls + '( |$)', 'gi').test(elem.className);
            // }
        }
        ,

        /**
         * 为指定的dom元素添加样式
         *
         * @param elem
         * @param cls
         */
        addClass: function (elem, cls) {
            var cs=cls?cls.split(" "):[];
            for (var i=0;i<cs.length;i++) {
                cls=cs[i];
                if (cls) {
                    if (elem.classList) {
                        elem.classList.add(cls);
                    } else {
                        if (!new RegExp('(^| )' + cls + '( |$)', 'gi').test(elem.className)) {
                            elem.className += ' ' + cls;
                        }
                    }
                }
            }
        }
        ,

        /**
         * 删除指定dom元素的样式
         *
         * @param elem
         * @param cls
         */
        removeClass: function (elem, cls) {
            if (elem.classList) {
                elem.classList.remove(cls);
            }
            else {
                if (!elem.className) {
                    elem.className = '';
                }
                elem.className = elem.className.replace(new RegExp('(^|\\b)' + cls.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
            }
        }
        ,

        /**
         * 如果存在(不存在)，就删除(添加)一个样式
         *
         * @param elem
         * @param cls
         */
        toggleClass: function (elem, cls) {
            if (elem.classList) {
                elem.classList.toggle(cls);
            } else {
                var classes = elem.className.split(' ');
                var existingIndex = -1;
                for (var i = classes.length; i--;) {
                    if (classes[i] === cls) {
                        existingIndex = i;
                    }
                }
                if (existingIndex >= 0) {
                    classes.splice(existingIndex, 1);
                }
                else {
                    classes.push(cls);
                }
                elem.className = classes.join(' ');
            }
        },

        //改变dom节点样式另一种方式是利用js动态创建一个style标签，再填入css属性,再添加到页面
        loadCSS: function (csstext) {
            if (csstext) {
                var head = document.getElementsByTagName('head')[0];
                var node = document.createElement('style');
                node.setAttribute('type', 'text/css');
                if ('styleSheet' in node) {
                    node.styleSheet.cssText = csstext;
                } else {
                    node.innerHTML = csstext;
                }
                head.appendChild(node);
            }
        },




        /*---防抖与节流---*/
        /*
        * 防止指定函数多次调用。当一直触发指定函数时，触发间隔小于指定时间，
        * 防抖方法下调用一次;
        * 节流方法下每隔一定时间调用一次;
        */

        /*---防抖(debounce)---*/
        /**
         *
         * 所谓防抖，就是指触发事件后在 n 秒内函数只能执行一次，如果在 n 秒内又触发了事件，则会重新计算函数执行时间。
         *
         * params :
         *
         *func : 需要进行防抖处理的函数；
         * wait : 指定时间间隔；
         *immediate : 指定是否立即执行函数
         *
         * */

        debunce: function (func, wait, immediate) {
            var timeout;

            if (immediate === undefined) {
                immediate = true;
            }

            return function () {
                var context = this;
                var args = arguments;

                if (timeout) {
                    clearTimeout(timeout);
                }

                if (immediate) {
                    var callNow = !timeout;
                    timeout = setTimeout(function () {
                        timeout = null;
                    }, wait);

                    if (callNow) {
                        func.apply(context, args);
                    }
                } else {
                    timeout = setTimeout(function () {
                        func.apply(context, args);
                    }, wait);
                }
            }
        },

        /*---节流(throttle)---*/
        /**
         *
         * 所谓节流，就是指连续触发事件但是在 n 秒中只执行一次函数。
         *
         * params :
         *
         *func : 需要进行节流处理的函数；
         * wait : 指定时间间隔；
         *type : 1 表示时间戳版, 2 表示定时器版
         *
         * */

        throttle: function (func, wait, type) {
            type = type || 1;

            // 使用 == 兼容字符串;
            if (type == 1) {
                var previous = 0;
            } else if (type == 2) {
                var timeout;
            }

            return function () {
                var context = this;
                var args = arguments;
                if (type == 1) {
                    var now = Date.now();

                    if (now - previous > wait) {
                        func.apply(context, args);
                        previous = now;
                    }
                } else if (type == 2) {
                    if (!timeout) {
                        timeout = setTimeout(function () {
                            timeout = null;
                            func.apply(context, args);
                        }, wait);
                    }
                }
            }
        }

    };
    $e.fn._hideHandel = $e.events.regEvent(document, 'click', $e.fn, $e.fn.hideMenu);
    $e.fn._scrollHandel = $e.events.regEvent(document, 'scroll', $e.fn, $e.fn.syncMovingMenu);
    $e.fn.extend({
        type_D: "date",
        type_DT: "datetime",
        type_T: "time",
        reg_fmt: {},
        /**
         * 将日期或日期类型的变量格式化成指定类型的字符串
         *
         * @param date
         * @param f
         * @returns
         */
        formatDate: function (date, ftext) {
            //TODO
        	if(date && !(date instanceof Date)){
        		date = $e.fn.parseValue(date, 'datetime');
        	}
            if (date && date instanceof Date) {
                ftext = ftext ? ftext : "yyyy-MM-dd HH:mm:ss";
                var o = {
                    "M+": date.getMonth() + 1,
                    "d+": date.getDate(),
                    "H+": date.getHours(),
                    "h+": date.getHours() > 12 ? date
                        .getHours() - 12 : date.getHours(),
                    "m+": date.getMinutes(),
                    "s+": date.getSeconds(),
                    "q+": Math
                        .floor((date.getMonth() + 3) / 3),
                    "f+": date.getMilliseconds()
                };
                if (/(y+)/.test(ftext)) {
                    ftext = ftext.replace(RegExp.$1, (date
                        .getFullYear() + "")
                        .substr(4 - RegExp.$1.length));
                }
                for (var k in o) {
                    if (new RegExp("(" + k + ")").test(ftext)) {
                        ftext = ftext
                            .replace(
                                RegExp.$1,
                                RegExp.$1.length == 1 ? o[k]
                                    : ((k.charAt(0) == 'f' ? "000"
                                    : "00") + o[k])
                                        .substr(("" + o[k]).length));
                    }
                }
                return ftext;
            }
            return "";
        },

        /**
         * 分割符必须为/或-
         *
         * @param s
         * @returns
         */
        isDateText: function (s) {
            if (s && (s + '').trim() && !!isNaN(s)) {
                var date = new Date(s);
                return !isNaN(date.getDay());
            }
            return false;
        },
        /**
         * 格式化数字
         *
         * @param num
         * @param pattern
         * @returns
         */
        formatNumber: function (num, ftext) {
            if (typeof (num) == "string") {
                num = num.replace(/,/g, "");
            }
            num = parseFloat(num);
            if (isNaN(num) || num == null) {
                return '';
            }
            var str = '';
            if (num || num === 0) {
                if (!ftext) {
                    return num + '';
                }
                var fmt = ftext = ftext.trim();
                if (fmt.endsWith("%")) {
                    num = num * 100;
                    fmt = fmt.substr(0, fmt.length - 1);
                }
                var split = false;
                fmt = fmt.split('.');
                if (fmt.length > 1) {
                    // 有小数,四舌五入
                    num = num.toFixed(fmt[1].length);
                } else {
                    num = num.toFixed(0);
                }
                var p = fmt[0].lastIndexOf(",");
                if (p >= 0) {
                    fmt[0] = fmt[0].substring(p + 1);
                    split = (fmt[0].length > 0);
                }
                var str_num = num.split('.');
                if (split) {
                    str = str_num[0].replace(this.getRegExp(fmt[0].length), "$1,");
                } else {
                    //无分节号
                    str = str_num[0];
                }
                if (str_num.length > 1 && fmt.length > 1) {
                    //有小数
                    var i = str_num[1].length - 1;
                    while (i >= 0) {
                        if (str_num[1].charAt(i) != '0' || fmt[1].charAt(i) != '#') {
                            break;
                        }
                        i--;
                    }
                    if (i >= 0) {
                        str = str + "." + str_num[1].substring(0, i + 1);
                    }
                }
                str = (str == '-') ? '' : str;
                if ((str.length > 0) && ftext && ftext.endsWith("%")) {
                    str = str + "%";
                }
            }
            return str;
        },
        getRegExp: function (type) {
            type = type + '';
            var reg = this.reg_fmt[type];
            if (!reg) {
                this.reg_fmt[type] = reg = new RegExp('(\\d{1,' + type + '})(?=(\\d{' + type + '})+(?:$))', "g");
            }
            return reg;
        },
        /**
         *
         * @param value
         * @param type
         *            string,number,date,datetime,time
         * @param prec
         * @returns
         */
        getDataText: function (value, type, prec) {
            if (value) {
                if (type == "string") {
                    // 强制转型
                    if (value instanceof Date) {
                        value = this.formatDate(value, "yyyy-MM-dd");
                    } else {
                        value = value + '';
                    }
                    if (prec && prec > 0 && value.length > prec) {
                        value = value.substr(0, prec);
                    }
                } else if (type == "number" || type == "int" || type == 'long') {
                    value = this.formatNumber(value, "0." + "#".fillText(prec));
                } else if (type == "date") {
                    value = this.formatDate(value, "yyyy-MM-dd");
                } else if (type == "datetime") {
                    value = this.formatDate(value, "yyyy-MM-dd hh:mm:ss");
                } else if (type == "time") {
                    value = this.formatDate(value, "hh:mm:ss");
                }
            }
            return value;
        },

        /**
         * 格式化字符,数字,日期时间类型的文本
         *
         * @param value
         * @param type
         * @param ftext
         * @param prec
         * @returns
         */
        formatData: function (value, ftext, type, prec, focused) {
            if (value) {
                if (!type && this.isDateText(value + '')) {
                    type = 'date';
                }
                type = type ? type : typeof (value);
                if (type == "text" || type == 'string') {
                    value += "";
                    if (ftext == "U" || ftext == 'upper') {
                        value = value.toUpperCase();
                    } else if (ftext == "L" || ftext == 'lower') {
                        value = value.toLowerCase();
                    }
                } else if (type == "percent"
                    || type == 'number' || type == 'int'
                    || type == 'long') {
                    value = this.formatNumber(value, ftext);
                    // 格式化
                    if (focused) {
                        // 替换","为空
                        value = value.replace(/,/g, "");
                    }
                } else if (type == "date" || type == "datetime" || type == "time") {
                    value = this.formatDate(value, ftext);
                }
            }
            return value == null ? '' : value;
        },
        getDataAlign: function (type) {
            var a = 'left';
            if (type == 'number' || type == "percent") {
                a = 'right';
            } else if (type == 'int' || type == 'long'
                || type == 'date' || type == "datetime") {
                a = 'center';
            }
            return a;
        }
    }, $e.fn);

}($e);
