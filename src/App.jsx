import React, { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import { Provider, connect } from 'react-redux'

import enUS from 'antd/es/locale/en_US'
import zhCN from 'antd/es/locale/zh_CN'
import { localeConfig } from '@/config/locale'
import { IntlProvider } from 'react-intl'
import RenderRouter from './routes'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import './App.css'

const App = ({global}) => {

  const { locale } = global.global

  useEffect(() => {
    // console.log(localeConfig,locale, 'localeConfig')
    // 这里可以根据 locale 来配置moment.locale

  }, [])

  const getAntdLocale = () => {
    if (locale.toLowerCase() === 'en-us') {
      return enUS;
    } else if (locale.toLowerCase() === 'zh-cn') {
      return zhCN;
    }
  }

  const getLocale = () => {
    const lang = localeConfig.find((item) => {
      return item.key === locale.toLowerCase();
    });
    
    return lang?.messages;
  }
  
  return (

      <ConfigProvider locale={getAntdLocale()} componentSize='middle'>
        <IntlProvider locale={locale.split('-')[0]} messages={getLocale()}>
          <BrowserRouter>
            {/* <SwitchTransition mode='out-in'>
              <CSSTransition timeout={2000} classNames='fade'> */}
                {/* <div> */}
                  <RenderRouter />
                {/* </div> */}
              {/* </CSSTransition>
            </SwitchTransition> */}
          </BrowserRouter>
        </IntlProvider>
      </ConfigProvider>
    // </Provider>
  )
}

const mapStateToProps = (state) => {
  const { global } =  state
  return { global }
}

export default  connect(mapStateToProps)(App)
