
import Home from './Home'
import Demo from './Demo'
import TxPool from './txPool'

export default {
  root: { path: '/', component: Home, name: 'root' },
  home: { path: '/home', component: Home, name: 'Home' },
  demo: { path: '/demo', component: Demo, name: 'Demo' },
}
