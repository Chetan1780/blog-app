import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ToastContainer } from 'react-toastify'
import { Provider } from 'react-redux'
import { store, persistor } from './store' // ✅ Import persistor
import { PersistGate } from 'redux-persist/integration/react'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>  {/* ✅ Add persistor */}
        <ToastContainer />
        <App />
      </PersistGate>
    </Provider>
  </StrictMode>,
)
