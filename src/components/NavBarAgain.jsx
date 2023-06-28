import React from "react";
import {NavBar} from 'antd-mobile'
import {useNavigate, useLocation, useSearchParams} from 'react-router-dom'
import './NavBarAgain.less'

/* 对ui组件库-导航栏的二次封装 */
const NavBarAgain = function NavBarAgain(props) {
    let {title = '天天日报'} = props
    const navigate = useNavigate(),
          location = useLocation(),
          [usp] = useSearchParams()
          
    // 点击back键的操作      
    const handleBack = () => {
        // 特殊：登录页 & to 的值是/deatil/xxx
        let to = usp.get('to')
        if (location.pathname === '/login' && /^\/deatil\/\d+$/.test(to)) {
            navigate(to, {replace: true})
            return
        }
        navigate(-1)
    }

    return(
        <NavBar className="navbar-again-box" onBack={handleBack}> {title} </NavBar>
    )
}
NavBarAgain.defaultProps = {
    title: '个人中心'
}
export default NavBarAgain;