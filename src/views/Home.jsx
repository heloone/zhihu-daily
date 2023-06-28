import React,{useState, useEffect, useRef} from "react";
import HomeHead from "../components/HomeHead";
import _ from '../assets/utils'
import './Home.less'
import {Swiper, Image, Divider, DotLoading} from 'antd-mobile'
import {Link} from 'react-router-dom'
import api from '../api'
import NewsItem from '../components/NewsItem'
import SkeletonAgain from '../components/SkeletonAgain' // 骨架屏

const Home = function Home() {
    /* 创建所需状态 */
    let [today, setToday] = useState(_.formatTime(null, "{0}{1}{2}"))
    //console.log(_.formatTime(null,"{0}{1}{2}"))
    let [bannerData, setBannerData] = useState([]),
        [newsList, setNewsList] = useState([])
    let loadMore = useRef()


    /* 第一次渲染完毕：向服务器发送数据请求 */
    useEffect(() => {
        (async () => {
            try{
                let {date, stories, top_stories} = await api.queryNewsLatest()
                setToday(date)
                setBannerData(top_stories)
                // 更新日报列表状态
                newsList.push({
                    date,
                    stories
                })
                setNewsList([...newsList])
                console.log("111")
            }catch (_){

            }
        })()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    /* 第一次渲染完毕：设置监听器，实现触底加载 */
    useEffect(() => {
        /* 通过IntersectionObserver监听dom节点是否在视口中，可以避免dom元素过多从而计算量很大，
            导致性能问题，也可以简化代码量。但结束后要进行移除 */
        let ob = new IntersectionObserver(async changes => {
            let {isIntersecting} = changes[0]
            if(isIntersecting) {
                // 加载更多的按钮出现在视口中，触底
                try{
                    let time = newsList[newsList.length-1]['date']
                    let res = await api.queryNewsBefore(time)
                    newsList.push(res)
                    setNewsList([...newsList])
                }catch(_){ }
            }

        })
        let loadMoreBox = loadMore.current
        ob.observe(loadMore.current)
        // 在组件销毁释放的时候：手动销毁监听器
        return () => {
            ob.unobserve(loadMoreBox) // loadMore.current === null
            ob = null
        }
        // 解决React报错React Hook useEffect has a missing dependency,禁用规则
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    return(
        <div className="home-box">
            {/* 头部 */}
            <HomeHead today = {today} />

            {/* 轮播图 */}
            <div className="swiper-box">
                {bannerData.length > 0 ? (
                    <Swiper autoplay={true} loop={true}>
                        {
                            bannerData.map(item => {
                                let {id, image, title, hint} = item
                                return(
                                    <Swiper.Item key={id}>
                                        <Link to={{pathname:`/detail/${id}`}}>
                                            {/* <img src={image} alt="" /> */}
                                            {/* 图片懒加载 */}
                                            <Image src={image} lazy />
                                            <div className="desc">
                                                <h3 className="title">{title}</h3>
                                                <p className="author">{hint}</p>
                                            </div>
                                        </Link>
                                    </Swiper.Item>
                                )
                            })
                        }
                    </Swiper>
                ): null}
            </div>

            {/* 日报列表 */}
            {   newsList.length === 0 ? <SkeletonAgain /> :
                <>
                    {   
                        newsList.map((item,index) => {
                            console.log(item)
                            let {date, stories} = item
                            return(
                                <div className="news-box" key={index}>
                                    {
                                        index <= 1 ? null:
                                        <Divider contentPosition="left">{_.formatTime(date,'{1}月{2}日')}</Divider>
                                    }
                                    <div className="list">
                                        {
                                            index < 1 ? null :
                                            stories.map(cur => {
                                                return <NewsItem key={cur.id} info={cur} />
                                            })
                                        }
                                    </div>
                                </div>
                            )
                        })
                    }
                </>
            }


            {/* 加载更多 */}
            <div className="loadmore-box" ref={loadMore} style={{
                display: newsList.length === 0 ? 'none' : 'block'
            }}>
                <DotLoading />
                数据加载中
            </div>
            
        </div>
    )

}

export default Home;