class ActiveModule{
    _amn='';
    engine=null;
    constructor(amn,engine){
        this._amn=amn;
        this.engine=engine;
        this.ados = {};
    }
    call = (name, ados, jsonparm, options)=> {
        this.request("call", name, ados, jsonparm, options);
    }
    selfCall=(name, ados, jsonparm, options)=> {
        this.request("async", name, ados, jsonparm, options);
    }
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
            cell = this.engine.getADO(name, am);
        }
        if (cell) {
            if (options.success) {
                this.engine.callback(options.success);
            }
        } else {
            options.params = options.params || {};
            options.params._mn = options.params._mn || this.getModuleName();
            this.engine.request(this._amn, type, name, ados, jsondata, options);
        }
    }
    release=()=>{
        if (this.engine) {
            this.engine = null;
            for (var i in this.ados) {
                this.ados[i].release();
            }
            this.ados = null;
        }
    }
}

class Engine{
    _inited=false;
    _amgn=null;
    _checkid=null;
    _lifeType='keep';
    am=null;
    ams={};

    //初始化，外部驱动
    init=(amgn,amn,checkid,options={})=>{
        amn=amn||amgn;
        this._amgn=amgn;
        this._checkid= checkid || this._checkid;
        if (!this.am && amn==amgn) {
            this.am = new ActiveModule(amgn, this);
        }
        let am1=this.getActiveModule(amn);
        let act=options['_act'];
        if (!options.success) {
            options.success = this.inited;
            options.context = this;
        } else {
            options.success = [ this.initEnd, options.success ];
        }
        if (!this._inited || (!this._checkid) || (checkid !=this._checkid) || !am1){
            this.request(amn, "reg_am", act, null, null, options);
        }else if (act){
            this.request(amn, "call", act, null, null, options);
        }
    }
    initEnd=(options)=>{
        this._public = options['public'] || false;
        this._lifeType = (options['lifeType'] || 'keep' )== 'keep';
        this._inited = true;
    }
    getActiveModule=(name,force)=>{
        if (!name || name==this._amgn){
            return this.am;
        }
        let am1=this.ams[name];
        if (!am1 && force){
            am1=new ActiveModule(name,this);
            this.ams[name]=am1;
        }
        return am1;
    }
    request=(amn,type, name, ados, jsondata, options)=> {

    }
    release=()=>{
        if (this.ams) {
            if (this.am) {
                this.am = null;
            }
            for (var i in this.ams) {
                this.ams[i].release();
            }
            this.ams = null;
        }
    }
}
var $e=new Engine();


ActiveModule.hello()


var foo = new ActiveModule;




export function call() {

}


export default engine;
