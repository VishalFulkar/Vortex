import React, { useEffect } from 'react'
import {Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Files from './pages/Files'
import SharedFiles from './pages/SharedFiles'
import Activity from './pages/Activity'
import useAuthStore from './store/authStore'
import ProtectedRoute from './components/common/ProtectedRoute'
import Trash from './pages/Trash'

const App = () => {
  const { fetchUser } = useAuthStore()

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  return (
    <div>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />

        <Route path='/' element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        <Route path='/files' element={
          <ProtectedRoute>
            <Files />
          </ProtectedRoute>
        } />
        <Route path='/shared' element={
          <ProtectedRoute>
            <SharedFiles />
          </ProtectedRoute>
        } />
        <Route path='/activity' element={
          <ProtectedRoute>
            <Activity />
          </ProtectedRoute>
        } />
        <Route path='/trash' element={
          <ProtectedRoute>
            <Trash />
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  )
}

export default App