+function ($e) {
    $e._baseURI = "";
    var beforeSend = function (xhr, options) {
        var title = (options && options.title != undefined) ? options.title : '正在请求...';
        $e.showProgress(title);
        return true;
    };
    var complete = function (type) {
        $e.hideProgress();
    };
    var nodo = function () {
    };
    var settings = {
        crossDomain: false,
        parseType: 'default', // 服务器返回数据的解析方法,如修改为其他字符，返回数据由用户自己解析
        headers: {
            charset: "UTF-8",
            contentType: "application/json"
        },
        type: 'POST', // HTTP请求类型
        timeout: 120000, // 超时时间设置为2分钟；
        beforeSend: beforeSend,
        complete: complete,
        async: true,
        success: nodo,
        final: nodo,
        error: {
            method: function (e1, e2) {
                if (arguments.length == 1) {
                    $e.ui.showMessage(e1, {ico: 'warn'});//请求中止
                    throw e1;
                } else {
                    throw parseError(e1, e2);
                }
            }
        }
    };

    $e.ajax = function (url, data, options) {
        url = $e.serialURL(url, false);
        var setting = options || {};
        $e.fn.extend(settings, setting);
        var context = setting.context || $e;
        var successobj = setting.success || nodo;
        var errorobj = $e.fn.extend(setting.error, {context: context});//setting.error;
        //var finalobj = setting.final;
        var error = function (type, text, exception) {
            complete("error");
            var args = errorobj.args || [];
            args = args.concat(exception ? [exception] : [type, text]);
            errorobj.args = args;
            $e.callback(errorobj);
        };
        var success = function (pdata) {
            var self = false;
            var err = null;
            if (pdata && (typeof pdata == 'string') && (setting.parseType == 'default')) {
                try {
                    self = true;
                    $e.showProgress("正在加载...");
                    $e.loadData(pdata, successobj, errorobj);
                } catch (e) {
                    err = e;
                    complete("error");
                }
            }
            if (!err) {
                complete("success");
                if (successobj && !self) {
                    $e.callback(successobj,pdata);
                }
            }
            return err;
        };
        // var final = function() {
        //     if (typeof finalobj=='function'){
        //         finalobj.call($e);
        //     }else {
        //         $e.callback(finalobj);
        //     }
        // };
        var abortTime = 0;
        var xhr = null;
        if (window.XMLHttpRequest) {
            xhr = new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            try {
                xhr = new ActiveXObject("Msxml2.XMLHTTP");
            } catch (e) {
                try {
                    xhr = new ActiveXObject("Microsoft.XMLHTTP");
                } catch (e1) {
                }
            }
        }
        var httptype = setting.type || 'POST';

        xhr.open(httptype, url, setting.async);
        xhr.setRequestHeader("Charset", setting.headers.charset || 'UTF-8');
        xhr.setRequestHeader("Content-Type", setting.headers.contentType);
        //if (data) {
        //    xhr.setRequestHeader("Content-length", data.length);
        //}
        var reponse = function (xhr1) {
            if (xhr1.readyState === 4) {
                xhr1.onreadystatechange = nodo;
                if (abortTime > 0)
                    clearTimeout(abortTime);
                if ((xhr1.status >= 200 && xhr1.status < 300)
                    || (xhr1.status === 304)
                    || (xhr1.status === 0 && xhr1.responseText)) {
                    var err = success(xhr1.responseText);
                    if (err) {
                        error('load-error', xhr1.responseText, err);
                    }
                } else {
                    var type = (xhr1.status || xhr1.status === 0) ? 'error' : 'abort';
                    var text = (type == 'error') ? xhr1.responseText : (xhr1.statusText || null);
                    error(type, text);
                }
                //final();
            }
        };
        if (setting.async) {
            xhr.onreadystatechange = function () {
                reponse(xhr);
            };
        }
        if (setting.beforeSend(xhr, setting) === false) {
            xhr.abort();
            return false;
        }
        if (setting.timeout > 0) {
            abortTime = setTimeout(function () {
                xhr.onreadystatechange = nodo;
                xhr.abort();
                error('timeout', 'timeout');
            }, settings.timeout);
        }
        xhr.send(data ? data : null);
        if (!setting.async) {
            reponse(xhr);
        }
        return true;
    };

    function parseError(type, text) {
        var info;
        if (type == 'timeout') {
            info = 'The connection request timed out !';//信息提示,连接服务器超时,请检查网络是否畅通！
        } else if (type == 'abort') {
            info = 'Request Abort !!！';//请求中止
        } else if (type == 'parse-error') {
            info = 'Failed to parse return information ！';//解析返回结果失败
        } else if (type == 'load-error') {
            info = 'Data Load Error ！';
        } else if (type == 'error') {
            info = 'Failed to connect to server！';//连接服务器失败
        } else {
            info = 'Unknown exception!';//未知异常
        }
        return info;
    }
}($e);
