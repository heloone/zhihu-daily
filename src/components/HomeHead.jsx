import React,{useMemo, useEffect} from "react";
import touxiang from '../assets/images/default.png'
import './HomeHead.less'
import {connect} from 'react-redux'
import action from '../store/action'
import {useNavigate} from 'react-router-dom'

const HomeHead = function HomeHead(props) {
    const navigate = useNavigate()
    /* 计算时间中的月和日 */
    console.log(props);
    let {today, info, queryUserInfoAsync} = props
    /* useMemo 使用来做缓存用的，只有当一个依赖项改变的时候才会发生变化 */
    let time = useMemo(() => {
        let [,month,day] = today.match(/^\d{4}(\d{2})(\d{2})$/),
            area = ["error",'一','二','三','四','五','六','七','八','九','十','十一','十二']
        return {
            month:area[+month] + '月',
            day
        }
    },[today])

    // 第一次渲染完，如果info中没有信息，尝试派发一次获取登录信息
    useEffect(() => {
        if (!info) {
            queryUserInfoAsync()
        }
    },[])

    return(
        <header className="home-head-box">
            <div className="info">
                <div className="time">
                    <span>{time.day}</span>
                    <span>{time.month}</span>
                </div>
                <h2 className="title">天天日报</h2>
            </div>

            <div className="picture" onClick={() =>{navigate('/personal')}}>
                <img src={info ? info.pic : touxiang} alt="" />
            </div>
        </header>
    )

}
export default connect(state => state.base, action.base)(HomeHead);