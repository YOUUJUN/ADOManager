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

    import Adapter from '../../utils/module/adapter';

    import adoManager from '../../utils/module/ado_module';

    import {extend} from "../../utils/module/utils_module";

    export default {
        name: "test",

        data () {
            return {
                rows12345: [],

                vars: {},

                rows2: [],

                vars2: {}
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



            this.test()
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
            },


            test(){
                let target = {
                    foo :1,
                };


                let source = {
                    foo : 2,
                    bar : {
                        baz : 3
                    }
                };


                let result = extend(1, source, false, false);

                console.log('result==>',result);


                setTimeout(()=>{
                    source.bar.baz = 4;
                    console.log('result==>',result);
                },1000)
            }

        }

    }
</script>

<style scoped>

</style>
