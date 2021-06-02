import {
    appConfig
} from "./config";

import MinCache from "../MinCache";

const utils = {
    /**
     *
     * @param text
     * @param duration
     * @param success
     */
    toast: function (text, duration, success) {
        uni.showToast({
            title: text || "出错啦~",
            icon: success || 'none',
            duration: duration || 2000
        })
    },

    /**
     * 是否android
     * @returns {boolean}
     */
    isAndroid: function () {
        const res = uni.getSystemInfoSync();
        return res.platform.toLocaleLowerCase() == "android"
    },

    /**
     * 是否iphone
     * @returns {boolean}
     */
    isIphoneX: function () {
        const res = uni.getSystemInfoSync();
        let iphonex = false;
        let models = ['iphonex', 'iphonexr', 'iphonexsmax', 'iphone11', 'iphone11pro', 'iphone11promax']
        const model = res.model.replace(/\s/g, "").toLowerCase()
        if (models.includes(model)) {
            iphonex = true;
        }
        return iphonex;
    },

    constNum: function () {
        let time = 0;
        // #ifdef APP-PLUS
        time = this.isAndroid() ? 300 : 0;
        // #endif
        return time
    },

    /**
     * 弹框，类似window.confirm
     * @param title
     * @param content
     * @param showCancel
     * @param callback
     * @param confirmColor
     * @param confirmText
     * @param cancelColor
     * @param cancelText
     */
    modal: function (title, content, showCancel = false, callback, confirmColor, confirmText, cancelColor, cancelText) {
        uni.showModal({
            title: title || '提示',
            content: content,
            showCancel: showCancel,
            cancelColor: cancelColor || "#555",
            confirmColor: confirmColor || "#e41f19",
            confirmText: confirmText || "确定",
            cancelText: cancelText || "取消",
            success(res) {
                if (res.confirm) {
                    callback && callback(true)
                } else {
                    callback && callback(false)
                }
            }
        })
    },


    delayed: null,

    actionTypeCall: 'call',
    actionTypePage: 'pagedata',

    composeTree: function (list = []) {
        const data = JSON.parse(JSON.stringify(list)) // 浅拷贝不改变源数据
        const result = []
        if (!Array.isArray(data)) {
            return result
        }
        data.forEach(item => {
            delete item.children
        })
        const map = {}
        data.forEach(item => {
            map[item.id] = item
        })
        data.forEach(item => {
            const parent = map[item.parentId]
            if (parent) {
                (parent.children || (parent.children = [])).push(item)
            } else {
                result.push(item)
            }
        })
        return result
    },

    /**
     * 对象 ---> url 字符串
     * @param params
     * @returns {string}
     */
    buildStrParams: function (params) {
        let strParams = ''
        for (let k in params) {
            strParams += '&' + k + '=' + params[k]
        }
        return strParams;
    },


    getImagePath: function (actionName, options) {
        utils.baseParams._name = actionName;
        utils.baseParams._type = 'async';
        utils.baseParams._hasdata = '0';
        let innerUrl = utils.buildStrParams(utils.baseParams).substring(1);
        if (options && options.params) {
            innerUrl += utils.buildStrParams(options.params);
        }
        return appConfig.apiUrl + innerUrl;
    },


    buildListData: function (listDataStr) {
        let list = [];
        if (listDataStr && listDataStr.length > 0) {
            let arr = listDataStr.split(';');
            arr.forEach(function (item) {
                if (item.indexOf('/') > -1) {
                    let itemArr = item.split('/');
                    list.push({value: itemArr[0], label: itemArr[1].toLowerCase()});
                } else {
                    list.push({value: item, label: item.toLowerCase()});
                }
            })
        }
        return list;
    },

    /**
     * 弹窗提示
     */
    beforeAjax: function () {
        utils.loadding = false;
        utils.delayed && uni.hideLoading();
        clearTimeout(utils.delayed);
        utils.delayed = null;
        utils.delayed = setTimeout(() => {
            uni.showLoading({
                mask: true,
                title: '请稍候...',
                success(res) {
                    utils.loadding = true;
                }
            })
        }, 1000)
    },

    baseParams: {
        _amgn: '',        //模型组名
        _amn: '',         //模型名
        _name: '',        //执行的后台方法名称，
        _type: 'reg_am',
        _hasdata: '0',
        _checkid: '',
        _rand: Math.abs(Math.sin(new Date().getTime()))
    },

    serialUrl: function (params, options, postData) {
        utils.baseParams._name = params.actionName ? params.actionName : (options && options.actionName ? options.actionName : '');
        utils.baseParams._type = params.actionType ? params.actionType : 'reg_am';
        utils.baseParams._hasdata = postData ? (JSON.stringify(postData) == '{}' ? '0' : '1') : '0';
        //utils.baseParams._checkid = utils.baseParams._checkid || params.checkId;
        let innerUrl = utils.buildStrParams(utils.baseParams).substring(1);
        if (options && options.params) {
            innerUrl += utils.buildStrParams(options.params);
        }
        return appConfig.apiUrl + innerUrl;
    },

    initModule: function (groupName, moduleName, options, postData) {
        if (groupName && moduleName) {
            utils.baseParams._amgn = groupName; //模型组名
            utils.baseParams._amn = moduleName; //模型名

            utils.beforeAjax();

            let ajaxUrl = utils.serialUrl({}, options, postData);
            return new Promise((resolve, reject) => {
                utils.ajax(ajaxUrl, {}, resolve, reject);
            })
        } else {
            utils.modal('警告', '请设置模型组名和模型名', function () {
                return;
            })
        }
    },

    /**
     * 请求数据处理
     * @param string url 请求地址
     * @param {*} postData 请求参数
     * @param string method 请求方式
     *  GET or POST
     * @param string contentType 数据格式
     *  'application/x-www-form-urlencoded'
     *  'application/json'
     * @param bool isDelay 是否延迟显示loading
     * @param bool hideLoading 是否隐藏loading
     *  true: 隐藏
     *  false:显示
     */
    request: function (actionName, actionType, options, postData) {
        //接口请求
        utils.beforeAjax();

        /**
         *
         * @param group  模块组名
         * @param module   模块名
         * @param action   执行的方法名
         * @param type     请求类型
         *     主要如下: re_am  初始化模块
         *             getado  获取对应的数据对象
         *             call    执行请求方法
         *             async   上传文件执行异步请求
         *             pagedata  分页更新
         * @param hasData
         * @param checkId
         */
        let ajaxUrl = utils.serialUrl({
            actionName: actionName,
            actionType: actionType,
        }, options, postData);

        return new Promise((resolve, reject) => {
            utils.ajax(ajaxUrl, postData, resolve, reject)
        })
    },

    initData: function (res) {
        let result = {};
        if (res.data) {
            //解析环境变量
            if (res.data['envs']) {
                result.envs = res.data['envs'];
                //设置checkId
                if (result.envs['_checkid']) {
                    utils.baseParams._checkid = result.envs['_checkid'];
                }
            }

            //解析列表选项
            if (res.data['view_or']) {
                if (res.data['view_or'][utils.baseParams._amn]) {
                    result.listData = {};
                    let freeChildren = res.data['view_or'][utils.baseParams._amn]['bill_free']['_child_or'];
                    for (let child in freeChildren) {
                        //列表项
                        if (freeChildren[child] && freeChildren[child]['listData']) {
                            let key = child.substring(1).toLowerCase();
                            let val = utils.buildListData(freeChildren[child]['listData']);
                            result.listData[key] = val;
                        }
                    }
                }
            }
            /*
            {
                vars: {},
                name: '',
                type: '',
                columns: [],
                hasPage: false,
                data: [],
                module: ''
            }
             */
            //解析数据
            if (res.data['ados']) {
                result.ados = [];
                //解析结构
                res.data['ados'].forEach(function (ado, index) {
                    //列表项
                    let name = ado['name'].toLowerCase();
                    let hasPage = (ado['pageRows'] && ado['pageRows'] > 0) ? true : false;
                    let module = ado['_amn'].toLowerCase();
                    let columns = ado['columns'];
                    let obj = {
                        name: name,
                        columns: columns,
                        hasPage: hasPage,
                        module: module
                    };
                    //缓存-ado定义
                    let key = module + '_' + name;
                    uni.setStorage({
                        key: key,
                        data: JSON.stringify(obj),
                        success() {
                            console.log('缓存结构成功了')
                        },
                        fail() {
                            console.log('缓存结构失败了')
                        }
                    });
                    result.ados.push(obj);
                })
            }
            //解析数据
            if (res.data['data']) {
                res.data['data'].forEach(function (db, i) {
                    let name = db['name'].toLowerCase();
                    let module = db['_amn'].toLowerCase();
                    let ado = null;
                    if (result.ados) {
                        const currentIndex = result.ados.findIndex(function (el) {
                            return (el.name === name && el.module === module);
                        });
                        ado = result.ados[currentIndex];
                    } else {
                        try {
                            ado = JSON.parse(uni.getStorageSync(module + '_' + name));
                            result.oneAdo = ado;
                        } catch (e) {
                            console.log('------------getStorageSync--------ADO------' + JSON.stringify(e))
                        }
                    }
                    if (db['rowsData']) {
                        let newData = [];
                        let colMap = {};
                        db['rowsData'].forEach(function (item, k) {
                            let newItem = {};
                            for (let aliceKey in item) {
                                if (aliceKey.charAt(0) == 'c') {
                                    let col = aliceKey.substring(1) - 0;
                                    let colName = ado.columns[col].name.toLowerCase();
                                    newItem[colName] = item[aliceKey];
                                    colMap[colName] = aliceKey;
                                } else {
                                    newItem[aliceKey.toLowerCase()] = item[aliceKey];
                                }
                            }
                            newData.push(newItem);
                        });

                        //有数据
                        if (newData && newData.length > 0) {
                            //给result增加hasData属性，表示有数据
                            ado.hasData = true;
                            let key = module + '_' + name + '_data';
                            uni.setStorage({
                                key: key,
                                data: JSON.stringify(newData),
                                success() {
                                    console.log('缓存数据成功了')
                                },
                                fail() {
                                    console.log('缓存数据失败了')
                                }
                            });
                        } else {
                            ado.hasData = false;
                        }

                        ado.data = newData;

                        //缓存属性与键值(c**)对应关系
                        if (colMap && Object.keys(colMap).length > 0) {
                            let col_key = module + '_' + name + '_col_map';
                            uni.setStorage({
                                key: col_key,
                                data: JSON.stringify(colMap),
                                success() {
                                    console.log('缓存列名成功了')
                                },
                                fail() {
                                    console.log('缓存列名成功了')
                                }
                            });
                        }
                    }
                    //权限相关参数
                    if (db['vars']) {
                        ado.vars = db['vars'];
                    }
                    if (db['status']) {
                        ado.status = db['status'];
                    }
                    if (db['type']) {
                        ado.type = db['type'];
                    }
                    //总页数
                    if (ado.hasPage) {
                        ado.totalSize = db['pages'];
                    }
                    //当前页码
                    if (ado.hasPage) {
                        ado.currentPage = db['page'];
                    }
                })
            }
        }
        return result;
    },

    ajax: function (ajaxUrl, postData, resolve, reject) {
        console.log('---------postData------' + JSON.stringify(postData))
        uni.request({
            url: ajaxUrl,
            data: postData,
            header: {
                'content-type': 'application/json'
            },
            method: 'POST',
            dataType: 'json',
            responseType: "text",
            success: (res) => {
                if (utils.loadding) {
                    uni.hideLoading()
                }
                if (res.statusCode === 200) {
                    console.log('ajax url==============================' + ajaxUrl + ', ------success---response---' + JSON.stringify(res.data));
                    let result = utils.initData(res);
                    resolve(result);
                } else {
                    reject(res.data.msg);
                }
            },

            fail: (res) => {
                utils.toast("网络不给力，请稍后再试~")
                console.log('------fail---response---' + JSON.stringify(res))
                reject(res)
            },

            complete: function (res) {

                clearTimeout(utils.delayed)
                utils.delayed = null;

                let message = '';
                if (res.statusCode === 200) {
                    //处理异常和通知信息
                    if (res.data['error']) {
                        if (res.data['error']['code'] == '111') {
                            utils.modal('系统提示', '网络连接超时，请您重新登录', function () {
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
                            });
                        } else if (res.data['error']['message']) {
                            message = res.data['error']['message'];
                        } else {
                            message = res.data['error'];
                        }
                    } else {
                        message = res.data['msg'];
                    }

                    //弹框提示
                    if (message) {
                        utils.modal('系统提示', message, function () {

                        });
                    } else {
                        uni.hideLoading();
                    }
                } else {
                    utils.toast('服务器开小差了~')
                }
            }
        })
    },

    updateData: function (res) {
        let result = {};
        if (res && res['data']) {

            const data = JSON.parse(res['data']);
            console.log('----------data-------' + JSON.stringify(data))

            //解析环境变量
            if (data['envs']) {
                result.envs = data['envs'];
            }
            console.log('------1-----' + JSON.stringify(res))
            console.log('------2-----' + JSON.stringify(data['data']));
            if (data['data']) {
                data['data'].forEach(function (db, i) {
                    let name = db['name'].toLowerCase();
                    let module = db['_amn'].toLowerCase();
                    let ado = null;
                    try {
                        ado = JSON.parse(uni.getStorageSync(module + '_' + name));
                        console.log('-------ado--------' + JSON.stringify(ado));
                    } catch (e) {
                        console.log('------------getStorageSync--------ADO------' + JSON.stringify(e))
                    }
                    if (db['rowsData']) {
                        let newData = [];
                        let colMap = {};
                        db['rowsData'].forEach(function (item, k) {
                            let newItem = {};
                            for (let aliceKey in item) {
                                if (aliceKey.charAt(0) == 'c') {
                                    let col = aliceKey.substring(1) - 0;
                                    let colName = ado.columns[col].name.toLowerCase();
                                    newItem[colName] = item[aliceKey];
                                    colMap[colName] = aliceKey;
                                } else {
                                    newItem[aliceKey.toLowerCase()] = item[aliceKey];
                                }
                            }
                            newData.push(newItem);
                        });

                        //有数据
                        if (newData && newData.length > 0) {
                            //给result增加hasData属性，表示有数据
                            result.hasData = true;
                            // let key = module + '_' + name + '_data';
                            // uni.setStorage({
                            //     key: key,
                            //     data: JSON.stringify(newData),
                            //     success() {
                            //         console.log('缓存数据成功了')
                            //     },
                            //     fail() {
                            //         console.log('缓存数据失败了')
                            //     }
                            // });
                        } else {
                            result.hasData = false;
                        }
                        result.data = newData;
                    }
                })
            }
        }
        return result;
    },


    /**
     * 上传文件
     * @param string url 请求地址
     * @param string src 文件路径
     */
    uploadFile: function (url, src) {
        uni.showLoading({
            title: '请稍候...'
        })
        return new Promise((resolve, reject) => {
            const uploadTask = uni.uploadFile({
                url: url,
                filePath: src,
                name: 'file',
                header: {
                    'content-type': 'multipart/form-data',
                },
                success: function (res) {
                    uni.hideLoading();
                    let result = utils.updateData(res);
                    resolve(result);
                },
                fail: function (res) {
                    uni.hideLoading();
                    utils.toast("网络不给力，请稍后再试~")
                    reject(res)
                }
            })
        })
    },

    send_ados: {
        ados: []
    },

    build_diff_data(moduleName, adoName, newAdoData) {
        if (adoName) {
            let adoData = JSON.parse(uni.getStorageSync(moduleName + '_' + adoName + '_data'));
            if (adoData && adoData.length > 0 && newAdoData && newAdoData.length > 0) {
                const columns = JSON.parse(uni.getStorageSync(moduleName + '_' + adoName + '_col_map'));
                let send_ado = {};
                let diff_list = [];
                newAdoData.forEach(function (item, index) {
                    let diff_item = {};
                    for (let k in item) {
                        if (adoData[index][k] != item[k]) {
                            if (columns[k]) {
                                diff_item[columns[k]] = item[k];
                            }
                        }
                        if (diff_item && Object.keys(diff_item).length > 0) {
                            diff_item['__rowid'] = item['__rowid'];
                            diff_item['__status'] = "1";
                        }
                    }
                    if (diff_item && Object.keys(diff_item).length > 0) {
                        diff_list.push(diff_item);
                    }
                })
                if (diff_list && diff_list.length > 0) {
                    send_ado['convert'] = '1';
                    send_ado['name'] = adoName;
                    send_ado['_amn'] = moduleName;
                    send_ado['data'] = diff_list;
                    utils.send_ados.ados.push(send_ado);
                }
            }
        }
    },

    //去空格
    trim: function (value) {
        return value.replace(/(^\s*)|(\s*$)/g, "");
    },

    //格式化手机号码
    formatNumber: function (num) {
        return num.length === 11 ? num.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2') : num;
    },

    //金额格式化
    formatMoney: function (money) {
        return parseFloat(money).toFixed(2).toString().split('').reverse().join('').replace(/(\d{3})/g, '$1,').replace(
            /\,$/, '').split('').reverse().join('');
    },

    // 时间格式化输出，如11:03 25:19 每1s都会调用一次
    timer: function (micro_second) {
        // 总秒数
        let second = Math.floor(micro_second / 1000);
        // 天数
        let day = Math.floor(second / 3600 / 24);
        // 小时
        let hr = Math.floor(second / 3600 % 24);
        // 分钟
        let min = Math.floor(second / 60 % 60);
        // 秒
        let sec = Math.floor(second % 60);
        return {
            day,
            hr: hr < 10 ? '0' + hr : hr,
            min: min < 10 ? '0' + min : min,
            sec: sec < 10 ? '0' + sec : sec,
            second: second
        }
    },

    //日期格式化
    formatDate: function (formatStr, fdate) {
        if (fdate) {
            if (~fdate.indexOf('.')) {
                fdate = fdate.substring(0, fdate.indexOf('.'));
            }
            fdate = fdate.toString().replace('T', ' ').replace(/\-/g, '/');
            let fTime, fStr = 'ymdhis';
            if (!formatStr)
                formatStr = "y-m-d h:i:s";
            if (fdate) {
                fTime = new Date(fdate);
            } else {
                fTime = new Date();
            }

            let month = fTime.getMonth() + 1;
            let day = fTime.getDate();
            let hours = fTime.getHours();
            let minu = fTime.getMinutes();
            let second = fTime.getSeconds();

            month = month < 10 ? '0' + month : month;
            day = day < 10 ? '0' + day : day;
            hours = hours < 10 ? ('0' + hours) : hours;
            minu = minu < 10 ? '0' + minu : minu;
            second = second < 10 ? '0' + second : second;
            let
                formatArr = [
                    fTime.getFullYear().toString(),
                    month.toString(),
                    day.toString(),
                    hours.toString(),
                    minu.toString(),
                    second.toString()
                ]
            for (let i = 0; i < formatArr.length; i++) {
                formatStr = formatStr.replace(fStr.charAt(i), formatArr[i]);
            }
            return formatStr;
        } else {
            return "";
        }
    },

    //日期格式化
    transDate: function (date, fmt) {
        if (!date) {
            return '--'
        }
        let _this = new Date(date * 1000)
        let o = {
            'M+': _this.getMonth() + 1,
            'd+': _this.getDate(),
            'h+': _this.getHours(),
            'm+': _this.getMinutes(),
            's+': _this.getSeconds(),
            'q+': Math.floor((_this.getMonth() + 3) / 3),
            'S': _this.getMilliseconds()
        }
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (_this.getFullYear() + '').substr(4 - RegExp.$1.length))
        }
        for (let k in o) {
            if (new RegExp('(' + k + ')').test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
            }
        }
        return fmt
    },

    /**
     * 根据经纬度获取距离
     * @param lat1
     * @param lng1
     * @param lat2
     * @param lng2
     * @returns {string}
     */
    getDistance: function (lat1, lng1, lat2, lng2) {
        function Rad(d) {
            return d * Math.PI / 180.0;
        }

        if (!lat1 || !lng1) {
            return '';
        }
        // lat1用户的纬度
        // lng1用户的经度
        // lat2商家的纬度
        // lng2商家的经度
        let radLat1 = Rad(lat1);
        let radLat2 = Rad(lat2);
        let a = radLat1 - radLat2;
        let b = Rad(lng1) - Rad(lng2);
        let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(
            Math.sin(b / 2), 2)));
        s = s * 6378.137;
        s = Math.round(s * 10000) / 10000;
        s = '(距您' + s.toFixed(2) + '公里)' //保留两位小数
        return s
    },
    /**
     * 手机号码验证
     * @param mobile
     * @returns {boolean}
     */
    isMobile: function (mobile) {
        if (!mobile) {
            utils.toast('请输入手机号码');
            return false
        }
        if (!mobile.match(/^1[3-9][0-9]\d{8}$/)) {
            utils.toast('手机号不正确');
            return false
        }
        return true
    },

    /**
     *  rgb 颜色转换成16进制颜色值
     * @param r
     * @param g
     * @param b
     * @returns {string}
     */
    rgbToHex: function (r, g, b) {
        return "#" + utils.toHex(r) + utils.toHex(g) + utils.toHex(b)
    },

    toHex: function (n) {
        n = parseInt(n, 10);
        if (isNaN(n)) return "00";
        n = Math.max(0, Math.min(n, 255));
        return "0123456789ABCDEF".charAt((n - n % 16) / 16) +
            "0123456789ABCDEF".charAt(n % 16);
    },

    /**
     * 16进制颜色值 转换成RGB颜色值
     * @param hex
     * @returns {*}
     */
    hexToRgb(hex) {
        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    },

    /**
     * 数值验证
     * @param val
     * @returns {boolean}
     */
    isNumber: function (val) {
        let regPos = /^\d+(\.\d+)?$/; //非负浮点数
        let regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
        if (regPos.test(val) || regNeg.test(val)) {
            return true;
        } else {
            return false;
        }
    },

    //判断字符串是否为空
    isEmpty: function (str) {
        if (str === '' || str === undefined || str === null) {
            return true;
        } else {
            return false;
        }
    },

    /**
     * 超时时间
     * @param str
     * @returns {number}
     */
    expireTime: function (str) {
        if (!str) {
            return;
        }
        let NowTime = new Date().getTime();
        //IOS系统直接使用new Date('2018-10-29 11:25:21')，在IOS上获取不到对应的时间对象。
        let totalSecond = Date.parse(str.replace(/-/g, '/')) - NowTime || [];
        if (totalSecond < 0) {
            return;
        }
        return totalSecond / 1000
    },


    /**
     * 调用微信登录
     */
    wxlogin: function () {
        return new Promise(function (resolve, reject) {
            uni.login({
                success: function (res) {
                    if (res.code) {
                        resolve(res);
                    } else {
                        reject(res);
                    }
                },
                fail: function (err) {
                    reject(err);
                }
            });
        });
    },


}

module.exports = {
    toast: utils.toast,
    modal: utils.modal,
    build_diff_data: utils.build_diff_data,
    buildListData: utils.buildListData,
    isAndroid: utils.isAndroid,
    isIphoneX: utils.isIphoneX,
    constNum: utils.constNum,
    initModule: utils.initModule,
    request: utils.request,
    getImagePath: utils.getImagePath,
    uploadFile: utils.uploadFile,
    trim: utils.trim,
    formatNumber: utils.formatNumber,
    formatMoney: utils.formatMoney,
    timer: utils.timer,
    formatDate: utils.formatDate,
    getDistance: utils.getDistance,
    isMobile: utils.isMobile,
    rgbToHex: utils.rgbToHex,
    hexToRgb: utils.hexToRgb,
    transDate: utils.transDate,
    isNumber: utils.isNumber,
    isEmpty: utils.isEmpty,
    expireTime: utils.expireTime,
    wxlogin: utils.wxlogin,
    composeTree: utils.composeTree,
    callAction: utils.actionTypeCall,
    pageAction: utils.actionTypePage,
    diff_data: utils.send_ados,
}
