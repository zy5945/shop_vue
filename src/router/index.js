import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/Users.vue'
import Rights from '../components/Rights.vue'
import Roles from '../components/Roles.vue'
import Goods from '../components/Goods.vue'
import Params from '../components/Params.vue'
import Categories from '../components/Categories.vue'
import Add from '../components/Add.vue'
import Orders from '../components/Orders.vue'
import Reports from '../components/Reports.vue'

Vue.use(VueRouter)

const routes = [
    {path:'/',redirect:'/login'},
    {path:'/login',component:Login},
    {
        path:'/home',
        component:Home,
        redirect:'/welcome',
        children:[
            {
                path:'/welcome',
                component:Welcome
            },
            //用户管理
            {
                path:'/users',
                component:Users
            },
            {
                path:'/rights',
                component:Rights
            },
            {
                path:'/roles',
                component:Roles
            },
            {
                path:'/goods',
                component:Goods,
            },
            {
                path:'/goods/add',
                component:Add
            },
            {
                path:'/params',
                component:Params
            },
            {
                path:'/categories',
                component:Categories
            }
            ,
            {
                path:'/orders',
                component:Orders
            },
            {
                path:'/reports',
                component:Reports
            }
        ]
    },
];


const originalPush= VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}
const router = new VueRouter({
  routes
});
//路由导航守卫
router.beforeEach((to,from,next)=>{
    if(to.path==='/login') return next();
    const token=window.sessionStorage.getItem('token');
    if(!token) return next('/login');
    next()
})
export default router
