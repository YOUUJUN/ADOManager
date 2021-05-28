import axios from 'axios';

const errorCaptured = async (asyncFunc, ...params) =>{
    try{
        console.log('params',params);
        let res = await asyncFunc(...params);
        return [null,res];
    }catch (e) {
        return [e, null];
    }
};


const baseURL = "http://192.168.3.62:3001";

const $axios =  async (options = {}) => {

    options = Object.assign({},{
        baseURL,
        method : 'GET',
        withCredentials: false, //CORS
        timeout : 120000,
        responseType: 'json',
        responseEncoding: 'utf8',
        transformRequest: [function (data, headers) {
            // 对 data 进行任意转换处理
            return data;
        }],
        // `transformResponse` 在传递给 then/catch 前，允许修改响应数据
        transformResponse: [function (data) {
            // 对 data 进行任意转换处理
            return data;
        }],
    },options);


    let $axios = axios.create(options);

    // Add a request interceptor
    $axios.interceptors.request.use((config) =>{

        return config;
    },(error)=>{

        return Promise.reject(error);
    });


    $axios.interceptors.response.use((response) =>{

        //do something with response data;
        return response;
    }, (error) =>{

        return Promise.reject(error);
    });


    let [error,res] = await $axios(options);

    if(error){
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);

        } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.log(error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
        }
        console.log(error.config);
    }


    return res;
};


export default $axios;


















