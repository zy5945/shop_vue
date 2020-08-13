import Vue from 'vue';
import App from './App.vue';
import router from './router';
import './plugins/element.js';
import './assets/css/global.css';
import axios from 'axios';
import TreeTable from 'vue-table-with-tree-grid';
axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/';
//通过axios请求拦截器添加token，确保有获取数据的权限。
axios.interceptors.request.use(config=>{
    console.log(config);
    config.headers.Authorization = window.sessionStorage.getItem('token');
    return config
})
Vue.config.productionTip = false;
Vue.prototype.$http=axios;
Vue.component('tree-table',TreeTable);
Vue.filter('dateFormat',function(dates){
    let date=new Date(dates)
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    let d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    let e= date.getHours(); //小时
    let f= date.getMinutes(); //分
    let g= date.getSeconds()
    return y + '-' + m + '-' + d+' '+e+':'+f+':'+g;
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
