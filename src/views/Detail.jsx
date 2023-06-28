import React,{ useState, useEffect, useMemo } from "react";
import './Detail.less'
import { SafeArea, Badge, Toast } from 'antd-mobile'
import {LeftOutline, MessageOutline, LikeOutline, StarOutline, LinkOutline} from 'antd-mobile-icons'
import api from "../api"
import SkeletonAgain from "../components/SkeletonAgain";
import {flushSync} from 'react-dom'
import {connect} from 'react-redux'
import action from '../store/action'

const Detail = function Detail(props) {
    let {navigate,params} = props
    // console.log(params);
    let [info, setInfo] = useState(null),
        [extra,setExtra] = useState(0)

    /* 第一次渲染完毕：获取数据 */
    // 处理样式
    let link1
    const handleStyle = (result1) => {
        let {css} = result1
        if(!Array.isArray(css)) return
        let css1 = css[0]
        if(!css1) return
        // 创建link元素，并为其添加属性，后放置在head中，退出后需要移除
        link1 = document.createElement("Link")
        link1.rel = "stylesheet"
        link1.href = css 
        document.head.appendChild(link1)
    }
    // 处理图片
    const handleImage = (result1) => {
        let imgPlaceHolder = document.querySelector('.img-place-holder')
        if(!imgPlaceHolder) return
        //创建大图
        let tempImg = new Image()
        tempImg.src = result1.image
        tempImg.onload = () => {
            imgPlaceHolder.appendChild(tempImg)
            console.log("加载两次");
        }
        // tempImg.onerror = () => {
        //     let parent = imgPlaceHolder.parentNode
        //     parent.parentNode.removeChild(parent)
        // }
    }
    // 添加标题
    let title
    let imgs
    const handleTitle = (result1) =>{
        title = document.createElement("h4")
        imgs = document.querySelector(".img-place-holder")
        title.innerText = result1.title
        imgs.appendChild(title)
        console.log(imgs.scrollTop);
    }
    useEffect(() => {
        (async () => {
            try{
                let result1 = await api.queryNewsInfo(params.id)
                
                // 处理样式和图片 [除了传参也可以用useEffect方法]
                flushSync(() => {
                    setInfo(result1)
                    handleStyle(result1)
                    handleImage(result1)
                    handleTitle(result1)
                })
            }catch(_){ }
        })()
        // 销毁组件：移除创建的样式
        return () => {
            if(link1) document.head.removeChild(link1)
            if(title) title.parentNode.removeChild(title)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    useEffect(() => {
        (async () => {
            try{
                let result2 = await api.queryStoryExtra(params.id)
                setExtra(result2)
            }catch(_){ }
        })()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    /* 关于登录收藏 */
    let {base: {info: userInfo}, queryUserInfoAsync, location, 
            store: {list: storeList}, queryStoreListAsync, removeStoreListById} = props
    useEffect(() => {
        if(!userInfo) queryUserInfoAsync()
        if(!storeList) queryStoreListAsync()
    },[])
    // 依赖于收藏列表和路径参数，计算是否收藏
    const isStore = useMemo(() => {
        if(!storeList) return false
        return storeList.some(item => {
            return +item.news.id === +params.id
        })
    },[storeList, params])
    console.log(props);
    // 点击收藏按钮
    const handleStore = async () => {
        //未登录，携带信息前往登录页
        if (!userInfo) {
            Toast.show({
                icon: 'fail',
                content: "请先登录"
            })
            navigate(`/login?to=${location.pathname}`,{replace: true})
            return;
        }
        //已登录，收藏或是移除收藏
        if (isStore) {
            // 移除收藏
            let item = storeList.find(item => {
                return +item.news.id === +params.id
            })
            console.log(item)
            if(!item) return 
            try {
                let {code} = await api.storeRemove(item.id)
                if(+code !== 0) {
                    Toast.show({
                        icon: 'fail',
                        content: "取消收藏失败"
                    })
                    return
                }
                Toast.show({
                    icon: 'success',
                    content: "取消收藏成功"
                })
                removeStoreListById(item.id) // 告诉redux把这项给移除
            } catch (_) { }
            return
        }
        // 收藏
        try {
            let {code} = await api.store(params.id)
            if(+code !== 0) {
                Toast.show({
                    icon: 'fail',
                    content: "收藏失败"
                })
                return
            }
            Toast.show({
                icon: 'success',
                content: "收藏成功"
            })
            queryStoreListAsync() // 同步最新的收藏列表到redux容器中
        } catch (_) { }

    }

    return(
        <div className="detail-box">
            {/* 新闻内容 */}
            {
                !info ? <SkeletonAgain /> : 
                /* dangerouslySetInnerHTML={{__html: xxx}}在react中插入html，将文本中带有的html格式转化为html形式展示,{}会直接当做普通文本 */
                <div className="content" dangerouslySetInnerHTML={{__html: info.body}}></div>
            }

            {/* 底部图标吸顶 */}
            <div className="tab-bar">
                <div className="back" onClick={() => {navigate(-1)}}><LeftOutline /></div>
                <div className="icons">
                    <Badge content={extra ? extra.comments+1 : 0}><MessageOutline /></Badge>
                    <Badge content={extra ? extra.popularity : 0}><LikeOutline /></Badge>
                    <span className={isStore ? "stored" : ""} onClick={handleStore}><StarOutline /></span>
                    <span><LinkOutline /></span>
                </div>
            </div>
            <div><SafeArea position='bottom' /></div>
        </div>
    )

}

export default connect(state => state, {...action.base, ...action.store}) (Detail);