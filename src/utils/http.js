import axios from 'axios';

let myDIYAxios =  (options) => {

    let $axios = axios.create({
        baseURL : 'http://192.168.3.62:3001',
        withCredentials : true
    });

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
    })


    return $axios(options);
};


export default myDIYAxios;
