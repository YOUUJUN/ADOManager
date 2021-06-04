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
                } else {
                    this.splice(to, 0, v1);
                    return to;
                }
            }
        }
        return -1;
    };
}

var $e = $e || {};
+function ($e) {
    $e.fn = {
        _FIELD_ENABLE: true,
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
        arrayFind(array,key,value){
            if (array){
                for (let i=0;i<array.length;i++){
                    if (array[i][key]==value){
                        return i;
                    }
                }
            }
            return -1;
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
        }
    };
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
        }
    }, $e.fn);

}($e);
