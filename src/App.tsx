import './App.css'
import { AuthProvider } from './hooks/UseAuth'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './pages/ProtectedRoute'
import { Home } from './pages/home/Home'
import { Login } from './pages/login/Login'

function App() {
  
  

  return (
    <AuthProvider>
      <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login/>}>

        </Route>
        <Route path='/' element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }>

        </Route>

      </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
