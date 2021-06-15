
class ActiveModule {
    _amn = '';
    _adapter = null;
    engine = null;

    constructor(amn, engine) {
        this._amn = amn;
        this.engine = engine;
        this.ados = {};
    }

    getADO = (name) => {
        name = this.engine.fn.convertName(name);
        return this.ados[name];
    }
    addADO = (ado) => {
        let name = ado.getName();
        name = this.engine.fn.convertName(name);
        if (!this.ados[name]) {
            this.ados[name] = ado;
        }
    }
    getAdapter = () => {
        return this._adapter;
    }
    createAdapter = (vue, reset) => {
        if (!this._adapter || !!reset) {
            if (this._adapter) {
                this._adapter.release();
            }
            this._adapter = new Adapter(vue, this._amn);
        }
        return this._adapter;
    }
    release = () => {
        if (this.engine) {
            for (let i in this.ados) {
                this.ados[i].release();
            }
            this.ados = null;
            this.engine = null;
            if (this._adapter) {
                this._adapter.release();
                this._adapter = null;
            }
        }
    }
}

class Adapter {
    vue = null;
    amn = null;

    constructor(vue, amn) {
        this.vue = vue
        this.amn = amn;
    }

    /**
     *
     * @param adoname
     * @param rows1 vue中的，仅指定名称即可
     * @param vars1  vue中的，仅指定名称即可
     * @param options 存放回写的字段{writeback:['colname1','colname2']},如为空，表示会写所有字段
     */
    mappingData(adoname, rows1, vars1, options) {
        this[adoname] = {rows: rows1, vars: vars1, options: options};
    };

    /**
     * 从ADO的修改或整体数据，输出到接口
     * @param adoname
     * @param data 数据{type:'refresh'/edit,rows:[],clear:false/true，vars:{}}
     * @param isclear
     */
    outData(adoname, isclear) {
        //必须事先已经建立映射关系
        if (this[adoname]) {
            let data=$e.getADO(adoname,this.amn).getReflectData(!!isclear);
            if (data) {
                let rows0 = this.vue._data[this[adoname]['rows']];
                if (data.type == 'refresh') {
                    if (!!data.clear) {
                        rows0.splice(0, rows0.length);
                    }
                    rows0.push(data.rows);
                } else {
                    let row = 0, rowid = -1, status = '0', rows = data.rows;
                    //ROW_ADD: '2',ROW_EDIT: '1',ROW_DELETE: '3'
                    for (let i = 0; i < rows.length; i++) {
                        rowid = rows[i].__rowid;
                        status == rows[i].__status;
                        row = $e.fn.arrayFind(rows0, '__rowid', rowid);
                        if (status == '1') {
                            //修改
                            if (row >= 0) {
                                $e.fn.extend(rows[i], rows0[row], true);
                            }
                        } else if (status == '2') {
                            if (row >= 0) {
                                //修改
                                $e.fn.extend(rows[i], rows0[row], true);
                            } else {
                                //增加
                                let next = rows[i].__nextrow;
                                if (next >= 0) {
                                    rows0.splice(next, 0, rows[i]);
                                } else {
                                    rows0.push(rows[i]);
                                }
                            }
                        } else if (status == '3') {
                            //删除
                            if (row >= 0) {
                                rows0.splice(row, 1);
                            }
                        }
                    }
                }
                let vars = data['vars'];
                if (vars) {
                    //vars 中的变量名是区分大小写的
                    let vars0 = this.vue._data[this[adoname]['vars']];
                    if (vars0) {
                        for (let i in vars) {
                            vars0[i] = vars[i];
                        }
                    }
                }
            }
        }
    }

    inData(adoname) {
        let cols = null;
        if (this[adoname]['options']) {
            cols = this[adoname]['options']['writeback'];
        }
        if (cols !== 'none') {
            let ado = $e.getActiveModule(this.amn).getADO();
            let row, idRows = ado.getRowIDMap();
            let rows0 = this.vue._data[this[adoname]['rows']];
            for (let i = 0; i < rows0.length; i++) {
                row = idRows(rows0[i].__rowid);
                if (!cols) {
                    for (let j = 0; j < cols.length; j++) {
                        ado.setValueAt(row, cols[j], rows0[i][cols[j]]);
                    }
                } else {
                    ado.setValuesAt(row, rows0[i]);
                }
            }
        }
    }

