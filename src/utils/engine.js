class ActiveModule{
    _amn='';
    _adapter=null;
    engine=null;
    constructor(amn,engine){
        this._amn=amn;
        this.engine=engine;
        this.ados = {};
    }

    /**
     *
     * @param name
     * @param ados 用“，”分割的数据对象名
     * @param jsonparm 要传递的json格式数据
     * @param options
     */
    // call = (name, ados, jsonparm, options)=> {
    //     return this.request("call", name, ados, jsonparm, options);
    // }
    //
    // selfCall=(name, ados, jsonparm, options)=> {
    //     return this.request("async", name, ados, jsonparm, options);
    // }
    getADO=(name)=>{
        name=this.engine.fn.convertName(name);
        return this.ados[name];
    }
    addADO=(ado)=>{
        name=this.engine.fn.convertName(name);
        if (!this.ados[name]) {
            this.ados[name] = ado;
        }
    }
    getAdapter(){
        return this._adapter;
    }
    createAdapter(vue){
        if (!this._adapter) {
            this._adapter = new Adapter(vue);
        }
        return this._adapter;
    }
    /**
     *
     * @param name
     * @param type
     *            getado/getview/getany/call/[selfcall/async]/release
     * @param options
     */
    // request=(type, name, ados, jsondata, options)=> {
    //     options = options || {};
    //     var am = this.getActiveModuleName();
    //     var cell = null;
    //     if (type == 'getado') {
    //         cell = this.engine.getADO(name, am);
    //     }
    //     if (cell){
    //         return cell;
    //     }else {
    //         options.params = options.params || {};
    //         options.params._mn = options.params._mn || this._amn;
    //         return this.engine.request(this._amn, type, name, ados, jsondata, options);
    //     }
    // }
    release=()=>{
        if (this.engine) {
            for (var i in this.ados) {
                this.ados[i].release();
            }
            this.ados = null;
            this.engine = null;
            if (this._adapter) {
                this._adapter.release();
                this._adapter=null;
            }
        }
    }
}

class Adapter {
    constructor(vue){
        this.vue = vue
    }

    /**
     *
     * @param adoname
     * @param rows1 vue中的，仅指定名称即可
     * @param vars1  vue中的，仅指定名称即可
     */
    mappingData(adoname, rows1, vars1){
        this[adoname]={rows:rows1,vars:vars1};
    };
    outData(adoname,rows,isclear){
        var rows0=this.vue._data[this[adoname]['rows']];
        if (isclear){
            rows0.splice(0,rows0.length);
        }
        rows0.push(rows);
    }
    getData(adoname){
        return this.vue._data[this[adoname]['rows']];
    }
    getVars(adoname){
        return this.vue._data[this[adoname]['vars']];
    }
    release(){
        this.vue = null;
        this.ados = null;
        this.adoname=null;
    }

}

