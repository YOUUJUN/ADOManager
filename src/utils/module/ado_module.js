import {extend as $extend} from './utils_module';

import {createObject, getBoolean} from './engine';


const ado_status = {
    REFRESH: '0',
    ROW_NOEDIT: '0',
    ROW_ADD: '2',
    ROW_EDIT: '1',
    ROW_DELETE: '3',
    EVENT_ALL: '#all'
};


class ADOAgent{
    dataPage = null;
    // 是否存在修改行为
    isEdit = false;
    // eventObject: null,
    editCols = null;// 可以修改的列序号
    // 监听数据变动事件
    // 使用的时候当做了数组，结果赋值的时候是null，
    // 这样是有问题的
    // listen: [],
    // 是否正在刷新
    locked = false;
    preRowNum = -1;
    vars = null;
    // 数据加载时延时执行的状态,用于记录响应服务器端数据更新时的状态
    //delayType: '',
    // delayVar: null,
    // delayEvents: null,
    onLoad = null;// 加载完成时的事件函数
    isInited = false;
    maxRowID = 0;
    // maxEvents:10,//在超过10行数据变动事件时，自动转换为REFRESH事件

    constructor(name) {
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

    init = ({extend, columns, updateColumns, updateColumns, pageLoadReset, pageRows, page, pages}) => {
        // 创建结构
        if(extend){
            let obj = createObject(extend);
            $extend(this, obj, true);
        }

        if (columns) {
            columns.forEach((cl, index) => {
                let column = new Column(cl.name, cl.dataType, cl.precision, cl.defaultValue);
                this.columns.push(column);
                this.colsIndex[column.name] = j;
                this.colsIndex[cl.name] = j;
            })
        }
        this.editCols = updateColumns ? updateColumns.split(",") : [];
        this.pageLoadReset = getBoolean(pageLoadReset, true);

        // 实例化 dataPage
        this.dataPage = new DataPage(this, pageRows, page, pages);
    };

    loadData = ({type, rowsData, vars, page, pages, status, vars}) => {
        let addType = type;
        let chgRow = -1;//, chgRowID = -1;
        // 行数据是个数组
        let rowdata = null , status='';
        let delRows = 0;
        let editRows = 0;
        let addRows = 0;

        try {
            this.locked = true;
            // 是否转换列名
            this.reflectData={
                type:(addType=='refresh'?'refresh':'edit'),
                rows:[],
                vars:vars,
                clear:false
            };

            switch (addType) {
                case 'refresh':
                    // 刷新,清空数据
                    if (page <= 0 || this.pageLoadReset) {
                        this.reset(true);
                        this.reflectData.clear=true;
                    }
                    // 修改page状态
                    this.dataPage.changePage(page, pages);
                    // this.addDelayEvent(delayEvents, this.buildEventObject(ado_status.REFRESH));
                    this.dataPage.refreshRows = 0;
                    //只有连续分页才有意义
                    break;

                case 'sync':
                    // 同步,状态为服务器端的状态
                    this.clearEdit(status);
                    break;

                default:
                    this.isEdit = (status != ado_status.ROW_NOEDIT);
                    break;
            }

            let isEdit = this.isEdit;
            let editData = null;

            if (rowsData && rowsData.length > 0) {
                // 遍历rowsData
                rowsData.forEach((data, index, ) => {
                    let rowid = data.__rowid;
                    let map = {};
                    switch (addType) {
                        case 'refresh':

                            // 初始加载
                            if (!this.pageLoadReset && rowid <= this.maxRowID) {
                                if (this.findRowByRowID(rowid) >= 0) {
                                    //防止重复加入行
                                    return;
                                }
                            }

                            rowdata = this.createDefaultRowData("0", rowid);
                            // 使用别名,
                            // 获取每一行数据
                            this.setRowProperties(rowdata, data,map);
                            // 装载data
                            this.maxRowID = Math.max(this.maxRowID, rowid);
                            this.rows.push(rowdata);
                            this.dataPage.refreshRows++;
                            this.reflectData.rows.push(map);

                            break;

                        default:
                            // sync,edit,del数据同步,保存后修改的值
                            let evt = null, row = this.findRowByRowID(rowid, true);
                            if (row >= 0) {
                                chgRow = row;
                                rowdata = this.getRowData(row, true);
                                status = data.__status;
                                // 修改行的行号，
                                if (status == ado_status.ROW_DELETE) {
                                    this.delRow(row, true, true);
                                    delRows++;
                                    this.reflectData.rows.push({__rowid:rowdata.__rowid,__status:ado_status.ROW_DELETE});
                                } else {
                                    // 用新值覆盖旧值
                                    editData = this.setRowProperties(rowdata, data,map);
                                    editRows++;
                                    this.reflectData.rows.push(map);
                                }
                            }else{
                                // add
                                rowdata = this.createDefaultRowData(ado_status.ROW_ADD, rowid);
                                this.maxRowID = Math.max(this.maxRowID, rowid);
                                row = this.preRowNum;
                                if (row >= 0) {
                                    chgRow = this.insertRow(row, rowdata);
                                    this.preRowNum = chgRow + 1;
                                    rowdata.__nextrow=row;
                                } else {
                                    row = this.getDataPage().getRealRow(data.__rownum);
                                    chgRow = this.insertRow(row, rowdata);
                                    rowdata.__nextrow=-1;
                                }
                                this.setRowProperties(rowdata, data,map);
                                this.reflectData.rows.push(map);
                                addRows++;
                            }

                            break;
                    }

                });
            }

            this.isEdit = isEdit;
            if (page == 0 && addType == "refresh") {
                this.dataPage.refreshRows = this.getRowsCount();
            }

            if (vars){
                $extend(this.vars, vars,true);
            }
            this.isInited=true;
        } catch (error) {
            throw error;
        } finally {
            this.locked = false;
        }
        //this.preRowNum = -1;
        // 重建行号
        this.buildRowNum();
    };

    getDataPage = () => this.dataPage;


    /**
     * 插入一行,内部调用，没有触发任何状态改变和事件
     *
     * @param rownum
     * @param rowdata
     * @returns {Number}
     */
    insertRow = (rownum, rowdata) => {
        if (rownum >= 0) {
            for (let i = 0; i < this.rows.length; i++) {
                if (this.rows[i].__rownum >= rownum) {
                    // 返回插入的下标
                    this.rows[i].__rownum += 1;
                    this.rows.splice(i, 0, rowdata);
                    return i;
                }
            }
        }
        // 返回插入的下标
        this.rows.push(rowdata);
        return this.rows.length - 1;
    };

    /**
     * 定位要插入行的位置
     *
     * @param rownum
     */
    prepareInsertRow = (rownum) => { this.preRowNum = rownum; };


    /**
     * @deprecated #see prepareInsertRow
     * @param rownum
     */
    prepareInsert = (rownum) => {this.preRowNum = rownum;};

    getPrepareInsertRow = () => this.preRowNum;


    /**
     * 移动行数据
     *
     * @param from
     * @param to
     * @returns
     */
    moveRow = (from, to) => {
        let i = this.rows.move(from, to);
        if (i >= 0) {
            this.buildRowNum();
            return to;
        }
        return -1;
    };


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
    delRow = (row, stop, all) => {
        let rowdata = null;
        if (row >= 0) {
            rowdata = this.rows.splice(row, 1)[0];
        }
        if (rowdata) {
            if (!stop) {
                // 触发delete事件
                if (this.editCols.length > 0) {
                    this.isEdit = true;
                }
            }
            return true;
        }
        return false;
    };


    /**
     * 在主数据区查找行
     *
     * @param method
     *            字符串或函数
     * @param from
     * @param to
     * @returns 查找到的行号
     */
    findRow = (method, from = 0, to) => {

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
    };


    /**
     * 为rowData创建顺序号和所在的行号 __rownum从0开始 __row从0开始
     */
    buildRowNum = () => {
        if (this.rows.length > 0) {
            let row = this.dataPage.getRowNum(0);
            for (let i = 0; i < this.rows.length; i++) {
                this.rows[i].__rownum = row++;//__rownum是内部编号,不对外提供
                this.rows[i].__row = i;
            }
        }
    };


    /**
     * 本方法只有在后台传来数据时,才会发生,不提供给外部调用，不涉及状态变动和事件触发
     *
     * @param rowdata
     *            指定的行数据对象
     * @param props
     * @returns
     */
    setRowProperties = (rowdata, props,map) => {
        map.__rowid = rowdata.__rowid;

        for (let key in props) {
            if (key.charAt(0) == 'c') {
                let col = key.substring(1) - 0; // 从1开始到后面所有字符
                if (rowdata.__data.rangeCheck(col)) {
                    // 已经转换成数值类型了
                    if (rowdata.__data[col] !== props[key]) {
                        rowdata.__data[col] = props[key];
                    }
                    map[this.columns[col].name]=props[key];
                }
            }
        }
        return null;
    };


    /**
     * 获取行属性
     * @deprecated by getValuesAt
     *
     * @param rown
     * @param colsname
     * @returns
     */
    getRowProperties = (row, colsname) => this.getValuesAt(row, colsname);


    /**
     * 在主数据缓存区获取行的状态
     *
     * @param row
     * @returns
     */
    getRowStatus = (row) => this.rows[row].__status;

    getRowRealStatus = (row) => this.rows[row].__status2;


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
    getRowData = (rownum, all) => {
        let ds= this.rows, row = rownum;
        if (ds.rangeCheck(row)) {
            return ds[row];
        } else {
            throw `In ado ${this.name},getRowData rownum:${rownum} not exists !!!`;
        }
    };

    getRowsData = (fromrow, torow) => {
        let r = 0, rows = new Array(torow - fromrow);
        for (let i = fromrow; i < torow; i++) {
            rows[r++] = this.rows[i];
        }
        return r;
    };


    /**
     * 获取指定行的rowid
     *
     * @param row
     * @returns
     */
    getRowID = (row) => this.rows[row].__rowid;


    /**
     * 在主缓存区获取指定行指定列的值
     *
     * @param row
     * @param col
     * @returns
     */
    getValueAt = (row, col,ifnullvalue) => {
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
                throw (`In getValueAt,column ${col} not exists !`);
            }
            let value=this.rows[row].__data[c1];
            return ((value==null || value=='') && ifnullvalue!=undefined)?ifnullvalue:value;
        } else {
            throw `In ado ${this.name},getRowData row:${row} not exists !!!`;
        }
    };





}

export default ADOAgent;



