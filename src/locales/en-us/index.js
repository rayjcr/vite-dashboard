import { enUS_login } from './login/login'
import { enUS_error } from './error'
import { enUS_menu } from './menu'
import { enUS_table } from './table'

const en_US = {
  ...enUS_login,
  ...enUS_error,
  ...enUS_menu,
  ...enUS_table,
}

export default en_US;