class Engine{
    _inited=false;
    _amgn=null;
    _checkid=null;
    _lifeType='keep';
    _baseURI='';
    _envs={};
    am=null;
    ams={};
    fn={
        reg_fmt: {},
        convertName(name){
            return name?name.toLowerCase():name;
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
        plainObj:{
            string: {}.hasOwnProperty.toString.call(Object)
        },
        isPlainObject:function(obj) {
            if (!obj || {}.toString.call(obj) !== "[object Object]") {
                return false;
            }
            if (!Object.getPrototypeOf) {
                return true;
            }
            var proto = Object.getPrototypeOf(obj);
            if (this.plainObj.hasOwnProperty.call(proto, "constructor")) {
                return this.plainObj.hasOwnProperty.toString.call(proto.constructor) === this.plainObj.string;
            }
            return false;
        },
        isEmptyObject: function (e) {
            for (var t in e)
                return false;
            return true;
        },
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

    //初始化，外部驱动
    init=(amgn,amn,checkid,options={})=>{
        amn=amn||amgn;
        this._amgn=amgn;
        this._checkid= checkid || this._checkid;
        if (!this.am && amn==amgn) {
            this.am = new ActiveModule(amgn, this);
        }
        let am1=this.getActiveModule(amn);
        let act=options['_act'];
        if (!options.success) {
            options.success = this.inited;
            options.context = this;
        } else {
            options.success = [ this.initEnd, options.success ];
        }
        if (!this._inited || (!this._checkid) || (checkid !=this._checkid) || !am1){
            this.request(amn, "reg_am", act, null, null, options);
        }else if (act){
            this.request(amn, "call", act, null, null, options);
        }
    }
    initEnd=(options)=>{
        this._public = options['public'] || false;
        this._lifeType = (options['lifeType'] || 'keep' )== 'keep';
        this._inited = true;
    }
    getActiveModule=(name,force)=>{
        if (!name || name==this._amgn){
            return this.am;
        }
        let am1=this.ams[name];
        if (!am1 && force){
            am1=new ActiveModule(name,this);
            this.ams[name]=am1;
        }
        return am1;
    }
    getADO=(name,amn)=>{
        name=this.fn.convertName(name);
        let am=this.getActiveModule(amn||this._amgn);
        return am?am.getADO(name):null;
    }
    getAdapter(amn){
        let am=this.getActiveModule(amn);
        return am==null?null:am.getAdapter();
    }
    createAdapter(vue,amn){
        let am=this.getActiveModule(amn,force);
        return am.createAdapter(vue);
    }

    serialURL=(url, norand)=> {
        if (this.fn.isPlainObject(url)) {
            url = this.fn.extend(url, {});
            if (!norand) {
                url._rand = this.randNum();
            }
            var url1 = url._baseURI || (this._baseURI + "cloud?");
            delete url['_baseURI'];
            var type, value;
            var link = url1.indexOf('?') >= 0;
            for (var key in url) {
                type = (typeof key);
                if (typeof type == 'string' || type instanceof String) {
                    value = url[key] + '';
                    type = (typeof value);
                    if ((value instanceof String)  || (type != 'function' && type != 'object' && type != 'array')) {
                        if (!link) {
                            url1 += "?";
                            link = true;
                        }
                        url1 = url1 + '&' + encodeURIComponent(key) + '=' + encodeURIComponent((value || '') + '');
                    }
                }
            }
            url = url1.replace('?&', '?');
        }
        return url;
    }

    getURL=(type, options, hasdata, noid)=>{
        options = options || {};
        $e.fn.extend(
            {
                _hasdata: $e.fn.getBoolean(hasdata) ? "1" : "0",
                _type: type,
                _amgn: this._amgn,
                _baseURI: this._baseURI + "cloud?",
                _checkid: this._checkid || ''
            }, options);
        return this.serialURL(options, noid);
    }
    // 产生随机数,ok
    randNum=()=>{
        var today = new Date();
        return Math.abs(Math.sin(today.getTime()));
    }
    //type, name, ados, jsondata, options
    call = (amn,name, ados, jsondata, options)=> {
        return this.request(amn,"call", name, ados, jsondata, options);
    }

    selfCall=(amn,name, ados, jsondata, options)=> {
        return this.request(amn,"async", name, ados, jsondata, options);
    }
    buildData=(amn, ados, jsondata)=>{
        var data = {};
        if (ados) {
            data.ados = this.getEditADOData(amn, ados);
        }
        if (jsondata) {
            data.data = jsondata;// (rowsparm instanceof
            // Array)?rowsparm:[rowsparm];
        }
        return this.fn.isEmptyObject(data) ? null : JSON.stringify(data);
    }
    request=(amn, type, name, adosname, jsondata,options)>={
        // 获取需要同步的数据对象action, param, data
       amn = (amn || this._amgn);
       let data = this.buildData(amn, adosname, jsondata);
        // 执行服务器端调用,主动分析返回的数据,做相关的处理,顺序是先处理同步数据,再显示同步消息
        // 如1.数据保存后,返回的同步信息
        // 2.在刷新数据对象时,更新本地缓存的数据
        // 3.其他方式下,执行服务器端调用后,同步返回的信息
        let settings = {
            _baseURI: this._baseURI + "cloud?",
            _amgn: this._amgn,
            _amn: amn,
            _name: name,
            _type: type,
            _hasdata: (data ? "1" : "0"),
            _checkid: $e.getEnv('_checkid') || ''
        };
        options = options || {};
        if (options.async == undefined) {
            options.async = true;// (type == 'call') ? false : true;
        }
        if (options.params) {
            $e.fn.extend(options.params, settings, true);
        }
        options.error=options['error']||this.defa_error;
        this.ajax(settings, data, options);// , null, null, options
    }
    release=()=>{
        if (this.ams) {
            if (this.am) {
                this.am = null;
            }
            for (var i in this.ams) {
                this.ams[i].release();
            }
            this.ams = null;
        }
    }

}
let $e=new Engine();


ActiveModule.hello()


var foo = new ActiveModule;




export function call() {

}


export default engine;
