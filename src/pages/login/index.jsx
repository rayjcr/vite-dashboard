import React, { useState } from 'react'

import { Form, Input, Button, notification } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useIntl } from 'react-intl'
import { connect } from 'react-redux'
import { MailOutlined, LockOutlined  } from '@ant-design/icons'
import { login } from '@/api/user.js'
import { useDebounce } from '@/utils/tool.js'
import css from './login.module.scss'

const { Password } = Input;

const Login = ({app, dispatch}) => {

  const { formatMessage } = useIntl();
  const history = useNavigate();
  // const changeLang = () => {
  //   dispatch({
  //     type: 'global/setGlobal',
  //     payload: { global: {
  //       ...global.global, 
  //       locale: global.global.locale === 'en-US'?'zh-CN':'en-US'
  //     }}
  //   })
  // }

  const handleLogin = useDebounce(async (loginForm) => {
    const res = await login(loginForm);
    if (res.data.code !== 200) {
      notification.error({
        message: formatMessage({id: 'error.notification.message'}),
        description: res.data.data.msg,
        placement: 'bottomRight',
      })
    } else {
      console.log(res.data);
      dispatch({
        type: 'app/setState',
        payload: {user: {
          ...app.user,
          ...res.data
        }}
      })
      sessionStorage.setItem('loggedInData', JSON.stringify(res.data))
      history('/dashboard')
    }
  }, 500)

  return (
    <div className={css.loginForm}>
      <div className={css.title}>Welcome to Citcon’s Dashboard</div>
      <Form
        name='login'
        onFinish={handleLogin}
      >
        <Form.Item
          labelCol={{span: 6}}
          label={formatMessage({id:'login.username'})}
          name='email'
          rules={[{ required: true, message: formatMessage({id:'login.vaild.email'}) }]}
        >
          <Input prefix={<MailOutlined />} />
        </Form.Item>
        <Form.Item
          labelCol={{span: 6}}
          label={formatMessage({id:'login.password'})}
          name='password'
          rules={[{ required: true, message: formatMessage({id:'login.vaild.password'}) }]}
        >
            <Password prefix={<LockOutlined />} />
        </Form.Item>
        <div className='b-align-center'>
          <Button type="primary" htmlType='submit'>{formatMessage({id:'login.login'})}</Button>
        </div>
      </Form>
    </div>
  )
}

const mapStateToProps = (state) => {
  const { app } =  state
  return { app }
}

export default connect(mapStateToProps)(Login)
