import ADOAgent from './ado_module.js';

import {fn} from './utils_module.js';


class Engine {
    _inited = false;
    _amgn = null;
    _checkid = null;
    _lifeType = 'keep';
    _baseURI = '/api/';
    envs = {};
    am = null;
    ams = {};

    //初始化，外部驱动
    init = (amgn, amn, checkid, options = {}) => {
        amn = amn || amgn;
        this._amgn = amgn;
        this._checkid = checkid || this._checkid;
        // if (!this.am && amn == amgn) {
        //     this.am = new ActiveModule(amgn);
        //     this.ams[amgn]=this.am;
        // }
        let am1 = this.getActiveModule(amn);
        let act = options['_act'];
        // if (!options.success) {
        //     options.success = this._inited;
        //     options.context = this;
        // } else {
        //     options.success = [this.initEnd, options.success];
        // }
        if (!this._inited || (!this._checkid) || (checkid != this._checkid) || !am1) {
            //this.request(amn, "reg_am", act, null, null, options);
            return new Promise((resolve, reject) => {
                this.request(amn, "reg_am", act, null, null, options, resolve, reject);  // , null, null, options
            });
        } else if (act) {
            return new Promise((resolve, reject) => {
                this.request(amn, "call", act, null, null, options, resolve, reject);  // , null, null, options
            });
            //this.request(amn, "call", act, null, null, options);
        }
    }

    initEnd = (options) => {
        this._public = options['public'] || false;
        this._lifeType = (options['lifeType'] || 'keep') == 'keep';
        this._inited = true;
    }
    forActiveCell = (props, cell) => {
        cell.name = cell.name || props.name;
        cell._mn = props._mn;
        cell._amn = props._amn;
    }
    getActiveModule = (name, force) => {
        // if (!name || name == this._amgn) {
        //     return this.am;
        // }
        let am1 = this.ams[name];
        if (!am1 && force) {
            am1 = new ActiveModule(name);
            this.ams[name] = am1;
        }
        return am1;
    }
    getADO = (name, amn) => {
        name = fn.convertName(name);
        let am = this.getActiveModule(amn || this._amgn);
        return am ? am.getADO(name) : null;
    }

    getAdapter(amn) {
        let am = this.getActiveModule(amn);
        return am ?am.getAdapter():null;
    }

    createAdapter(vue, amn) {
        let am = this.getActiveModule(amn, true);
        return am.createAdapter(vue);
    }

