import React from 'react'

import enUS from '@/locales/en-us'
import zhCN from '@/locales/zh-cn'

import EnUsSvg from '../assets/en_US.svg'
import ZhCnSvg from '../assets/zh_CN.svg'

export const localeConfig = [
  {
    label: <span>English</span>,
    key: 'en-us',
    name: 'en-US',
    messages: enUS,
    icon: <img src={EnUsSvg} />,
  }, {
    label: <span>简体中文</span>,
    key: 'zh-cn',
    name: 'zh-CN',
    messages: zhCN,
    icon: <img src={ZhCnSvg} />,
  }
];
