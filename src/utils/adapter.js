class Adapter {
    constructor(props) {

    }

    cacheData(rows = {}, vars = {}, envs = {}){

        const ado = {
            rows,
            vars,
            envs
        }

        this.adoAdapter = ado;
    }


    setValue(){
        this.adoAdapter.rows = [1,2,3];
    }
}


const adapter = new Adapter;


export default adapter;
