import {lazy} from 'react';
import Home from '../views/Home'
import {withKeepAlive} from 'keepalive-react-component'

const routes = [{
    path:'/',
    name:'home',
    //将需要缓存的组件用withKeepAlive包裹，添加配置项，cacheId为缓存名（唯一），scroll为是否定位到之前滑动的地方（缓存组件之前滚动的位置）
    component:withKeepAlive(Home, {cacheId: 'home', scroll: true}),
    meta: {
        title:'天天日报-WebApp'
    }
},{
    path:'/detail/:id',
    name:'detail',
    component:lazy(() => import('../views/Detail')), // 路由懒加载
    meta: {
        title:'日报详情-天天日报'
    }
},{
    path:'/personal',
    name:'personal',
    component:lazy(() => import('../views/Personal')), 
    meta: {
        title:'个人中心-天天日报'
    }
},{
    path:'/store',
    name:'store',
    component:lazy(() => import('../views/Store')), 
    meta: {
        title:'我的收藏-天天日报'
    }
},{
    path:'/update',
    name:'update',
    component:lazy(() => import('../views/Update')), 
    meta: {
        title:'修改个人信息-天天日报'
    }
},{
    path:'/login',
    name:'login',
    component:lazy(() => import('../views/Login')), 
    meta: {
        title:'登录/注册-天天日报'
    }
},{
    path:'*',
    name:'404',
    component:lazy(() => import('../views/Page404')), 
    meta: {
        title:'404页面-天天日报'
    }
}];
export default routes;