import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import {ConfigProvider} from 'antd-mobile'
import zhCN from 'antd-mobile/es/locales/zh-CN'

import "amfe-flexible"
import './index.less'

import {Provider} from 'react-redux'
import store from './store'

// import styled from 'styled-components'
// const StyleProvider = styled.div`
//     .box{
//       width: 328px;
//       height: 164px;
//       line-height: 164px;
//       text-align: center;
//       font-size: 40px;
//       background: lightblue;
//     }
// `
(function(){
  const handleMax = function handleMax() {
    let html = document.documentElement,
        root = document.getElementById("root"),
        deviceW = html.clientWidth;
    root.style.maxWidth = "750px"
    if(deviceW >= 750){
      html.style.fontSize = "75px"
    }
  };
  handleMax();
})();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ConfigProvider locale={zhCN}>
      <Provider store={store}>
       <App />
      </Provider>
    </ConfigProvider>
    
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
