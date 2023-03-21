import { zhCN_login } from './login/login'
import { zhCN_error } from './error'
import { zhCN_menu } from './menu'
import { zhCN_table } from './table'

const zh_CN = {
  ...zhCN_login,
  ...zhCN_error,
  ...zhCN_menu,
  ...zhCN_table,
}

export default zh_CN;