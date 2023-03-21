import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { Provider } from 'react-redux'
import store from './store'
import SuspendFallbackLoading from './pages/layout/suspendFallbackLoading'
import './index.css'


ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <Suspense fallback={<SuspendFallbackLoading />}>
      <App />
    </Suspense>
  </Provider>,
)
