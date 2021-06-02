class Adapter {
    constructor(vue){
        this.vue = vue
    }
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
}


//export default Adapter;
