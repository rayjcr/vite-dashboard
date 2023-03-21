import React, { memo } from 'react'
import { Outlet, useLocation, useOutlet } from 'react-router-dom'
import { TransitionGroup, CSSTransition, SwitchTransition } from 'react-transition-group'
import Header from './components/header'
import Nav from './components/nav'
import css from './layout.module.scss'

const Layout = memo(() => {
  const outlet = useOutlet()
  const location = useLocation()

  return (
    <div className={css.Layout}>
        
        <div className={css.leftBody}>
            <Nav></Nav>
        </div>
        <div className={css.rightBody}>
            <Header></Header>
            <TransitionGroup component={null}>
              <CSSTransition key={location.key} timeout={300} classNames='fade' >
                <div className={css.outlet}>
                  {outlet}
                </div>
              </CSSTransition>
            </TransitionGroup>
        </div> 
    </div>
  )
})

export default Layout
