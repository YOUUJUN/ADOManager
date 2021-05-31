<template>

    <div>

        <div v-for="item of rows">
            {{item}}
        </div>

        <button @click="setValue">点我</button>

    </div>

</template>

<script>

    import adapter from '../../utils/adapter';

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
            adapter.cacheData(this.rows);
        },

        methods : {

            setValue(){
                adapter.setValue();
            }

        }

    }
</script>

<style scoped>

</style>
