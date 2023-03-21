import React, { memo, useEffect, useState, useLayoutEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { connect } from 'react-redux'
import { setState } from '../store/appSlice'
// import { getCurrentUser } from '../api/user'


const PrivateRoute = memo(({ children, app, dispatch }) => {
  const { user } = app
  const loggedInData = JSON.parse(sessionStorage.getItem('loggedInData'))
  const [logged, setLogged] = useState(loggedInData?.session_id ? true : false)

  useLayoutEffect(() => {
    // console.log(app, user, 'useLayoutEffect-app')
    const loggedInData =  JSON.parse(sessionStorage.getItem('loggedInData'));
    dispatch({
      type: 'app/setState',
      payload: { user: {
          ...user,
          ...loggedInData
        }
      }
    })
  //   console.log({ user: {
  //     ...user,
  //     ...loggedInData
  //   }
  // }, 'dispatch')
  }, [])

  /**
   * 这里可以监听 getUser 返回的值用来判断是否需要重新登陆 [res]
   */
  useEffect(() => {
    // console.log(app, 'privateRoute-app')
    // const loggedInData = sessionStorage.getItem('loggedInData')
    // const getUser = async () =>{
    //   console.log(logged, 'logged-A')
    //   // const res = await getCurrentUser();
    //   setLogged(false)
    //   console.log(logged, 'logged-B')
    //   // dispatch(setState({ user: { ...user, username:'测试用户', logged: true } }))
    // }
    // getUser();
    // const res = await getCurrentUser();
    // console.log(user, 'a')
    // console.log(res, 'b')
    // dispatch(setState({ user: { ...user, username:'测试用户', logged: true } }))
  }, [])

  /**
   * 如果报错直接跳转到 Login页面
   * if(err) {
   *   dispatch(setState({user:{...user, logged: false}}))
   *   return <Navigate to='/login' />
   * }
   */
  

  return logged ? (
    <>{user.session_id && children}</>
  ) : <Navigate to='/login' />
})

const mapStateToProps = (state) => {
  const { app } =  state
  return { app }
}

export default connect(mapStateToProps)(PrivateRoute)
