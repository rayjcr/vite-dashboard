import React, { useState, useEffect } from 'react'

import { Dropdown } from 'antd'
import { TranslationOutlined } from '@ant-design/icons'
import { localeConfig } from '@/config/locale'
import { connect } from 'react-redux'
import css from '../../layout.module.scss'

const Header = ({global, dispatch}) => {
  const [items, setItems] = useState(localeConfig)

  const setCurLang = () => {
    items.forEach(item => {
      item.disabled = global.global.locale.toLowerCase() === item.key ? true : false
    })
    setItems([...items])
  }

  const changeLang = (e) => {
    let keys = e.key.split('-')
    let locale = keys[0] + '-' + keys[1].toUpperCase()
    dispatch({
      type: 'global/setGlobal',
      payload: { global:{
          ...global.global,
          locale,
        }
      }
    });
    localStorage.setItem('locale', locale)
  }

  useEffect(() => {
    setCurLang();
  }, [global])

  return (
    <div className={css.Header}>
      <Dropdown menu={{items, onClick: changeLang}} trigger={['click']} className={css.SwitchLang}>
        <div className={css.LanguageBtn}>
          <TranslationOutlined/>
        </div>
      </Dropdown>
    </div>
  )
}

const mapStateToProps = (state) => {
  const { global } =  state
  return { global }
}

export default connect(mapStateToProps)(Header)
