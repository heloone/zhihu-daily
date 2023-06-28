import React from "react";
import './NewsItem.less'
import {Image} from 'antd-mobile'
import {Link} from 'react-router-dom'

const NewsItem = function NewsItem(props) {
    let {info} = props
    if(!info) return null // 判断是否有数据
    let {id, title, hint, image, images} = info
    if(!Array.isArray(images)) images = [""] // 判断类型是否为数组，防止images[0]报错

    return(
        <div className="news-item-box">
            <Link to={{pathname: `/detail/${id}`}}>
                <div className="content">
                    <h4 className="title">{title}</h4>
                    <p className="author">{hint}</p>
                </div>
                <Image src={image ? image : images[0]} lazy />
            </Link>
        </div>
    )
}
export default NewsItem