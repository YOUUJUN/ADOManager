﻿+function ($e) {
    function ActiveModule(name) {
        $e.initActiveCell(this, {name: name, _amn: name, _mn: name});
        this.ados = {};
        this.views = {};
        this.anys = {};
        this.mapViews = {};
    }

    ActiveModule.prototype = {
        getADO: function (name) {
            return name ? this.ados[name.toLowerCase()] : null;
        },
        getView: function (name) {
            return this.views[name];
        },
        getAny: function (name) {
            return this.anys[name];
        },
        release: function (toserver) {
            for (var j in this.ados) {
                this.ados[j].release();
            }
            for (var j in this.views) {
                this.views[j].release(true);
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
            envListen: {},// key:{method:function(){},context:null}
            isPublic: false,
            _inited: false,
            _amgn: '',
            _evts: $e.events.createEventCell(),
            _baseURI: "",
            ErrorStatus:{
                TYPE_NOT_LOGIN:1,
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
                getView: function (name, amn) {
                    return $e.getView(name, amn || this.getActiveModuleName());
                },
                getADO: function (name, amn) {
                    name = name || this['adoName'];
                    return name ? ($e.getADO(name, amn || this.getActiveModuleName())) : null;
                },
                getAny: function (name, amn) {
                    return $e.getAny(name, amn || this.getActiveModuleName());
                },
                requestView: function (name, options) {
                    this.request("getview", name, null, null, options);
                },
                requestADO: function (name, options) {
                    this.request("getado", name, null, null, options);
                },
                requestAny: function (name, options) {
                    this.request("getany", name, null, null, options);
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
                    } else if (type == 'getview') {
                        cell = $e.getView(name, am);
                    } else if (type == 'getany') {
                        cell = $e.getAny(name, am);
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
                buildAsyncURL:function(action,norand){
                    var options = {
                        _amn: this.getActiveModuleName(),
                        _mn: this.getModuleName(),
                        _name: action,
                        _hasdata: "0",
                        _checkid: $e.getEnv('_checkid') || ''
                    };
                    return $e.getURL("async",options,norand);
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
                options.error=options['error']||this.defa_error;
                this.ajax(settings, data, options);// , null, null, options
            },

            /**
			 * 这个函数只有一个参数，其他参数应放置在obj的args数组中
			 * 
			 * @param obj
			 */
            callback: function (obj) {
                if (obj) {
                    var arg1,arg = [].slice.apply(arguments, [1]) || [];
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
            // createURL:function(modulecell,options){
            // options=options?options:{};
            // var setting={
            // _amgn: this._amgn,
            // _baseURI: modulecell._baseURI + "cloud?",
            // _amn: modulecell.getActiveModuleName(),
            // _mn: modulecell.getModuleName(),
            // _checkid: this.getEnv("_checkid")
            // };
            // $e.fn.extend(options,setting,true);
            // return this.serialURL(setting);
            // },

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
                	if (e1['code']==111){
                		$e.open(e1['login']||'index.html','_self');
                	}else if (e1['code']==101){
                		$e.ui.showMessage(e1['message'], {ico: 'warn'});
                	}else if (e1['code'] || e1['message']){
                		$e.ui.showMessage(e1['detail']+','+e1['message'], {ico: 'warn'});
                	}else{
                		$e.ui.showMessage(e1, {ico: 'warn'});
                	}
                }
            },
            /**
			 * 只有不存在指定视图时，才会增加
			 * 
			 * @param view
			 * @returns {Boolean}
			 */
            addView: function (view) {
                var an = view.getActiveModuleName();
                var am = this.getActiveModule(an, true);
                var name = view.getName();
                if (!am.views[name]) {
                    am.views[name] = view;
                    return true;
                }
                return false;
            },

            /**
			 * 如果来自抽象业务模型的请求，需要在options中的 _mn中指定所在module的名称
			 */
            requestView: function (name, amn, options) {
                var view = this.getView(name, amn);
                if (!view) {
                    this.request(amn, "getview", name, null, null, options);
                } else if (options && options.success) {
                    this.callback(options.success);
                }
            },

            getView: function (name, amn) {
                var mn = this.getMapViewName(name, amn);
                var am = this.getActiveModule(mn._mn);
                return am ? am.views[mn.name] : null;
            },
            removeView: function (name, amn, view0) {
                var view = this.getView(name, amn);
                if (view && (!view0 || view0 == view)) {
                    amn = view.getActiveModuleName();
                    var am = this.getActiveModule(amn);
                    delete am.views[view.getName()];
                    return view;
                }
                return null;
            },

            mapView: function (vs) {
                var t;
                for (var i = 0; i < vs.length; i++) {
                    t = vs[i];
                    if ((t._mn != t.targetMN) || (t.name != t.targetName)) {
                        var c = {
                            _mn: t.targetMN,
                            name: t.targetName
                        };
                        this.getActiveModule(t._mn, true).mapViews[t.name] = c;
                    }
                }
            },
            /**
			 * 获取隐射的viewname
			 * 
			 * @param name
			 * @returns 隐射的viewcode和目标model的数组
			 */
            getMapViewName: function (name, amn) {
                var am = this.getActiveModule(amn);
                if (am) {
                    var mv = am.mapViews[name];
                    if (mv) {
                        return this.getMapViewName(mv.name, mv._mn);
                    }
                }
                return {
                    name: name,
                    _mn: amn
                };
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
                    name=name.toLowerCase();
                    var ado = am.ados[name];
                    delete am.ados[name];
                    return ado;
                }
                return null;
            },

            getEnvs: function () {
                return this.env;
            },           /**
							 * 获取用户登陆环境变量
							 * 
							 * @param name
							 *            变量名称
							 * @returns
							 */
            getEnv: function (name) {
                return this.env[name];
            },
            removeEnv: function (name) {
                var v = this.env[name];
                delete this.env[name];
                return v;
            },

            setEnv: function (name, value, stope) {
                var oldvalue = this.env[name] || null;
                this.env[name] = value;
                if (!stope) {
                    this.doEnvListen(name, value, oldvalue,false);
                }
            },
            setEnvs: function (map, stope) {
                if (map && !$e.fn.isEmptyObject(map)) {
                    var old = $e.fn.extend(this.env, {});
                    $e.fn.extend(map, this.env, true);
                    if (!stope) {
                    	var b=false;
                        for (var i in map) {
                            this.doEnvListen(i, map[i], old[i] || null, true);
                            b=true;
                        }
                        if (b){
                        	this.doEnvListen("#all", "", "", true);
                        }
                    }
                }
            },
            doEnvListen: function (name, value, oldvalue,only) {
            	var arg = [{name:name, value:value, oldvalue:oldvalue}];
                var ec=this.envListen[name];
                if (ec){
                	ec.done(arg);
                }
//				if (name !='#all' && !only){
//					ec=this.envListen['#all'];
//					if (ec){
//	                	ec.done.apply(ec,arg);
//					}
//				}              
            },

            /**
			 * ls {source:source,func:func}
			 */
            addEnvChangedListen: function (name, listen) {
                var ls = this.envListen[name];
                if (!ls) {
                    this.envListen[name]=ls=$e.events.createEventCell();
                }
                return ls.add(listen);// handle
            },
            removeEnvChangedListen: function (name, handle) {
                var ls = this.envListen[name];
                if (ls) {
                    ls.remove(handle);
                }
            },
            addAny: function (name, anysrc, amn) {
                var am = this.getActiveModule(amn, true);
                if (am) {
                    am.anys[name] = anysrc;
                }
            },

            getAny: function (name, amn) {
                var am = this.getActiveModule(amn);
                return am ? am.getAny(name) : null;
            },

            /**
			 * 获取模型组件脚本
			 * 
			 * @param model
			 *            模型名
			 * @param name
			 *            脚本名,包括所在的模型名,如a_bc/add
			 * @returns
			 */
            requestAny: function (name, amn, options) {
                var any = this.getAny(name, amn);
                if (!any) {
                    this.request(amn, "getany", name, null, null, options);
                } else if (options && options.success) {
                    this.callback(options.success);
                }
            },
            // loadCSS:function(name,text){
            // name=name||'';
            // if ((this.css[name]!=text) && text){
            // this.css[name]=text;
            // $e.fn.loadCSS(text);
            // }
            // },
            /**
			 * web版{}
			 */
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
                    }else{
                        cells=s;
                    }
                    var name, amn, view, ado;
                    // var cells = JSON.parse(s);

                    // 卸载工作的业务模型
                    var dump = cells["dump"];
                    if (dump) {
                        this.releaseMember(dump);
                    }
                    var mv = cells["mapView"];
                    if (mv) {
                        this.mapView(mv);
                    }
                    var css = cells['css'];
                    if (css) {
                        for (var i = 0; i < css.length; i++) {
                            $e.fn.loadCSS(css[i]);
                        }
                    }
                    // env
                    var envs = cells['envs'];
                    var onLoadScript = cells['onLoad'];
                    var cbps=cells["cbps"];//回调函数的参数
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
                    var anys = cells['anys'];
                    if (anys) {
                    	var a1;
                        for (var i in anys) {
                        	a1=anys[i];
                            if (a1) {
                            	for (var j in a1){
                            		this.addAny(j, a1[j], i);
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
                    // view
                    var mkviews = [], views = cells["views"];
                    if (views && views.length > 0) {
                        for (var j = 0; j < views.length; j++) {
                            if (views[j]) {
                                amn = views[j]._amn;
                                name = views[j].name;
                                // if (this.allowView(name, amn, views[j]._mn))
								// {
                                view = $e.ui.createView(views[j]);
                                if (view) {
                                    if (this.addView(view)) {
                                        mkviews.push(view);
                                    }
                                }
                                // }
                            }
                        }
                    }

                    // 下拉列表或其他代码表值@version:2.0 2012.11.3
                    var vs, ld = cells["view_or"];
                    if (ld) {
                        for (amn in ld) {
                            vs = ld[amn];
                            for (var vn in vs) {
                                view = $e.getView(vn, amn);
                                if (view && view.changeProperty) {
                                    view.changeProperty(vs[vn]['_child_or'] ? vs[vn]['_child_or'] : vs[vn]);
                                }
                            }
                        }
                    }
                    var async = false;
                    if (mkviews.length > 0) {
//                        for (var i = 0; i < mkviews.length; i++) {
//                            if (mkviews[i] && !!mkviews[i]['onCreated']) {
//                                mkviews[i].onCreated.apply(mkviews[i]);
//                            }
//                        }
                        // var tmp = this;
                        for (var i = 0; i < mkviews.length; i++) {
                            if (mkviews[i]) {
                                $e.fn.bindMovingMenu(mkviews[i]);
                                if (mkviews[i].init) {
                                    mkviews[i].init();
                                }
                            }
                        } 
                        setTimeout(function () {
                            // 检查加载完成后,需要执行的js
                            try {
                                $e.endLoadData(ds, mkados, envs);//  onLoadScript
                                for (var i = 0; i < mkviews.length; i++) {
                                    if (mkviews[i]) {
                                        if (mkviews[i]['onLoad']) {
                                            mkviews[i].onLoad();
                                        }
                                    }
                                }
                                // 执行脚本,保留命名的环境变量值
                                if (onLoadScript) {
                                    new Function(onLoadScript)();
                                }
                            } catch (e2) {
                                if (!cells["error"] && errorobj) {
                                    $e.callback(errorobj, e2);
                                    return;
                                }
                                throw e2;
                            }
                            if (!cells["error"] && successobj) {
                            	$e.callback.apply($e,cbps?[successobj,cbps]:[successobj]);
                                //$e.callback(successobj);
                            }
                        }, 0);
                        async = true;
                    } else {
                        this.endLoadData(ds, mkados, envs);
                    }
                    // 错误信息
                    var msg = cells["error"];
                    if (msg) {
                        throw msg;
                    } else {
                        // message
                        msg = cells["msg"];
                        if (msg) {
                            this.ui.showMessage(msg);
                        }
                    }
                    if (!async) {
                        if (onLoadScript) {
                            new Function(onLoadScript)();
                        }
                        if (successobj) {
                            //this.callback(successobj);
                            $e.callback.apply($e,cbps?[successobj,cbps]:[successobj]);
                        }
                    }
               };
            },
            endLoadData: function (ds, mkados, envs) {
                var ados={};
                if (ds) {
                    for (var i = 0; i < ds.length; i++) {
                        ds[i].doDelayListen();
                        ados[ds[i].getName()]=1;
                    }
                }
                if (mkados) {
                    for (var i = 0; i < mkados.length; i++) {
                        if (mkados[i].onLoad) {
                            mkados[i].onLoad.apply(mkados[i]);
                        }
                        if (!ados[mkados[i].getName()]){
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
                    } else if (i == 'view') {
                        for (var j = 0; j < r1.length; j++) {
                            m1 = this.getView(r1[j][0], r1[j][1]);
                            if (m1) {
                                m1.release(false, r1[j][2] == '1');
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

            showProgress: function (title) {
                title = title || 'please wait ......';
                var p = this['_progress'];
                if (!p) {
                    this._progress = p = $e.fn.create("div", "progress");
                    p.innerHTML = '<ul><li><span class="progress-icon fa fa-spinner fa-spin"></span></li><li><span id="progress">' + title + '</span></li></ul>';
                    document.body.appendChild(p);
                } else {
                    this.fn.setLabelText(p.querySelector('#progress'), title);
                }
                this.fn.setStyle(p, 'z-index:' + (this.fn._maxIndex + 1));
                $e.fn.showElement(p, true);
            },
            hideProgress: function () {
                $e.fn.showElement(this._progress, false);
            },

            // 产生随机数,ok
            randNum: function () {
                var today = new Date();
                return Math.abs(Math.sin(today.getTime()));
            },
            release: function () {
                if (this._evts) {
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
                    this.envListen=null;
                    this._evts.release();
                    this._evts = null;
                }
            }
        }, $e);
}($e);