    serialURL = (url, norand) => {
        if (fn.isPlainObject(url)) {
            url = fn.extend(url, {});
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
        fn.extend(
            {
                _hasdata: fn.getBoolean(hasdata) ? "1" : "0",
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
        //return this.request(amn, "call", name, ados, jsondata, options);
        return new Promise((resolve, reject) => {
            this.request(amn, "call", name, ados, jsondata, options, resolve, reject);  // , null, null, options
        });
    }

    selfCall = (amn, name, ados, jsondata, options) => {
        return new Promise((resolve, reject) => {
            this.request(amn, "async", name, ados, jsondata, options, resolve, reject);  // , null, null, options
        });
        //return this.request(amn, "async", name, ados, jsondata, options);
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
        return fn.isEmptyObject(data) ? null : JSON.stringify(data);
    }
    getEditADOData = (amn, ados) => {
        let data = [];
        if (ados) {
            let ado, names, adapter;
            names = (ados instanceof Array) ? ados : ados.split(",");
            for (let i = 0; i < names.length; i++) {
                // p = names[i].indexOf("/");
                // if (p >= 0) {
                //     amn = names[i].substring(0, p);
                //     name = names[i].substring(p + 1);
                // } else {
                //     amn = _amn;
                //     name = names[i];
                // }
                adapter = this.getAdapter(amn);
                if (adapter) {
                    ado = this.getADO(names[i], amn);
                    if (ado) {
                        adapter.inData(ado);
                        // 此处只有存在该数据对象时,才获取同步数据
                        let adata = ado.getUpdateData();
                        if (adata) {
                            data.push(adata);
                        }
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
            if (envs && !fn.isEmptyObject(envs)) {
                if (envs["_checkid"]) {
                    this._checkid = envs["_checkid"];
                    delete envs["_checkid"];
                }
                if (!fn.isEmptyObject(envs)) {
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
                            this.getActiveModule(amn, true).addADO(ado);
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
            if (ds) {
                let adapter=null,am;
                for (let i = 0; i < ds.length; i++) {
                    am=this.getActiveModule(ds[i].getActiveModuleName());
                    adapter = am.getAdapter();

                    if (!adapter){
                        adapter= this.getAdapter(ds[i].getActiveModuleName());
                    }

                    if (adapter) {
                        adapter.outData(ds[i], true);
                    }
                }
            }
            if (envs && !fn.isEmptyObject(envs)) {
                fn.extend(envs, this.envs, true, true);
            }
        }
    }


    transParent = (options) => {

    }

    request = (amn, type, name, adosname, jsondata, options, resolve, reject) => {
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
            fn.extend(options.params, settings, true);
        }
        options.error = options['error'] || this.defa_error;
        // return new Promise((resolve, reject) => {
        this.ajax(settings, data, options, resolve, reject);  // , null, null, options
        // })
    }
    //处理默认的系统消息
    defaultError = (err) => {
        if (err.code == 101) {
            fn.showModal('信息提示', err.message || err.msg);
        } else if (err.code == 111) {
            this.exitSystem();
        } else {
            fn.showModal('信息提示', '错误代码：' + err.code + "," + (err.message || err.msg));
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
        // this.delayed = setTimeout(() => {
        //     uni.showLoading({
        //         mask: true,
        //         title: '请稍候...'
        //     })
        // }, 100);
        // resolve=resolve||(()=>{});
        // reject=reject ||(()=>{});
        console.log('---------postData------' + JSON.stringify(postData))

        let setting = {
            url: this.serialURL(ajaxUrl),
            data: postData,
            header: {
                'content-type': 'application/json'
            },
            method: 'POST',
            dataType: 'json',
            responseType: "text",
            success: (res) => {
                console.log('-------------success---------' + JSON.stringify(res));
                if (res.statusCode === 200) {
                    console.log('ajax url==============================' + ajaxUrl + ', ------success---response---' + JSON.stringify(res.data));
                    try {
                        this.loadData(res.data);
                        let err = res.data['error'];
                        if (err) {
                            if (err.code == 111) {
                                fn.exitSystem();
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
                console.log('-----------fail-----------' + JSON.stringify(res));
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
            fn.extend(options, setting, true, true);
        }


        console.log('--------------------------------' + JSON.stringify(setting));

        uni.request(setting);
    }
}

class Adapter {
    vue = null;
    amn = null;

    constructor(vue, amn) {
        this.vue = vue;
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
     * 从服务器端就收数据(ADO的修改或整体数据)，输出到接口
     * @param ado
     * @param data 数据{type:'refresh'/edit,rows:[],clear:false/true，vars:{}}
     * @param isclear
     */
    outData(ado, isclear) {
        console.log('--------outData-----', ado)


        //必须事先已经建立映射关系
        let data = ado.getReflectData();
        if (data) {
            let name = ado.getName();

            let rows0 = this.vue.$data[this[name]['rows']];
            if (data.type == 'refresh') {
                if (!!data.clear) {
                    rows0.splice(0, rows0.length);
                }
                data.rows.forEach((item) => {
                    rows0.push(item)
                })
                // rows0 = rows0.concat(data.rows)
                //rows0.splice(rows0.length,0,data.rows);
            } else {
                let row = 0, rowid = -1, status = '0', rows = data.rows;
                //ROW_ADD: '2',ROW_EDIT: '1',ROW_DELETE: '3'
                for (let i = 0; i < rows.length; i++) {
                    rowid = rows[i].__rowid;
                    status == rows[i].__status;
                    row = fn.arrayFind(rows0, '__rowid', rowid);
                    if (status == '1') {
                        //修改
                        if (row >= 0) {
                            fn.extend(rows[i], rows0[row], true);
                        }
                    } else if (status == '2') {
                        if (row >= 0) {
                            //修改
                            fn.extend(rows[i], rows0[row], true);
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
                let vars0 = this.vue.$data[this[name]['vars']];
                if (vars0) {
                    for (let i in vars) {
                        vars0[i] = vars[i];
                    }
                }
            }
        }
    }

    inData(ado) {
        let cols = null;
        let name = ado.getName();
        if (this[name]['options']) {
            cols = this[name]['options']['writeback'];
        }
        if (cols !== 'none') {
            let row, idRows = ado.getRowIDMap();
            let rows0 = this.vue.$data[this[name]['rows']];
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
    getVars(name) {
        return this.vue.$data[this[name]['vars']];
    }

    release() {
        this.vue = null;
        this.ados = null;
        this.adoname = null;
    }
}

class ActiveModule {
    _amn = '';
    _adapter = null;
    __rand=null;

    constructor(amn) {
        this._amn = amn;
        this.ados = {};

        let today = new Date();
        this.__rand=Math.abs(Math.sin(today.getTime()));
    }

    getADO = (name) => {
        name = fn.convertName(name);
        return this.ados[name];
    }
    addADO = (ado) => {
        let name = ado.getName();
        name = fn.convertName(name);
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
        if (this.ados) {
            for (let i in this.ados) {
                this.ados[i].release();
            }
            this.ados = null;
            if (this._adapter) {
                this._adapter.release();
                this._adapter = null;
            }
        }
    }
}

export default Engine;