    /**
     * 返回vue中使用的vars
     * @param adoname
     */
    getVars(adoname) {
        return this.vue._data[this[adoname]['vars']];
    }

    release() {
        this.vue = null;
        this.ados = null;
        this.adoname = null;
    }
}

class Engine {
    _inited = false;
    _amgn = null;
    _checkid = null;
    _lifeType = 'keep';
    _baseURI = '';
    envs = {};
    am = null;
    ams = {};
    os = {
        isAndroid: function () {
            const res = uni.getSystemInfoSync();
            return res.platform.toLocaleLowerCase() == "android"
        },

        /**
         * 是否iphone
         * @returns {boolean}
         */
        isIphone: function () {
            const res = uni.getSystemInfoSync();
            const model = res.model.replace(/\s/g, "").toLowerCase()
            return model.startsWith('iphone');
        }
    }
    fn = {
        reg_fmt: {},
        convertName(name) {
            return name ? name.toLowerCase() : name;
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
            let c = 0;
            if (text) {
                for (let i = 0; i < text.length; i++) {
                    if (text.charAt(i) == c1) {
                        c++;
                    }
                }
            }
            return c;
        },
        toast: function (text, icon, duration) {
            uni.showToast({
                title: text || "出错啦~",
                icon: icon || 'none',
                duration: duration || 2000
            })
        },
        //title, content, showCancel = false, callback, confirmColor, confirmText, cancelColor, cancelText
        showModal: function (title, content, confirm, cancel) {
            let hasConfirm = !!confirm;
            let hasCancel = !!cancel;
            uni.showModal({
                title: title || '提示',
                content: content,
                confirmColor: hasConfirm ? (confirm.color || "#e41f19") : "#e41f19",
                confirmText: hasConfirm ? (confirm.text || "确定") : "确定",
                showCancel: hasCancel,
                cancelColor: hasCancel ? (cancel.color || "#555") : "#555",
                cancelText: hasCancel ? (cancel.text || "取消") : "取消",
                success(res) {
                    if (res.confirm) {
                        if (hasConfirm && confirm.method) {
                            confirm.method();
                        }
                    } else {
                        if (hasCancel && cancel.method) {
                            cancel.method();
                        }
                    }
                }
            })
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
                                let mils = 0;
                                if (typeof(value) == 'string') {
                                    let p = value.indexOf('.');
                                    if (p > 0) {
                                        mils = parseInt(value.substring(p + 1));
                                        value = value.substring(0, p);
                                    }
                                    if (value.indexOf('-') > 0) {
                                        value = value.replace(new RegExp(/-/gm), "/");
                                    }
                                }
                                value = new Date(value);
                                if (mils > 0) {
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
            if (date && !(date instanceof Date)) {
                date = $e.fn.parseValue(date, 'datetime');
            }
            if (date && date instanceof Date) {
                ftext = ftext ? ftext : "yyyy-MM-dd HH:mm:ss";
                let o = {
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
                for (let k in o) {
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
                let date = new Date(s);
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
            let str = '';
            if (num || num === 0) {
                if (!ftext) {
                    return num + '';
                }
                let fmt = ftext = ftext.trim();
                if (fmt.endsWith("%")) {
                    num = num * 100;
                    fmt = fmt.substr(0, fmt.length - 1);
                }
                let split = false;
                fmt = fmt.split('.');
                if (fmt.length > 1) {
                    // 有小数,四舌五入
                    num = num.toFixed(fmt[1].length);
                } else {
                    num = num.toFixed(0);
                }
                let p = fmt[0].lastIndexOf(",");
                if (p >= 0) {
                    fmt[0] = fmt[0].substring(p + 1);
                    split = (fmt[0].length > 0);
                }
                let str_num = num.split('.');
                if (split) {
                    str = str_num[0].replace(this.getRegExp(fmt[0].length), "$1,");
                } else {
                    //无分节号
                    str = str_num[0];
                }
                if (str_num.length > 1 && fmt.length > 1) {
                    //有小数
                    let i = str_num[1].length - 1;
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
            let reg = this.reg_fmt[type];
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
            let vars = {};
            if (array && array.length > 0) {
                let v1;
                for (let i = 0; i < array.length; i++) {
                    v1 = array[i];
                    vars[v1.name] = this.parseValue(v1.value, v1.type);
                }
            }
            return vars;
        },
        plainObj: {
            string: {}.hasOwnProperty.toString.call(Object)
        },
        isPlainObject: function (obj) {
            if (!obj || {}.toString.call(obj) !== "[object Object]") {
                return false;
            }
            if (!Object.getPrototypeOf) {
                return true;
            }
            let proto = Object.getPrototypeOf(obj);
            if (this.plainObj.hasOwnProperty.call(proto, "constructor")) {
                return this.plainObj.hasOwnProperty.toString.call(proto.constructor) === this.plainObj.string;
            }
            return false;
        },
        isEmptyObject: function (e) {
            for (let t in e)
                return false;
            return true;
        },
        extend: function (source, target, overwrite, isdeep) {
            if (source && target) {
                overwrite = !!overwrite;
                for (let f in source) {
                    //目标对象没有该属性，或overwrite为true
                    if ((target[f] == undefined)) {
                        if (this.isPlainObject(source[f])) {
                            target[f] = {};
                            this.extend(source[f], target[f], overwrite, isdeep);
                        } else {
                            target[f] = source[f];
                        }
                    } else if (isdeep) {
                        if (this.isPlainObject(source[f])) {
                            if (target[f] == null || !this.isPlainObject(target[f])) {
                                target[f] = {};
                            }
                            this.extend(source[f], target[f], overwrite, isdeep);
                        } else if (overwrite && target[f] !== source[f]) {
                            target[f] = source[f];
                        }
                    } else if (overwrite && target[f] !== source[f]) {
                        target[f] = source[f];
                    }
                }
            }
            return target;
        }
    };

    //初始化，外部驱动
    init = (amgn, amn, checkid, options = {}) => {
        amn = amn || amgn;
        this._amgn = amgn;
        this._checkid = checkid || this._checkid;
        if (!this.am && amn == amgn) {
            this.am = new ActiveModule(amgn, this);
        }
        let am1 = this.getActiveModule(amn);
        let act = options['_act'];
        if (!options.success) {
            options.success = this.inited;
            options.context = this;
        } else {
            options.success = [this.initEnd, options.success];
        }
        if (!this._inited || (!this._checkid) || (checkid != this._checkid) || !am1) {
            this.request(amn, "reg_am", act, null, null, options);
        } else if (act) {
            this.request(amn, "call", act, null, null, options);
        }
    }

    initEnd = (options) => {
        this._public = options['public'] || false;
        this._lifeType = (options['lifeType'] || 'keep') == 'keep';
        this._inited = true;
    }
    forActiveCell= (props, cell)=>{
        cell.name = cell.name || props.name;
        cell._mn = props._mn;
        cell._amn = props._amn;
    }
    getActiveModule = (name, force) => {
        if (!name || name == this._amgn) {
            return this.am;
        }
        let am1 = this.ams[name];
        if (!am1 && force) {
            am1 = new ActiveModule(name, this);
            this.ams[name] = am1;
        }
        return am1;
    }
    getADO = (name, amn) => {
        name = this.fn.convertName(name);
        let am = this.getActiveModule(amn || this._amgn);
        return am ? am.getADO(name) : null;
    }

    getAdapter(amn) {
        let am = this.getActiveModule(amn);
        return am == null ? null : am.getAdapter();
    }

    createAdapter(vue, amn) {
        let am = this.getActiveModule(amn, true);
        return am.createAdapter(vue);
    }

    serialURL = (url, norand) => {
        if (this.fn.isPlainObject(url)) {
            url = this.fn.extend(url, {});
            if (!norand) {
                url._rand = this.randNum();
            }
            let url1 = url._baseURI || (this._baseURI + "cloud?");
            delete url['_baseURI'];
            let type, value;
            let link = url1.indexOf('?') >= 0;
            for (let key in url) {
                type = (typeof key);
                if (typeof type == 'string' || type instanceof String) {
                    value = url[key] + '';
                    type = (typeof value);
                    if ((value instanceof String) || (type != 'function' && type != 'object' && type != 'array')) {
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

    getURL = (type, options, hasdata, noid) => {
        options = options || {};
        this.fn.extend(
            {
                _hasdata: this.fn.getBoolean(hasdata) ? "1" : "0",
                _type: type,
                _amgn: this._amgn,
                _baseURI: this._baseURI + "cloud?",
                _checkid: this._checkid || ''
            }, options);
        return this.serialURL(options, noid);
    }
    // 产生随机数,ok
    randNum = () => {
        let today = new Date();
        return Math.abs(Math.sin(today.getTime()));
    }
    //type, name, ados, jsondata, options
    call = (amn, name, ados, jsondata, options) => {
        return this.request(amn, "call", name, ados, jsondata, options);
    }

    selfCall = (amn, name, ados, jsondata, options) => {
        return this.request(amn, "async", name, ados, jsondata, options);
    }
    buildData = (amn, ados, jsondata) => {
        let data = {};
        if (ados) {
            data.ados = this.getEditADOData(amn, ados);
        }
        if (jsondata) {
            data.data = jsondata;// (rowsparm instanceof
            // Array)?rowsparm:[rowsparm];
        }
        return this.fn.isEmptyObject(data) ? null : JSON.stringify(data);
    }
    getEditADOData = (_amn, ados) => {
        let data = [];
        if (ados) {
            var ado, names, amn, name, p;
            names = (ados instanceof Array) ? ados : ados.split(",");
            for (let i = 0; i < names.length; i++) {
                p = names[i].indexOf("/");
                if (p >= 0) {
                    amn = names[i].substring(0, p);
                    name = names[i].substring(p + 1);
                } else {
                    amn = _amn;
                    name = names[i];
                }
                ado = this.getADO(name, amn);
                if (ado) {
                    // 此处只有存在该数据对象时,才获取同步数据
                    let adata = ado.getUpdateData();
                    if (adata) {
                        data.push(adata);
                    }
                }
            }
        }
        return data;
    }

    loadData = (s) => {
        if (s) {
            var cells;
            if ((typeof (s) === "string") || (s instanceof String)) {
                if (!s.startsWith("{") || !s.endsWith("}")) {
                    return;
                }
                cells = JSON.parse(s);
            } else {
                cells = s;
            }
            var name, amn, view, ado;
            // var cells = JSON.parse(s);

            // 卸载工作的业务模型
            // var dump = cells["dump"];
            // if (dump) {
            //     this.releaseMember(dump);
            // }
            // env
            var envs = cells['envs'];
            //var onLoadScript = cells['onLoad'];
            var cbps = cells["cbps"];//回调函数的参数
            if (envs && !this.fn.isEmptyObject(envs)) {
                if (envs["_checkid"]) {
                    this._checkid = envs["_checkid"];
                    delete envs["_checkid"];
                }
                if (!this.fn.isEmptyObject(envs)) {
                    //this.setEnvs(envs, true);
                    this.transParent({
                        type: 'env',
                        isParent: false,
                        data: envs,
                        _amgn: this._amgn
                    });
                }
            }

            var ados = cells['ados'];
            var prop, mkados = [];
            if (ados && ados.length > 0) {
                // 数据对象定义
                for (var i = 0; i < ados.length; i++) {
                    // 创建db
                    prop = ados[i];
                    if (prop) {
                        name = prop.name;
                        amn = prop._amn;
                        if (!this.getADO(name, amn)) {
                            // 没有建立ycdb
                            ado = new ADOAgent(name);
                            ado.init(prop);
                            this.getActiveModule(amn,true).addADO(ado);
                            mkados.push(ado);
                        }
                    }
                }
            }
            var ds = '';
            // data,初始是reload
            var data = cells['data'];
            if (data && data.length > 0) {
                // 一个或多个ADOAgent的数据
                ds = [];
                for (var i = 0; i < data.length; i++) {
                    if (data[i]) {
                        name = data[i].name;
                        amn = data[i]._amn;
                        ado = this.getADO(name, amn);
                        if (ado) {
                            ado.loadData(data[i]);
                            ds.push(ado);
                        } else if (!this.getActiveModule(amn)) {
                            this.transParent({
                                type: 'ado',
                                isParent: false,
                                data: data[i],
                                name: name,
                                _amn: amn,
                                _amgn: this._amgn
                            });
                        }
                    }
                }
            }
            if (ds){
                let adapter;
                for (let i=0;i<ds.length;i++){
                    adapter=this.getAdapter(ds[i].getActiveModuleName());
                    if (adapter){
                        adapter.outData(ds[i].getName(),true);
                    }
                }
            }
            if (envs && !this.fn.isEmptyObject(envs)) {
                this.fn.extend(envs,this.envs,true,true);
            }
        }
    }

    request = (amn, type, name, adosname, jsondata, options) => {
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
            _amn: amn || this._amgn,
            _name: name,
            _type: type,
            _hasdata: (data ? "1" : "0"),
            _checkid: this._checkid || ''
        };
        options = options || {};
        if (options.async == undefined) {
            options.async = true;// (type == 'call') ? false : true;
        }
        if (options.params) {
            this.fn.extend(options.params, settings, true);
        }
        options.error = options['error'] || this.defa_error;
        this.ajax(settings, data, options);// , null, null, options
    }
    //处理默认的系统消息
    defaultError = (err) => {
        if (err.code ==101) {
            this.fn.showModal('信息提示', err.message || err.msg);
        } else if(err.code ==111){
            this.exitSystem();
        } else {
            this.fn.showModal('信息提示', '错误代码：'+err.code+","+(err.message || err.msg));
        }
     }
    //退出系统，重新登录
    exitSystem = () => {
        this.showModal('系统提示', '网络连接超时，请您重新登录', {
            method: function () {
                //退出app
                //#ifdef APP-PLUS
                if (plus.os.name.toLowerCase() === 'android') {
                    plus.runtime.quit();
                } else {
                    const threadClass = plus.ios.importClass("NSThread");
                    const mainThread = plus.ios.invoke(threadClass, "mainThread");
                    plus.ios.invoke(mainThread, "exit");
                }
                //#endif
            }
        });
    }
    release = () => {
        if (this.ams) {
            if (this.am) {
                this.am = null;
            }
            for (let i in this.ams) {
                this.ams[i].release();
            }
            this.ams = null;
        }
    }

    ajax = (ajaxUrl, postData, options, resolve, reject) => {
        if (this.delayed) {
            clearTimeout(this.delayed);
            this.delayed = null;
        }
        this.delayed = setTimeout(() => {
            uni.showLoading({
                mask: true,
                title: '请稍候...'
            })
        }, 100);
        console.log('---------postData------' + JSON.stringify(postData))

        let setting = {
            url: ajaxUrl,
            data: postData,
            header: {
                'content-type': 'application/json'
            },
            method: 'POST',
            dataType: 'json',
            responseType: "text",
            success: (res) => {
                if (res.statusCode === 200) {
                    console.log('ajax url==============================' + ajaxUrl + ', ------success---response---' + JSON.stringify(res.data));
                    try {
                        this.loadData(res.data);
                        let err=res.data['error'];
                        if (err){
                            if (err.code==111){
                                this.fn.exitSystem();
                                return;
                            }
                            throw res.data['error'];
                        } else if (res.data['message'] || res.data['msg']) {
                            //提示性信息按异常处理
                            throw {code: 101, message: res.data['message'] || res.data['msg']};
                        } else {
                            resolve(res.data);
                        }
                    } catch (err) {
                        reject(err);
                    }
                } else {
                    reject(res.data);
                }
            },

            fail: (res) => {
                let msg = "";
                switch (res.status) {
                    case 400:
                        msg = "错误请求";
                        break;
                    case 401:
                        msg = "访问拒绝";
                        break;
                    case 403:
                        msg = "拒绝访问";
                        break;
                    case 404:
                        msg = "请求错误，未找到该资源";
                        break;
                    case 405:
                        msg = "请求方法未允许";
                        break;
                    case 408:
                        msg = "请求超时";
                        break;
                    case 500:
                        msg = "服务器端出错";
                        break;
                    case 501:
                        msg = "网络未实现";
                        break;
                    case 502:
                        msg = "网络错误";
                        break;
                    case 503:
                        msg = "服务不可用";
                        break;
                    case 504:
                        msg = "网络超时";
                        break;
                    case 505:
                        msg = "http版本不支持该请求";
                        break;
                    default:
                        msg = "http 未知错误！";
                        break;
                }
                msg = {code: res.status, message: msg};//"Error code:"+res.status+","+msg;
                reject(msg);
            },

            complete: function (res) {
                if (this.delayed) {
                    clearTimeout(this.delayed)
                    this.delayed = null;
                }
                uni.hideLoading();
            }
        }
        if (options) {
            this.fn.extend(options, setting, true, true);
        }
        uni.request(setting);
    }
}

let $e = new Engine();


export default $e;

export const fn = $e.fn;


