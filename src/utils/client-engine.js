﻿+function ($e) {
    function ActiveModule(name) {
        $e.initActiveCell(this, {name: name, _amn: name, _mn: name});
        this.ados = {};
    }

    ActiveModule.prototype = {
        _inited:false,
        getADO: function (name) {
            return name ? this.ados[name.toLowerCase()] : null;
        },
        release: function (toserver) {
            for (var j in this.ados) {
                this.ados[j].release();
            }
            this.anys = this.mapViews = null;
            if (toserver && !$e.isPublic) {
                $e.request(this.getName(), 'release');
            }
            $e.removeActiveModule(this.name);
        }
    };

    /**
     * 缓存的变量 dbs:按名称(lower)缓存的db views:按名称缓存的views,不区分具体内容和差别 客户端向服务器端请求资源类型包括3类
     * 1、请求资源如view,db等,可采用getView(name),getADO(name)来获取
     * 2、在ADOAgent为同步方式下的删除,增加行数据时的验证和返回数据,由ADOAgent自动调用,synccheck/syncdel
     * 3、执行服务器端指令,可采用同步方式doAction("save","d1,d2"),或异步方式doAsyncAction(action,
     * dbnames, _onLoad)来执行 4、在请求刷新数据时,应采用同步方式doAction("getrefresh","d1,d2");
     * 5、请求分页数据doAction("getfirst[/getpre/getnext/getlast/getpage_n]","view1-1");-1为当前页
     */
    // Engine.prototype = {};
    $e.fn.extend(
        {
            ams: {},
            env: {}, // 当前用户的登陆环境变量,如登陆用户名,登陆机构名称等等
            isPublic: false,
            _inited: false,
            _amgn: '',
            _baseURI: "",
            ErrorStatus: {
                TYPE_NOT_LOGIN: 1,
            },
            ModuleCell: {
                getModuleName: function () {
                    return this._mn;
                },
                getActiveModuleName: function () {
                    return this._amn;
                },
                getName: function () {
                    return this.name;
                },
                getADO: function (name, amn) {
                    name = name || this['adoName'];
                    return name ? ($e.getADO(name, amn || this.getActiveModuleName())) : null;
                },
                requestADO: function (name, options) {
                    this.request("getado", name, null, null, options);
                },
                call: function (name, ados, jsonparm, options) {
                    this.request("call", name, ados, jsonparm, options);
                },
                selfCall: function (name, ados, jsonparm, options) {
                    this.request("async", name, ados, jsonparm, options);
                },
                /**
                 *
                 * @param name
                 * @param type
                 *            getado/getview/getany/call/[selfcall/async]/release
                 * @param options
                 */
                request: function (type, name, ados, jsondata, options) {
                    options = options || {};
                    var am = this.getActiveModuleName();
                    var cell = null;
                    if (type == 'getado') {
                        cell = $e.getADO(name, am);
                    }
                    if (cell) {
                        if (options.success) {
                            $e.callback(options.success);
                        }
                    } else {
                        options.params = options.params || {};
                        options.params._mn = options.params._mn || this.getModuleName();
                        $e.request(this.getActiveModuleName(), type, name, ados, jsondata, options);
                    }
                },
                buildAsyncURL: function (action, norand) {
                    var options = {
                        _amn: this.getActiveModuleName(),
                        _mn: this.getModuleName(),
                        _name: action,
                        _hasdata: "0",
                        _checkid: $e.getEnv('_checkid') || ''
                    };
                    return $e.getURL("async", options, norand);
                }
            },

            initActiveCell: function (cell, props, extendcell) {
                cell.name = cell.name || props.name;
                cell._mn = props._mn;
                cell._amn = props._amn;
                $e.fn.extend(extendcell || $e.ModuleCell, cell);
            },
            forActiveCell: function (props, cell) {
                cell.name = cell.name || props.name;
                cell._mn = props._mn;
                cell._amn = props._amn;
                return cell;
            },
            /**
             * 获取活动资源对象
             */
            getActiveModule: function (name, autoadd) {
                name = name ? name : this._amgn;
                var am = this.ams[name];
                if ((!am) && !!autoadd) {
                    am = new ActiveModule(name);
                    this.ams[name] = am;
                }
                return am;
            },
            /**
             * 释放一个或多个业务模型实例
             *
             * @param mname
             */
            releaseActiveModule: function (name, toserver) {
                if (name) {
                    var am = this.removeActiveModule[name];
                    if (am && (am.name != $e._amgn)) {
                        am.release(!!toserver);
                    }
                }
            },

            /**
             * 从缓存中移除一个ActiveModule
             *
             * @param name
             * @returns
             */
            removeActiveModule: function (name) {
                var am = this.ams[name];
                delete this.ams[name];
                return am;
            },

            /**
             *
             * @param amn
             *            活动模块名
             * @param type
             *            请求类型
             *            getado/getview/getany/call/selfcall/getfile/release
             * @param name
             *            请求的资源名或指令名
             * @param adosname
             *            用","分割的数据对象名
             * @param jsondata
             *            发送的json格式数据
             * @param options
             *            如果是请求资源，可以同时申请执行action，在options中，设置{_act:actionName}
             */
            request: function (amn, type, name, adosname, jsondata, options) {
                // 获取需要同步的数据对象action, param, data
                amn = amn || this._amgn;
                var data = this.buildData(amn, adosname, jsondata);
                // 执行服务器端调用,主动分析返回的数据,做相关的处理,顺序是先处理同步数据,再显示同步消息
                // 如1.数据保存后,返回的同步信息
                // 2.在刷新数据对象时,更新本地缓存的数据
                // 3.其他方式下,执行服务器端调用后,同步返回的信息
                var settings = {
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
                options.error = options['error'] || this.defa_error;
                this.ajax(settings, data, options);// , null, null, options
            },

            /**
             * 这个函数只有一个参数，其他参数应放置在obj的args数组中
             *
             * @param obj
             */
            callback: function (obj) {
                if (obj) {
                    var arg1, arg = [].slice.apply(arguments, [1]) || [];
                    obj = (obj instanceof Array) ? obj : [obj];
                    for (var i = 0; i < obj.length; i++) {
                        arg1 = arg.concat(obj[i].args || []);
                        if ((typeof  obj[i]) == 'function') {
                            obj[i].apply($e, arg1);
                        } else {
                            obj[i].method.apply(obj[i].context || $e, arg1);
                        }
                    }
                }
            },

            serialURL: function (url, norand) {
                if ($e.fn.isPlainObject(url)) {
                    url = $e.fn.extend(url, {});
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
                            if (type != 'function' && type != 'object' && type != 'array' || value instanceof String) {
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
            },

            getURL: function (type, options, hasdata, noid) {
                options = options || {};
                $e.fn.extend(
                    {
                        _hasdata: $e.fn.getBoolean(hasdata) ? "1" : "0",
                        _type: type,
                        _amgn: this._amgn,
                        _baseURI: this._baseURI + "cloud?",
                        _checkid: this.getEnv("_checkid") || ''
                    }, options);
                return this.serialURL(options, noid);
            },
            buildData: function (awn, ados, jsondata) {
                var data = {};
                if (ados) {
                    data.ados = this.getEditADOData(awn, ados);
                }
                if (jsondata) {
                    data.data = jsondata;// (rowsparm instanceof
                    // Array)?rowsparm:[rowsparm];
                }
                return $e.fn.isEmptyObject(data) ? null : JSON.stringify(data);
            },
            defa_error: {
                method: function (e1) {
                    if (e1['code'] == 111) {
                        $e.open(e1['login'] || 'index.html', '_self');
                    } else if (e1['code'] == 101) {
                        $e.ui.showMessage(e1['message'], {ico: 'warn'});
                    } else if (e1['code'] || e1['message']) {
                        $e.ui.showMessage(e1['detail'] + ',' + e1['message'], {ico: 'warn'});
                    } else {
                        $e.ui.showMessage(e1, {ico: 'warn'});
                    }
                }
            },
            addADO: function (ado) {
                var an = ado.getActiveModuleName();
                var am = this.getActiveModule(an, true);
                var name = ado.getName().toLowerCase();
                if (!am.ados[name]) {
                    am.ados[name] = ado;
                }
            },
            /**
             * db 在容器中的命名与view、jscode不同 ok! ,not test 根据名称获取db
             *
             * @param {}
             *            name
             * @return {}
             */
            requestADO: function (name, amn, options) {
                var ado = this.getADO(name, amn);
                if (!ado) {
                    this.request(amn, "getado", name, null, null, options);
                } else if (options && options.success) {
                    this.callback(options.success);
                }
            },

            getADO: function (name, amn) {
                var am = this.getActiveModule(amn);
                return am ? am.getADO(name) : null;
            },

            removeADO: function (name, amn) {
                var am = this.getActiveModule(amn);
                if (am) {
                    name = name.toLowerCase();
                    var ado = am.ados[name];
                    delete am.ados[name];
                    return ado;
                }
                return null;
            },

            open: function (url, pos, ns, repl) {
                if ($e.fn.isPlainObject(url)) {
                    if (!url['_baseURI']) {
                        url['_baseURI'] = 'work.jsp';
                    }
                    url = this.serialURL(url);
                }
                if (url.indexOf("_rand") < 0) {
                    // 添加随机数
                    url = url + (url.indexOf("?") > 0 ? "&" : "?") + "_rand=" + this.randNum();
                }
                if (arguments.length >= 4) {
                    return window.open(url, pos, ns, repl);
                } else if (arguments.length == 3) {
                    return window.open(url, pos, ns);
                } else if (arguments.length == 2) {
                    return window.open(url, pos);
                } else {
                    return window.open(url);
                }
            },

            initModule: function (name, chkid) {
                this.setEnv("_checkid", chkid);
                this._amgn = name;
                $e.getActiveModule(name, true);
                $e.requestView('initView', name, {
                    success: {
                        context: $e,
                        method: function () {
                            var view = $e.getView('initView', name);
                            if (view) {
                                document.getElementById("main").appendChild(view.getShell());
                                document.title = this.getEnv('title') || document.title;
                                this.isPublic = $e.fn.getBoolean(this.getEnv('public'), false);
                                this.keepLife = (this.env['lifeType'] || 'keep') == 'keep';
                                this.initEnd();
                            }
                        }
                    }
                });
            },
            initEnd: function () {
                if (this.isPublic && !this.keepLife) {
                    this.request(this._amgn, 'inited');
                }
            },
            getActiveGroupName: function () {
                return this._amgn;
            },

            /**
             * 对从服务器获取的资源,进行解析并处理数据
             *
             * @param {}
             *            s
             */
            loadData: function (s, successobj, errorobj) {
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
                    var dump = cells["dump"];
                    if (dump) {
                        this.releaseMember(dump);
                    }
                    // env
                    var envs = cells['envs'];
                    var onLoadScript = cells['onLoad'];
                    var cbps = cells["cbps"];//回调函数的参数
                    if (envs && !$e.fn.isEmptyObject(envs)) {
                        if (envs['onStart']) {
                            new Function('data', envs['onStart'])(cells);
                            delete envs["onStart"];
                        }
                        onLoadScript = envs['onLoad'] || null;

                        delete envs["onLoad"];
                        delete envs["_checkid"];
                        // delete envs["_inited"];
                        if (!$e.fn.isEmptyObject(envs)) {
                            this.setEnvs(envs, true);
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
                                    ado = new $e.ADOAgent(name);
                                    ado.init(prop);
                                    this.addADO(ado);
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
                    var async = false;
                    this.endLoadData(ds, mkados, envs);
                    // 错误信息
                    var msg = cells["error"];
                    if (msg) {
                        throw msg;
                    } else {
                        msg = cells["msg"];
                        if (msg) {
                            this.ui.showMessage(msg);
                        }
                    }
                    if (!async) {
                        if (successobj) {
                            //this.callback(successobj);
                            $e.callback.apply($e, cbps ? [successobj, cbps] : [successobj]);
                        }
                    }
                }
                ;
            },
            endLoadData: function (ds, mkados, envs) {
                var ados = {};
                if (ds) {
                    for (var i = 0; i < ds.length; i++) {
                        ds[i].doDelayListen();
                        ados[ds[i].getName()] = 1;
                    }
                }
                if (mkados) {
                    for (var i = 0; i < mkados.length; i++) {
                        if (mkados[i].onLoad) {
                            mkados[i].onLoad.apply(mkados[i]);
                        }
                        if (!ados[mkados[i].getName()]) {
                            mkados[i].doDelayListen();
                        }
                    }
                }
                // 环境变量变动,再次覆盖，激活事件
                if (envs && !$e.fn.isEmptyObject(envs)) {
                    this.setEnvs(envs);
                }
            },
            releaseMember: function (dump) {
                var r1, m1;
                for (var i in dump) {
                    r1 = dump[i];// name,am,child
                    if (i == 'ado') {
                        for (var j = 0; j < r1.length; j++) {
                            m1 = this.getADO(r1[j][0], r1[j][1]);
                            if (m1) {
                                m1.release();
                            }
                        }
                    } else if (i == 'module') {
                        for (var j = 0; j < r1.length; j++) {
                            this.releaseActiveModule(r1[j][0]);
                        }
                    }
                }
            },
            transParent: function (options) {
            },

            /**
             * k,not test 获取多个ADOAgent的变动数据,自动采用别名方式
             *
             * @param {}
             *            dbs
             * @return {}
             */
            getEditADOData: function (wn, ados) {
                var data = [];
                if (ados) {
                    var ado, names, amn, name, p;
                    names = (ados instanceof Array) ? ados : ados.split(",");
                    for (var i = 0; i < names.length; i++) {
                        p = names[i].indexOf("/");
                        if (p >= 0) {
                            amn = names[i].substring(0, p);
                            name = names[i].substring(p + 1);
                        } else {
                            amn = wn;
                            name = names[i];
                        }
                        ado = $e.getADO(name, amn);
                        if (ado) {
                            // 此处只有存在该数据对象时,才获取同步数据
                            var adata = ado.getUpdateData();
                            if (adata) {
                                data.push(adata);
                            }
                        }
                    }
                }
                return data;// .length > 0 ? data : null;
            },

            // 产生随机数,ok
            randNum: function () {
                var today = new Date();
                return Math.abs(Math.sin(today.getTime()));
            },
            release: function () {
                if (!this.isPublic) {
                    // var url = this.getURL('release');
                    this.request(this._amgn, 'release');
                }
                // 清除所有缓存的变量
                if (this.ams) {
                    for (var i in this.ams) {
                        this.ams[i].release();
                    }
                    this.ams = null;
                }
                this.env = null;
            }
        }, $e);
}($e);

