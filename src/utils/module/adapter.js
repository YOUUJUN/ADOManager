class Adapter {

    constructor(vue){
        this.vue = vue
    }

    mappingData(adoName, rows1, vars1){
        this[adoName]={rows:rows1,vars:vars1};
    };

    outData(adoname,rows){
        this.vue._data[this[adoname]['rows']].push(rows);
    }

    getData(adoname){
        return this.vue._data[this[adoname]['rows']];
    }


    setValue  (adoName){
        // this.vue.$set(this.adoAdapter, 'rows', 2);
        // this.adoAdapter.rows = 2;
        // this.vue._data.rows = 2;
        //console.log('this==>',this);
        //console.log('adoName',this[adoName]);
        // this[adoName].rows[0] = 1;
        //this[adoName].rows = {name:'abc',age:8};
        //this.vue._data.rows[0] = this[adoName].rows;

        // this.vue.$set(this[adoName].rows,0,'abc');
        this.outData('car',[{name:'abc',age:8}]);
    }
}



export default Adapter;
