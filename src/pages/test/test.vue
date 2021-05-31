<template>

    <div>

        <div v-for="item of rows">
            {{item}}
        </div>

        <button @click="setValue">点我</button>

    </div>

</template>

<script>

    import Adapter from '../../utils/adapter';

    export default {
        name: "test",

        data(){
            return{
                rows : [

                ],

                vars : {

                }
            }
        },

        created() {
            let adapterObj = new Adapter(this);
            adapterObj.cacheData(ados[],this.rows);
        },

        methods : {

            setValue(){
                adapter.setValue();
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
