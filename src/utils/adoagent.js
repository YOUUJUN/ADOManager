+function ($e) {
    ado_status ={
        REFRESH: '0',
        ROW_NOEDIT: '0',
        ROW_ADD: '2',
        ROW_EDIT: '1',
        ROW_DELETE: '3',
        EVENT_ALL: '#all'
    };

    // 该ADOAgent定义的整个显示组件的数据存放和相应的操作。
    function ADOAgent(name) {
        // 该组件的数据存放使用SelfArray类型的变量作为容器
        this.rows = [];// 主缓存数据
        this.vars = {};// 数据对象变量
        this.columns = [];// 所有的列定义,
        this.colsIndex = {};// 所有的列对应的序号,
        this.name = name;
        // this.listen = $e.events.createEventCell();// 所有注册的事件
        // this.eventObject = this.buildEventObject(ado_status.REFRESH);
        this.reflectData=null;//{type:'refresh'/'edit',rows:[],clear:false/true,vars:{}};
    }

    ADOAgent.prototype = {
        dataPage: null,
        // 是否存在修改行为
        isEdit: false,
        // eventObject: null,
        editCols: null,// 可以修改的列序号
        // 监听数据变动事件
        // 使用的时候当做了数组，结果赋值的时候是null，
        // 这样是有问题的
        // listen: [],
        // 是否正在刷新
        locked: false,
        preRowNum: -1,
        vars: null,
        // 数据加载时延时执行的状态,用于记录响应服务器端数据更新时的状态
        //delayType: '',
        // delayVar: null,
        // delayEvents: null,
        onLoad: null,// 加载完成时的事件函数
        isInited: false,
        maxRowID: 0,
        // maxEvents:10,//在超过10行数据变动事件时，自动转换为REFRESH事件
        getDataPage: function () {
            return this.dataPage;
        },

        init: function (props) {
            // 创建结构
            if (props['extend']) {
                let obj = $e.fn.createObject(props['extend']);
                $e.fn.extend(obj, this, true);
            }
            let cls = props.columns;
            if (cls) {
                let column;
                for (let j = 0; j < cls.length; j++) {
                    column = new Column(cls[j].name, cls[j].dataType,
                        cls[j].precision, cls[j].defaultValue);
                    this.columns.push(column);
                    this.colsIndex[column.name] = j;
                    this.colsIndex[cls[j].name] = j;
                }
            }
            this.editCols = props.updateColumns ? props.updateColumns.split(",") : [];
            this.pageLoadReset = $e.fn.getBoolean(props['pageLoadReset'], true);
            //$e.forActiveCell(props, this);
            // 实例化 dataPage
            this.dataPage = new DataPage(this, props.pageRows, props.page, props.pages);
        },

        loadData: function (rds) {
            let addType = rds.type;
            let chgRow = -1;//, chgRowID = -1;
            // 行数据是个数组
            let rowdata = null, rs = rds.rowsData, status='';
            let delRows = 0;
            let editRows = 0;
            let addRows = 0;

            try {
                this.locked = true;
                //this.delayType = '';
                // 是否转换列名
                //let range={};
                //this.delayVar=null;
                // let delayEvents = {'size':0};
                this.reflectData={type:(addType=='refresh'?'refresh':'edit'),rows:[],vars:rds.vars,clear:false};
                if (addType == "refresh") {
                    // 刷新,清空数据
                    if (rds.page <= 0 || this.pageLoadReset) {
                        this.reset(true);
                        this.reflectData.clear=true;
                    }
                    // 修改page状态
                    this.dataPage.changePage(rds.page, rds.pages);
                    // this.addDelayEvent(delayEvents, this.buildEventObject(ado_status.REFRESH));
                    this.dataPage.refreshRows = 0;
                    //只有连续分页才有意义
                } else if (addType == "sync") {
                    // 同步,状态为服务器端的状态
                    this.clearEdit(rds.status);
                } else {
                    this.isEdit = (rds.status != ado_status.ROW_NOEDIT);
                }
                let isEdit = this.isEdit;
                let editData = null;
                if (rs && rs.length > 0) {
                    let rowid;
                    // 遍历rowsData
                    let map=null;
                    for (let i = 0; i < rs.length; i++) {
                        rowid = rs[i].__rowid;
                        map={};
                        if (addType == "refresh") {
                            // 初始加载
                            if (!this.pageLoadReset && rowid <= this.maxRowID) {
                                if (this.findRowByRowID(rowid) >= 0) {
                                    //防止重复加入行
                                    continue;
                                }
                            }
                            rowdata = this.createDefaultRowData("0", rowid);
                            // 使用别名,
                            // 获取每一行数据
                            this.setRowProperties(rowdata, rs[i],map);
                            // 装载data
                            this.maxRowID = Math.max(this.maxRowID, rowid);
                            this.rows.push(rowdata);
                            this.dataPage.refreshRows++;
                            this.reflectData.rows.push(map);
                        } else {
                            // sync,edit,del数据同步,保存后修改的值
                            let evt, row = this.findRowByRowID(rowid, true);
                            if (row >= 0) {
                                chgRow = row;
                                rowdata = this.getRowData(row, true);
                                status = rs[i].__status;
                                // 修改行的行号，
                                //chgRowID = rowid;
                                // evt = this.buildEventObject(status, row, rowdata.__rowid, -1);
                                if (status == ado_status.ROW_DELETE) {
                                    // evt.rowData = rowdata;
                                    this.delRow(row, true, true);
                                    delRows++;
                                    this.reflectData.rows.push({__rowid:rowdata.__rowid,__status:ado_status.ROW_DELETE});
                                } else {
                                    // 用新值覆盖旧值
                                    editData = this.setRowProperties(rowdata, rs[i],map);
                                    // if (editData.cols == 1) {
                                    //     evt.newValue = editData.newValue;
                                    //     evt.oldValue = editData.oldValue;
                                    //     evt.columnIndex = editData.columnIndex;
                                    //     evt.columnName = this.getColumnName(editData.columnIndex);
                                    // }
                                    editRows++;
                                    this.reflectData.rows.push(map);
                                }
                                // this.addDelayEvent(delayEvents, evt);
                            } else {
                                // add
                                rowdata = this.createDefaultRowData(ado_status.ROW_ADD, rowid);
                                this.maxRowID = Math.max(this.maxRowID, rowid);
                                row = this.preRowNum;
                                if (row >= 0) {
                                    chgRow = this.insertRow(row, rowdata);
                                    this.preRowNum = chgRow + 1;
                                    rowdata.__nextrow=row;
                                } else {
                                    row = this.getDataPage().getRealRow(rs[i].__rownum);
                                    chgRow = this.insertRow(row, rowdata);
                                    rowdata.__nextrow=-1;
                                }
                                this.setRowProperties(rowdata, rs[i],map);
                                this.reflectData.rows.push(map);
                                // this.addDelayEvent(delayEvents, this.buildEventObject(ado_status.ROW_ADD, chgRow, rowdata.__rowid, -1));
                                addRows++;
                            }
                        }
                    }
                }
                this.isEdit = isEdit;
                if (rds.page == 0 && addType == "refresh") {
                    this.dataPage.refreshRows = this.getRowsCount();
                }
                //rs = rds.vars;
                if (rds.vars){
                    $e.fn.extend(rds.vars,this.vars,true);
                }
                // if (rs && !$e.fn.isEmptyObject(rs)) {
                //     //let d = [];
                //     for (let k in rs) {
                //         //d.push({name: k, oldValue: this.vars[k] || null, value: rs[k]});
                //         //this.setVar(k, rs[k], true);
                //         this.reflectData.vars[k]=rs[k];
                //     }
                //     //if (addType != 'refresh') {
                //     //刷新时，不触发变量变动事件
                //     //this.delayVar = d;//this.delayVar ? this.delayVar.concat(d) : d;
                //     //}
                // }
                // this.delayEvents = $e.fn.isEmptyObject(delayEvents)?null:delayEvents;
                // if (this.delayEvents && this.delayEvents['size']>this.maxEvents){
                //     this.delayEvents={'size':0};
                //     this.addDelayEvent(this.delayEvents, this.buildEventObject(ado_status.REFRESH));
                // }
                this.isInited=true;
            } catch (error) {
                throw error;
            } finally {
                this.locked = false;
            }
            //this.preRowNum = -1;
            // 重建行号
            this.buildRowNum();
        },

        // addDelayEvent: function (delayobj, event) {
        //     let es = delayobj[event.eventType];
        //     if (!es) {
        //         es = delayobj[event.eventType] = [];
        //     }
        //     es.push(event);
        //     delayobj['size']=(delayobj['size']||0)+1;
        // },
        /**
         * 插入一行,内部调用，没有触发任何状态改变和事件
         *
         * @param rownum
         * @param rowdata
         * @returns {Number}
         */
        insertRow: function (rownum, rowdata) {
            if (rownum >= 0) {
                for (let i = 0; i < this.rows.length; i++) {
                    if (this.rows[i].__rownum >= rownum) {
                        // 返回插入的下标
                        this.rows[i].__rownum += 1;
                        this.rows.splice(i, 0, rowdata);
                        return i;
                    }
                }
            } // else {
            // 返回插入的下标
            this.rows.push(rowdata);
            return this.rows.length - 1;
            // }
        },

        /**
         * 定位要插入行的位置
         *
         * @param rownum
         */
        prepareInsertRow: function (rownum) {
            this.preRowNum = rownum;
        },
        /**
         * @deprecated #see prepareInsertRow
         * @param rownum
         */
        prepareInsert: function (rownum) {
            this.preRowNum = rownum;
        },
        getPrepareInsertRow: function () {
            return this.preRowNum;
        },
        /**
         * 移动行数据
         *
         * @param from
         * @param to
         * @returns
         */
        moveRow: function (from, to) {
            let i = this.rows.move(from, to);
            if (i >= 0) {
                this.buildRowNum();
                // let eo = this.buildEventObject(ado_status.REFRESH);
                // this.doDataListen(eo);
                return to;
            }
            return -1;
        },

        /**
         * 删除行数据
         *
         * @param row
         *            指定的行
         * @param stop
         *            是否停止触发事件
         * @param all
         *            是否包含过滤缓存区
         * @returns {Boolean}
         */
        delRow: function (row, stop, all) {
            let rowdata = null;
            if (row >= 0) {
                rowdata = this.rows.splice(row, 1)[0];
            }
            if (rowdata) {
                if (!stop) {
                    // 触发delete事件
                    // let eo = this.buildEventObject(ado_status.ROW_DELETE, row, rowdata.__rowid, -1);
                    // eo.rowData = rowdata;
                    if (this.editCols.length > 0) {
                        this.isEdit = true;
                    }
                    // this.doDataListen(eo);
                }
                return true;
            }
            return false;
        },

        /**
         * 在主数据区查找行
         *
         * @param method
         *            字符串或函数
         * @param from
         * @param to
         * @returns 查找到的行号
         */
        findRow: function (method, from, to) {
            // 这行代码的意义？
            from = from || 0;
            if (!to || to > this.rows.length) {
                to = this.rows.length;
            }
            let i = -1, f = false, p = [this];
            for (i = from; (i < to) && (!f); i++) {
                f = method.apply(this.rows[i], p);
                if (f) {
                    break;
                }
            }
            // 返回to，或 -1
            return f ? i : -1;
        },

        /**
         * 为rowData创建顺序号和所在的行号 __rownum从0开始 __row从0开始
         */
        buildRowNum: function () {
            if (this.rows.length > 0) {
                let row = this.dataPage.getRowNum(0);
                for (let i = 0; i < this.rows.length; i++) {
                    this.rows[i].__rownum = row++;//__rownum是内部编号,不对外提供
                    this.rows[i].__row = i;
                }
            }
        },

        /**
         * 本方法只有在后台传来数据时,才会发生,不提供给外部调用，不涉及状态变动和事件触发
         *
         * @param rowdata
         *            指定的行数据对象
         * @param props
         * @returns
         */
        setRowProperties: function (rowdata, props,map) {
            //let c = {cols: 0, col: -1, oldValue: null, newValue: null};
            map.__rowid=rowdata.__rowid;
            for (let key in props) {
                if (key.charAt(0) == 'c') {
                    let col = key.substring(1) - 0; // 从1开始到后面所有字符
                    if (rowdata.__data.rangeCheck(col)) {
                        // 已经转换成数值类型了
                        if (rowdata.__data[col] !== props[key]) {
                            // c.oldValue = rowdata.__data[col];
                            // c.newValue = props[key];
                            // c.columnIndex = col;
                            rowdata.__data[col] = props[key];
                            // c.cols++;
                        }
                        map[this.columns[col].name]=props[key];
                    }
                }
            }
            return null;
        },

        /**
         * 获取行属性
         * @deprecated by getValuesAt
         *
         * @param rown
         * @param colsname
         * @returns
         */
        getRowProperties: function (row, colsname) {
            return this.getValuesAt(row, colsname);
        },

        /**
         * 在主数据缓存区获取行的状态
         *
         * @param row
         * @returns
         */
        getRowStatus: function (row) {
            return this.rows[row].__status;
        },
        getRowRealStatus: function (row) {
            return this.rows[row].__status2;
        },

        /**
         * 在主数据缓存区根据id获取一行的属性
         *
         * @param rowid
         *            数据行的rowid
         * @param colsname
         *            数组列名(如['name','age'])或用",'连接的字段名字符串(如'name,age')
         * @returns
         */
        // getRowPropertiesById : function(rowid, colsname) {
        // 	let r = this.findRowByRowID(rowid);
        // 	return r >= 0 ? this.getRowProperties(r, colsname) : null;
        // },

        /**
         * 获取行数据,一般只用于内部调用
         *
         * @param rownum
         *            行号
         * @param all
         *            是否包括过滤缓存
         * @returns
         */
        getRowData: function (rownum, all) {
            let ds= this.rows, row = rownum;
            if (ds.rangeCheck(row)) {
                return ds[row];
            } else {
                throw 'In ado ' + this.name + ",getRowData rownum:" + rownum
                + " not exists !!!";
            }
        },
        getRowsData: function (fromrow, torow) {
            let r = 0, rows = new Array(torow - fromrow);
            for (let i = fromrow; i < torow; i++) {
                rows[r++] = this.rows[i];
            }
            return r;
        },
        /**
         * 获取指定行的rowid
         *
         * @param row
         * @returns
         */
        getRowID: function (row) {
            return this.rows[row].__rowid;
        },

        /**
         * 在主缓存区获取指定行指定列的值
         *
         * @param row
         * @param col
         * @returns
         */
        getValueAt: function (row, col,ifnullvalue) {
            if (this.rows.rangeCheck(row)) {
                let c1 = col;
                if (isNaN(col)) {
                    c1 = this.getColumnIndex(col);
                }
                if (c1 == -100) {
                    return this.rows[row]['$row'];
                } else if (c1 == -101) {
                    return this.rows[row].__rowid;
                }
                if (!this.rows[row].__data.rangeCheck(c1)) {
                    throw ("In getValueAt,column '" + col + "' not exists !");
                }
                let value=this.rows[row].__data[c1];
                return ((value==null || value=='') && ifnullvalue!=undefined)?ifnullvalue:value;
            } else {
                throw 'In ado ' + this.name + ",getRowData row:" + row + " not exists !!!";
            }
        },



        /**
         * 修改主缓存数据指定行指定列的值
         *
         * @param row
         *            指定行
         * @param col_name_index
         *            列名或列号
         * @param value
         * @param stope
         *            是否禁止触发事件
         * @returns {Boolean}，有数据修改true,否则为false
         */
        setValueAt: function (row, col_name_index, value, stope) {
            let col;
            if (isNaN(col_name_index)) {
                col = this.getColumnIndex(col_name_index);
            } else {
                col = col_name_index - 0;
            }
            if (!this.rows.rangeCheck(row)) {
                throw new Error("In AdoAgent:" + this.name
                    + ",setValueAt:row " + row + " not exists !!!");
            } else if (!this.columns.rangeCheck(col)) {
                throw new Error("In AdoAgent:" + this.name
                    + ",setValueAt:column " + col_name_index
                    + " not exists !!!");
            } else {
                let rd = this.rows[row];
                let cln = this.columns[col];
                let v1 = rd.__data[col];
                if (value) {
                    value = $e.fn.parseValue(value, cln.dataType, cln.precision);
                }
                if (v1 !== value) {
                    // let rs = this.buildEventObject(ado_status.ROW_EDIT, row, rd.__rowid, col);
                    // rs.rowData = rd;
                    // rs.oldValue = v1;
                    // rs.newValue = value;
                    rd.__data[col] = value;

                    // 行状态为修改
                    rd.__status = ((rd.__status == ado_status.ROW_NOEDIT) ? ado_status.ROW_EDIT: rd.__status);
                    if (rd.__cellStatus.indexOf(col) < 0) {
                        rd.__cellStatus.push(col);
                    }
                    this.isEdit = true;
                    // this.eventObject = rs;
                    // if (!stope) {
                    //     this.doDataListen(rs);
                    // }
                    return true;
                }
                return false;
            }
        },

        /**
         * 在主数据缓存区获取一行的属性
         *
         * @param row_rowdata
         * @param colsname
         *            只能是用","分割的字符串或字符串数组
         * @returns
         */
        getValuesAt: function (row_rowdata, colnames, hasvar) {
            let rs = {};
            let rd;
            if (!isNaN(row_rowdata)) {
                // row_rowdata >>> 0;
                if (this.rows.rangeCheck(row_rowdata)) {
                    rd = this.rows[row_rowdata];
                } else {
                    throw "In ado:" + this.name + ",getValuesAt(row),row "
                    + row_rowdata + " over range !!!";
                }
            } else {
                rd = row_rowdata;
            }
            if (rd) {
                if (colnames) {
                    let ns = (colnames instanceof Array) ? colnames : colnames.toLowerCase().split(",");
                    for (let i = 0; i < ns.length; i++) {
                        rs[ns[i]] = rd[ns[i]];
                    }
                } else {
                    rs.__rowid = rd.__rowid;
                    rs.__rownum = rd.__rownum;
                    rs.__status = rd.__status;
                    rs.__status2 = rd.__status2;
                    for (let j = 0; j < this.columns.length; j++) {
                        rs[this.columns[j].name] = rd.__data[j];
                    }
                }
            }
            if (hasvar) {
                $e.fn.extend(this.vars, rs);
            }
            return rs;
        },
        /**
         * 修改主缓存区的数据值
         *
         * @param row
         *            指定行
         * @param props
         *            要修改的值集
         */
        setValuesAt: function (row, props) {
            //let b1=false;
            if (props) {
                let col=-1;
                //let c1 = 0,b1 = false;//, chgCol = -1;
                for (let i in props) {
                    col = this.getColumnIndex(i);
                    if (col >= 0) {
                        this.setValueAt(row, col, props[i], true);
                        //c1 += (b1 ? 1 : 0);
                    }
                }
                // if (c1 > 0) {
                //     c1 += (b1 ? 1 : 0);
                //     let eo = this.buildEventObject(ado_status.ROW_EDIT, row, this.getRowID(row), c1 > 1 ? -2 : chgCol);
                //     this.doDataListen(eo);
                // }
            }
            //return b1;
        },
        /**
         * 设置数据对象变量
         *
         * @param name
         *            数据对象变量区分大小写
         * @param value
         */
        // setVar: function (name, value, stope) {
        //     let oldvalue = this.vars[name] || null;
        //     this.vars[name] = value;
        // },
        // getVar: function (name) {
        //     return this.vars[name];
        // },
        getVars: function () {
            return this.vars;
        },
        removeVar: function (name) {
            let v1=this.vars[name];
            delete this.vars[name];
            return v1;
        },

        setEdit: function (edit) {
            this.isEdit = edit;
        },
        /**
         * 设置刷新状态,ok
         *
         * @param b
         * @returns
         */
        setLocked: function (b) {
            this.locked = !!b;
        },

        /**
         * 改变数据对象的变动状态
         *
         * @param row
         * @param rowid
         * @param col
         */
        // buildEventObject: function (status, row, rowid, col) {
        //     let eo = {
        //         eventType: status,
        //         rowid: rowid,
        //         row: row,
        //         columnIndex: col,// -1表示没有列改变,-2表示多个列改变
        //         columnName: '',// 正在改变的列
        //         newValue: null,
        //         oldValue: null,
        //         rowData: null,
        //         ado: this
        //     };
        //     if ((status == ado_status.REFRESH) || (row < 0)) {
        //         eo.row = eo.rowid = eo.columnIndex = -1;
        //     } else if (status != ado_status.REFRESH && row >= 0 && row < this.getRowsCount()) {
        //         eo.rowData = this.getRowData(row);
        //         if (eo.rowData != null && eo.rowData.__rowid != rowid) {
        //             eo.rowData = null;
        //         }
        //     }
        //     if ((arguments.length >= 4) && (col >= 0)) {
        //         eo.columnName = this.columns[col].name.toLowerCase();
        //     }
        //     return eo;
        // },

        /**
         * 统计主缓存区某列的值
         *
         * @param name_index
         * @param prec
         * @param func
         *            对指定行进行范围验证，确定是否包含在内
         * @returns
         */
        sum: function (col_method, prec) {
            let v=0.0,v1;
            if ((typeof col_method)=='function'){
                let p = [this];
                for (let i = 0; i < this.rows.length; i++) {
                    v1 = col_method.apply(this.rows[i], p);
                    v += ((v1 || 0) - 0);
                }
            }else {
                let col = isNaN(col_method) ? this.getColumnIndex(col_method) : col_method - 0;
                if (col >= 0) {
                    for (let i = 0; i < this.rows.length; i++) {
                        v1 = this.rows[i].__data[col];
                        v += ((v1 || 0) - 0);
                    }
                }
            }
            return (prec || prec === 0) ? v.toFixed(prec) - 0 : v;
        },

        /**
         * 根据列名获取列号(列的位置)
         *
         * @param colname
         * @return
         */
        getColumnIndex: function (colname) {
            if (colname) {
                if (colname == "$row") {//从1开始的行号,__rownum从0开始
                    return -100;
                } else if (colname == "__rowid") {//__rowid是虚拟的列
                    return -101;
                } else {
                    let i = this.colsIndex[colname.toLowerCase()];
                    return (i === undefined || i === null) ? -1 : i;
                }
            }
            return -1;
        },
        getColumnName: function (index) {
            return this.columns.rangeCheck(index) ? this.columns[index].name : null;
        },

        /**
         * 获取指定的列
         *
         * @param col_name
         *            列名或列号
         * @returns
         */
        getColumn: function (col_name) {
            let i = isNaN(col_name) ? this.getColumnIndex(col_name) : col_name;
            return this.columns.rangeCheck(i) ? this.columns[i] : null;
        },

        /**
         * 获取列数
         *
         * @returns
         */
        getColumnCount: function () {
            return this.columns.length;
        },

        /**
         * 以数组形式返回多个列名的位置
         *
         * @param colsname
         * @returns
         */
        getColumnsIndex: function (colsname) {
            let ci = [];
            if (colsname) {
                if (colsname == '#all') {
                    for (let i = 0; i < this.colsIndex.length; i++) {
                        ci[i] = i;
                    }
                } else {
                    let cs = colsname;
                    if (typeof (colsname) == 'string') {
                        cs = colsname.split(",");
                    }
                    for (let i = 0; i < cs.length; i++) {
                        ci[i] = this.getColumnIndex(cs[i]);
                    }
                }
            }
            return ci;
        },

        /**
         * 根据指定的状态获取默认的行数据，内部调用
         *
         * @param status
         *            行的状态
         * @param rowid
         *            指定的rowid
         * @returns {RowData}
         */
        createDefaultRowData: function (status, rowid) {
            let len = this.columns.length;
            let rd = new RowData(len, status, rowid, this.colsIndex);
            for (let i = 0; i < len; i++) {
                // 获取默认值
                rd.__data[i] = this.columns[i].defa;
            }
            return rd;
        },

        /**
         * 根据rowid获取所在的行
         *
         * @param id
         * @param all
         *            是否包括过滤缓存
         * @return
         */
        findRowByRowID: function (rowid) {
            let count = this.rows.length;
            for (let i = 0; i < count; i++) {
                if (this.rows[i].__rowid == rowid) {
                    return i;
                }
            }
            return -1;
        },

        /**
         * 获取rowid所在的行的集合
         * @param rowid
         * @returns {{}}
         */
        getRowIDMap: function (rowid) {
            let map=new Map();
            let count = this.rows.length;
            for (let i = 0; i < count; i++) {
                map[this.rows[i].__rowid]=i;
            }
            return map;
        },


        /**
         * 清空所有数据和行状态
         */
        reset: function (stope) {
            this.rows.length = 0;
            this.isEdit = false;
            // if (!stope) {
            //     this.eventObject = this.buildEventObject(ado_status.REFRESH);
            //     this.doDataListen(this.eventObject);
            // }
        },

        /**
         * 清空修改状态
         *
         * @param status
         *            修改为指定的状态
         */
        clearEdit: function (status) {
            let rowdata;
            let st1 = ado_status.ROW_NOEDIT;
            let data = this.rows;
            for (let i = 0; i < data.length; i++) {
                rowdata = data[i];
                if (status == st1)
                    rowdata.__status = rowdata.__status2 = st1;
                rowdata.__cellStatus.length = 0;
            }
            this.isEdit = (status != st1);
        },

        /**
         * 判断是否存在已修改还没有同步的数据
         *
         * @return {Boolean}
         */
        hasEditData: function () {
            if (this.editCols.length > 0) {
                let d1 = this.rows;
                for (let i = 0; i < d1.length; i++) {
                    if (d1[i].__status != ado_status.ROW_NOEDIT)
                        return true;
                }
            }
            return false;
        },

        /**
         * 判断是否修改或未保存
         */
        isDataEdit: function () {
            return this.isEdit || this.hasEditData();
        },

        /**
         * 获取修改的数据
         *
         * @return {}
         */
        getUpdateData: function () {
            let prop = null;
            if (this.editCols.length > 0) {
                prop = {
                    //type : "sync",
                    convert: "1"
                };
                // 修改状态值为sync，
                $e.forActiveCell(this, prop);

                let eData = [];
                let rd, col, vs, p = null, value;
                // 主缓存区和过滤缓存区
                let data = this.rows;
                for (let i = 0; i < data.length; i++) {
                    rd = data[i];
                    if ((rd.__status != ado_status.ROW_NOEDIT)
                        && (rd.__cellStatus.length > 0)) {
                        p = {
                            __rowid: rd.__rowid,
                            __status: rd.__status
                        };
                        vs = rd.__cellStatus;
                        for (let j = 0; j < vs.length; j++) {
                            col = vs[j];
                            value = rd.__data[col];
                            if (value && value instanceof Date) {
                                value = value.getTime();
                            }
                            p["c" + col] = value;
                        }
                        eData.push(p);
                    }
                }
                if (eData.length > 0) {
                    prop.data = eData;
                } else {
                    prop = null;
                }
            }
            return prop;
        },

        /**
         * 根据名称添加事件
         *
         * @param l，成员有{name,eventType,method:function,context}
         */
        // addListen: function (listen) {
        //     return this.listen.add(listen);
        // },
        //
        // removeListen: function (handle) {
        //     this.listen.remove(handle);
        // },

        /**
         * 延时执行数据变动事件，一般是从同步服务器端数据后开始执行
         */
        // doDelayListen: function () {
        //     let es, events = this.delayEvents;
        //     if (events) {
        //         es = events[ado_status.REFRESH];
        //         if (es) {
        //             for ( let i = 0; i < es.length; i++) {
        //                 this.doDataListen(es[i]);
        //             }
        //             this.delayVar = null;
        //         } else {
        //             es = (events[ado_status.ROW_DELETE] || []);
        //             if (es) {
        //                 for ( let i = 0; i < es.length; i++) {
        //                     this.doDataListen(es[i]);
        //                 }
        //             }
        //             es = (events[ado_status.ROW_EDIT] || [])
        //                 .concat((events[ado_status.ROW_ADD] || []));
        //             for ( let i = 0; i < es.length; i++) {
        //                 es[i].row = this.findRowByRowID(es[i].rowid);
        //                 this.doDataListen(es[i]);
        //             }
        //         }
        //     }else if (this.delayVar){
        //         this.doDataListen(this.buildEventObject(ado_status.EVENT_ALL,-1));
        //     }
        //     this.delayEvents = null;
        //     this.isInited = true;
        // },

        // /**
        //  * 执行数据变动事件
        //  *
        //  * @param type
        //  */
        // doDataListen: function (event_object) {
        //     event_object = event_object || this.eventObject;
        //     this.eventObject = event_object;
        //     if (!this.locked) {
        //         if ((event_object.row || 0) >= 0) {
        //             this.isEdit = (this.editCols.length > 0);
        //         }
        //         let p = $e.fn.extend(event_object, {});
        //         this.listen.done(p);
        //     }
        // },

        /**
         * 返回主缓存区数据行数
         *
         * @returns
         */
        getRowsCount: function () {
            return this.rows.length;
        },

        /**
         * 按指定的了排序,可对多列排序
         *
         * @param cols_and_type[[]]
         *            二维数组 排序列序号或列名及排序方式，如[[a,1],[b,-1]]按列顺序,b列倒叙
         * @param type[]
         *            排序方式 1/顺序 -1/倒序
         * @returns
         */
        sortBy: function (cols_and_type) {
            let ct = cols_and_type;
            if (typeof ct == 'string') {
                ct = ct.split(";");
                let p;
                for (let i = 0; i < ct.length; i++) {
                    p = ct[i].indexOf(",");
                    if (p >= 0) {
                        ct[i] = [ct[i].substring(0, p),
                            parseInt(ct[i].substring(p + 1))];
                    } else {
                        ct[i] = [ct[i], 1];
                    }
                }
            }
            if (ct && ct.length > 0) {
                for (let i = 0; i < ct.length; i++) {
                    ct[i][0] = isNaN(ct[i][0]) ? this.getColumnIndex(ct[i][0])
                        : (ct[i][0] - 0);
                }
                this.rows.sort(function (x, y) {
                    let vx, vy;
                    for (let i = 0; i < ct.length; i++) {
                        vx = x.__data[ct[i][0]] || '';
                        vy = y.__data[ct[i][0]] || '';
                        if (vx != vy) {
                            return (vx > vy) ? ct[i][1] : -ct[i][1];
                        }
                    }
                    return 0;
                });
                this.buildRowNum();
                // let eo = this.buildEventObject(ado_status.REFRESH);
                // this.doDataListen(eo);
            }
        },

        /**
         * 对指定的列进行排序
         *
         * @param cname
         *            列名
         * @param type
         *            顺序或倒序(1/顺序;-1/倒序)
         */
        sort: function (cname, type) {
            this.sortBy([[cname, type || 1]]);
        },

        toPage: function (page, options) {
            options = options ? options : {};
            if (page < 0) {
                page = 0;
            } else if (page >= this.dataPage.pages) {
                page = this.dataPage.pages - 1;
            }
            if (page != this.dataPage.currentPage) {
                options.params = options.params || {};
                options.params._name = this.getName();
                options.params.page = page;
                this.request('pagedata', '', null, null, options);
                return true;
            }
            return false;
        },
        nextPage: function (options) {
            let pg = this.getDataPage();
            if (pg.getCurrentPage() < pg.getPageCount() - 1) {
                return this.toPage(pg.getCurrentPage() + 1, options);
            }
            return false;
        },
        release: function () {
            // if (this.listen) {
            //     this.listen.release();
            //     this.listen = null;
            // }
            this.reset(true);
            // 该函数未声明
            $e.removeADO(this.getName(), this.getActiveModuleName());
            this.dataPage.release();
            this.dataPage = null;
        },
        toString: function () {
            return this.name;
        }
    };
    // 该类定义一行的属性（而一行包含n列，其属性有：行的长度/length，状态标示/statusFlag，
    // 行的id/rowID---唯一标示该行的属性）
    function RowData(len, status, rowid, columnsindex) {
        // 行数据(每一个元素就是一个DataColumn),变量rowData已经过时，只是为了兼容旧版本
        this.__status = this.__status2 = status;
        this.__cellStatus = [];
        this.__rowid = rowid;
        this.__data = new Array(len);
        this.__cols = columnsindex;
    }

    RowData.prototype = {
        __rownum: -1,//行序号，在只有一页数据时与__row相同，都从0开始；
        __row: -1 //不管数据处在第几页，总是从0开始，$是从1开始的行号，等于__rownum+1
    };

    // 该类定义一列的属性（列名/name，类型/type，默认值/defa）
    // order 排列序号
    // type:string,date,datetime,int,number
    function Column(name, type, precision, defa) {
        this.name = name.toLowerCase();
        this.dataType = type.toLowerCase();
        this.precision = precision;
        this.defa = defa;
    }

    function DataPage(ado, _pagerows, _page, _pages) {
        this.ado = ado;
        this.pageRows = _pagerows;
        this.changePage(_page, _pages);
    }

    DataPage.prototype = {
        ado: null,
        pages: 1,
        pageRows: 0,
        currentPage: 0,
        refreshRows: 0,
        changePage: function (page, pages) {
            page = page <= 0 ? 0 : page;
            this.currentPage = page;
            this.pages = pages;
        },
        getPageRows: function () {
            return this.pageRows;
        },
        /**
         *
         * @param row
         * @returns
         */
        getRowNum: function (row) {
            let num;
            if (this.ado.pageLoadReset || this.currentPage <= 0) {
                num = this.currentPage * this.pageRows + row;
            } else {
                num = row;
            }
            return num;
        },
        getRealRow: function (row) {
            let num;
            if (this.ado.pageLoadReset || this.currentPage <= 0 || row < this.pageRows || this.pageRows <= 0) {
                num = row;
            } else {
                num = row % this.pageRows;
            }
            return num;
        },
        getPageCount: function () {
            return this.pages;
        },
        getCurrentPage: function () {
            return this.currentPage;
        },
        getRefreshRows: function () {
            return this.refreshRows;
        },
        hasNextPage: function () {
            return this.pages > 1 && (this.currentPage < this.pages - 1);
        },
        release: function () {
            this.ado = null;
        }
    };

    //$e.fn.extend($e.ModuleCell, ADOAgent.prototype);
    $e.ADOAgent = ADOAgent;
}($e);
//