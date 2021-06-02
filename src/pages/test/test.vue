<template>

    <div>

<!--        <div v-for="item of rows">-->
<!--            <span>{{item}}</span>-->
<!--        </div>-->

        <div>{{rows12345}}</div>

        <button @click="setValue">点我</button>

        <button @click="setValue2">点我2</button>

    </div>

</template>

<script>

    import Adapter from '../../utils/adapter';

    import adoManager from '../../utils/ado_module';

    export default {
        name: "test",
        data () {
            return {
                rows12345: [],
                vars: {},
                rows2: [],
                vars2: {},
                view:{
                    car_type:'0/dd;1/ddd'//[{label:'',value:1234},{}]
                }
            }

        },

        created() {

            let adapter = new Adapter(this);

            adapter.mappingData('car', 'rows12345', 'vars');

            // adapter.mappingData('carList', this.rows2, this.vars2);

            //this.observer = observer;

            // adapter.setValue('car');
            this.adapter = adapter;
            console.log('adapter',adapter);
        },

        methods : {

            setValue(){
                adoManager.fillAdapter(this.adapter);
                // this.rows=this.adapter.car.rows;
                //console.log(this.rows);
            },

            setValue2(){
                //this.$set(this.rows, 0, 1);
                //this.$set(this.rows, 1, 2);
            }
        }
    }


var datas={
        ados:{
            car:{
                rows:[],
                vars:{}
            }
        }
}
    engine.request();



</script>

<style scoped>

</style>
