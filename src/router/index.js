import React,{Suspense, useEffect, useState} from "react"; //Suspense 优化路由懒加载
import {Routes, Route, useNavigate, useLocation, useParams, useSearchParams} from 'react-router-dom'
import routes from "./routes";
import {Mask, DotLoading, Toast} from 'antd-mobile'
import store from '../store'
import action from "../store/action";

const isCheckLogin = (path) => { //返回是否需要校验
    let { base: { info } } = store.getState(), // 是否拿到用户信息，用户是否进行登录
        checkList = ['/personal', '/store', '/update']; //这三个路径才需要登录校验
    return !info && checkList.includes(path);
};
/* 统一路由配置 */
const Element = function Element(props) {
    console.log(props);
    let {component:Component, meta, path} = props
    let isShow = !isCheckLogin(path); // 判断是否需要校验，true直接渲染需要的组件
    let [_, setRandom] = useState(0); // 控制组件更新
    // 登录态校验
    useEffect(() => {
        if (isShow) return;
        // 没有使用redux的高阶组件，自己实现更新 
        (async () => { // 开始校验
            let infoAction = await action.base.queryUserInfoAsync(); //获取用户信息
            let info = infoAction.info;
            if (!info) {
                // 如果获取后还是不存在:没有登录
                Toast.show({
                    icon: 'fail',
                    content: '请先登录'
                });
                // 跳转到登录页
                navigate({
                    pathname: '/login',
                    search: `?to=${path}`
                }, { replace: true }); // replace将栈顶的地址替换为当前的地址，不会形成history
                return;
            }
            // 如果获取到了信息,说明是登录的,我们派发任务把信息存储到容器中
            store.dispatch(infoAction); // 派发任务，先把redux中的信息存储起来
            console.log(infoAction);
            setRandom(+new Date()); //更新Element组件，当有组件发生变化时，及运行useEffect（空依赖模拟该生命周期函数）
        })();
    });


    // 修改页面title
    let {title = "天天日报-WebApp"} = meta || {}
    document.title = title 

    // 获取路由信息，基于属性传递给组件
    const navigate = useNavigate(),
          location = useLocation(),
          params = useParams(),
          [usp] = useSearchParams();


    return (// 判断是否需要做校验，渲染视图
        <>
        {isShow ?
            <Component navigate={navigate}
                location={location}
                params={params}
                usp={usp} /> :
            <Mask visible={true}>
                <DotLoading color="white" />
            </Mask>
        }
    </>
    )
}

export default function RouterView() {
    return(
        <Suspense fallback={<Mask visible={true}><DotLoading color="white" /></Mask>}>
            <Routes>
                {
                    routes.map(item => {
                        let {name,path} = item;
                        return <Route key={name} path={path} element={<Element {...item} />} />
                    })
                }
            </Routes>
        </Suspense>
    )
}