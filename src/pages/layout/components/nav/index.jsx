import React, { memo, useState, useEffect } from 'react'

import { ShopOutlined, ProfileOutlined, DashboardOutlined } from '@ant-design/icons'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useIntl } from 'react-intl'
import { Tree } from 'antd'
// import { routeList } from '@/routes'
import { cloneDeep } from 'lodash'
import { getMultilayer } from '@/api/user'
import css from '../../layout.module.scss'

const { DirectoryTree } = Tree

const NavItem = memo(({to, children}) => {
  if (to){
    return <Link to={to}>{children}</Link>
  } else {
    return <div>{children}</div>
  }
})

const Nav = memo(() => {
  const history = useNavigate();
  const location = useLocation();
  const { formatMessage } = useIntl();
  // console.log(location, 'location')
  const loggedInfo = JSON.parse(sessionStorage.getItem('loggedInData'))

  const [treeData, setTreeData] = useState([])
  const [expandedKeys, setExpandedKeys] = useState(sessionStorage.getItem('curNode')||'')

  const NavTo = (url) => {
    setExpandedKeys('/dashboard');
    history(url)
  }

  const selectMerchant = (key, { selectedNodes, node }) => {
    // console.log(node, selectedNodes, 'aaaa')
    console.log('BBBBBBB')
    if(node.expanded && node.children) return;
    sessionStorage.setItem('curNode', node.key);
    setExpandedKeys(node.key)
    history(`/merchant/${node.merchantId||''}`);
  }

  const updateTreeData = (list, key, children) => {
    return list.map((node) => {
      if (node.key == key) {
        return { ...node, children };
      }
      if (node.children) {
        return { ...node, children: updateTreeData(node.children, key, children) };
      }
      return node;
    })
  }

  const removeIcon = (menu) => {
    menu.forEach(item => {
      delete item['icon']
      if (item.children) removeIcon(item.children)
    })
    return menu
  }

  const appendIcon = (menu) => {
    menu.forEach(item => {
      item.icon = !item.isLeaf ? <ShopOutlined /> : <ProfileOutlined />
      if (item.children) appendIcon(item.children)
    })
    return menu
  }

  const onLoadData = async ({key, children}) => {
    // console.log(key, 'Key',children)
    if (children&&children.length>0) {
      return
    } else {
      let res = await getMultilayer({
        parent_id: key,
        session_id: loggedInfo.session_id
      })
      let fetchList = res.data.childrens_data.map(item => {
        return {
          ...item,
          title: item.value,
          key: item.id+'',
          merchantId: item.merchantId,
          isLeaf: (item.children && item.children.length>0) ? false : true,
          children:null,
          icon: item.children ? <ShopOutlined /> : <ProfileOutlined />,
        }
      })

      setTreeData((origin) => {
        const _treeData = updateTreeData(origin, key, fetchList)
        sessionStorage.setItem('_treeData', JSON.stringify(removeIcon(cloneDeep(_treeData))))
        return _treeData
      })
    }
  }

  useEffect(() => {
    if(!(location.pathname.indexOf('merchant/')>=0)) {
      setExpandedKeys(location.pathname)
    }

    const _treeData = JSON.parse(sessionStorage.getItem('_treeData'));
    if(_treeData) {
      setTreeData(appendIcon(_treeData))
    } else {
      setTreeData([{
        title: loggedInfo.hierarchyName,
        key: loggedInfo.hierarchy+'',
        icon: <ShopOutlined />,
        children:[]
      }])
    }
  }, [])
  

  return (
    <div className={css.Nav}>
      {/* <NavItem to='dashboard'> */}
      <div className={`${css.NavItemBox} ${expandedKeys==='/dashboard'?css.active:''}`} onClick={()=>NavTo('dashboard')}><DashboardOutlined /><span className={css.title}>{formatMessage({id: 'menu.dashboard'})}</span></div>
      {/* </NavItem>  */}
      {treeData.length>0 && <DirectoryTree 
        showIcon
        defaultSelectedKeys={[expandedKeys]}
        defaultExpandedKeys={[expandedKeys]}
        selectedKeys={[expandedKeys]}
        rootClassName={css.Tree}
        treeData={treeData}
        onSelect={selectMerchant}
        loadData={onLoadData}
      />}
    </div>
  )
})


export default Nav