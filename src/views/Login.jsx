import React, {useState, useEffect} from "react";
import {Form, Input, Toast} from 'antd-mobile'
import NavBarAgain from "../components/NavBarAgain"
import "./Login.less"
import ButtonAgain from "../components/ButtonAgain";
import api from "../api"
import _ from '../assets/utils'
import {connect} from 'react-redux'
import action from "../store/action"

/* 自定义表单校验规则 */
const validate = {
    phone(_, value) {
        value = value.trim();
        let reg = /^(?:(?:\+|00)86)?1\d{10}$/;
        if (value.length === 0) return Promise.reject(new Error('手机号是必填项!'));
        if (!reg.test(value)) return Promise.reject(new Error('手机号格式有误!'));
        return Promise.resolve();
    },
    code(_, value) {
        value = value.trim();
        let reg = /^\d{6}$/;
        if (value.length === 0) return Promise.reject(new Error('验证码是必填项!'));
        if (!reg.test(value)) return Promise.reject(new Error('验证码格式有误!'));
        return Promise.resolve();
    }
};

const Login = function Login(props) {
    // console.log(props);
    let {queryUserInfoAsync, navigate, usp} = props

    const [formIns] = Form.useForm()
    const [disabled, setDisabled] = useState(false),
          [sendText, setSendText] = useState("发送验证码")

    /* 表单提交 */
    const submit = async () => {
        try{
            await formIns.validateFields()
            let {phone, code} = formIns.getFieldValue()
            let {code: codeHttp, token} = await api.login(phone, code)
            if(+codeHttp !== 0) {
                Toast.show({
                    icon: 'fail',
                    content: "登录失败"
                })
                formIns.resetFields(['code'])
                return;
            }
            // 登录成功：存储token、存储登录信息到redux、提示、跳转
            _.storage.set('tk',token)
            await queryUserInfoAsync() // 派发任务，同步redux中的状态信息
            Toast.show({
                icon: 'success',
                content: "登录成功"
            })
            // 地址跳转
            let to = usp.get('to')
            // to有值代表是被路由守卫跳转过来，则前往to；无值则是输入之类的登录操作，直接退回原来页面
            to ? navigate(to, {replace: true}) : navigate(-1) 
        }catch(_){ }
    }

    /* 发送验证码 */
    let timer = null,
        num = 61
    const countDown = () => {
        num--
        if(num === 0) {
            clearInterval(timer)
            timer = null
            setSendText("发送验证码")
            setDisabled(false)
            return
        }
        setSendText(`${num}秒后重发`)
    }
    const send = async () => {
        try{
            await formIns.validateFields(['phone']) //里面放置数组
            let phone = formIns.getFieldValue('phone')
            let {code} = await api.sendPhoneCode(phone)
            if(+code !== 0) {
                Toast.show({
                    icon: 'fail',
                    content: "发送失败"
                })
                return;
            }
            // 发送成功
            setDisabled(true)
            countDown()
            // 重发定时器
            if(!timer) timer = setInterval(countDown, 1000)
        }catch(_){ console.log(_);}
    }
    /* 组件销毁时，清除手动定时器 */
    useEffect(() => {
        return () => {
            if(timer) {
                clearInterval(timer)
                timer = null
            }
        }
    },[])
    return(
        <div className="login-box">
            {/* 返回导航 */}
            <NavBarAgain title="登录/注册" /> 
            <Form layout="horizontal" style={{'--border-top':'none'}}
                footer={
                // <Button type="submit" color="primary" loading={submitLoading}>提交</Button>
                <ButtonAgain type="submit" color="primary" onClick={submit}>提交</ButtonAgain>
            }
                // onFinish = {submit} 
                form={formIns} initialValues={{phone:'',code:''}}
            >
                <Form.Item name='phone' label="手机号" rules={[{validator: validate.phone}]}>
                    <Input placeholder="请输入手机号" />
                </Form.Item>

                <Form.Item name='code' label="验证号" rules={[{validator: validate.code}]}
                    extra={
                        <ButtonAgain size="small" color="primary"
                         disabled = {disabled} onClick = {send}>{sendText}</ButtonAgain>
                    }>
                    <Input placeholder="请输入验证码" />
                </Form.Item>
            </Form>
        </div>
    )

}

export default connect(null,action.base)(Login);