import React from "react"
// import { SwitchTransition, CSSTransition } from 'react-transition-group'
import { useRoutes } from "react-router-dom"
import WrapperRouteComponent from "./config"
import Layout from '../pages/layout'
import Login from '../pages/login'
import Merchant from '../pages/merchant'
import PageA from '../pages/pageA'

export const routeList = [
  {
    path: '/',
    element: <WrapperRouteComponent auth={true}><Layout/></WrapperRouteComponent>,
    children: [
      {
        path: '/dashboard',
        title: 'menu.dashboard',
        element: <PageA />
      }, {
        path: '/merchant/:mid',
        title: 'merchant',
        element: <Merchant />
      }, {
        path: '/merchant/',
        title: 'merchant',
        element: <Merchant />
      }
    ]
  }, {
    path: '/login',
    title: 'menu.login',
    element: <Login />
  }
]

const RenderRouter = () => {
  // const location = useLocation();

  const element = useRoutes(routeList);

  // return (<SwitchTransition mode="out-in">
  //         <CSSTransition key={location.key} timeout={500} classNames='fade'> 
  //           {element}
  //         </CSSTransition>
  //         </SwitchTransition>)
  return element
}

export default RenderRouter
